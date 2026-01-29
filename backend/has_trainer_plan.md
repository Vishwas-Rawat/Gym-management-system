# Implementation Plan - Add Missing `has-trainer` API

The frontend is calling `/api/member/has-trainer` which currently returns `403 Forbidden` (likely treating it as a standard 404/403 since the endpoint doesn't exist).
The goal is to implement this endpoint in the **User Admin Service** so the frontend can check if the current member has an assigned trainer.

## Proposed Changes

### Backend (User Admin Service)

#### [MODIFY] [MemberController.java](file:///e:/Gym%20management%20new%20version/Gym-management-system/backend/user-admin-service/src/main/java/com/gymmanagement/usermanagement/controller/MemberController.java)

- Add a new endpoint `GET /has-trainer`.
- **Logic**:
  1.  Extract `userId` from the authenticated user (Principal).
  2.  Find the `Member` entity associated with this `userId`.
  3.  Check if `member.getTrainer()` is not null.
  4.  Return `Boolean` (true/false) wrapped in `ResponseEntity`.

#### [MODIFY] [MemberService.java](file:///e:/Gym%20management%20new%20version/Gym-management-system/backend/user-admin-service/src/main/java/com/gymmanagement/usermanagement/service/MemberService.java)

- Add `hasTrainer(Integer userId)` method.
- Fetch member by `userId` and return correctness of trainer assignment.

## Verification Plan

### Manual Verification

- **Request**: `GET http://localhost:8083/member/has-trainer` (with Bearer Token).
- **Expected Response**: `true` or `false` (200 OK).
- **Frontend Verify**: Refresh the page. The 403/Forbidden error in console should disappear.
