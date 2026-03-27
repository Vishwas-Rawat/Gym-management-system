# Chat Feature - Frontend Developer Guide

## 📋 **Overview**

This document provides complete implementation details for the **End-to-End Encrypted Real-Time Chat** feature in the Gym Management System.

**Features**:

- 🔒 End-to-end encryption (RSA + AES)
- 💬 Real-time messaging via WebSocket
- 🔍 User search (members, trainers, admins)
- 📜 Message history
- ✅ Read receipts
- 🔐 Secure key exchange

---

## 🏗️ **Architecture**

```
┌─────────────────┐
│   Frontend      │
│  (React/Vue)    │
└────────┬────────┘
         │
         ├─── REST API (HTTP) ────────┐
         │                            │
         │    • Search users          │
         │    • Upload public key     │
         │    • Get public key        │
         │    • Get message history   │
         │    • Mark as read          │
         │                            │
         └─── WebSocket (STOMP) ──────┤
                                      │
              • Send message          │
              • Receive message       │
                                      │
                              ┌───────▼────────┐
                              │  Backend       │
                              │  Port: 8084    │
                              └────────────────┘
```

---

## 🔑 **Authentication**

All API calls require a JWT token in the `Authorization` header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 📡 **API Endpoints**

### Base URL

```
http://localhost:8084
```

---

### 1️⃣ **Search Users**

**Endpoint**: `GET /chat/search`  
**Purpose**: Search for users to chat with (members, trainers, admins)

#### Request

```javascript
const searchUsers = async (query) => {
  const response = await fetch(
    `http://localhost:8084/chat/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return await response.json();
};
```

#### Response

```json
[
  {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "MEMBER"
  },
  {
    "userId": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "TRAINER"
  }
]
```

#### Usage

```javascript
// Search as user types
const handleSearch = async (searchTerm) => {
  if (searchTerm.length < 2) return; // Wait for at least 2 characters

  const users = await searchUsers(searchTerm);
  setSearchResults(users);
};
```

---

### 2️⃣ **Upload Public Key**

**Endpoint**: `POST /chat/keys`  
**Purpose**: Upload your RSA public key for encryption

#### Request

```javascript
const uploadPublicKey = async (userId, publicKeyPem) => {
  const response = await fetch("http://localhost:8084/chat/keys", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      publicKeyPem: publicKeyPem,
    }),
  });
  return response.ok;
};
```

#### Request Body

```json
{
  "userId": 1,
  "publicKeyPem": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----"
}
```

---

### 3️⃣ **Get Public Key**

**Endpoint**: `GET /chat/keys/{userId}`  
**Purpose**: Get another user's public key to encrypt messages for them

#### Request

```javascript
const getPublicKey = async (userId) => {
  const response = await fetch(`http://localhost:8084/chat/keys/${userId}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (response.ok) {
    return await response.text(); // Returns PEM string
  }
  return null;
};
```

#### Response

```
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----
```

---

### 4️⃣ **Get Message History**

**Endpoint**: `GET /chat/history/{otherUserId}`  
**Purpose**: Load previous messages with a specific user

#### Request

```javascript
const getMessageHistory = async (otherUserId) => {
  const response = await fetch(
    `http://localhost:8084/chat/history/${otherUserId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return await response.json();
};
```

#### Response

```json
[
  {
    "messageId": 1,
    "senderId": 1,
    "receiverId": 2,
    "encryptedContent": "base64-encrypted-content",
    "encryptedAesKey": "base64-encrypted-aes-key",
    "timestamp": "2024-12-09T04:00:00",
    "isRead": true
  },
  {
    "messageId": 2,
    "senderId": 2,
    "receiverId": 1,
    "encryptedContent": "base64-encrypted-content",
    "encryptedAesKey": "base64-encrypted-aes-key",
    "timestamp": "2024-12-09T04:01:00",
    "isRead": false
  }
]
```

---

### 5️⃣ **Mark Message as Read**

**Endpoint**: `POST /chat/read/{messageId}`  
**Purpose**: Mark a received message as read

#### Request

```javascript
const markAsRead = async (messageId) => {
  await fetch(`http://localhost:8084/chat/read/${messageId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};
```

---

## 🔌 **WebSocket Connection**

### Setup

```javascript
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

const connectWebSocket = (token, onMessageReceived) => {
  const socket = new SockJS("http://localhost:8084/ws");
  stompClient = Stomp.over(socket);

  // Add auth header
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  stompClient.connect(
    headers,
    (frame) => {
      console.log("Connected to WebSocket");

      // Subscribe to personal message queue
      stompClient.subscribe("/user/queue/messages", (message) => {
        const receivedMessage = JSON.parse(message.body);
        onMessageReceived(receivedMessage);
      });
    },
    (error) => {
      console.error("WebSocket error:", error);
    }
  );
};
```

---

### Send Message

```javascript
const sendMessage = (receiverId, encryptedContent, encryptedAesKey) => {
  if (stompClient && stompClient.connected) {
    const message = {
      receiverId: receiverId,
      encryptedContent: encryptedContent,
      encryptedAesKey: encryptedAesKey,
    };

    stompClient.send("/app/chat", {}, JSON.stringify(message));
  } else {
    console.error("WebSocket not connected");
  }
};
```

---

### Disconnect

```javascript
const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.disconnect();
    console.log("Disconnected from WebSocket");
  }
};
```

---

## 🔐 **Encryption Implementation**

### Generate RSA Key Pair

```javascript
const generateKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  return keyPair;
};
```

---

### Export Public Key to PEM

```javascript
const exportPublicKeyToPem = async (publicKey) => {
  const exported = await window.crypto.subtle.exportKey("spki", publicKey);
  const exportedAsString = String.fromCharCode.apply(
    null,
    new Uint8Array(exported)
  );
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
  return pemExported;
};
```

---

### Import Public Key from PEM

```javascript
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

// Helper function
const str2ab = (str) => {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
};
```

---

### Encrypt Message

```javascript
const encryptMessage = async (message, recipientPublicKey) => {
  // 1. Generate random AES key
  const aesKey = await window.crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );

  // 2. Encrypt message with AES
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    data
  );

  // 3. Export AES key
  const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

  // 4. Encrypt AES key with recipient's RSA public key
  const encryptedAesKey = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
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

// Helper function
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
```

---

### Decrypt Message

```javascript
const decryptMessage = async (
  encryptedContent,
  encryptedAesKey,
  privateKey
) => {
  // 1. Decode from base64
  const encryptedContentBytes = base64ToArrayBuffer(encryptedContent);
  const encryptedAesKeyBytes = base64ToArrayBuffer(encryptedAesKey);

  // 2. Decrypt AES key with RSA private key
  const aesKeyBytes = await window.crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encryptedAesKeyBytes
  );

  // 3. Import AES key
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    aesKeyBytes,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["decrypt"]
  );

  // 4. Extract IV and encrypted data
  const iv = encryptedContentBytes.slice(0, 12);
  const data = encryptedContentBytes.slice(12);

  // 5. Decrypt message with AES
  const decryptedContent = await window.crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    data
  );

  // 6. Decode to string
  const decoder = new TextDecoder();
  return decoder.decode(decryptedContent);
};

// Helper function
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};
```

---

## 📦 **Complete React Component Example**

```jsx
import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

function ChatComponent({ currentUserId, token }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [keyPair, setKeyPair] = useState(null);
  const stompClientRef = useRef(null);

  // Initialize encryption keys
  useEffect(() => {
    initializeKeys();
  }, []);

  // Connect WebSocket
  useEffect(() => {
    if (keyPair) {
      connectWebSocket();
    }
    return () => disconnectWebSocket();
  }, [keyPair]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.userId);
    }
  }, [selectedUser]);

  const initializeKeys = async () => {
    // Generate RSA key pair
    const keys = await generateKeyPair();
    setKeyPair(keys);

    // Export and upload public key
    const publicKeyPem = await exportPublicKeyToPem(keys.publicKey);
    await uploadPublicKey(currentUserId, publicKeyPem);
  };

  const connectWebSocket = () => {
    const socket = new SockJS("http://localhost:8084/ws");
    const client = Stomp.over(socket);

    client.connect({ Authorization: `Bearer ${token}` }, () => {
      console.log("Connected");
      client.subscribe("/user/queue/messages", async (message) => {
        const received = JSON.parse(message.body);
        const decrypted = await decryptMessage(
          received.encryptedContent,
          received.encryptedAesKey,
          keyPair.privateKey
        );

        setMessages((prev) => [
          ...prev,
          {
            ...received,
            content: decrypted,
            isMine: false,
          },
        ]);

        // Mark as read
        await markAsRead(received.messageId);
      });
    });

    stompClientRef.current = client;
  };

  const disconnectWebSocket = () => {
    if (stompClientRef.current) {
      stompClientRef.current.disconnect();
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    const response = await fetch(
      `http://localhost:8084/chat/search?query=${encodeURIComponent(query)}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const users = await response.json();
    setSearchResults(users);
  };

  const loadMessages = async (otherUserId) => {
    const response = await fetch(
      `http://localhost:8084/chat/history/${otherUserId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const history = await response.json();

    // Decrypt all messages
    const decryptedMessages = await Promise.all(
      history.map(async (msg) => ({
        ...msg,
        content: await decryptMessage(
          msg.encryptedContent,
          msg.encryptedAesKey,
          keyPair.privateKey
        ),
        isMine: msg.senderId === currentUserId,
      }))
    );

    setMessages(decryptedMessages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    // Get recipient's public key
    const response = await fetch(
      `http://localhost:8084/chat/keys/${selectedUser.userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

      // Add to local messages
      setMessages((prev) => [
        ...prev,
        {
          content: newMessage,
          isMine: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      setNewMessage("");
    }
  };

  return (
    <div className="chat-container">
      {/* Search Users */}
      <div className="user-search">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="search-results">
          {searchResults.map((user) => (
            <div
              key={user.userId}
              className="user-item"
              onClick={() => setSelectedUser(user)}
            >
              <strong>
                {user.firstName} {user.lastName}
              </strong>
              <span>{user.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {selectedUser && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>
              {selectedUser.firstName} {selectedUser.lastName}
            </h3>
          </div>

          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.isMine ? "mine" : "theirs"}`}
              >
                <p>{msg.content}</p>
                <span className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>

          <div className="message-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatComponent;
```

---

## 🎨 **CSS Styling Example**

```css
.chat-container {
  display: flex;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.user-search {
  width: 300px;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
}

.user-search input {
  padding: 12px;
  border: none;
  border-bottom: 1px solid #ddd;
}

.search-results {
  flex: 1;
  overflow-y: auto;
}

.user-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-item:hover {
  background-color: #f5f5f5;
}

.user-item strong {
  font-size: 14px;
}

.user-item span {
  font-size: 12px;
  color: #666;
  background: #e3f2fd;
  padding: 2px 8px;
  border-radius: 12px;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background: #f5f5f5;
}

.chat-header h3 {
  margin: 0;
}

.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fafafa;
}

.message {
  margin-bottom: 12px;
  max-width: 70%;
}

.message.mine {
  margin-left: auto;
  text-align: right;
}

.message.theirs {
  margin-right: auto;
}

.message p {
  display: inline-block;
  padding: 10px 14px;
  border-radius: 18px;
  margin: 0;
}

.message.mine p {
  background: #007bff;
  color: white;
}

.message.theirs p {
  background: #e9ecef;
  color: #333;
}

.message .timestamp {
  display: block;
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}

.message-input {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: white;
}

.message-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 8px;
}

.message-input button {
  padding: 10px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.message-input button:hover {
  background: #0056b3;
}
```

---

## 📚 **Required NPM Packages**

```json
{
  "dependencies": {
    "sockjs-client": "^1.6.1",
    "@stomp/stompjs": "^7.0.0"
  }
}
```

Install:

```bash
npm install sockjs-client @stomp/stompjs
```

---

## 🔧 **Configuration**

### Environment Variables

```javascript
// .env
REACT_APP_API_URL=http://localhost:8084
REACT_APP_WS_URL=http://localhost:8084/ws
```

### Usage in Code

```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8084";
const WS_URL = process.env.REACT_APP_WS_URL || "http://localhost:8084/ws";
```

---

## ✅ **Implementation Checklist**

### Phase 1: Basic Setup

- [ ] Install required packages (`sockjs-client`, `@stomp/stompjs`)
- [ ] Create chat component structure
- [ ] Add CSS styling
- [ ] Set up environment variables

### Phase 2: User Search

- [ ] Implement search input
- [ ] Call `/chat/search` API
- [ ] Display search results
- [ ] Handle user selection

### Phase 3: Encryption

- [ ] Generate RSA key pair on component mount
- [ ] Export public key to PEM format
- [ ] Upload public key to server
- [ ] Implement encrypt/decrypt functions

### Phase 4: WebSocket

- [ ] Connect to WebSocket on mount
- [ ] Subscribe to `/user/queue/messages`
- [ ] Handle incoming messages
- [ ] Implement send message function
- [ ] Disconnect on unmount

### Phase 5: Message History

- [ ] Load message history when user selected
- [ ] Decrypt historical messages
- [ ] Display messages in chat window
- [ ] Implement scroll to bottom

### Phase 6: Features

- [ ] Mark messages as read
- [ ] Show read receipts
- [ ] Add typing indicators (optional)
- [ ] Add message timestamps
- [ ] Handle errors gracefully

---

## 🐛 **Common Issues & Solutions**

### Issue 1: WebSocket Connection Fails

**Solution**: Check if backend is running on port 8084 and CORS is configured

### Issue 2: Messages Not Decrypting

**Solution**: Ensure both users have uploaded their public keys

### Issue 3: Search Returns Empty

**Solution**: Users must have `UserProfile` records with `firstName` set

### Issue 4: "Cannot read property 'connected' of null"

**Solution**: Check if WebSocket connected before sending messages

---

## 📖 **API Reference Summary**

| Endpoint                    | Method          | Purpose               |
| --------------------------- | --------------- | --------------------- |
| `/chat/search?query=<term>` | GET             | Search users          |
| `/chat/keys`                | POST            | Upload public key     |
| `/chat/keys/{userId}`       | GET             | Get user's public key |
| `/chat/history/{userId}`    | GET             | Get message history   |
| `/chat/read/{messageId}`    | POST            | Mark as read          |
| `/ws`                       | WebSocket       | Real-time connection  |
| `/app/chat`                 | STOMP Send      | Send message          |
| `/user/queue/messages`      | STOMP Subscribe | Receive messages      |

---

## 🚀 **Next Steps**

1. **Copy the React component** and integrate into your app
2. **Install dependencies**: `npm install sockjs-client @stomp/stompjs`
3. **Add CSS styling** from the example above
4. **Test user search** - ensure users have profiles
5. **Test encryption** - send and receive encrypted messages
6. **Add features** - read receipts, typing indicators, etc.

---

**Last Updated**: 2025-12-09  
**Backend Port**: 8084  
**WebSocket**: STOMP over SockJS  
**Encryption**: RSA-2048 + AES-256-GCM
