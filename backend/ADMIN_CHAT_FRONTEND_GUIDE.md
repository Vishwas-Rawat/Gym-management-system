# Admin Panel Chat API Documentation

This document provides all the necessary API endpoints and protocols for integrating the End-to-End Encrypted (E2EE) chat feature into the Admin Panel.

## 1. Overview

- **Base URL**: `http://localhost:8085`
- **Protocol**: REST (HTTP) for history and keys, STOMP (WebSocket) for real-time messaging.
- **Authentication**: JWT Token in `Authorization: Bearer <token>` header.

---

## 2. REST API Endpoints

### A. Fetch Chat Contacts

Returns all members and trainers across all gyms managed by the admin.

- **Endpoint**: `GET /chat/contacts`
- **Response**: `List<ContactResponse>`
  ```json
  [
    {
      "userId": 102,
      "name": "Member: John Doe",
      "role": "MEMBER",
      "publicKey": "..." // RSA Public Key PEM
    },
    ...
  ]
  ```

### B. Fetch Chat History (Paginated)

Fetches the conversation with a specific user. Supports pagination to handle large conversations.

- **Endpoint**: `GET /chat/history/{otherUserId}?page=0&size=50`
- **Query Params**: `page` (default 0), `size` (default 100)
- **Response**: `List<ChatMessage>`
  ```json
  [
    {
      "messageId": 505,
      "senderUserId": 101,
      "receiverUserId": 102,
      "ciphertext": "...", // Decrypt if you are receiver
      "senderCiphertext": "...", // Decrypt if you are sender
      "createdAt": "2023-10-27T10:00:00"
    }
  ]
  ```

### C. Search Contacts

Search for members or trainers across all gyms managed by the admin.

- **Endpoint**: `GET /chat/search?query=...`
- **Response**: `List<ContactResponse>` (Same format as Fetch Chat Contacts)

### C. Fetch User Public Key

Fetch the public key of any user to encrypt a new message.

- **Endpoint**: `GET /chat/keys/{userId}`
- **Response**: Plain text PEM string (e.g., `"-----BEGIN PUBLIC KEY-----\n..."`)

### D. Sync My Keys (Admin)

Upload your own public key and encrypted private key (for cross-device synchronization).

- **Endpoint**: `POST /chat/sync-keys`
- **Payload**:
  ```json
  {
    "publicKey": "...",
    "encryptedPrivateKey": "..."
  }
  ```

---

## 3. Real-Time Messaging (WebSocket/STOMP)

### Connection

- **Endpoint**: `ws://localhost:8084/ws`
- **Topic to Subscribe**: `/user/queue/messages` (Incoming messages)

### Sending a Message

- **Destination**: `/app/chat/send`
- **Payload**:
  ```json
  {
    "receiverUserId": 102,
    "ciphertext": "<Encrypted for recipient>",
    "senderCiphertext": "<Encrypted for self>"
  }
  ```

---

## 4. Frontend Integration Steps

1. **Initialize**: Generate RSA key pair if not existing. POST to `/chat/sync-keys`.
2. **Load Contacts**: Fetch from `GET /chat/contacts`. Now resolves real names (FirstName LastName) where available.
3. **Open Chat**: Fetch history from `GET /chat/history/{userId}?page=0&size=50`. Decrypt using your private key.
4. **Search**: Use `GET /chat/search?query=...` for real-time filtering in the sidebar.
5. **Encrypt & Send**:
   - Encrypt plain text using recipient's `publicKey` -> `ciphertext`.
   - Encrypt plain text using your own `publicKey` -> `senderCiphertext`.
   - Send JSON via STOMP to `/app/chat/send`.
