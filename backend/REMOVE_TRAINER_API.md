# Remove Trainer API - Member Based View

## New Endpoint Added ✅

### **Remove Trainer from Member (Simplified)**

**Endpoint**: `POST /member/{memberId}/remove-trainer`  
**Port**: 8083 (user-admin-service)  
**Auth**: Admin only (`@PreAuthorize("hasRole('ADMIN')")`)  
**Purpose**: Remove/unassign a trainer from a member (for member-based view)

---

## API Details

### Request

```bash
POST http://localhost:8083/member/{memberId}/remove-trainer
Authorization: Bearer <admin-jwt-token>
```

**Path Parameters**:

- `memberId` (Integer) - The ID of the member to remove trainer from

**No Request Body Required**

---

### Response Examples

#### Success - Trainer Removed

```json
{
  "success": true,
  "message": "Trainer removed from member successfully"
}
```

#### Success - No Trainer Was Assigned

```json
{
  "success": true,
  "message": "Member has no trainer assigned"
}
```

#### Error - Member Not Found

```json
{
  "success": false,
  "message": "Member not found"
}
```

---

## How It Works

1. **Fetches the member** by `memberId`
2. **Checks if trainer is assigned**:
   - If NO trainer → Returns success message "Member has no trainer assigned"
   - If trainer EXISTS → Removes the trainer assignment
3. **Sets `member.trainer = null`** in the database
4. **Saves the member** with updated data
5. **Returns success response**

---

## Frontend Integration

### Example: Remove Trainer Button Click

```javascript
async function removeTrainer(memberId) {
  try {
    const response = await fetch(
      `http://localhost:8083/member/${memberId}/remove-trainer`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      // Show success message
      alert(result.message);

      // Refresh member data to show "No Trainer Assigned"
      await refreshMemberData(memberId);
    } else {
      // Show error message
      alert(result.message);
    }
  } catch (error) {
    console.error("Error removing trainer:", error);
    alert("Failed to remove trainer");
  }
}

// Refresh member data after removal
async function refreshMemberData(memberId) {
  const member = await fetch(`http://localhost:8083/member/${memberId}`, {
    headers: {
      Authorization: `Bearer ${adminToken}`,
    },
  });

  const memberData = await member.json();

  // Update UI to show "No Trainer Assigned"
  updateMemberUI(memberData);
}
```

---

### Example: UI Button

```html
<!-- Member row in table -->
<tr>
  <td>meekeway536@httpsiu.com</td>
  <td>
    <span id="trainer-name-101">Vishwas Rawat</span>
  </td>
  <td>
    <button onclick="removeTrainer(101)" class="btn-remove">
      Remove Trainer
    </button>
  </td>
</tr>
```

---

## Comparison with Existing Endpoint

### Old Endpoint (Still Available)

```
POST /member/gym/{gymId}/member/{memberId}/remove-trainer
```

- Requires both `gymId` and `memberId`
- More explicit about gym context

### New Endpoint (Simpler)

```
POST /member/{memberId}/remove-trainer
```

- Only requires `memberId`
- Automatically gets gym from member data
- **Better for member-based view** where you already have member ID

---

## Use Cases

### Member-Based View (Recommended)

When viewing a list of members and want to remove trainer:

```javascript
// You have: memberId = 101
// Just call:
POST / member / 101 / remove - trainer;
```

### Trainer-Based View

When viewing trainer's assigned members and want to remove one:

```javascript
// You have: trainerId = 12, memberId = 101
// Can use either:
POST / member / 101 / remove - trainer;
// OR
POST / member / gym / 19 / member / 101 / remove - trainer;
```

---

## Testing

### Using curl

```bash
# Remove trainer from member ID 101
curl -X POST \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:8083/member/101/remove-trainer
```

### Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:8083/member/101/remove-trainer`
3. **Headers**:
   - `Authorization`: `Bearer <your-admin-token>`
4. **Body**: None
5. **Send** → Should get success response

---

## Database Changes

When this API is called:

**Before**:

```sql
SELECT member_id, trainer_id FROM member WHERE member_id = 101;
-- Result: member_id=101, trainer_id=12
```

**After**:

```sql
SELECT member_id, trainer_id FROM member WHERE member_id = 101;
-- Result: member_id=101, trainer_id=NULL
```

---

## Complete Member Management Flow

### 1. View Members

```
GET /member/gym/{gymId}
```

### 2. Assign Trainer to Member

```
POST /trainer/admin/assign-members
{
  "trainerId": 12,
  "memberIds": [101]
}
```

### 3. Change Member's Trainer

```
POST /trainer/admin/assign-members
{
  "trainerId": 13,  // New trainer
  "memberIds": [101]
}
```

### 4. Remove Trainer from Member (NEW)

```
POST /member/{memberId}/remove-trainer
```

---

## Error Handling

### Possible Errors

1. **Member Not Found**

   ```json
   {
     "success": false,
     "message": "Member not found"
   }
   ```

2. **Unauthorized** (No admin token)

   ```
   HTTP 403 Forbidden
   ```

3. **Invalid Member ID**
   ```json
   {
     "success": false,
     "message": "Invalid member ID"
   }
   ```

---

## Security

- **Admin Only**: Only users with `ADMIN` role can call this endpoint
- **JWT Required**: Must include valid JWT token in Authorization header
- **No Gym Validation**: Automatically uses member's gym (no need to verify gym access)

---

## Next Steps

1. ✅ **API is ready** - No need to restart server (hot reload should work)
2. **Test the endpoint** using Postman or curl
3. **Integrate in frontend** - Add "Remove Trainer" button in member list
4. **Add confirmation dialog** - Ask admin to confirm before removing
5. **Refresh UI** - Update member row to show "No Trainer Assigned" after removal

---

**Created**: 2025-12-09  
**Service**: user-admin-service (Port 8083)  
**Controller**: MemberController.java  
**Method**: `removeTrainerFromMember()`
