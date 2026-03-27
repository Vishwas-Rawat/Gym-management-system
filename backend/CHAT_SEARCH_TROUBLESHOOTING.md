# Chat API - Members & Trainers List Troubleshooting Guide

## Issue

Not getting members or trainers list when clicking the chat icon.

---

## How Chat Search Works

### API Flow

```
Frontend → GET /chat/search?query=<search_term>
         ↓
ChatRestController (trainer-panel:8084)
         ↓
UserManagementClient.searchUsers(query)
         ↓
GET http://localhost:8083/user/search?query=<search_term>
         ↓
UserProfileController.searchUsers()
         ↓
UserProfileRepository.searchByName(query)
         ↓
Returns: List<UserSearchDto>
```

---

## ⚠️ **Critical Conditions for Users to Appear**

### 1️⃣ **User MUST have a UserProfile**

The search query looks in the `user_profiles` table:

```sql
SELECT p FROM UserProfile p
WHERE LOWER(CONCAT(p.firstName, ' ', COALESCE(p.lastName, '')))
LIKE LOWER(CONCAT('%', :query, '%'))
```

**❌ If a user doesn't have a UserProfile record, they WON'T appear in search!**

---

### 2️⃣ **UserProfile MUST have firstName**

The query searches by `firstName` and `lastName`:

```java
CONCAT(p.firstName, ' ', COALESCE(p.lastName, ''))
```

**Required**:

- ✅ `firstName` must be set (NOT NULL)
- ⚠️ `lastName` is optional (uses COALESCE)

**❌ If firstName is NULL or empty, user won't be searchable!**

---

### 3️⃣ **Search Query Must Match Name**

The search is case-insensitive and uses `LIKE %query%`:

**Examples**:

- Query: `"john"` → Matches: "John Doe", "Johnny Smith"
- Query: `"doe"` → Matches: "John Doe", "Jane Doe"
- Query: `"j"` → Matches: "John", "Jane", "James"

**❌ If you search for "admin" but user's name is "John Doe", they won't appear!**

---

## 🔍 **Diagnostic Steps**

### Step 1: Check if Users Have UserProfile

```sql
-- Check users without profiles
SELECT u.user_id, u.email, u.role
FROM users u
LEFT JOIN user_profiles up ON u.user_id = up.user_id
WHERE up.profile_id IS NULL;
```

**Expected**: Should return **empty** (all users should have profiles)

**If you see results**: These users won't appear in chat search!

---

### Step 2: Check UserProfile Data

```sql
-- Check profiles with missing names
SELECT up.profile_id, up.user_id, up.first_name, up.last_name, u.email, u.role
FROM user_profiles up
JOIN users u ON up.user_id = u.user_id
WHERE up.first_name IS NULL OR up.first_name = '';
```

**Expected**: Should return **empty**

**If you see results**: These users won't be searchable!

---

### Step 3: Test Search Query Directly

```sql
-- Test the actual search query
SELECT
    u.user_id,
    up.first_name,
    up.last_name,
    CONCAT(up.first_name, ' ', COALESCE(up.last_name, '')) as full_name,
    u.email,
    u.role
FROM user_profiles up
JOIN users u ON up.user_id = u.user_id
WHERE LOWER(CONCAT(up.first_name, ' ', COALESCE(up.last_name, '')))
      LIKE LOWER(CONCAT('%', 'john', '%'));
```

Replace `'john'` with your search term.

---

### Step 4: Check User Roles

```sql
-- See all users with their roles
SELECT
    u.user_id,
    u.email,
    u.role,
    up.first_name,
    up.last_name,
    u.is_active
FROM users u
LEFT JOIN user_profiles up ON u.user_id = u.user_id
WHERE u.role IN ('MEMBER', 'TRAINER', 'ADMIN')
ORDER BY u.role, u.user_id;
```

---

## 🛠️ **Common Fixes**

### Fix 1: Create Missing UserProfiles

```sql
-- Find users without profiles
SELECT user_id, email FROM users
WHERE user_id NOT IN (SELECT user_id FROM user_profiles);

-- Create profiles for them
INSERT INTO user_profiles (user_id, first_name, last_name, created_at, updated_at)
SELECT
    user_id,
    'User',  -- Default first name
    CAST(user_id AS CHAR),  -- Use user_id as last name
    NOW(),
    NOW()
FROM users
WHERE user_id NOT IN (SELECT user_id FROM user_profiles);
```

---

### Fix 2: Update NULL/Empty Names

```sql
-- Update profiles with missing first names
UPDATE user_profiles up
JOIN users u ON up.user_id = u.user_id
SET
    up.first_name = CASE
        WHEN u.role = 'ADMIN' THEN 'Admin'
        WHEN u.role = 'TRAINER' THEN 'Trainer'
        WHEN u.role = 'MEMBER' THEN 'Member'
        ELSE 'User'
    END,
    up.last_name = CAST(u.user_id AS CHAR),
    up.updated_at = NOW()
WHERE up.first_name IS NULL OR up.first_name = '';
```

---

### Fix 3: Ensure Proper Registration Flow

**For Members**:

```java
// When adding a member, ALWAYS create UserProfile
User user = new User();
user.setEmail(email);
// ... set other fields
userRepository.save(user);

// ✅ MUST CREATE PROFILE
UserProfile profile = new UserProfile();
profile.setUser(user);
profile.setFirstName(firstName);  // ← REQUIRED
profile.setLastName(lastName);
userProfileRepository.save(profile);
```

**For Trainers**:

```java
// Similar - always create profile during registration
UserProfile profile = new UserProfile();
profile.setUser(user);
profile.setFirstName(firstName);  // ← REQUIRED
profile.setLastName(lastName);
userProfileRepository.save(profile);
```

---

## 📋 **API Response Format**

### Successful Response

```json
[
  {
    "userId": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "MEMBER"
  },
  {
    "userId": 2,
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "TRAINER"
  }
]
```

### Empty Response (No Results)

```json
[]
```

---

## 🧪 **Testing**

### Test 1: Direct API Call

```bash
# Search for users with "john" in their name
curl "http://localhost:8083/user/search?query=john"
```

**Expected**: JSON array with matching users

**If empty**: No users match the search term OR they don't have profiles

---

### Test 2: Search with Single Letter

```bash
# Search for users with "a" in their name (should return many)
curl "http://localhost:8083/user/search?query=a"
```

**Expected**: Multiple results

**If empty**: Database issue or no profiles exist

---

### Test 3: Via Chat Endpoint

```bash
# Through trainer-panel chat endpoint
curl -H "Authorization: Bearer <token>" \
     "http://localhost:8084/chat/search?query=john"
```

---

## 🎯 **Quick Checklist**

Before users can appear in chat search:

- [ ] User exists in `users` table
- [ ] User has a record in `user_profiles` table
- [ ] `user_profiles.first_name` is NOT NULL
- [ ] `user_profiles.first_name` is NOT empty string
- [ ] User's name matches your search query
- [ ] User is active (`users.is_active = true`)
- [ ] Both services are running (8083 and 8084)

---

## 💡 **Recommended Solution**

### Create a Database Migration Script

```sql
-- Ensure all users have profiles with proper names
INSERT INTO user_profiles (user_id, first_name, last_name, created_at, updated_at)
SELECT
    u.user_id,
    CASE
        WHEN u.role = 'ADMIN' THEN 'Admin'
        WHEN u.role = 'TRAINER' THEN 'Trainer'
        WHEN u.role = 'MEMBER' THEN 'Member'
        ELSE 'User'
    END as first_name,
    CONCAT('User', u.user_id) as last_name,
    NOW(),
    NOW()
FROM users u
WHERE u.user_id NOT IN (SELECT user_id FROM user_profiles)
ON DUPLICATE KEY UPDATE
    first_name = COALESCE(NULLIF(first_name, ''), VALUES(first_name)),
    updated_at = NOW();
```

---

## 🔧 **Frontend Debugging**

### Check Network Request

```javascript
// In browser console
fetch("http://localhost:8084/chat/search?query=test", {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
})
  .then((r) => r.json())
  .then((data) => console.log("Search results:", data));
```

**Expected**: Array of users

**If error**: Check token, check services are running

---

## 📊 **Expected Behavior**

### When Search Works Correctly:

1. **Type in search box**: "john"
2. **API call**: `GET /chat/search?query=john`
3. **Response**: All users with "john" in firstName or lastName
4. **Display**: List of users with names, emails, roles
5. **Click user**: Opens chat conversation

### When Search Returns Empty:

**Possible Reasons**:

1. No users match the search term
2. Users don't have UserProfile records
3. UserProfile.firstName is NULL/empty
4. Search term doesn't match any names
5. Database connection issue
6. Service not running

---

## 🚀 **Quick Fix Command**

Run this SQL to fix most common issues:

```sql
-- Create missing profiles and fix empty names
INSERT INTO user_profiles (user_id, first_name, last_name, created_at, updated_at)
SELECT
    u.user_id,
    COALESCE(NULLIF(SUBSTRING_INDEX(u.email, '@', 1), ''), 'User') as first_name,
    CONCAT('ID', u.user_id) as last_name,
    NOW(),
    NOW()
FROM users u
WHERE u.user_id NOT IN (SELECT user_id FROM user_profiles);

-- Fix existing profiles with empty names
UPDATE user_profiles up
JOIN users u ON up.user_id = u.user_id
SET
    up.first_name = COALESCE(NULLIF(up.first_name, ''), SUBSTRING_INDEX(u.email, '@', 1), 'User'),
    up.last_name = COALESCE(NULLIF(up.last_name, ''), CONCAT('ID', u.user_id)),
    up.updated_at = NOW()
WHERE up.first_name IS NULL OR up.first_name = '';
```

---

**Last Updated**: 2025-12-09  
**Services**: user-admin-service (8083), trainer-panel (8084)  
**Endpoint**: `GET /chat/search?query=<term>`
