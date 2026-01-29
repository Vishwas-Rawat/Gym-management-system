# Member Request Management API Specification

This document outlines the required endpoints to support the "Edit" and "Cancel" functionality for Member Requests (Diet & Workout) on the frontend.

**Service**: Trainer Panel (Port 8085)
**Controller**: `MemberRequestController`

---

## 1. Get My Requests (History)

Retrieves all diet and workout requests for the authenticated member.

- **URL**: `/api/member/request/my`
- **Method**: `GET`
- **Headers**:
  - `Authorization`: Bearer `<token>`
- **Response (200 OK)**:
  ```json
  [
    {
      "requestId": 1,
      "memberId": 123,
      "trainerId": 456,
      "message": "I need a high protein diet.",
      "createdAt": "2024-01-23T10:00:00",
      "status": "PENDING",
      "type": "DIET"
    },
    {
      "requestId": 2,
      "memberId": 123,
      "trainerId": 456,
      "message": "Focus on legs this week.",
      "createdAt": "2024-01-23T12:00:00",
      "status": "COMPLETED",
      "type": "WORKOUT"
    }
  ]
  ```

---

## 2. Update Diet Request

Updates the message/note of an existing pending diet request.

- **URL**: `/api/member/request/diet/{requestId}`
- **Method**: `PUT`
- **Path Variables**:
  - `requestId` (Integer): ID of the request to update.
- **Request Body**:
  ```json
  {
    "message": "Updated requirements: I prefer vegan options now."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "requestId": 1,
    "memberId": 123,
    "trainerId": 456,
    "message": "Updated requirements: I prefer vegan options now.",
    "createdAt": "2024-01-23T10:00:00",
    "status": "PENDING",
    "type": "DIET"
  }
  ```

---

## 3. Update Workout Request

Updates the message/note of an existing pending workout request.

- **URL**: `/api/member/request/workout/{requestId}`
- **Method**: `PUT`
- **Path Variables**:
  - `requestId` (Integer): ID of the request to update.
- **Request Body**:
  ```json
  {
    "message": "Updated focus: Please include more cardio."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "requestId": 2,
    "memberId": 123,
    "trainerId": 456,
    "message": "Updated focus: Please include more cardio.",
    "createdAt": "2024-01-23T12:00:00",
    "status": "PENDING",
    "type": "WORKOUT"
  }
  ```

---

## 4. Cancel Diet Request

Deletes (cancels) a pending diet request.

- **URL**: `/api/member/request/diet/{requestId}`
- **Method**: `DELETE`
- **Path Variables**:
  - `requestId` (Integer): ID of the request to delete.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Request cancelled successfully"
  }
  ```

---

## 5. Cancel Workout Request

Deletes (cancels) a pending workout request.

- **URL**: `/api/member/request/workout/{requestId}`
- **Method**: `DELETE`
- **Path Variables**:
  - `requestId` (Integer): ID of the request to delete.
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Request cancelled successfully"
  }
  ```
