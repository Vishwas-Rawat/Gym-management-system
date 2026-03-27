# Member Dashboard – Selected API Documentation

All endpoints below are secured with JWT authentication and require the **MEMBER** role (`@PreAuthorize("hasRole('MEMBER')")`). Include the token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

---

## 1️⃣ Member Home Dashboard

**Endpoint**: `GET /api/member/dashboard/home`

**Response** (`application/json`):

```json
{
  "memberId": 45,
  "name": "Amit Kumar",
  "photo": "https://...",
  "currentStreak": 12,
  "totalCheckIns": 156,
  "caloriesToday": 1850,
  "caloriesGoal": 2500,
  "proteinToday": 142,
  "proteinGoal": 160,
  "workoutToday": "Push Day",
  "workoutCompleted": true,
  "dietLogged": true,
  "trainerName": "Rahul Sharma",
  "unreadMessages": 2,
  "nextCheckInReward": "Free Protein Shake at 15-day streak!"
}
```

---

## 2️⃣ Today’s Summary (Diet + Workout)

**Endpoint**: `GET /api/member/dashboard/today`

**Response** (`application/json`):

```json
{
  "date": "2025-12-04",
  "checkedIn": true,
  "checkInTime": "07:45",
  "diet": {
    "calories": 1850,
    "protein": 142,
    "carbs": 210,
    "fat": 68,
    "macroPercent": { "protein": 31, "carbs": 45, "fat": 24 },
    "mealsLogged": 3,
    "goalMet": false
  },
  "workout": {
    "name": "Push Day",
    "exercises": ["Bench Press 4x10", "Shoulder Press 3x12"],
    "completed": true
  }
}
```

---

## 3️⃣ My Current Diet Plan

**Endpoint**: `GET /api/member/diet/my-plan`

**Response** (`application/json`):

```json
{
  "planName": "Bulking Phase 2",
  "dietType": "NON_VEG",
  "meals": [
    {
      "mealName": "BREAKFAST",
      "foods": ["Oats 100g", "4 Eggs", "Whey 1 scoop"]
    },
    {
      "mealName": "LUNCH",
      "foods": ["Chicken 200g", "Rice 150g", "Broccoli"]
    }
  ]
}
```

---

## 4️⃣ Log Food (New System)

**Endpoint**: `POST /api/member/diet/log`

**Request Body** (`application/json`):

```json
{
  "foodId": 45,
  "quantity": 180,
  "mealName": "LUNCH"
}
```

**Response**: Plain‑text confirmation, e.g.

```
Calories logged: 560
```

---

## 5️⃣ Today’s Calories + Macro Pie Chart

**Endpoint**: `GET /api/member/diet/today/summary`

**Response** (`application/json`):

```json
{
  "totalCalories": 1850,
  "goal": 2500,
  "protein": 142,
  "carbs": 210,
  "fat": 68,
  "macroChart": {
    "protein": 31,
    "carbs": 45,
    "fat": 24
  }
}
```

---

## 6️⃣ My Current Workout Plan

**Endpoint**: `GET /api/member/workout/my-plan`

**Response** (`application/json`):

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

## 7️⃣ Attendance Streak

**Endpoint**: `GET /api/member/attendance/streak`

**Response** (`application/json`):

```json
{
  "currentStreak": 12,
  "bestStreak": 28,
  "thisMonth": 18,
  "calendar": ["2025-12-04", "2025-12-03", "..."]
}
```

---

## 8️⃣ My Profile

**Endpoint**: `GET /api/member/profile/me`

**Response** (`application/json`):

```json
{
  "name": "Amit Kumar",
  "age": 28,
  "weight": 78,
  "height": 175,
  "goal": "Gain Muscle",
  "trainer": "Rahul Sharma",
  "joinDate": "2025-01-10",
  "membershipDaysLeft": 89
}
```

---

_Generated on 2025‑12‑07 by Antigravity – your AI coding assistant._
