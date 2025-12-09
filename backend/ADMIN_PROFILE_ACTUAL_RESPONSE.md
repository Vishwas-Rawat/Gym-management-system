# Admin Profile API - Actual Response Fields

## API Endpoint

```
GET http://localhost:8083/admin/profile
Authorization: Bearer <admin-jwt-token>
```

---

## Actual Response Structure

Based on your database schema (`User` and `UserProfile` entities):

```json
{
  "userId": 1,
  "email": "admin@newgym.com",
  "username": "admin_newgym",
  "phoneNumber": "9876543210",
  "role": "ADMIN",
  "isActive": true,
  "isEmailVerified": true,
  "registrationStatus": "REGISTERED",

  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "123 Main Street, City",
  "weight": 75.5,
  "height": 175.0,

  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-12-09T03:30:00"
}
```

---

## Complete Field Reference

### User Basic Information (from `users` table)

| Field                | Type    | Source                     | Description                     | Example              |
| -------------------- | ------- | -------------------------- | ------------------------------- | -------------------- |
| `userId`             | Integer | `user.user_id`             | Unique user ID                  | `1`                  |
| `email`              | String  | `user.email`               | Email address (unique)          | `"admin@newgym.com"` |
| `username`           | String  | `user.username`            | Username (unique, nullable)     | `"admin_newgym"`     |
| `phoneNumber`        | String  | `user.phone_number`        | Phone number (unique, nullable) | `"9876543210"`       |
| `role`               | String  | `user.role`                | User role enum                  | `"ADMIN"`            |
| `isActive`           | Boolean | `user.is_active`           | Account active status           | `true`               |
| `isEmailVerified`    | Boolean | `user.is_email_verified`   | Email verification status       | `true`               |
| `registrationStatus` | String  | `user.registration_status` | Registration status enum        | `"REGISTERED"`       |

### Profile Information (from `user_profiles` table)

| Field         | Type      | Source                       | Description                 | Example         |
| ------------- | --------- | ---------------------------- | --------------------------- | --------------- |
| `firstName`   | String    | `user_profile.first_name`    | First name (required)       | `"John"`        |
| `lastName`    | String    | `user_profile.last_name`     | Last name (required)        | `"Doe"`         |
| `fullName`    | String    | Computed                     | firstName + lastName        | `"John Doe"`    |
| `dateOfBirth` | LocalDate | `user_profile.date_of_birth` | Date of birth (nullable)    | `"1990-01-15"`  |
| `gender`      | String    | `user_profile.gender`        | Gender (nullable)           | `"Male"`        |
| `address`     | String    | `user_profile.address`       | Physical address (nullable) | `"123 Main St"` |
| `weight`      | Double    | `user_profile.weight`        | Weight in kg (nullable)     | `75.5`          |
| `height`      | Double    | `user_profile.height`        | Height in cm (nullable)     | `175.0`         |

### Account Timestamps

| Field       | Type          | Source            | Description           | Example                 |
| ----------- | ------------- | ----------------- | --------------------- | ----------------------- |
| `createdAt` | LocalDateTime | `user.created_at` | Account creation time | `"2024-01-01T10:00:00"` |
| `updatedAt` | LocalDateTime | `user.updated_at` | Last update time      | `"2024-12-09T03:30:00"` |

---

## Possible Values

### `role` (Enum)

- `"ADMIN"`
- `"MEMBER"`
- `"TRAINER"`

### `registrationStatus` (Enum)

- `"PENDING"` - Registration link sent but not completed
- `"REGISTERED"` - Registration completed
- `null` - If not set

### `gender` (String - Free text)

- Common values: `"Male"`, `"Female"`, `"Other"`
- Can be `null`

---

## Nullable Fields

The following fields can be `null` in the response:

- `username` - If admin hasn't set a username
- `phoneNumber` - If not provided
- `dateOfBirth` - If not set
- `gender` - If not set
- `address` - If not set
- `weight` - If not set
- `height` - If not set
- `registrationStatus` - If not set

---

## Example Responses

### Complete Profile

```json
{
  "userId": 1,
  "email": "admin@newgym.com",
  "username": "admin_newgym",
  "phoneNumber": "9876543210",
  "role": "ADMIN",
  "isActive": true,
  "isEmailVerified": true,
  "registrationStatus": "REGISTERED",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "123 Main Street, City, State 12345",
  "weight": 75.5,
  "height": 175.0,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-12-09T03:30:00"
}
```

### Minimal Profile (newly registered admin)

```json
{
  "userId": 2,
  "email": "newadmin@gym.com",
  "username": null,
  "phoneNumber": null,
  "role": "ADMIN",
  "isActive": true,
  "isEmailVerified": true,
  "registrationStatus": "REGISTERED",
  "firstName": "New",
  "lastName": "Admin",
  "fullName": "New Admin",
  "dateOfBirth": null,
  "gender": null,
  "address": null,
  "weight": null,
  "height": null,
  "createdAt": "2024-12-09T03:00:00",
  "updatedAt": "2024-12-09T03:00:00"
}
```

### Profile Without UserProfile (edge case)

```json
{
  "userId": 3,
  "email": "incomplete@gym.com",
  "username": null,
  "phoneNumber": null,
  "role": "ADMIN",
  "isActive": false,
  "isEmailVerified": false,
  "registrationStatus": "PENDING",
  "firstName": null,
  "lastName": null,
  "fullName": "Admin",
  "dateOfBirth": null,
  "gender": null,
  "address": null,
  "weight": null,
  "height": null,
  "createdAt": "2024-12-08T10:00:00",
  "updatedAt": "2024-12-08T10:00:00"
}
```

---

## Frontend Usage Examples

### TypeScript Interface

```typescript
interface AdminProfile {
  // User basic info
  userId: number;
  email: string;
  username: string | null;
  phoneNumber: string | null;
  role: "ADMIN" | "MEMBER" | "TRAINER";
  isActive: boolean;
  isEmailVerified: boolean;
  registrationStatus: "PENDING" | "REGISTERED" | null;

  // Profile info
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  dateOfBirth: string | null; // ISO date format
  gender: string | null;
  address: string | null;
  weight: number | null;
  height: number | null;

  // Timestamps
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}
```

### Fetch and Use

```javascript
async function getAdminProfile(): Promise<AdminProfile> {
  const response = await fetch("http://localhost:8083/admin/profile", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return await response.json();
}

// Usage
const profile = await getAdminProfile();

console.log(`Name: ${profile.fullName}`);
console.log(`Email: ${profile.email}`);
console.log(`Phone: ${profile.phoneNumber || "Not set"}`);
console.log(`Active: ${profile.isActive ? "Yes" : "No"}`);
```

### Display in UI

```javascript
function displayAdminProfile(profile) {
  // Header
  document.getElementById("admin-name").textContent = profile.fullName;
  document.getElementById("admin-email").textContent = profile.email;

  // Profile details
  document.getElementById("username").textContent =
    profile.username || "Not set";
  document.getElementById("phone").textContent =
    profile.phoneNumber || "Not set";
  document.getElementById("dob").textContent = profile.dateOfBirth || "Not set";
  document.getElementById("gender").textContent = profile.gender || "Not set";
  document.getElementById("address").textContent = profile.address || "Not set";

  // Physical stats
  if (profile.weight) {
    document.getElementById("weight").textContent = `${profile.weight} kg`;
  }
  if (profile.height) {
    document.getElementById("height").textContent = `${profile.height} cm`;
  }

  // Status badges
  const statusBadge = document.getElementById("status-badge");
  statusBadge.textContent = profile.isActive ? "Active" : "Inactive";
  statusBadge.className = profile.isActive ? "badge-success" : "badge-danger";

  // Account info
  const createdDate = new Date(profile.createdAt);
  document.getElementById("member-since").textContent =
    createdDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
}
```

---

## React Component Example

```jsx
import { useState, useEffect } from "react";

function AdminProfileCard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8083/admin/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="profile-card">
      <h2>{profile.fullName}</h2>

      <div className="profile-section">
        <h3>Contact Information</h3>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phoneNumber || "Not set"}
        </p>
        <p>
          <strong>Username:</strong> {profile.username || "Not set"}
        </p>
      </div>

      <div className="profile-section">
        <h3>Personal Information</h3>
        <p>
          <strong>Date of Birth:</strong> {profile.dateOfBirth || "Not set"}
        </p>
        <p>
          <strong>Gender:</strong> {profile.gender || "Not set"}
        </p>
        <p>
          <strong>Address:</strong> {profile.address || "Not set"}
        </p>
      </div>

      {(profile.weight || profile.height) && (
        <div className="profile-section">
          <h3>Physical Stats</h3>
          {profile.weight && (
            <p>
              <strong>Weight:</strong> {profile.weight} kg
            </p>
          )}
          {profile.height && (
            <p>
              <strong>Height:</strong> {profile.height} cm
            </p>
          )}
        </div>
      )}

      <div className="profile-section">
        <h3>Account Status</h3>
        <p>
          <strong>Status:</strong>{" "}
          <span className={profile.isActive ? "text-success" : "text-danger"}>
            {profile.isActive ? "Active" : "Inactive"}
          </span>
        </p>
        <p>
          <strong>Email Verified:</strong>{" "}
          {profile.isEmailVerified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Member Since:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default AdminProfileCard;
```

---

## Testing

### curl Command

```bash
curl -H "Authorization: Bearer <your-token>" \
     http://localhost:8083/admin/profile | jq
```

### Expected Output

```json
{
  "userId": 1,
  "email": "admin@example.com",
  "username": "admin123",
  "phoneNumber": "1234567890",
  "role": "ADMIN",
  "isActive": true,
  "isEmailVerified": true,
  "registrationStatus": "REGISTERED",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "123 Main St",
  "weight": 75.5,
  "height": 175.0,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-12-09T03:30:00"
}
```

---

## Summary

**Total Fields**: 18

**Required Fields** (always present):

- `userId`, `email`, `role`, `isActive`, `isEmailVerified`, `fullName`, `createdAt`, `updatedAt`

**Optional Fields** (can be null):

- `username`, `phoneNumber`, `registrationStatus`, `firstName`, `lastName`, `dateOfBirth`, `gender`, `address`, `weight`, `height`

**Computed Fields**:

- `fullName` - Automatically built from firstName + lastName

---

**Last Updated**: 2025-12-09  
**Based on**: User.java and UserProfile.java entities  
**Service**: user-admin-service (Port 8083)
