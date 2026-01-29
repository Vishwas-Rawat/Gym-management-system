import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import './ChatComponent.css';

// Encryption Constants
const RSA_ALGORITHM = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};

const AES_ALGORITHM = {
  name: "AES-GCM",
  length: 256,
};

function ChatComponent({ currentUserId, token }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyPair, setKeyPair] = useState(null);
  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_CHAT_API_URL || "http://localhost:8084";
  const WS_URL = import.meta.env.VITE_CHAT_WS_URL || "http://localhost:8084/ws";

  // Initialize encryption keys
  useEffect(() => {
    if (currentUserId) {
        initializeKeys();
    }
  }, [currentUserId]);

  // Connect WebSocket
  useEffect(() => {
    if (keyPair && token) {
      connectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [keyPair, token]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.userId);
    }
  }, [selectedUser]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeKeys = async () => {
    try {
      // Check if keys exist in localStorage
      const storedPriv = localStorage.getItem(`chat_priv_${currentUserId}`);
      const storedPub = localStorage.getItem(`chat_pub_${currentUserId}`);

      let keys;
      if (storedPriv && storedPub) {
          // Import from storage
          // Note: In a real app, storing private key in localStorage is not recommended.
          // Using IndexedDB or just regenerating session keys (standard for some ephemeral chats) is an option.
          // For this guide, we regenerate to ensure fresh compatibility or use storage if implemented properly.
          // Let's stick to generating fresh keys per session or check logic.
          // The guide says "Generate RSA key pair on component mount".
          keys = await generateKeyPair();
      } else {
          keys = await generateKeyPair();
      }
      
      setKeyPair(keys);

      // Export and upload public key
      const publicKeyPem = await exportPublicKeyToPem(keys.publicKey);
      await uploadPublicKey(currentUserId, publicKeyPem);
    } catch (err) {
        console.error("Key initialization failed:", err);
    }
  };

  // --- Encryption Helpers ---

  const generateKeyPair = async () => {
    return await window.crypto.subtle.generateKey(
      RSA_ALGORITHM,
      true,
      ["encrypt", "decrypt"]
    );
  };

  const exportPublicKeyToPem = async (publicKey) => {
    const exported = await window.crypto.subtle.exportKey("spki", publicKey);
    const exportedAsString = String.fromCharCode.apply(
      null,
      new Uint8Array(exported)
    );
    const exportedAsBase64 = window.btoa(exportedAsString);
    return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  };

  const importPublicKeyFromPem = async (pem) => {
    const pemHeader = "-----BEGIN PUBLIC KEY-----";
    const pemFooter = "-----END PUBLIC KEY-----";
    const pemContents = pem
      .substring(pemHeader.length, pem.length - pemFooter.length)
      .trim();

    const binaryDerString = window.atob(pemContents);
    const binaryDer = str2ab(binaryDerString);

    return await window.crypto.subtle.importKey(
      "spki",
      binaryDer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"]
    );
  };

  const str2ab = (str) => {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const encryptMessage = async (message, recipientPublicKey) => {
    // 1. Generate random AES key
    const aesKey = await window.crypto.subtle.generateKey(
      AES_ALGORITHM,
      true,
      ["encrypt", "decrypt"]
    );

    // 2. Encrypt message with AES
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      data
    );

    // 3. Export AES key
    const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

    // 4. Encrypt AES key with recipient's RSA public key
    const encryptedAesKey = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      recipientPublicKey,
      exportedAesKey
    );

    // 5. Combine IV + encrypted content
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    return {
      encryptedContent: arrayBufferToBase64(combined),
      encryptedAesKey: arrayBufferToBase64(encryptedAesKey),
    };
  };

  const decryptMessage = async (encryptedContent, encryptedAesKey, privateKey) => {
    try {
        // 1. Decode from base64
        const encryptedContentBytes = base64ToArrayBuffer(encryptedContent);
        const encryptedAesKeyBytes = base64ToArrayBuffer(encryptedAesKey);

        // 2. Decrypt AES key with RSA private key
        const aesKeyBytes = await window.crypto.subtle.decrypt(
          { name: "RSA-OAEP" },
          privateKey,
          encryptedAesKeyBytes
        );

        // 3. Import AES key
        const aesKey = await window.crypto.subtle.importKey(
          "raw",
          aesKeyBytes,
          AES_ALGORITHM,
          false,
          ["decrypt"]
        );

        // 4. Extract IV and encrypted data
        const iv = encryptedContentBytes.slice(0, 12);
        const data = encryptedContentBytes.slice(12);

        // 5. Decrypt message with AES
        const decryptedContent = await window.crypto.subtle.decrypt(
          { name: "AES-GCM", iv: iv },
          aesKey,
          data
        );

        // 6. Decode to string
        const decoder = new TextDecoder();
        return decoder.decode(decryptedContent);
    } catch (e) {
        console.error("Decryption error:", e);
        return "[Decryption Failed]";
    }
  };

  // --- API Calls ---

  const uploadPublicKey = async (userId, publicKeyPem) => {
    try {
      const response = await fetch(`${API_URL}/chat/keys`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          publicKeyPem: publicKeyPem,
        }),
      });
      if (!response.ok) throw new Error("Failed to upload public key");
    } catch (e) {
      console.error("Upload key error:", e);
    }
  };

  const markAsRead = async (messageId) => {
    try {
        await fetch(`${API_URL}/chat/read/${messageId}`, {
            method: "POST",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    } catch (e) {
        console.error("Mark read error:", e);
    }
  };

  const connectWebSocket = () => {
    const socket = new SockJS(WS_URL);
    const client = Stomp.over(socket);

    // Disable debug logs for cleaner console
    client.debug = () => {};

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      console.log("Connected to WebSocket");
      client.subscribe("/user/queue/messages", async (message) => {
        const received = JSON.parse(message.body);
        
        let decryptedContent = "[Encrypted]";
        if (keyPair?.privateKey) {
            decryptedContent = await decryptMessage(
                received.encryptedContent,
                received.encryptedAesKey,
                keyPair.privateKey
            );
        }

        setMessages((prev) => {
            // Avoid duplicates
            if (prev.some(m => m.messageId === received.messageId)) return prev;
            return [
                ...prev,
                {
                    ...received,
                    content: decryptedContent,
                    isMine: false,
                },
            ];
        });

        // Mark as read
        if (received.messageId) {
            await markAsRead(received.messageId);
        }
      });
    }, (error) => {
        console.error("WebSocket error:", error);
    });

    stompClientRef.current = client;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
      console.log("Disconnected WebSocket");
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
        const response = await fetch(
        `${API_URL}/chat/search?query=${encodeURIComponent(query)}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        if (response.ok) {
            const users = await response.json();
            setSearchResults(users);
        }
    } catch (e) {
        console.error("Search error:", e);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
        const response = await fetch(
        `${API_URL}/chat/history/${otherUserId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        
        if (response.ok) {
            const history = await response.json();

            // Decrypt all messages
            const decryptedMessages = await Promise.all(
            history.map(async (msg) => {
                let content = "[Encrypted]";
                try {
                    content = await decryptMessage(
                        msg.encryptedContent,
                        msg.encryptedAesKey,
                        keyPair.privateKey
                    );
                } catch (e) {
                    console.error("Failed to decrypt history message:", e);
                }

                return {
                    ...msg,
                    content: content,
                    isMine: msg.senderId === currentUserId,
                };
            })
            );

            setMessages(decryptedMessages);
        }
    } catch (e) {
        console.error("Load history error:", e);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
        // Get recipient's public key
        const response = await fetch(
        `${API_URL}/chat/keys/${selectedUser.userId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
        );
        
        if (!response.ok) {
            alert("Could not fetch user public key. They may not be online/registered for chat.");
            return;
        }

        const recipientPublicKeyPem = await response.text();
        const recipientPublicKey = await importPublicKeyFromPem(
            recipientPublicKeyPem
        );

        // Encrypt message
        const { encryptedContent, encryptedAesKey } = await encryptMessage(
            newMessage,
            recipientPublicKey
        );

        // Send via WebSocket
        if (stompClientRef.current && stompClientRef.current.connected) {
            stompClientRef.current.send(
                "/app/chat",
                {},
                JSON.stringify({
                receiverId: selectedUser.userId,
                encryptedContent,
                encryptedAesKey,
                })
            );

            // Add to local messages (optimistic UI)
            setMessages((prev) => [
                ...prev,
                {
                    content: newMessage,
                    isMine: true,
                    timestamp: new Date().toISOString(),
                },
            ]);

            setNewMessage("");
        } else {
            alert("WebSocket is not connected.");
        }
    } catch (e) {
        console.error("Send message error:", e);
        alert("Failed to send message.");
    }
  };

  return (
    <div className="chat-container">
      {/* Search Users */}
      <div className="user-search">
        <input
          type="text"
          placeholder="Search user to chat..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="search-results">
          {searchResults.map((user) => (
            <div
              key={user.userId}
              className="user-item"
              onClick={() => {
                  setSelectedUser(user);
                  setSearchQuery(""); // Clear search on select? Optional.
                  setSearchResults([]);
              }}
            >
              <div>
                <strong>{user.firstName} {user.lastName}</strong>
                <br/>
                <small style={{color:'#666'}}>{user.email}</small>
              </div>
              <span>{user.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedUser ? (
        <div className="chat-window">
          <div className="chat-header">
            <h3>
              {selectedUser.firstName} {selectedUser.lastName}
            </h3>
            <small style={{color:'green'}}>{selectedUser.role}</small>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.isMine ? "mine" : "theirs"}`}
              >
                <p>{msg.content}</p>
                <span className="timestamp">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Just now'}
                  {msg.isRead && msg.isMine && <span style={{marginLeft:'5px'}}>✓✓</span>}
                </span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button 
                onClick={handleSendMessage} 
                disabled={!newMessage.trim()}
            >
                Send
            </button>
          </div>
        </div>
      ) : (
          <div className="chat-window" style={{justifyContent:'center', alignItems:'center', color:'#999'}}>
              <p>Select a user to start chatting</p>
          </div>
      )}
    </div>
  );
}

export default ChatComponent;
