# Native App: Member Panel Implementation Spec

This document specifies the login flow and Member Dashboard functionality for the native application, mirroring the web frontend's logic.

---

## 1. Authentication & Routing Flow

### Login Logic

1.  **API Call:** `POST /user/login`
2.  **Payload:** `{ username: "email@example.com", password: "..." }`
3.  **Response Handling:**
    - Store `token` and `userId`.
    - Identify Role: Check `response.role` or decode JWT `sub.role` / `authorities`.
4.  **Routing Rule:**
    ```javascript
    if (role === "MEMBER" || role === "GYM_MEMBER") {
      // Navigate to Member Dashboard
    } else if (role === "TRAINER") {
      // Navigate to Trainer Panel
    } else if (role === "ADMIN") {
      // Navigate to Admin Panel
    }
    ```

---

## 2. Member Dashboard Features

The Member Panel should follow the same **App Shell** design as the Trainer/Admin panels (Sidebar + Top Header + Content Area).

### Navigation Items (Sidebar/Tabs)

| ID  | Tab Name         | Icon       | Description                                               |
| --- | ---------------- | ---------- | --------------------------------------------------------- |
| 0   | **Dashboard**    | Home       | Overview of today's stats, attendance, and quick actions. |
| 1   | **Diet Plan**    | Assignment | View diet plan assigned by trainer.                       |
| 5   | **My Diet**      | Restaurant | Log daily food intake (Calorie Tracker).                  |
| 2   | **Workout Plan** | Fitness    | View workout plan assigned by trainer.                    |
| 6   | **My Workout**   | Edit       | Log daily exercise sets/reps.                             |
| 7   | **Chat**         | Chat       | Chat with assigned trainer or admin.                      |
| 3   | **Attendance**   | Calendar   | View monthly attendance calendar.                         |
| 4   | **Profile**      | Person     | View/Edit profile details.                                |

---

## 3. UI/UX Guidelines

- **Design System:** Use the `LIGHT_THEME_SPEC.md` and `ADMIN_THEME_SPEC.md` definitions.
- **Consistency:** The layout (Sidebar, Header, Cards) should match the Admin/Trainer panels exactly.
  - **Light Theme:** `#F8FAFC` background, White cards, Slate/Orange text.
  - **Dark Theme:** `#0b0f19` background, Navy cards, White/Orange text.

---

## 4. API Reference (Member Service)

Use these endpoints for the respective screens.

### Dashboard & Activity

- `GET /api/member/dashboard/today` - Get today's activity summary.
- `GET /api/member/dashboard/home/{gymId}` - Home stats (if applicable).

### Profile & Settings

- `GET /member/profile/me` - Get full profile.
- `PUT /member/profile/me` - Update profile.
- `GET /member/has-trainer` - Check if member has an assigned trainer.
- `GET /api/member/trainers/available` - List trainers (if none assigned).

### Diet Feature

- `GET /api/member/diet/my-plan` - Get assigned diet plan.
- `GET /api/diet/log?date=YYYY-MM-DD` - Get daily diet logs.
- `POST /api/diet/log` - Log a food item.
- `GET /api/food/search?query={q}` - Search for food items.
- `POST /api/member/request/diet` - Request a new diet plan.

### Workout Feature

- `GET /api/workout/my-plan` - Get assigned workout plan.
- `GET /api/workout/log?date=YYYY-MM-DD` - Get daily workout logs.
- `POST /api/workout/log` - Log a workout set.
- `GET /api/exercise/search?query={q}` - Search for exercises.
- `POST /api/member/request/workout` - Request a new workout plan.

### Attendance

- `GET /attendance/today` - Check today's status.
- `GET /attendance/history` - Get monthly calendar data.
- `POST /attendance/mark?status=PRESENT` - Mark attendance (if self-check-in enabled).

### Requests & Chat

- `GET /api/member/requests/my` - View plan update requests.
- **Chat:** Uses WebSocket/Socket.io (Connect to `/chat` namespace).
