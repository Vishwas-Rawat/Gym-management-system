# Attendance API Documentation

These endpoints manage user attendance, allowing members and trainers to mark their daily status and view their history.

**Base URL**: `http://localhost:8085`
**Authentication**: Valid JWT required (`Bearer <token>`).

---

## 1️⃣ Mark Attendance

**Endpoint**: `POST /api/attendance/mark`

**Description**: Mark or update your attendance for today.

**Query Parameters**:

- `status` (optional): `PRESENT` or `ABSENT`. Defaults to `PRESENT` if omitted.

**Examples**:

- **Mark Present**: `POST /api/attendance/mark?status=PRESENT`
- **Mark Absent**: `POST /api/attendance/mark?status=ABSENT`

**Response** (`application/json`):

```json
{
  "id": 105,
  "marked": true,
  "message": "Attendance marked as PRESENT"
}
```

_or if updating:_

```json
{
  "id": 105,
  "marked": true,
  "message": "Attendance updated to ABSENT"
}
```

---

## 2️⃣ Attendance History

**Endpoint**: `GET /api/attendance/history`

**Description**: Retrieve the full list of your past attendance records.

**Response** (`application/json`):

```json
[
  {
    "id": 105,
    "userId": 12,
    "role": "MEMBER",
    "date": "2025-12-07",
    "status": "PRESENT"
  },
  {
    "id": 98,
    "userId": 12,
    "role": "MEMBER",
    "date": "2025-12-06",
    "status": "ABSENT"
  },
  {
    "id": 92,
    "userId": 12,
    "role": "MEMBER",
    "date": "2025-12-05",
    "status": "PRESENT"
  }
]
```

---

## 3️⃣ Check Today's Status

**Endpoint**: `GET /api/attendance/today`

**Description**: Check if attendance has already been marked for the current date.

**Response** (`boolean`):

- `true` - Attendance is marked (Present or Absent).
- `false` - Not marked yet.

---

## 4️⃣ Get Current Streak

**Endpoint**: `GET /api/attendance/streak`

**Description**: Returns the current consecutive days of "PRESENT" attendance.

**Response** (`application/json`):

```json
12
```

_(Returns a simple integer)_

---

## 5️⃣ Get Max Streak

**Endpoint**: `GET /api/attendance/max-streak`

**Description**: Returns the user's highest ever streak (longest run of consecutive "PRESENT" days).

**Response** (`application/json`):

```json
25
```

---

### ⚠️ Auto-Absent Logic

- **Manual Marking**: Users can manually mark themselves `ABSENT` using the API above.
- **Automatic Marking**: To automatically mark users as `ABSENT` if they miss a day, a nightly scheduled job (Cron) is required on the backend. (Currently, the API supports manual absent marking).
