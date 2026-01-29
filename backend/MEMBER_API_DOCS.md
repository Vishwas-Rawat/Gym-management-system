# Member API Documentation (Frontend Integration)

This document outlines the API changes for member registration, updates, and profile retrieval to assist the frontend team.

## Base Configuration

- **Service**: `user-admin-service`
- **Port**: `8083`
- **Prefix**: `/`

---

## 1. Get Admin Profile

Retrieves the logged-in admin's profile and their **Active** gyms.

- **Endpoint**: `GET /admin/profile/me`
- **Auth**: Required (Bearer Token)
- **Note**: This API now automatically filters out gyms marked as inactive (`isActive: false`).

**Response Example**:

```json
{
  "userId": 1,
  "fullName": "Admin Name",
  "email": "admin@gym.com",
  "gyms": [
    {
      "gymId": 10,
      "gymName": "Active Gym",
      "isActive": true
    }
  ]
}
```

---

## 2. Register New Members (Bulk)

Admin creates new member entries. This sends registration invite links to the provided emails.

- **Endpoint**: `POST /member/admin/add-multiple`
- **Auth**: Required (Admin role)
- **Request Body**: `List<AddMemberRequest>`

**Simplified Request JSON**:

```json
[
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNo": "9876543210",
    "workoutTimeSlot": "06:00 AM - 08:00 AM",
    "monthsPaid": 3,
    "monthsFree": 1,
    "registrationFee": 500.0,
    "planPrice": 3000.0,
    "discount": 200.0,
    "paymentMethod": "CASH",
    "joiningDate": "2026-01-26",
    "gymId": 1
  }
]
```

> [!IMPORTANT]
>
> - **Time Format**: Individual fields (`fromHour`, `fromMinute`, etc.) are removed. Use a single `workoutTimeSlot` string.
> - **Total Amount**: Do not send `totalAmount`. The backend calculates this automatically.

---

## 3. Update Member Details

Updates an existing member's information or renews their plan.

- **Endpoint**: `PUT /member/{memberId}`
- **Auth**: Required
- **Request Body**: `UpdateMemberRequest`

**Simplified Request JSON**:

```json
{
  "fullName": "Jane Updated",
  "email": "jane.new@example.com",
  "phoneNo": "9876543210",
  "workoutTimeSlot": "05:00 PM - 07:00 PM",
  "monthsPaid": 6,
  "monthsFree": 0,
  "planPrice": 5000.0,
  "discount": 500.0,
  "paymentMethod": "UPI"
}
```

---

## 4. Response Handling

The registration response (`AddMemberResponse`) has also been simplified.

- **timing**: Contains the `workoutTimeSlot` string directly.
- **name**: Returns the first name from the user profile.

**Response Example**:

```json
{
  "memberId": 55,
  "name": "Jane",
  "email": "jane@example.com",
  "timing": "06:00 AM - 08:00 AM",
  "totalAmount": 3300.0,
  "message": "Member added successfully...",
  "role": "MEMBER"
}
```
