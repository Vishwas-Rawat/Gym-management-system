# Admin Portal: Member & Trainer API Documentation

This document provides request and response structures for managing Members and Trainers via the `user-admin-service` (Port **8083**).

---

## 1. Member Management (Port 8083)

### **A. Add New Members (Bulk)**

Admin registers new members. Invite links are sent via email.

- **Endpoint**: `POST /member/admin/add-multiple`
- **Request Body**: `List<AddMemberRequest>`

**Request JSON**:

```json
[
  {
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phoneNo": "9876543210",
    "workoutTimeSlot": "06:00 AM - 08:00 AM",
    "monthsPaid": 3,
    "monthsFree": 0,
    "registrationFee": 500.0,
    "planPrice": 1500.0,
    "discount": 100.0,
    "paymentMethod": "CASH",
    "joiningDate": "2026-01-26",
    "gymId": 1
  }
]
```

**Response JSON**:

```json
{
  "success": true,
  "message": "1 members added successfully..."
}
```

---

### **B. Update/Renew Member**

Updates member details or renews membership.

- **Endpoint**: `PUT /member/{memberId}`
- **Request JSON**:

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

## 2. Trainer Management (Port 8083)

### **A. Add New Trainers (Bulk)**

Admin registers new trainers. Invite links are sent via email.

- **Endpoint**: `POST /trainer/admin/add-trainers`
- **Request Body**: `List<AddTrainerRequest>`

**Request JSON**:

```json
[
  {
    "fullName": "Mike Ross",
    "email": "mike@gym.com",
    "phoneNo": "9988776655",
    "specialization": "Yoga, Cardio",
    "experienceYears": 5,
    "gymId": 1
  }
]
```

**Response JSON**:

```json
[
  {
    "trainerId": 12,
    "userId": 45,
    "fullName": "Mike Ross",
    "email": "mike@gym.com",
    "specialization": "Yoga, Cardio",
    "message": "Trainer added successfully..."
  }
]
```

---

### **B. Update Trainer Details**

Updates trainer information like experience, specialization, or status.

- **Endpoint**: `PUT /trainer/{trainerId}`
- **Request JSON**:

```json
{
  "specialization": "Bodybuilding, Nutrition",
  "experienceYears": 7,
  "availability": "Available",
  "phoneNo": "9988776655",
  "salary": 35000.0,
  "status": "ACTIVE"
}
```

**Response JSON**:
Returns the updated `Trainer` object.

---

## Key Notes for Frontend:

1. **Time Slots**: Both Members and Trainers now use simple strings (e.g., `"06:00 AM - 08:00 AM"`) for timing fields.
2. **Bulk Operations**: "Add" APIs for both Member and Trainer accept an **Array** of objects.
3. **Calculations**: `totalAmount` for members is calculated on the server; no need to send it in the request.
