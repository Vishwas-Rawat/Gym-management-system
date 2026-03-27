# Admin Profile API Documentation

## Overview

This API allows admins to retrieve their complete profile information including personal details, gym association, and account status.

---

## Endpoints

### 1️⃣ Get Current Admin Profile (Recommended)

**Endpoint**: `GET /admin/profile`  
**Port**: 8083 (user-admin-service)  
**Auth**: Admin only (`@PreAuthorize("hasRole('ADMIN')")`)  
**Purpose**: Get the profile of the currently logged-in admin (using JWT token)

#### Request

```bash
GET http://localhost:8083/admin/profile
Authorization: Bearer <admin-jwt-token>
```

**No Request Body or Parameters Required** - Uses JWT token to identify the admin

#### Response Example

```json
{
  "userId": 1,
  "email": "admin@newgym.com",
  "username": "admin_newgym",
  "phoneNumber": "9876543210",
  "role": "ADMIN",
  "isActive": true,
  "isEmailVerified": true,

  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-15",
  "gender": "Male",
  "address": "123 Main Street, City",
  "weight": 75.5,
  "height": 175.0,

  "gymId": 19,
  "gymName": "new gym",
  "gymAddress": "456 Fitness Avenue, City",

  "createdAt": "2024-01-01T10:00:00",
  "lastLogin": "2024-12-09T03:30:00"
}
```

---

### 2️⃣ Get Admin Profile by User ID

**Endpoint**: `GET /admin/profile/{userId}`  
**Port**: 8083 (user-admin-service)  
**Auth**: Admin only  
**Purpose**: Get admin profile by specific user ID (for internal use)

#### Request

```bash
GET http://localhost:8083/admin/profile/1
Authorization: Bearer <admin-jwt-token>
```

**Path Parameters**:

- `userId` (Integer) - The user ID of the admin

#### Response

Same as above

---

## Response Fields

| Field               | Type          | Description                      |
| ------------------- | ------------- | -------------------------------- |
| **User Basic Info** |               |                                  |
| `userId`            | Integer       | Unique user ID                   |
| `email`             | String        | Admin's email address            |
| `username`          | String        | Admin's username                 |
| `phoneNumber`       | String        | Contact phone number             |
| `role`              | String        | User role (always "ADMIN")       |
| `isActive`          | Boolean       | Account active status            |
| `isEmailVerified`   | Boolean       | Email verification status        |
| **Profile Info**    |               |                                  |
| `firstName`         | String        | First name                       |
| `lastName`          | String        | Last name                        |
| `fullName`          | String        | Full name (firstName + lastName) |
| `dateOfBirth`       | LocalDate     | Date of birth                    |
| `gender`            | String        | Gender                           |
| `address`           | String        | Physical address                 |
| `weight`            | Double        | Weight in kg                     |
| `height`            | Double        | Height in cm                     |
| **Gym Info**        |               |                                  |
| `gymId`             | Long          | Associated gym ID                |
| `gymName`           | String        | Gym name                         |
| `gymAddress`        | String        | Gym address                      |
| **Account Info**    |               |                                  |
| `createdAt`         | LocalDateTime | Account creation timestamp       |
| `lastLogin`         | LocalDateTime | Last login timestamp             |

---

## Frontend Integration

### React/JavaScript Example

```javascript
// Get current admin profile
async function getCurrentAdminProfile() {
  try {
    const response = await fetch("http://localhost:8083/admin/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const profile = await response.json();
    return profile;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
}

// Usage in component
async function loadAdminProfile() {
  const profile = await getCurrentAdminProfile();

  // Update UI
  document.getElementById("admin-name").textContent = profile.fullName;
  document.getElementById("admin-email").textContent = profile.email;
  document.getElementById("gym-name").textContent = profile.gymName;

  // Store in state/context
  setAdminProfile(profile);
}
```

---

### React Component Example

```jsx
import { useState, useEffect } from "react";

function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8083/admin/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) throw new Error("Failed to load profile");

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  return (
    <div className="admin-profile">
      <h1>Admin Profile</h1>

      <section className="personal-info">
        <h2>Personal Information</h2>
        <p>
          <strong>Name:</strong> {profile.fullName}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Phone:</strong> {profile.phoneNumber}
        </p>
        <p>
          <strong>Date of Birth:</strong> {profile.dateOfBirth}
        </p>
        <p>
          <strong>Gender:</strong> {profile.gender}
        </p>
        <p>
          <strong>Address:</strong> {profile.address}
        </p>
      </section>

      <section className="gym-info">
        <h2>Gym Information</h2>
        <p>
          <strong>Gym Name:</strong> {profile.gymName}
        </p>
        <p>
          <strong>Gym Address:</strong> {profile.gymAddress}
        </p>
      </section>

      <section className="account-info">
        <h2>Account Information</h2>
        <p>
          <strong>Username:</strong> {profile.username}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Status:</strong> {profile.isActive ? "Active" : "Inactive"}
        </p>
        <p>
          <strong>Email Verified:</strong>{" "}
          {profile.isEmailVerified ? "Yes" : "No"}
        </p>
        <p>
          <strong>Member Since:</strong>{" "}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
        <p>
          <strong>Last Login:</strong>{" "}
          {new Date(profile.lastLogin).toLocaleString()}
        </p>
      </section>
    </div>
  );
}

export default AdminProfilePage;
```

---

## Use Cases

### 1. Display Admin Info in Header/Navbar

```javascript
async function loadAdminHeader() {
  const profile = await getCurrentAdminProfile();

  document.getElementById("header-admin-name").textContent = profile.fullName;
  document.getElementById("header-gym-name").textContent = profile.gymName;

  // Show avatar with initials
  const initials =
    profile.firstName[0] + (profile.lastName ? profile.lastName[0] : "");
  document.getElementById("admin-avatar").textContent = initials;
}
```

---

### 2. Profile Settings Page

```javascript
async function initProfileSettings() {
  const profile = await getCurrentAdminProfile();

  // Pre-fill form fields
  document.getElementById("firstName").value = profile.firstName || "";
  document.getElementById("lastName").value = profile.lastName || "";
  document.getElementById("email").value = profile.email || "";
  document.getElementById("phone").value = profile.phoneNumber || "";
  document.getElementById("address").value = profile.address || "";
  document.getElementById("dateOfBirth").value = profile.dateOfBirth || "";
  document.getElementById("gender").value = profile.gender || "";
}
```

---

### 3. Dashboard Welcome Message

```javascript
async function showWelcomeMessage() {
  const profile = await getCurrentAdminProfile();

  const greeting = getGreeting(); // "Good morning", "Good afternoon", etc.
  const message = `${greeting}, ${profile.firstName}! Welcome to ${profile.gymName}`;

  document.getElementById("welcome-message").textContent = message;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
```

---

## Error Handling

### Possible Errors

#### 1. Unauthorized (No Token)

```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required"
}
```

#### 2. Forbidden (Not Admin)

```json
{
  "status": 403,
  "error": "Forbidden",
  "message": "Access Denied"
}
```

#### 3. User Not Found

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "User not found with email: admin@example.com"
}
```

#### 4. Not an Admin

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "User is not an admin"
}
```

---

### Error Handling Example

```javascript
async function safeGetAdminProfile() {
  try {
    const response = await fetch("http://localhost:8083/admin/profile", {
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      redirectToLogin();
      return null;
    }

    if (response.status === 403) {
      // Not authorized (not an admin)
      showError("You do not have admin privileges");
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      showError(error.message || "Failed to load profile");
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Network error:", error);
    showError("Network error. Please check your connection.");
    return null;
  }
}
```

---

## Testing

### Using curl

```bash
# Get current admin profile
curl -H "Authorization: Bearer <your-admin-token>" \
     http://localhost:8083/admin/profile

# Get admin profile by user ID
curl -H "Authorization: Bearer <your-admin-token>" \
     http://localhost:8083/admin/profile/1
```

### Using Postman

1. **Method**: GET
2. **URL**: `http://localhost:8083/admin/profile`
3. **Headers**:
   - `Authorization`: `Bearer <your-admin-token>`
4. **Send** → Should return admin profile JSON

---

## Security Notes

1. **JWT Required**: Both endpoints require a valid JWT token
2. **Admin Role Only**: Only users with `ROLE_ADMIN` can access
3. **Email from Token**: The `/admin/profile` endpoint extracts email from JWT, preventing users from accessing other profiles
4. **Role Verification**: Service layer verifies the user is actually an admin before returning data

---

## Integration Checklist

- [ ] Add API call to fetch admin profile on app load
- [ ] Display admin name in header/navbar
- [ ] Show gym name in header/navbar
- [ ] Create profile settings page
- [ ] Pre-fill profile form with existing data
- [ ] Add profile avatar with initials
- [ ] Show last login time
- [ ] Display account status (active/inactive)
- [ ] Add error handling for failed requests
- [ ] Implement token refresh on 401 errors

---

## Related APIs

| API                | Endpoint                       | Purpose                          |
| ------------------ | ------------------------------ | -------------------------------- |
| **Admin Profile**  | `GET /admin/profile`           | Get current admin profile        |
| **User Profile**   | `GET /user/profile/{userId}`   | Get any user's profile (generic) |
| **Dashboard**      | `GET /admin/dashboard/{gymId}` | Get dashboard stats              |
| **Update Profile** | `PUT /user/profile/{userId}`   | Update profile (if implemented)  |

---

## Next Steps

1. ✅ **API is ready** - Endpoints are implemented
2. **Test the API** - Use Postman or curl
3. **Integrate in frontend** - Add to React/Vue/Angular app
4. **Create profile page** - Build UI for profile display
5. **Add edit functionality** - Allow admins to update their profile
6. **Add avatar upload** - Allow profile picture upload

---

**Created**: 2025-12-09  
**Service**: user-admin-service (Port 8083)  
**Controller**: AdminProfileController.java  
**Service**: AdminProfileServiceImpl.java  
**Response DTO**: AdminProfileResponse.java
