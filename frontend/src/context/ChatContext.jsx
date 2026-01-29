import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import api, { chatApi } from '../services/api';
import { cryptoService } from '../services/cryptoService';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({}); // { userId: [msg1, msg2] }
  const [typingStatus, setTypingStatus] = useState({}); // { userId: boolean }
  const [keyPair, setKeyPair] = useState(null);
  const [recipientKeys, setRecipientKeys] = useState({}); // { userId: CryptoKey }
  
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
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
        // A. Handle Keys
        let keys;
        const storedPrivateKey = localStorage.getItem(`chat_priv_key_${userId}`);
        
        if (storedPrivateKey) {
          // Load existing
          const privateKey = await cryptoService.importPrivateKey(storedPrivateKey);
          const storedPublicKeyPEM = localStorage.getItem(`chat_pub_key_${userId}`);
          if (storedPublicKeyPEM) {
             const publicKey = await cryptoService.importPublicKey(storedPublicKeyPEM);
             keys = { privateKey, publicKey };
          } else {
             // Fallback: Generate new
             keys = await cryptoService.generateKeyPair();
             await saveKeys(keys);
          }
        } else {
          // Generate New
          keys = await cryptoService.generateKeyPair();
          await saveKeys(keys);
        }
        
        setKeyPair(keys);
        keyPairRef.current = keys;

        // Upload Public Key
        const pem = await cryptoService.exportPublicKey(keys.publicKey);
        await chatApi.post('/chat/keys', { userId, publicKeyPem: pem });

        // B. Connect WebSocket
        // Try passing token in query param for handshake auth if headers aren't supported
        const socket = new SockJS(`http://localhost:8084/ws?token=${token}`); 
        const stompClient = Stomp.over(socket);
        stompClient.debug = () => {}; // Disable debug logs

        stompClient.connect(
          { Authorization: `Bearer ${token}` },
          (frame) => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            setClient(stompClient);

            // Subscribe to Messages
            stompClient.subscribe('/user/queue/messages', async (msg) => {
              const chatMessage = JSON.parse(msg.body);
              await handleIncomingMessage(chatMessage);
            });

            // Subscribe to Typing
            stompClient.subscribe('/user/queue/typing', (msg) => {
              const data = JSON.parse(msg.body);
              // data: { isTyping: true, fromUserId: 45 }
              setTypingStatus(prev => ({ ...prev, [data.fromUserId]: data.isTyping }));
            });

            // Subscribe to Read Receipts
            stompClient.subscribe('/user/queue/read-receipts', (msg) => {
              const receipt = JSON.parse(msg.body);
              handleReadReceipt(receipt);
            });
          },
          (error) => {
            console.error('WebSocket Error', error);
            setIsConnected(false);
          }
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

  const saveKeys = async (keys) => {
    const priv = await cryptoService.exportPrivateKey(keys.privateKey);
    const pub = await cryptoService.exportPublicKey(keys.publicKey);
    localStorage.setItem(`chat_priv_key_${userId}`, priv);
    localStorage.setItem(`chat_pub_key_${userId}`, pub);
  };

  // 2. Handle Incoming Message
  const handleIncomingMessage = async (msg) => {
    if (!keyPairRef.current) return;
    
    try {
      // Decrypt
      const decryptedText = await cryptoService.decrypt(keyPairRef.current.privateKey, msg.ciphertext);
      const messageWithText = { ...msg, text: decryptedText };

      // Add to state
      const otherId = msg.senderUserId === Number(userId) ? msg.receiverUserId : msg.senderUserId;
      
      setMessages(prev => {
        const list = prev[otherId] || [];
        // Avoid duplicates
        if (list.some(m => m.messageId === msg.messageId)) return prev;
        return { ...prev, [otherId]: [...list, messageWithText] };
      });
    } catch (e) {
      console.error("Failed to decrypt message", e);
    }
  };

  // 3. Handle Read Receipt
  const handleReadReceipt = (receipt) => {
    setMessages(prev => {
      const newMessages = { ...prev };
      Object.keys(newMessages).forEach(uid => {
        newMessages[uid] = newMessages[uid].map(m => 
          m.messageId === receipt.messageId ? { ...m, read: true } : m
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
      let receiverKey = recipientKeys[receiverId];
      if (!receiverKey) {
        const { data } = await chatApi.get(`/chat/keys/${receiverId}`);
        if (data) { 
           // The API returns the PEM string directly as text/plain based on the prompt description
           // "Success Response text: -----BEGIN PUBLIC KEY----- ..."
           // But axios might parse it if content-type is json, or return string if text.
           // Let's assume it's a string.
           receiverKey = await cryptoService.importPublicKey(data);
           setRecipientKeys(prev => ({ ...prev, [receiverId]: receiverKey }));
        } else {
           throw new Error("User public key not found");
        }
      }

      // Encrypt
      const ciphertext = await cryptoService.encrypt(receiverKey, text);

      // Send
      const payload = {
        receiverUserId: receiverId,
        ciphertext: ciphertext,
        nonce: "optional-nonce", 
        signature: "optional-sig" 
      };

      client.send('/app/chat/send', {}, JSON.stringify(payload));
      
    } catch (err) {
      console.error("Send Failed", err);
      alert("Failed to send message: " + err.message);
    }
  };

  // 5. Send Typing
  const sendTyping = (receiverId, isTyping) => {
    if (client && isConnected) {
      client.send('/app/chat/typing', {}, JSON.stringify({ toUserId: receiverId, isTyping }));
    }
  };

  // 6. Mark Read
  const markRead = (messageId) => {
    if (client && isConnected) {
      client.send('/app/chat/read', {}, JSON.stringify({ messageId }));
    }
  };

  // 7. Load History
  const loadHistory = async (otherUserId) => {
    if (!keyPair) return;
    try {
      const { data } = await chatApi.get(`/chat/history/${otherUserId}`);
      // Decrypt all
      const decryptedMessages = await Promise.all(data.map(async (msg) => {
        try {
            return await cryptoService.decrypt(keyPair.privateKey, msg.ciphertext);
        } catch (e) {
            if (msg.senderUserId === Number(userId)) {
                return "[Sent Message - Encrypted]"; 
            }
            return "[Decryption Error]";
        }
      }));

      const historyWithText = data.map((msg, i) => ({ ...msg, text: decryptedMessages[i] }));
      
      setMessages(prev => ({ ...prev, [otherUserId]: historyWithText }));
    } catch (err) {
      console.error("Load History Failed", err);
    }
  };

  return (
    <ChatContext.Provider value={{
      isConnected,
      messages,
      typingStatus,
      sendMessage,
      sendTyping,
      markRead,
      loadHistory,
      userId 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
