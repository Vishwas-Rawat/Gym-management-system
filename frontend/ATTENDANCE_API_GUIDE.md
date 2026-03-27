# Member Attendance API & Integration Guide

This document outlines the APIs used for the Member Attendance feature and provides instructions on where to apply or modify them in the codebase.

## 1. Backend API Endpoints

**Controller**: `com.gymmanagement.trainer.trainer_panel.controller.AttendanceController`
**Base URL**: `/attendance` (Port 8085)

| Method | Endpoint              | Description                               | Auth Required        | Response Payload                                            |
| :----- | :-------------------- | :---------------------------------------- | :------------------- | :---------------------------------------------------------- |
| `POST` | `/attendance/mark`    | Marks or Toggles attendance for today.    | YES (Member/Trainer) | `{ "marked": true, "status": "PRESENT", "message": "..." }` |
| `GET`  | `/attendance/today`   | Checks if attendance is marked for today. | YES                  | `true` or `false` (or status object)                        |
| `GET`  | `/attendance/history` | Fetches attendance history for the user.  | YES                  | `[ { "date": "2024-01-23", "status": "PRESENT" }, ... ]`    |

### Security

The controller uses `extractUser(Authentication auth)` to identify the caller. It supports both `TRAINER` and `MEMBER` roles.

---

## 2. Frontend Integration

### A. Service Layer

**File**: `frontend/src/services/attendanceService.js`

This file handles the HTTP requests to the backend.

```javascript
// src/services/attendanceService.js
export const attendanceService = {
  // Toggle Attendance
  markAttendance: async () => {
    const response = await attendanceApi.post("/attendance/mark");
    return response.data;
  },

  // Check Status
  checkTodayStatus: async () => {
    const response = await attendanceApi.get("/attendance/today");
    return response.data;
  },

  // Get History
  getHistory: async () => {
    const response = await attendanceApi.get("/attendance/history");
    return response.data;
  },
};
```

### B. Context Layer

**File**: `frontend/src/context/AttendanceContext.jsx`

The context manages the state (`todayStatus`, `history`, `loading`) and exposes functions to components.

- `markAttendance()`: Calls service, updates local state and history list based on response.
- `checkTodayAttendance()`: Syncs initial state on load.
- `getAttendanceHistory()`: Fetches full history list.

### C. UI Component

**File**: `frontend/src/components/AttendanceView.jsx`

The main UI that users interact with.

- **View**: Displays the "Mark Present" button, Streak stats, and History modal.
- **Usage**: Wraps logic `useAttendance()` hook.
  ```javascript
  const { markAttendance, todayStatus, history } = useAttendance();
  ```

---

## 3. How to Apply Changes

### If adding a new feature (e.g., Monthly Stats):

1.  **Backend**: Add endpoint in `AttendanceController.java`.
    ```java
    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) { ... }
    ```
2.  **Service**: Add method in `attendanceService.js`.
    ```javascript
    getStats: async () => (await attendanceApi.get("/attendance/stats")).data;
    ```
3.  **Context**: Add state/function in `AttendanceContext.jsx`.
    ```javascript
    const getStats = async () => { ... }
    ```
4.  **UI**: Consume it in `AttendanceView.jsx`.

### If debugging "Mark Attendance" issues:

- Check **Browser Network Tab**: Look for `POST /attendance/mark`.
  - If 403 Forbidden: Check `SecurityConfig.java` to ensure member access is allowed.
  - If 500 Error: Check Backend Logs.
- Check **Context Logic**: Ensure `setTodayStatus` updates correctly based on the API response.
