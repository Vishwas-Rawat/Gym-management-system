# Gym Management System - Complete API Guide

This document lists all available APIs across the system, categorized by feature.

---

## 1. Authentication & User Profile

**Base URL**: `http://localhost:8081` (User Admin Service)

| Method | Endpoint                     | Request Payload                                | Response Payload                                                    |
| :----- | :--------------------------- | :--------------------------------------------- | :------------------------------------------------------------------ |
| `POST` | `/auth/login`                | `{ "email": "...", "password": "..." }`        | `{ "token": "JWT...", "role": "MEMBER" }`                           |
| `GET`  | `/member/{memberId}`         | -                                              | `{ "memberId": 1, "fullName": "...", "plan": "..." }`               |
| `GET`  | `/member/dashboard/{userId}` | -                                              | `{ "activeMembers": 10, "gymName": "..." }` (Admin) or Member Stats |
| `PUT`  | `/user/profile`              | `{ "firstName": "...", "fitnessGoal": "..." }` | `{ "success": true }`                                               |

---

## 2. Member Attendance

**Base URL**: `http://localhost:8085` (Trainer Panel / Attendance Service)

| Method | Endpoint              | Request Payload         | Response Payload                                    |
| :----- | :-------------------- | :---------------------- | :-------------------------------------------------- |
| `POST` | `/attendance/mark`    | `{}` (Empty for toggle) | `{ "marked": true, "status": "PRESENT" }`           |
| `GET`  | `/attendance/today`   | -                       | `true` (if present) or `false`                      |
| `GET`  | `/attendance/history` | -                       | `[ { "date": "2024-01-01", "status": "PRESENT" } ]` |
| `GET`  | `/attendance/streak`  | -                       | `{ "currentStreak": 5, "maxStreak": 10 }`           |

---

## 3. Workouts (Trainer Panel)

**Base URL**: `http://localhost:8085` (Trainer Panel)

### Trainer Actions

| Method | Endpoint                          | Request Payload                                                                            | Response Payload                        |
| :----- | :-------------------------------- | :----------------------------------------------------------------------------------------- | :-------------------------------------- |
| `POST` | `/api/workout/assign`             | `{ "memberId": 123, "planName": "Strength A", "strategy": "REPLACE", "exercises": [...] }` | `{ "success": true, "planId": 45 }`     |
| `GET`  | `/api/workout/my-members?gymId=1` | -                                                                                          | `[ { "memberId": 1, "name": "John" } ]` |

### Member Actions

| Method | Endpoint                      | Request Payload | Response Payload                                   |
| :----- | :---------------------------- | :-------------- | :------------------------------------------------- |
| `GET`  | `/api/workout/my-plan`        | -               | `{ "planName": "Strength A", "exercises": [...] }` |
| `GET`  | `/api/member/my-workout-plan` | -               | _(Same as above)_                                  |

---

## 4. Workouts (Activity Tracking)

**Base URL**: `http://localhost:8083` (Member Activity Service)

| Method   | Endpoint                                  | Request Payload                                               | Response Payload                                             |
| :------- | :---------------------------------------- | :------------------------------------------------------------ | :----------------------------------------------------------- |
| `GET`    | `/api/workout-logs/today?date=2024-01-23` | -                                                             | `[ { "exerciseName": "Bench", "sets": 3, "weightKg": 60 } ]` |
| `POST`   | `/api/workout-logs`                       | `{ "exerciseId": 10, "sets": 3, "reps": 10, "weightKg": 50 }` | `{ "id": 101, "status": "LOGGED" }`                          |
| `PUT`    | `/api/workout-logs/{logId}`               | `{ "sets": 4 }`                                               | `{ "success": true }`                                        |
| `DELETE` | `/api/workout-logs/{logId}`               | -                                                             | `{ "success": true }`                                        |

---

## 5. Diet & Nutrition

**Base URL**: `http://localhost:8085` (Trainer Panel)

### Trainer Actions

| Method | Endpoint           | Request Payload                                                                      | Response Payload      |
| :----- | :----------------- | :----------------------------------------------------------------------------------- | :-------------------- |
| `POST` | `/api/diet/assign` | `{ "memberId": 123, "dietType": "VEG", "strategy": "REPLACE", "meals": [...], ... }` | `{ "success": true }` |

### Member Actions

| Method | Endpoint            | Request Payload | Response Payload                                                           |
| :----- | :------------------ | :-------------- | :------------------------------------------------------------------------- |
| `GET`  | `/api/diet/my-plan` | -               | `{ "dietType": "VEG", "meals": [ { "mealName": "Lunch", "foods": [] } ] }` |

**Base URL**: `http://localhost:8083` (Member Activity Service) - **Tracking**

| Method | Endpoint               | Request Payload                                         | Response Payload                              |
| :----- | :--------------------- | :------------------------------------------------------ | :-------------------------------------------- |
| `POST` | `/api/diet-logs`       | `{ "foodName": "Rice", "calories": 200, "protein": 4 }` | `{ "id": 50, "logged": true }`                |
| `GET`  | `/api/diet-logs/today` | -                                                       | `[ { "foodName": "Rice", "calories": 200 } ]` |

---

## 6. Requests (Member -> Trainer)

**Base URL**: `http://localhost:8085` (Trainer Panel)

| Method   | Endpoint                           | Request Payload                                       | Response Payload                                           |
| :------- | :--------------------------------- | :---------------------------------------------------- | :--------------------------------------------------------- |
| `POST`   | `/api/member/request/diet`         | `{ "trainerId": 5, "message": "I need a keto plan" }` | `{ "requestId": 1, "status": "PENDING" }`                  |
| `POST`   | `/api/member/request/workout`      | `{ "trainerId": 5, "message": "Focus on legs" }`      | `{ "requestId": 2, "status": "PENDING" }`                  |
| `GET`    | `/api/member/request/my`           | -                                                     | `[ { "requestId": 1, "type": "DIET", "message": "..." } ]` |
| `PUT`    | `/api/member/request/diet/{id}`    | `{ "message": "New message" }`                        | `{ "requestId": 1, ... }`                                  |
| `PUT`    | `/api/member/request/workout/{id}` | `{ "message": "New message" }`                        | `{ "requestId": 2, ... }`                                  |
| `DELETE` | `/api/member/request/diet/{id}`    | -                                                     | `{ "success": true }`                                      |
| `DELETE` | `/api/member/request/workout/{id}` | -                                                     | `{ "success": true }`                                      |

---

## 7. Admin Member Management

**Base URL**: `http://localhost:8081` (User Admin Service)

| Method   | Endpoint                           | Request Payload                             | Response Payload                               |
| :------- | :--------------------------------- | :------------------------------------------ | :--------------------------------------------- |
| `GET`    | `/member/all`                      | -                                           | `[ { "memberId": 1, "fullName": "..." } ]`     |
| `POST`   | `/member/admin/add-multiple`       | `[ { "email": "...", "fullName": "..." } ]` | `{ "success": true, "message": "Links sent" }` |
| `DELETE` | `/member/{memberId}`               | -                                           | `{ "success": true }`                          |
| `POST`   | `/member/admin/send-all-reminders` | -                                           | `{ "sent": 5, "message": "Reminders sent" }`   |

---

## 8. DTO Reference

**Common Enums**:

- `Role`: `ADMIN`, `TRAINER`, `MEMBER`
- `Status`: `PENDING`, `APPROVED`, `REJECTED`
- `DietType`: `VEG`, `NON_VEG`, `VEGAN`

_(Note: Port numbers may vary based on `application.properties`, defaults are shown above)_
