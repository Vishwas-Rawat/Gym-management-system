# Frontend API Documentation: Secure Chat Integration

This document outlines the API endpoints and WebSocket protocols required to implement the End-to-End Encrypted Chat feature.

## 1. Overview

The chat system uses a hybrid approach:

- **WebSockets (STOMP)**: For real-time message sending and receiving.
- **REST API**: For managing public keys and fetching chat history.
- **End-to-End Encryption**: All messages must be encrypted on the client side before sending. The server **never** sees plain text messages.

---

## 2. Authentication

Both HTTP and WebSocket connections require a valid JWT Token.

### WebSocket Handshake Auth

The WebSocket endpoint at `/ws` supports authentication via:

1.  **Header**: `Authorization: Bearer <your_jwt_token>` (Preferred if supported by client)
2.  **Query Param**: `ws://<host>:8084/ws?token=<your_jwt_token>` (Fallback)

---

## 3. Key Management (REST API)

Before chatting, clients must exchange public keys.

### A. Upload My Public Key

Call this immediately upon login or when the user generates a new key pair.

- **Endpoint**: `POST /chat/keys`
- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "publicKeyPem": "-----BEGIN PUBLIC KEY-----\n..."
  }
  ```

### B. Get User's Public Key

Call this before sending a message to encrypt it for the recipient.

- **Endpoint**: `GET /chat/keys/{userId}`
- **Response**: Returns the PEM string directly or inside a JSON object (check implementation, likely string).
  - _Note: Returns `200 OK` with body as string._

---

## 4. Real-Time Chat (WebSocket/STOMP)

### Connection

- **URL**: `ws://localhost:8084/ws` (or `wss://` in production)
- **SockJS support**: Yes, at `/ws`

### Subscriptions

- **Incoming Messages**: `/user/queue/messages`
  - Listens for new messages sent to the current user.
- **Read Receipts**: `/user/queue/read-receipts`
  - Listens for notifications that your messages were read.
- **Typing Indicators**: `/user/queue/typing`
  - Listens for typing events from other users.

### Sending a Message

**Destination**: `/app/chat/send`

**Process**:

1.  Get Recipient's Public Key (via API or local cache).
2.  Get Your (Sender's) Public Key (from local storage).
3.  Encrypt the message **twice**:
    - `ciphertext`: Encrypt with **Recipient's** Public Key.
    - `senderCiphertext`: Encrypt with **Your (Sender's)** Public Key.
    - _Why?_ Since you don't store plain text, you need the second copy to be able to read your own sent messages later (by decrypting with your Private Key).

**Payload**:

```json
{
  "receiverUserId": 102,
  "ciphertext": "<Encrypted string for Recipient>",
  "senderCiphertext": "<Encrypted string for You>",
  "nonce": "<optional-nonce>",
  "signature": "<optional-signature>"
}
```

### Sending Typing Indicator

**Destination**: `/app/chat/typing`

**Payload**:

```json
{
  "toUserId": 102
}
```

### Sending Read Receipt

**Destination**: `/app/chat/read`

**Payload**:

```json
{
  "messageId": 5055,
  "readerUserId": 101 // Optional, server knows who you are
}
```

---

## 5. Chat History (REST API)

### Get Conversation History

Fetches previous messages between the current user and another user.

- **Endpoint**: `GET /chat/history/{otherUserId}`
- **Response**: List of message objects.
  ```json
  [
    {
      "id": 5055,
      "senderUserId": 101,
      "receiverUserId": 102,
      "ciphertext": "...",        // Decrypt this if you are receiver
      "senderCiphertext": "...",  // Decrypt this if you are sender
      "timestamp": "2023-10-27T10:00:00"
    },
    ...
  ]
  ```

---

## 6. Frontend Flow Summary

1.  **On Init**: Generate/Load RSA Keypair. Upload Public Key to server.
2.  **On Chat Open**: Fetch history via REST. Decrypt messages using Private Key.
    - If `senderUserId == myId`, decrypt `senderCiphertext`.
    - If `receiverUserId == myId`, decrypt `ciphertext`.
3.  **On Send**:
    - Retrieve Recipient's Public Key.
    - Encrypt `msg` -> `recipient_key` = `ciphertext`.
    - Encrypt `msg` -> `my_key` = `senderCiphertext`.
    - Send via STOMP to `/app/chat/send`.
