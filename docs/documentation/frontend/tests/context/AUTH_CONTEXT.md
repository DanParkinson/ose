## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## AuthContext

| Test Name | Purpose |
|---|---|
| fetches and sets user on mount when request succeeds | Verifies the authenticated user is fetched and stored in context during initial application load. |
| sets user to null on mount when fetchUser fails | Verifies failed authentication checks reset the user state to null. |
| posts credentials and fetches user on success | Verifies successful login requests send credentials correctly and refresh the authenticated user state. |
| returns backend errors when login request fails | Verifies backend login validation errors are returned correctly from the login function. |
| returns fallback error when login fails without backend error data | Verifies fallback login errors are returned when no backend validation data exists. |
| posts to logout endpoint and clears user | Verifies logout requests call the correct endpoint and clear the authenticated user from context. |
| clears user even when logout request fails | Verifies the user state is cleared even if the logout request itself fails. |
| posts user details and returns success | Verifies registration requests send user credentials correctly and return a success response. |
| returns backend errors when register request fails | Verifies backend registration validation errors are returned correctly from the register function. |
| returns fallback error when register fails without backend error data | Verifies fallback registration errors are returned when no backend validation data exists. |
| posts password details and returns success | Verifies password change requests send the correct password payload and return success. |
| returns backend errors when changePassword request fails | Verifies backend password validation errors are returned correctly from the changePassword function. |
| returns fallback error when changePassword fails without backend error data | Verifies fallback password change errors are returned when no backend validation data exists. |
