# Trainer Assignment API Guide

## Problem Statement

**Issue**: Member shows "Vishwas Rawat" as assigned trainer in Member-Based view, but Trainer-Based view shows "0 Members" for Vishwas Rawat.

**Root Cause**: Data synchronization issue - the member's `trainer_id` field in the database might not be properly set, or the query is not fetching the correct data.

---

## Complete API Set for Trainer-Based View

### 1. Get All Trainers for a Gym

**Endpoint**: `GET /trainer/gym/{gymId}`  
**Port**: 8083 (user-admin-service)  
**Auth**: Required (JWT)  
**Purpose**: List all active trainers in the selected gym

**Example Request**:

```bash
GET http://localhost:8083/trainer/gym/19
Authorization: Bearer <your-jwt-token>
```

**Example Response**:

```json
[
  {
    "trainerId": 12,
    "fullName": "Vishwas Rawat",
    "email": "vishwas@example.com",
    "phoneNo": "9876543210",
    "specialization": "Strength Training",
    "experienceYears": 5,
    "gymId": 19,
    "gymName": "new gym"
  },
  {
    "trainerId": 13,
    "fullName": "new trainer",
    "email": "newtrainer@example.com",
    "phoneNo": "9123456789",
    "specialization": "Cardio",
    "experienceYears": 3,
    "gymId": 19,
    "gymName": "new gym"
  }
]
```

---

### 2. Get Members Assigned to a Trainer

**Endpoint**: `GET /trainer/{trainerId}/members`  
**Port**: 8083 (user-admin-service)  
**Auth**: Required (JWT)  
**Purpose**: Show all members currently assigned to this specific trainer

**Example Request**:

```bash
GET http://localhost:8083/trainer/12/members
Authorization: Bearer <your-jwt-token>
```

**Example Response**:

```json
[
  {
    "memberId": 101,
    "fullName": "meekeway536",
    "email": "meekeway536@httpsiu.com",
    "phoneNo": "9876543210",
    "membershipPlan": "Gold",
    "monthsPaid": 6,
    "monthsFree": 0,
    "gymName": "new gym",
    "trainerName": "Vishwas Rawat",
    "timing": "6:30 AM to 8:00 AM",
    "registrationFee": 500.0,
    "planPrice": 3000.0,
    "discount": 0.0,
    "totalPaid": 3500.0,
    "paymentMethod": "Cash",
    "startDate": "2024-01-15",
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

**If No Members**: Returns empty array `[]`

---

### 3. Get Potential Members for Assignment (NEW)

**Endpoint**: `GET /trainer/{trainerId}/potential-members`  
**Port**: 8083 (user-admin-service)  
**Auth**: Required (Admin only)  
**Purpose**: Show members that CAN be assigned to this trainer:

- Members with NO trainer assigned
- Members ALREADY assigned to THIS trainer (for re-assignment)

**Example Request**:

```bash
GET http://localhost:8083/trainer/12/potential-members
Authorization: Bearer <admin-jwt-token>
```

**Example Response**:

```json
[
  {
    "memberId": 101,
    "fullName": "meekeway536",
    "email": "meekeway536@httpsiu.com",
    "phoneNo": "9876543210",
    "membershipPlan": "Gold",
    "gymName": "new gym",
    "trainerName": "Vishwas Rawat",
    "timing": "6:30 AM to 8:00 AM"
  },
  {
    "memberId": 102,
    "fullName": "Rohit Kumar",
    "email": "rohit@example.com",
    "phoneNo": "9123456789",
    "membershipPlan": "Silver",
    "gymName": "new gym",
    "trainerName": "No Trainer Assigned",
    "timing": "8:00 AM to 10:00 AM"
  }
]
```

---

### 4. Assign Members to Trainer (Bulk)

**Endpoint**: `POST /trainer/admin/assign-members`  
**Port**: 8083 (user-admin-service)  
**Auth**: Required (Admin only)  
**Purpose**: Assign multiple members to a trainer at once

**Example Request**:

```bash
POST http://localhost:8083/trainer/admin/assign-members
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "trainerId": 12,
  "memberIds": [101, 102, 103]
}
```

**Example Response**:

```json
{
  "success": true,
  "message": "3 members successfully assigned to trainer Vishwas Rawat"
}
```

---

### 5. Remove Member from Trainer

**Endpoint**: `POST /member/gym/{gymId}/member/{memberId}/remove-trainer`  
**Port**: 8083 (user-admin-service)  
**Auth**: Required (Admin only)  
**Purpose**: Unassign a member from their current trainer

**Example Request**:

```bash
POST http://localhost:8083/member/gym/19/member/101/remove-trainer
Authorization: Bearer <admin-jwt-token>
```

**Example Response**:

```json
{
  "success": true,
  "message": "Member removed from trainer successfully"
}
```

---

## Data Flow & Synchronization

### How Assignment Works:

1. **Admin assigns member to trainer** via `POST /trainer/admin/assign-members`
2. **Backend updates** `member.trainer_id` in database
3. **Member-Based view** calls `GET /member/gym/{gymId}` → shows trainer name
4. **Trainer-Based view** calls `GET /trainer/{trainerId}/members` → shows assigned members

### Key Database Fields:

- `member` table has `trainer_id` (foreign key to `trainer` table)
- When `trainer_id` is NULL → "No Trainer Assigned"
- When `trainer_id` is set → Shows trainer's full name

---

## Troubleshooting Steps

### Issue: Trainer shows "0 Members" but member shows trainer name

**Step 1: Verify Database Data**

```sql
-- Check if member has trainer_id set
SELECT member_id, user_id, trainer_id, gym_id
FROM member
WHERE member_id = 101;

-- Check trainer details
SELECT trainer_id, user_id, gym_id
FROM trainer
WHERE trainer_id = 12;

-- Check if trainer_id matches
SELECT m.member_id, m.trainer_id, t.trainer_id
FROM member m
LEFT JOIN trainer t ON m.trainer_id = t.trainer_id
WHERE m.member_id = 101;
```

**Expected Result**: `member.trainer_id` should equal `12` (Vishwas Rawat's trainerId)

---

**Step 2: Test the API Directly**

```bash
# Get members for trainer ID 12
curl -H "Authorization: Bearer <token>" \
     http://localhost:8083/trainer/12/members

# Should return array with member data, NOT empty array
```

---

**Step 3: Check Repository Query**
The query in `MemberRepository.java`:

```java
@Query("SELECT m FROM Member m WHERE m.trainer.trainerId = :trainerId AND m.isActive = true AND m.deletedAt IS NULL")
List<Member> findActiveMembersByTrainerId(@Param("trainerId") Integer trainerId);
```

This query:

- Filters by `m.trainer.trainerId = :trainerId`
- Only returns active, non-deleted members
- Requires `member.trainer_id` to be set in database

---

**Step 4: Verify Assignment Logic**
Check `TrainerServiceImpl.assignMembersToTrainer()`:

```java
for (Integer memberId : request.getMemberIds()) {
    Member member = memberRepository.findActiveById(memberId)
            .orElseThrow(() -> new IllegalArgumentException("Member not found: " + memberId));

    // This line MUST execute to set the trainer
    member.setTrainer(trainer);
    memberRepository.save(member);
}
```

---

## Frontend Integration Guide

### Trainer-Based View Flow:

1. **Load Trainers List**

   ```javascript
   // GET /trainer/gym/{gymId}
   const trainers = await fetch(`/trainer/gym/${gymId}`);
   ```

2. **For Each Trainer, Show Member Count**

   ```javascript
   // GET /trainer/{trainerId}/members
   const members = await fetch(`/trainer/${trainerId}/members`);
   const memberCount = members.length;
   ```

3. **"Assign Members" Button Click**

   ```javascript
   // GET /trainer/{trainerId}/potential-members
   const availableMembers = await fetch(
     `/trainer/${trainerId}/potential-members`
   );
   // Show in modal/dialog with checkboxes
   ```

4. **Submit Assignment**

   ```javascript
   // POST /trainer/admin/assign-members
   await fetch("/trainer/admin/assign-members", {
     method: "POST",
     body: JSON.stringify({
       trainerId: 12,
       memberIds: [101, 102, 103],
     }),
   });
   ```

5. **Refresh Data**
   ```javascript
   // Re-fetch trainer members to update count
   const updatedMembers = await fetch(`/trainer/${trainerId}/members`);
   ```

---

## Member-Based View Flow:

1. **Load Members List**

   ```javascript
   // GET /member/gym/{gymId}
   const members = await fetch(`/member/gym/${gymId}`);
   // Each member object includes trainerName field
   ```

2. **"Change Trainer" Button Click**

   ```javascript
   // GET /trainer/gym/{gymId}
   const trainers = await fetch(`/trainer/gym/${gymId}`);
   // Show trainer selection dropdown
   ```

3. **Submit Trainer Change**

   ```javascript
   // POST /trainer/admin/assign-members
   await fetch("/trainer/admin/assign-members", {
     method: "POST",
     body: JSON.stringify({
       trainerId: newTrainerId,
       memberIds: [memberId],
     }),
   });
   ```

4. **Refresh Member Data**
   ```javascript
   // Re-fetch member to show updated trainer name
   const updatedMember = await fetch(`/member/${memberId}`);
   ```

---

## Testing Checklist

- [ ] Can see all trainers for a gym
- [ ] Can see member count for each trainer
- [ ] Can click trainer to see assigned members list
- [ ] Can click "Assign Members" to see available members
- [ ] Can select multiple members and assign them
- [ ] After assignment, member count updates immediately
- [ ] Member-Based view shows correct trainer name
- [ ] Trainer-Based view shows correct member count
- [ ] Can remove member from trainer
- [ ] Can reassign member to different trainer

---

## Common Issues & Solutions

### Issue: Empty array returned from `/trainer/{trainerId}/members`

**Solution**:

1. Check database: `SELECT * FROM member WHERE trainer_id = 12`
2. If empty, members were never assigned
3. Use `POST /trainer/admin/assign-members` to assign them

### Issue: Member shows trainer but trainer shows 0 members

**Solution**:

1. Database has stale data
2. Run assignment API again to refresh
3. Check if `member.is_active = true` and `member.deleted_at IS NULL`

### Issue: Cannot assign members

**Solution**:

1. Verify admin JWT token is valid
2. Check trainer exists and is active
3. Check members exist and are active
4. Verify gym IDs match

---

## API Summary Table

| Endpoint                                               | Method | Port | Auth  | Purpose                           |
| ------------------------------------------------------ | ------ | ---- | ----- | --------------------------------- |
| `/trainer/gym/{gymId}`                                 | GET    | 8083 | JWT   | List trainers in gym              |
| `/trainer/{trainerId}/members`                         | GET    | 8083 | JWT   | Get assigned members              |
| `/trainer/{trainerId}/potential-members`               | GET    | 8083 | Admin | Get assignable members            |
| `/trainer/admin/assign-members`                        | POST   | 8083 | Admin | Bulk assign members               |
| `/member/gym/{gymId}/member/{memberId}/remove-trainer` | POST   | 8083 | Admin | Remove trainer assignment         |
| `/member/gym/{gymId}`                                  | GET    | 8083 | JWT   | List members (with trainer names) |

---

## Next Steps

1. **Test the APIs** using Postman or curl
2. **Verify database data** using SQL queries
3. **Check frontend calls** - ensure correct endpoints are used
4. **Implement refresh logic** - update UI after assignment
5. **Add error handling** - show user-friendly messages

---

**Last Updated**: 2025-12-09  
**Service**: user-admin-service (Port 8083)
