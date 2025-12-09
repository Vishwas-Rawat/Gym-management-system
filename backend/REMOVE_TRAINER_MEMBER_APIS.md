# Remove Trainer/Member APIs - Complete Guide

## Overview

This document describes the APIs for removing trainer assignments in both directions:

1. **Remove Trainer from Member** (Member table view)
2. **Remove Member from Trainer** (Trainer table view)

---

## 1️⃣ Remove Trainer from Member (Member Table View)

### **Endpoint**

```
POST /member/{memberId}/remove-trainer
```

### **Details**

- **Port**: 8083 (user-admin-service)
- **Auth**: Admin only (`@PreAuthorize("hasRole('ADMIN')")`)
- **Purpose**: Remove trainer assignment from a member (for use in member table)

### **Request**

```bash
POST http://localhost:8083/member/101/remove-trainer
Authorization: Bearer <admin-jwt-token>
```

**Path Parameters**:

- `memberId` (Integer) - The ID of the member

**No Request Body Required**

### **Response Examples**

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

### **Frontend Integration**

```javascript
// Remove trainer button in member table
async function removeMemberTrainer(memberId) {
  try {
    const response = await fetch(
      `http://localhost:8083/member/${memberId}/remove-trainer`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Trainer removed successfully!");
      // Refresh member list
      await refreshMemberList();
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## 2️⃣ Remove Member from Trainer (Trainer Table View)

### **Endpoint**

```
POST /trainer/{trainerId}/remove-member/{memberId}
```

### **Details**

- **Port**: 8083 (user-admin-service)
- **Auth**: Admin only (`@PreAuthorize("hasRole('ADMIN')")`)
- **Purpose**: Remove a specific member from a trainer (for use in trainer table)

### **Request**

```bash
POST http://localhost:8083/trainer/12/remove-member/101
Authorization: Bearer <admin-jwt-token>
```

**Path Parameters**:

- `trainerId` (Integer) - The ID of the trainer
- `memberId` (Integer) - The ID of the member to remove

**No Request Body Required**

### **Response Examples**

#### Success - Member Removed

```json
{
  "success": true,
  "message": "Member removed from trainer successfully"
}
```

#### Error - Member Not Assigned to This Trainer

```json
{
  "success": false,
  "message": "Member is not assigned to this trainer"
}
```

#### Error - Member Has No Trainer

```json
{
  "success": false,
  "message": "Member has no trainer assigned"
}
```

#### Error - Trainer Not Found

```json
{
  "success": false,
  "message": "Trainer not found"
}
```

#### Error - Member Not Found

```json
{
  "success": false,
  "message": "Member not found"
}
```

### **Frontend Integration**

```javascript
// Remove member button in trainer's member list
async function removeTrainerMember(trainerId, memberId) {
  try {
    const response = await fetch(
      `http://localhost:8083/trainer/${trainerId}/remove-member/${memberId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Member removed from trainer successfully!");
      // Refresh trainer's member list
      await refreshTrainerMembers(trainerId);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## Comparison Table

| Feature                 | Member Table API                         | Trainer Table API                                    |
| ----------------------- | ---------------------------------------- | ---------------------------------------------------- |
| **Endpoint**            | `POST /member/{memberId}/remove-trainer` | `POST /trainer/{trainerId}/remove-member/{memberId}` |
| **Parameters**          | `memberId` only                          | `trainerId` + `memberId`                             |
| **Use Case**            | Remove trainer from member view          | Remove member from trainer view                      |
| **Validation**          | Checks if member exists                  | Checks if both exist AND are linked                  |
| **Error if not linked** | Returns success                          | Returns error                                        |

---

## Complete UI Flow Examples

### **Member Table View**

```html
<!-- Member table row -->
<tr>
  <td>meekeway536@httpsiu.com</td>
  <td id="trainer-name-101">Vishwas Rawat</td>
  <td>
    <button onclick="removeMemberTrainer(101)" class="btn-danger">
      Remove Trainer
    </button>
  </td>
</tr>
```

```javascript
async function removeMemberTrainer(memberId) {
  if (!confirm("Remove trainer from this member?")) return;

  try {
    const response = await fetch(
      `http://localhost:8083/member/${memberId}/remove-trainer`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      // Update UI to show "No Trainer Assigned"
      document.getElementById(`trainer-name-${memberId}`).textContent =
        "No Trainer Assigned";
      showSuccessToast(result.message);
    } else {
      showErrorToast(result.message);
    }
  } catch (error) {
    console.error("Error removing trainer:", error);
    showErrorToast("Failed to remove trainer");
  }
}
```

---

### **Trainer Table View**

```html
<!-- Trainer's assigned members list -->
<div class="trainer-members">
  <h3>Vishwas Rawat - Assigned Members</h3>
  <table>
    <tr>
      <td>meekeway536@httpsiu.com</td>
      <td>
        <button onclick="removeTrainerMember(12, 101)" class="btn-danger">
          Remove
        </button>
      </td>
    </tr>
  </table>
</div>
```

```javascript
async function removeTrainerMember(trainerId, memberId) {
  if (!confirm("Remove this member from the trainer?")) return;

  try {
    const response = await fetch(
      `http://localhost:8083/trainer/${trainerId}/remove-member/${memberId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      // Refresh the trainer's member list
      await loadTrainerMembers(trainerId);
      showSuccessToast(result.message);
    } else {
      showErrorToast(result.message);
    }
  } catch (error) {
    console.error("Error removing member:", error);
    showErrorToast("Failed to remove member");
  }
}

async function loadTrainerMembers(trainerId) {
  const response = await fetch(
    `http://localhost:8083/trainer/${trainerId}/members`,
    {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    }
  );

  const members = await response.json();
  updateTrainerMembersList(members);
}
```

---

## Database Changes

### Before Removal

```sql
SELECT member_id, trainer_id FROM member WHERE member_id = 101;
-- Result: member_id=101, trainer_id=12
```

### After Removal (Either API)

```sql
SELECT member_id, trainer_id FROM member WHERE member_id = 101;
-- Result: member_id=101, trainer_id=NULL
```

---

## Testing with curl

### Test Member Table API

```bash
# Remove trainer from member ID 101
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  http://localhost:8083/member/101/remove-trainer
```

### Test Trainer Table API

```bash
# Remove member ID 101 from trainer ID 12
curl -X POST \
  -H "Authorization: Bearer <admin-token>" \
  http://localhost:8083/trainer/12/remove-member/101
```

---

## Error Handling Best Practices

```javascript
async function safeRemoveOperation(apiCall) {
  try {
    const response = await apiCall();
    const result = await response.json();

    if (response.ok && result.success) {
      return { success: true, message: result.message };
    } else {
      return { success: false, message: result.message || "Operation failed" };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, message: "Network error occurred" };
  }
}

// Usage
const result = await safeRemoveOperation(() =>
  fetch(`/member/${memberId}/remove-trainer`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  })
);

if (result.success) {
  showSuccess(result.message);
} else {
  showError(result.message);
}
```

---

## Complete API Summary

### All Trainer Assignment APIs

| API                          | Method   | Endpoint                                            | Purpose                |
| ---------------------------- | -------- | --------------------------------------------------- | ---------------------- |
| Get trainers by gym          | GET      | `/trainer/gym/{gymId}`                              | List trainers          |
| Get trainer's members        | GET      | `/trainer/{trainerId}/members`                      | View assigned members  |
| Get potential members        | GET      | `/trainer/{trainerId}/potential-members`            | Members for assignment |
| Assign members               | POST     | `/trainer/admin/assign-members`                     | Bulk assign            |
| **Remove from member view**  | **POST** | **`/member/{memberId}/remove-trainer`**             | **Remove trainer**     |
| **Remove from trainer view** | **POST** | **`/trainer/{trainerId}/remove-member/{memberId}`** | **Remove member**      |

---

## Next Steps

1. ✅ **APIs are ready** - Both endpoints are implemented
2. **Add UI buttons** - Add "Remove" buttons in both tables
3. **Add confirmation dialogs** - Ask user to confirm before removing
4. **Implement refresh logic** - Update UI after successful removal
5. **Add error handling** - Show user-friendly error messages
6. **Test thoroughly** - Test both removal directions

---

**Created**: 2025-12-09  
**Service**: user-admin-service (Port 8083)  
**Controllers**: MemberController.java, TrainerController.java
