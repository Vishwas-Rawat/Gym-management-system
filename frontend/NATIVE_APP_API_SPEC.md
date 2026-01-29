# Native App API Specification

This document provides the API endpoints and data structures for the Mobile/Native development team.

## Base URLs

| Service              | Local URL               | Description                      |
| :------------------- | :---------------------- | :------------------------------- |
| **User Admin**       | `http://localhost:8081` | Auth, Profile, Member Management |
| **Activity/Trainer** | `http://localhost:8085` | Workouts, Diet, Requests, Logs   |
| **Attendance**       | `http://localhost:8085` | Key-card / QR Attendance marking |

---

## 1. Authentication

**Base URL**: `http://localhost:8081`

### Login

- **Endpoint**: `POST /auth/login`
- **Request**: `{ "email": "...", "password": "..." }`
- **Response**: `{ "token": "JWT_HERE", "role": "MEMBER/TRAINER", "userId": 123 }`

> [!IMPORTANT]
> Include the token in the headers for all subsequent requests:
> `Authorization: Bearer <token>`

---

## 2. Member Dashboard & Profile

### Get Profile

- **Endpoint**: `GET /member/user/{userId}`
- **Base URL**: `http://localhost:8081`

### Get Dashboard Stats

- **Endpoint**: `GET /member/dashboard/{userId}`
- **Base URL**: `http://localhost:8081`

---

## 3. Requests (Member -> Trainer)

**Base URL**: `http://localhost:8085`

### Create Request

- **Workouts**: `POST /api/member/request/workout`
- **Diet**: `POST /api/member/request/diet`
- **Body**:
  ```json
  {
    "trainerId": 456,
    "message": "I want to focus on hypertrophy."
  }
  ```
  > [!NOTE]
  > `memberId` is automatically resolved from the authentication token.

### View/Edit History

- **Get All My Requests**: `GET /api/member/request/my`
- **Update Message**: `PUT /api/member/request/{diet/workout}/{requestId}`
- **Cancel Request**: `DELETE /api/member/request/{diet/workout}/{requestId}`

---

## 4. Workout & Diet Assignments (Trainer Side)

**Base URL**: `http://localhost:8085`

### Assign Workout

- **Endpoint**: `POST /api/workout/assign`
- **Body**:
  ```json
  {
    "memberId": 123,
    "planName": "Push Day",
    "strategy": "REPLACE", // "REPLACE" or "APPEND"
    "exercises": [
      {
        "exerciseName": "Bench Press",
        "sets": 3,
        "reps": 10,
        "days": ["MONDAY"]
      }
    ]
  }
  ```

### Assign Diet

- **Endpoint**: `POST /api/diet/assign`
- **Body**:
  ```json
  {
    "memberId": 123,
    "planName": "Bulk Diet",
    "strategy": "APPEND", // "REPLACE" or "APPEND"
    "meals": [
      {
        "mealName": "LUNCH",
        "foods": [{ "foodName": "Chicken", "quantity": "200g" }]
      }
    ]
  }
  ```

---

## 5. Daily Logs (Activity Tracking)

**Base URL**: `http://localhost:8085`

- **Log Workout**: `POST /api/workout/log`
- **Log Food**: `POST /api/diet/log`
- **Get Today's Summary**: `GET /api/member/dashboard/today`

---

## 6. Attendance

**Base URL**: `http://localhost:8085`

- **Mark Attendance**: `POST /attendance/mark?status=PRESENT`
- **Check Today**: `GET /attendance/today`
- **View History**: `GET /attendance/history`
