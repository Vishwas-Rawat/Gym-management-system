import { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { chatApi } from "../services/api";
import { cryptoService } from "../services/cryptoService";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({}); // { userId: [msg1, msg2] }
  const [typingStatus, setTypingStatus] = useState({}); // { userId: boolean }
  const [keyPair, setKeyPair] = useState(null);
  const [recipientKeys, setRecipientKeys] = useState({}); // { userId: CryptoKey }

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Refs to access latest state in callbacks
  const keyPairRef = useRef(null);
  const messagesRef = useRef({});

  useEffect(() => {
    keyPairRef.current = keyPair;
  }, [keyPair]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // 1. Initialize Keys and Connection
  useEffect(() => {
    if (!userId || !token) return;

    const initChat = async () => {
      try {
        // A. Handle Keys (Backend Persistence)
        let keys;
        const chatPassword = `gym-password-${userId}`; // In a real app, prompt user for this!

        try {
          // 1. Try to fetch from backend
          const { data: syncData } = await chatApi.get("/chat/sync-keys");

          if (syncData.encryptedPrivateKey && syncData.publicKey) {
            console.log("Found existing keys on server. Decrypting...");
            const privateKeyJson = await cryptoService.decryptPrivateKey(
              syncData.encryptedPrivateKey,
              chatPassword,
            );

            let privateKey = null;
            if (privateKeyJson) {
              privateKey = await cryptoService.importPrivateKey(privateKeyJson);
            }

            const publicKey = await cryptoService.importPublicKey(
              syncData.publicKey,
            );

            if (privateKey && publicKey) {
              keys = { privateKey, publicKey };
              console.log("✅ Successfully decrypted and loaded existing keys");
            } else {
              console.error(
                "❌ Failed to decrypt server keys. Password might be wrong.",
              );
              console.log(
                "🔄 Resetting corrupted keys via DELETE /chat/sync-keys...",
              );

              // Call backend endpoint to delete corrupted keys
              try {
                await chatApi.delete("/chat/sync-keys");
                console.log("✅ Corrupted keys deleted from backend");
              } catch (deleteErr) {
                console.error("Failed to delete corrupted keys:", deleteErr);
              }

              // keys remains null, will regenerate below
            }
          }
        } catch (err) {
          // 404 or other error - proceed to generate
          console.log(
            "No keys found on server (or error), generating new pair...",
            err.message,
          );
        }

        if (!keys) {
          // 2. Generate New Pair
          console.log("Generating new KeyPair...");
          keys = await cryptoService.generateKeyPair();

          // 3. Encrypt & Upload
          const privateKeyJwk = await cryptoService.exportPrivateKey(
            keys.privateKey,
          );
          const encryptedPrivateKey = await cryptoService.encryptPrivateKey(
            privateKeyJwk,
            chatPassword,
          );
          const publicKeyPem = await cryptoService.exportPublicKey(
            keys.publicKey,
          );

          await chatApi.post("/chat/sync-keys", {
            publicKey: publicKeyPem,
            encryptedPrivateKey: encryptedPrivateKey,
          });
          console.log("New keys synced to server.");
        }

        setKeyPair(keys);
        keyPairRef.current = keys;

        // Remove localStorage usage as per security guidelines
        localStorage.removeItem(`chat_priv_key_${userId}`);
        localStorage.removeItem(`chat_pub_key_${userId}`);

        // B. Connect WebSocket
        // Try passing token in query param for handshake auth if headers aren't supported
        const socket = new SockJS(`http://localhost:8085/ws?token=${token}`);
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; // Disable debug logs

        stompClient.connect(
          { Authorization: `Bearer ${token}` },
          (frame) => {
            console.log("Connected to WebSocket");
            setIsConnected(true);
            setClient(stompClient);

            // Subscribe to Messages
            stompClient.subscribe("/user/queue/messages", async (msg) => {
              const chatMessage = JSON.parse(msg.body);
              await handleIncomingMessage(chatMessage);
            });

            // Subscribe to Typing
            stompClient.subscribe("/user/queue/typing", (msg) => {
              const data = JSON.parse(msg.body);
              // data: { isTyping: true, fromUserId: 45 }
              setTypingStatus((prev) => ({
                ...prev,
                [data.fromUserId]: data.isTyping,
              }));
            });

            // Subscribe to Read Receipts
            stompClient.subscribe("/user/queue/read-receipts", (msg) => {
              const receipt = JSON.parse(msg.body);
              handleReadReceipt(receipt);
            });
          },
          (error) => {
            console.error("WebSocket Error", error);
            setIsConnected(false);
          },
        );
      } catch (err) {
        console.error("Chat Init Error", err);
      }
    };

    initChat();

    return () => {
      if (client && client.connected) {
        client.disconnect();
      }
    };
  }, [userId, token]);

  // Removed saveKeys as we sync with backend now

  const resetKeys = async () => {
    if (
      window.confirm(
        "Reset Encryption Keys? The other person must Refresh after you do this.",
      )
    ) {
      localStorage.removeItem(`chat_priv_key_${userId}`);
      localStorage.removeItem(`chat_pub_key_${userId}`);
      window.location.reload();
    }
  };

  // 2. Handle Incoming Message
  const handleIncomingMessage = async (msg) => {
    if (!keyPairRef.current) return;

    try {
      // Decrypt Logic
      let decryptedText;
      if (msg.senderUserId === Number(userId)) {
        // It's my own message coming back from server
        if (msg.senderCiphertext) {
          decryptedText = await cryptoService.decrypt(
            keyPairRef.current.privateKey,
            msg.senderCiphertext,
          );
        } else {
          decryptedText = "[Encrypted Message]";
        }
      } else {
        // Incoming message from someone else
        decryptedText = await cryptoService.decrypt(
          keyPairRef.current.privateKey,
          msg.ciphertext,
        );
      }

      const messageWithText = { ...msg, text: decryptedText };

      // Add to state
      const otherId =
        msg.senderUserId === Number(userId)
          ? msg.receiverUserId
          : msg.senderUserId;

      setMessages((prev) => {
        const list = prev[otherId] || [];
        if (list.some((m) => m.messageId === msg.messageId)) return prev;

        const messageWithText = {
          ...msg,
          text: decryptedText,
          timestamp: msg.timestamp || msg.createdAt, // Normalize to timestamp
        };

        const newList = [...list, messageWithText];
        // Ensure strictly ordered by timestamp, then messageId
        newList.sort((a, b) => {
          const timeA = a.timestamp || a.createdAt || 0;
          const timeB = b.timestamp || b.createdAt || 0;
          const tA = new Date(timeA).getTime();
          const tB = new Date(timeB).getTime();

          if (tA !== tB) return tA - tB;
          return (a.messageId || 0) - (b.messageId || 0);
        });

        return { ...prev, [otherId]: newList };
      });
    } catch (e) {
      console.error("Failed to decrypt message", e);
    }
  };

  // 3. Handle Read Receipt
  const handleReadReceipt = (receipt) => {
    setMessages((prev) => {
      const newMessages = { ...prev };
      Object.keys(newMessages).forEach((uid) => {
        newMessages[uid] = newMessages[uid].map((m) =>
          m.messageId === receipt.messageId ? { ...m, read: true } : m,
        );
      });
      return newMessages;
    });
  };

  // 4. Send Message
  const sendMessage = async (receiverId, text) => {
    if (!client || !isConnected || !keyPair) return;

    try {
      // Get Receiver Public Key
      // Always fetch fresh key to avoid "Old Key" issues during development/testing
      let receiverKey = null;
      // if (!receiverKey) {
      try {
        // Add cache buster
        const { data } = await chatApi.get(
          `/chat/keys/${receiverId}?_t=${Date.now()}`,
        );
        if (data) {
          receiverKey = await cryptoService.importPublicKey(data);
          setRecipientKeys((prev) => ({ ...prev, [receiverId]: receiverKey }));
        }
      } catch (keyErr) {
        if (keyErr.response && keyErr.response.status === 404) {
          throw new Error(
            "User has not initialized chat (Public Key not found). They need to log in at least once.",
          );
        }
        throw keyErr;
      }
      // }

      if (!receiverKey) {
        throw new Error("Public key unavailable for this user.");
      }

      // Encrypt for Receiver
      const ciphertext = await cryptoService.encrypt(receiverKey, text);

      // Encrypt for Sender (Self) - Dual Ciphertext
      const senderCiphertext = await cryptoService.encrypt(
        keyPair.publicKey,
        text,
      );

      // Send
      const payload = {
        receiverUserId: receiverId,
        ciphertext: ciphertext,
        senderCiphertext: senderCiphertext, // New Field
        nonce: "optional-nonce",
        signature: "optional-sig",
      };

      client.send("/app/chat/send", {}, JSON.stringify(payload));
    } catch (err) {
      console.error("Send Failed", err);
      alert("Failed to send message: " + err.message);
    }
  };

  // 5. Send Typing
  const sendTyping = (receiverId, isTyping) => {
    if (client && isConnected) {
      client.send(
        "/app/chat/typing",
        {},
        JSON.stringify({ toUserId: receiverId, isTyping }),
      );
    }
  };

  // 6. Mark Read
  const markRead = (messageId) => {
    if (client && isConnected) {
      client.send("/app/chat/read", {}, JSON.stringify({ messageId }));
    }
  };

  // 7. Load History
  const loadHistory = async (otherUserId, page = 0, size = 50) => {
    if (!keyPair) return;
    try {
      const { data } = await chatApi.get(
        `/chat/history/${otherUserId}?page=${page}&size=${size}`,
      );
      // Decrypt all
      const decryptedMessages = await Promise.all(
        data.map(async (msg) => {
          try {
            // IF I am the SENDER, I decrypt 'senderCiphertext'
            if (msg.senderUserId === Number(userId)) {
              if (msg.senderCiphertext) {
                return await cryptoService.decrypt(
                  keyPair.privateKey,
                  msg.senderCiphertext,
                );
              }
              // Old messages before dual-ct was implemented won't have senderCiphertext
              return "[Encrypted Message]";
            }

            // IF I am the RECEIVER, I decrypt 'ciphertext'
            return await cryptoService.decrypt(
              keyPair.privateKey,
              msg.ciphertext,
            );
          } catch (e) {
            // OperationError usually means the key doesn't match the message (Old history)
            if (e.name === "OperationError") {
              console.warn(
                `Could not decrypt msg ${msg.messageId} (Key mismatch/Old message)`,
              );
            } else {
              console.error("Decryption error for msg", msg.messageId, e);
            }

            if (msg.senderUserId === Number(userId)) {
              return "[Sent Message - Key Rotated]";
            }
            return "[Encrypted - Key Rotated]";
          }
        }),
      );

      const historyWithText = data.map((msg, i) => ({
        ...msg,
        text: decryptedMessages[i],
        timestamp: msg.timestamp || msg.createdAt, // Normalize to timestamp
      }));

      // Sort robustly: Timestamp ASC, then MessageId ASC for ties
      historyWithText.sort((a, b) => {
        const timeA = a.timestamp || a.createdAt || 0;
        const timeB = b.timestamp || b.createdAt || 0;
        const tA = new Date(timeA).getTime();
        const tB = new Date(timeB).getTime();

        if (tA !== tB) return tA - tB;
        return (a.messageId || 0) - (b.messageId || 0);
      });

      // Debug log to check if timestamps are actually present
      if (historyWithText.length > 0) {
        console.log("Chat History Loaded & Sorted:", {
          first: historyWithText[0],
          last: historyWithText[historyWithText.length - 1],
        });
      }

      setMessages((prev) => ({ ...prev, [otherUserId]: historyWithText }));
    } catch (err) {
      console.error("Load History Failed", err);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        isConnected,
        messages,
        typingStatus,
        sendMessage,
        sendTyping,
        markRead,
        loadHistory,
        userId,
        resetKeys, // Exporting resetKeys
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
