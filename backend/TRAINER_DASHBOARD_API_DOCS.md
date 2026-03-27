# Trainer Dashboard API Documentation

**Base URL**: `http://localhost:8085`  
**Authentication**: All endpoints require a valid JWT Token in the Authorization header (`Authorization: Bearer <token>`).  
**Role Required**: `TRAINER`

---

## 1. Get Personal Dashboard Summary

**Endpoint**: `GET /api/trainer/dashboard/my-stats`  
**Description**: Returns a summary of the logged-in trainer's statistics, including assigned members, pending requests, and earnings.

**Response Body**:

```json
{
  "trainerId": 101,
  "name": "Rahul Sharma",
  "gymName": "PowerHouse Gym Mumbai",
  "totalMembers": 48,
  "activeToday": 32,
  "dietPlansAssigned": 42,
  "workoutPlansAssigned": 45,
  "pendingDietRequests": 3,
  "totalEarningsThisMonth": 184000.0,
  "rating": 4.8,
  "unreadMessages": 7
}
```

---

## 2. Get All Assigned Members

**Endpoint**: `GET /api/trainer/dashboard/my-members`  
**Description**: Returns a list of all members assigned to the trainer, including their plan details and last activity status.

**Response Body**:

```json
[
  {
    "memberId": 45,
    "name": "Amit Kumar",
    "phone": "+919876543210",
    "photo": "https://via.placeholder.com/150",
    "plan": "Standard",
    "lastAttendance": "2025-12-04",
    "daysSinceLastVisit": 0,
    "hasActiveDietPlan": true,
    "hasActiveWorkoutPlan": true
  }
]
```

---

## 3. Get Today's Attendance

**Endpoint**: `GET /api/trainer/dashboard/today-attendance`  
**Description**: Returns a list of assigned members who have marked attendance today (Check-in).

**Response Body**:

```json
[
  {
    "memberId": 45,
    "name": "Amit Kumar",
    "checkInTime": "09:00 AM",
    "workoutLogged": true,
    "dietLogged": false
  }
]
```

---

## 4. Get Inactive Members (Follow-up Needed)

**Endpoint**: `GET /api/trainer/dashboard/inactive-members`  
**Description**: Returns a list of members who have not attended the gym for more than 7 days.

**Response Body**:

```json
[
  {
    "memberId": 67,
    "name": "Priya Singh",
    "lastAttendance": "2025-11-25",
    "daysAbsent": 9,
    "phone": "+919900112233"
  }
]
```

---

## 5. Get Upcoming Birthdays

**Endpoint**: `GET /api/trainer/dashboard/upcoming-birthdays`  
**Description**: Returns a list of assigned members who have a birthday within the next 30 days.

**Response Body**:

```json
[
  {
    "memberId": 89,
    "name": "Rohan Mehta",
    "birthday": "2025-12-08",
    "daysUntil": 4
  }
]
```

---

## 6. Get Diet Compliance Stats

**Endpoint**: `GET /api/trainer/dashboard/diet-compliance`  
**Description**: Returns statistics on how many members are following their diet plans.

**Response Body**:

```json
{
  "todayLogged": 28,
  "totalMembers": 48,
  "compliancePercent": 58,
  "topPerformers": ["Amit", "Priya", "Rohan"],
  "message": null
}
```

---

## 7. Get Workout Compliance Stats

**Endpoint**: `GET /api/trainer/dashboard/workout-compliance`  
**Description**: Returns statistics on how many members are logging their workouts.

**Response Body**:

```json
{
  "todayLogged": 35,
  "totalMembers": 48,
  "compliancePercent": 73,
  "topPerformers": null,
  "message": "Great job! 73% of your members trained today"
}
```

---

## 8. Get Revenue Share (Optional)

**Endpoint**: `GET /api/trainer/dashboard/revenue-share`  
**Description**: Returns the estimated revenue share for the trainer based on assigned members.

**Response Body**:

```json
{
  "thisMonth": 184000.0,
  "yourSharePercent": 40.0,
  "yourEarnings": 73600.0,
  "paid": false
}
```
