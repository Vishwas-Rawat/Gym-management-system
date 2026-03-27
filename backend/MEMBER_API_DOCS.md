# 🏋️ Member App API Documentation

This document outlines the API endpoints available for the **Member Mobile/Web App**.

## 🔐 Authentication

- **Headers**: `Authorization: Bearer <JWT_TOKEN>`
- **Role Required**: `MEMBER`

## 🌍 Base URLs

- **User & Profile Service**: `http://localhost:8083`
- **Trainer & Activity Service**: `http://localhost:8085`

---

## 1. 🏠 Dashboard

**Base URL**: `http://localhost:8085`

### Get Home Screen Stats

**Endpoint**: `GET /api/member/dashboard/home`  
**Description**: Returns key metrics for the home screen including streak, calories, and next workout.

**Response**:

```json
{
  "streak": 5,
  "caloriesConsumed": 1250.0,
  "caloriesTarget": 2500.0,
  "workoutCompleted": false,
  "nextWorkoutName": "Full Body Power",
  "weight": 75.5,
  "quote": "Pain is temporary. Pride is forever."
}
```

### Get Today's Detailed Activity

**Endpoint**: `GET /api/member/dashboard/today`  
**Description**: Returns a consolidated view of today's diet logs, workout logs, and attendance status.

**Response**:

```json
{
  "dietLogs": [
    {
      "logId": 101,
      "mealName": "BREAKFAST",
      "foodName": "Oatmeal",
      "calories": 300,
      "protein": 10
    }
  ],
  "workoutLogs": [],
  "attendanceMarked": true,
  "caloriesConsumed": 300.0,
  "proteinConsumed": 10.0,
  "carbsConsumed": 50.0,
  "fatConsumed": 5.0
}
```

---

## 2. 🍎 Diet Logging

**Base URL**: `http://localhost:8085`

### Log a Meal

**Endpoint**: `POST /api/diet/log`  
**Description**: Log a food item consumed by the member.

**Request Body**:

```json
{
  "mealName": "LUNCH", // Enum: BREAKFAST, LUNCH, DINNER, SNACK
  "foodName": "Grilled Chicken",
  "quantity": 150.0, // in grams/units
  "calories": 250.0,
  "protein": 30.0,
  "carbs": 0.0,
  "fat": 5.0
}
```

### Get Today's Diet Logs

**Endpoint**: `GET /api/diet/today`

### Get Diet History (Last 30 Days)

**Endpoint**: `GET /api/diet/history`

---

## 3. 💪 Workout Logging

**Base URL**: `http://localhost:8085`

### Log a Workout Exercise

**Endpoint**: `POST /api/workout/log`  
**Description**: Log a set or exercise completed by the member.

**Request Body**:

```json
{
  "exerciseName": "SQUAT",
  "setsCount": 3,
  "repsCount": 12,
  "weight": 80.0, // in kg
  "durationMinutes": 0, // Optional, for cardio
  "completed": true
}
```

### Get Today's Workout Logs

**Endpoint**: `GET /api/workout/today`

---

## 4. 📅 Attendance

**Base URL**: `http://localhost:8085`

### Get Current Streak

**Endpoint**: `GET /api/attendance/streak`  
**Response**: `12` (Integer representing consecutive days checked in)

### Mark Attendance (Check-In)

**Endpoint**: `POST /api/attendance/mark`  
**Description**: Marks the member as present for today. Usually called when scanning a QR code or entering the gym.

---

## 5. 👤 Profile

**Base URL**: `http://localhost:8083` (Note port 8083)

### Get My Profile

**Endpoint**: `GET /api/member/profile/me`  
**Description**: detailed profile information.

**Response**:

```json
{
  "userId": 101,
  "firstName": "Rahul",
  "lastName": "Verma",
  "email": "rahul@example.com",
  "phone": "9876543210",
  "dateOfBirth": "1995-08-15",
  "gender": "MALE",
  "address": "123 Main St, Mumbai",
  "weight": 75.5,
  "height": 178.0,
  "fitnessGoal": "MUSCLE_GAIN",
  "membershipPlan": "GOLD_YEARLY"
}
```

### Update Profile

**Endpoint**: `PUT /api/member/profile/update`  
**Description**: Update personal details.

**Request Body**:

```json
{
  "firstName": "Rahul",
  "lastName": "Verma",
  "address": "456 New Rd, Delhi",
  "weight": 76.0,
  "height": 178.0,
  "fitnessGoal": "FAT_LOSS"
}
```
