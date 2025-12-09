# Trainer API Documentation

**Base URL**: `http://localhost:8085`

---

## 1️⃣ Authentication (Shared)

| Method | Endpoint                         | Description                             |
| :----- | :------------------------------- | :-------------------------------------- |
| `POST` | `/user/login`                    | Login (Returns JWT).                    |
| `POST` | `/trainer/complete-registration` | Complete registration from invite link. |

---

## 2️⃣ Trainer Dashboard

| Method | Endpoint                                    | Description                                                                  |
| :----- | :------------------------------------------ | :--------------------------------------------------------------------------- |
| `GET`  | `/api/trainer/dashboard/stats`              | Get full dashboard stats (Active Clients, Diet/Workout Compliance, Revenue). |
| `GET`  | `/api/trainer/dashboard/today-attendance`   | Get list of members present today.                                           |
| `GET`  | `/api/trainer/dashboard/my-members`         | Get all assigned members with their plan details.                            |
| `GET`  | `/api/trainer/dashboard/inactive-members`   | Get members absent for >3 days.                                              |
| `GET`  | `/api/trainer/dashboard/upcoming-birthdays` | Get upcoming member birthdays.                                               |
| `GET`  | `/api/trainer/dashboard/diet-compliance`    | Get diet adherence stats for charts.                                         |
| `GET`  | `/api/trainer/dashboard/workout-compliance` | Get workout adherence stats for charts.                                      |

---

## 3️⃣ Member Management (Trainer View)

| Method | Endpoint                      | Description                                         |
| :----- | :---------------------------- | :-------------------------------------------------- |
| `GET`  | `/trainer/members?gymId={id}` | Get all members assigned to this trainer.           |
| :----- | :---------------------------  | :-------------------------------------------------- |
| `POST` | `/api/attendance/mark`        | Mark attendance for self (or member if authorized). |
| `GET`  | `/api/attendance/history`     | Get own attendance history.                         |
| `GET`  | `/api/attendance/streak`      | Get current attendance streak.                      |
| `GET`  | `/api/attendance/max-streak`  | Get formatted max streak string.                    |

`Authorization: Bearer <jwt_token>`
The token must contain the `ROLE_TRAINER` authority.
