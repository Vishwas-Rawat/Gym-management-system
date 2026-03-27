# Admin API Documentation

**Base URL**: `http://localhost:8083`

---

## 1️⃣ Authentication (Public)

| Method | Endpoint                | Description                                  |
| :----- | :---------------------- | :------------------------------------------- |
| `POST` | `/user/register`        | Register a new Admin account.                |
| `POST` | `/user/login`           | Login (Admin, Trainer, Member). Returns JWT. |
| `POST` | `/user/verify-otp`      | Verify email OTP.                            |
| `POST` | `/auth/forgot-password` | Initiate password reset.                     |
| `POST` | `/auth/reset-password`  | Reset password using OTP.                    |

---

## 2️⃣ Dashboard

| Method | Endpoint                   | Description                                                    |
| :----- | :------------------------- | :------------------------------------------------------------- |
| `GET`  | `/admin/dashboard/{gymId}` | Get dashboard stats (active members, trainers, expiring soon). |

---

## 3️⃣ Gym Management

| Method   | Endpoint              | Description                              |
| :------- | :-------------------- | :--------------------------------------- |
| `POST`   | `/gym/create`         | Create one or multiple gyms.             |
| `GET`    | `/gym/my-gyms`        | Get all gyms managed by logged-in admin. |
| `PUT`    | `/gym/update/{gymId}` | Update gym details.                      |
| `DELETE` | `/gym/delete/{gymId}` | Soft delete a gym.                       |

---

## 4️⃣ Trainer Management

| Method   | Endpoint                                 | Description                                         |
| :------- | :--------------------------------------- | :-------------------------------------------------- |
| `POST`   | `/trainer/admin/add-trainers`            | Add one or multiple trainers (sends email invites). |
| `PUT`    | `/trainer/{trainerId}`                   | Update trainer details.                             |
| `DELETE` | `/trainer/{trainerId}`                   | Delete trainer (soft delete).                       |
| `GET`    | `/trainer/gym/{gymId}`                   | Get all trainers in a specific gym.                 |
| `POST`   | `/trainer/admin/assign-members`          | Assign members to a trainer.                        |
| `POST`   | `/trainer/admin/trainer/{userId}/resend` | Resend registration invite to trainer.              |

---

## 5️⃣ Member Management

| Method   | Endpoint                                 | Description                                        |
| :------- | :--------------------------------------- | :------------------------------------------------- |
| `POST`   | `/member/admin/add-multiple`             | Add one or multiple members (sends email invites). |
| `PUT`    | `/member/{memberId}`                     | Update member details.                             |
| `DELETE` | `/member/{memberId}`                     | Delete member (soft delete).                       |
| `GET`    | `/member/gym/{gymId}`                    | Get all members in a specific gym.                 |
| `GET`    | `/member/search?keyword=...`             | Search members by name or membership plan.         |
| `POST`   | `/member/admin/{userId}/resend-invite`   | Resend registration invite to member.              |
| `POST`   | `/member/admin/send-reminder/{memberId}` | Send single expiry reminder email.                 |
| `POST`   | `/member/admin/send-all-reminders`       | Send expiry reminders to all expiring members.     |
| `GET`    | `/member/all-with-expiry`                | Get list of all members with their expiry status.  |
