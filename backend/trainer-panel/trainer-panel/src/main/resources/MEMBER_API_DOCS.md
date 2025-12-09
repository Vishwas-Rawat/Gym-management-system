# Member API Documentation

All endpoints in the **Member API** are secured with JWT authentication and require the user to have the `MEMBER` role (`@PreAuthorize("hasRole('MEMBER')")`).

---

## 1. Get My Diet Plan

**Endpoint**: `GET /api/member/diet/my-plan`

**Description**: Returns the latest diet plan assigned to the authenticated member.

**Response** (`DietPlanResponse`):

```json
{
  "planId": 1,
  "planName": "Keto Starter",
  "meals": [
    {
      "mealName": "Breakfast",
      "description": "Eggs and avocado",
      "calories": 350
    },
    {
      "mealName": "Lunch",
      "description": "Grilled chicken salad",
      "calories": 500
    }
  ]
}
```

> _Note_: The exact fields of `DietPlanResponse` are defined in `DietPlanResponse.java`.

---

## 2. Log Diet Entry

**Endpoint**: `POST /api/member/diet/log`

**Description**: Persists a new diet log entry for the member.

**Request Body** (`DietLogRequest`):

```json
{
  "mealName": "Snack",
  "calories": 150,
  "protein": 5,
  "carbs": 20,
  "fat": 7,
  "date": "2025-12-07"
}
```

**Response**: Plain text confirmation.

```
Diet logged successfully
```

---

## 3. Today’s Diet Summary

**Endpoint**: `GET /api/member/diet/today/summary`

**Description**: Returns a summary of the member’s logged meals for the current day, including total calories, macro breakdown and a simple macro‑percentage chart.

**Response** (`DietTodaySummaryResponse`):

```json
{
  "totalCalories": 1800,
  "goalCalories": 2500,
  "protein": 120,
  "carbs": 200,
  "fat": 70,
  "macroChart": {
    "protein": 30,
    "carbs": 45,
    "fat": 25
  }
}
```

---

## 4. Get My Workout Plan

**Endpoint**: `GET /api/member/workout/my-plan`

**Description**: Returns a placeholder workout plan. In a full implementation this would be populated from the workout service.

**Response** (`WorkoutMyPlanResponse`):

```json
{
  "planName": "Push Pull Legs",
  "today": "Wednesday",
  "todayWorkout": "Leg Day",
  "exercises": [
    { "name": "Back Squat", "sets": 5, "reps": 5 },
    { "name": "Romanian Deadlift", "sets": 4, "reps": 8 }
  ]
}
```

---

## 5. Attendance Streak

**Endpoint**: `GET /api/member/attendance/streak`

**Description**: Retrieves the current attendance streak for the member.

**Response** (`AttendanceStreakResponse`):

```json
{
  "currentStreak": 7,
  "bestStreak": 15,
  "thisMonth": 10,
  "calendar": [
    "2025-12-01",
    "2025-12-02",
    "2025-12-03",
    "2025-12-04",
    "2025-12-05",
    "2025-12-06",
    "2025-12-07"
  ]
}
```

---

## 6. Get My Profile

**Endpoint**: `GET /api/member/profile/me`

**Description**: Returns the profile information of the authenticated member, aggregating data from the user‑management service.

**Response** (`MemberProfileResponse`):

```json
{
  "userId": 42,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-04-15",
  "gender": "MALE",
  "address": "123 Fitness St, Wellness City",
  "weight": 78.5,
  "height": 175.0,
  "fitnessGoal": "LOSE_WEIGHT",
  "membershipPlan": "PREMIUM"
}
```

---

## Security

All endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The token must contain the `ROLE_MEMBER` authority.

---

_Generated on 2025‑12‑07 by Antigravity – your AI coding assistant._
