# Authentication & Password Management API Documentation

These endpoints satisfy the requirements for **Forgot Password** and **Reset Password** functionality for all user roles (Admin, Member, Trainer).

**Base URL**: `http://localhost:8083`

---

## 1️⃣ Forgot Password

**Endpoint**: `POST /auth/forgot-password`

**Description**: Initiates the password reset process by generating a 6-digit OTP and sending it to the user's registered email address.

**Request Body** (`application/json`):

```json
{
  "email": "user@example.com"
}
```

**Response** (`application/json`):
_Success (200 OK)_

```json
{
  "message": "OTP sent to email"
}
```

_Error (400 Bad Request)_

```json
{
  "error": "User not found with email: user@example.com"
}
```

---

## 2️⃣ Reset Password

**Endpoint**: `POST /auth/reset-password`

**Description**: Verifies the OTP and updates the user's password. The new password will be encrypted before storage.

**Request Body** (`application/json`):

```json
{
  "email": "user@example.com",
  "otp": "123456",
  "newPassword": "NewStrongPassword123!"
}
```

**Response** (`application/json`):
_Success (200 OK)_

```json
{
  "message": "Password reset successful"
}
```

_Error (400 Bad Request)_

```json
{
  "error": "Invalid OTP"
}
```

_OR_

```json
{
  "error": "OTP has expired"
}
```

---

### ℹ️ Important Notes

- **OTP Expiry**: The generated OTP is valid for **15 minutes**.
- **Security**: These endpoints are **public** (`permitAll`) so users can access them without being logged in.
