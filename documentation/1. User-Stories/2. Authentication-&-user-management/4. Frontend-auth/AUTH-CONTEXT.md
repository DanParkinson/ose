# Auth Context

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Auth Provider](#auth-provider)
- [Authentication State](#authentication-state)
- [Initial Session Check](#initial-session-check)
- [Authentication Actions](#authentication-actions)
- [Shared Response Structure](#shared-response-structure)
- [Axios Relationship](#axios-relationship)
- [Frontend Relationship](#frontend-relationship)

## Purpose

The Auth Context manages frontend authentication state across the React application.

It centralises the current user, loading state, and authentication actions so individual components do not need to manage authentication requests independently.

## Auth Provider

`AuthProvider` wraps the application and exposes authentication data through React context.

```jsx
<AuthContext.Provider value={...}>
  {children}
</AuthContext.Provider>
```

Any component inside the provider can access authentication state and actions through the auth context.

## Authentication State

The provider stores two main pieces of state:

```js
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```

| State | Purpose |
|---|---|
| `user` | Stores the currently authenticated user or `null` |
| `loading` | Tracks whether the initial authentication check is still running |

The `loading` state prevents the application from making route or UI decisions before the current session has been checked.

## Initial Session Check

When the provider first mounts, it checks whether the browser already has a valid authenticated session.

```js
useEffect(() => {
  fetchUser();
}, []);
```

`fetchUser()` requests the current user from the backend.

```js
const { data } = await axiosRequest.get("/api/auth/user/");
```

If the request succeeds, the returned user data is stored in `user`.

If the request fails, `user` is set to `null`.

This allows the frontend to restore authentication state after a page refresh.

## Authentication Actions

The context exposes reusable authentication actions.

| Action | Purpose |
|---|---|
| `login` | Authenticates the user and refreshes user state |
| `logout` | Ends the session and clears user state |
| `register` | Creates a new user account |
| `changePassword` | Updates the authenticated user's password |

### Login

`login()` submits the user's email and password to the backend.

```js
await axiosRequest.post("/api/auth/login/", {
  email,
  password,
});
```

After a successful login, `fetchUser()` runs again so the global user state is updated.

### Logout

`logout()` submits a logout request to the backend.

```js
await axiosRequest.post("/api/auth/logout/");
```

The frontend clears the user state afterwards.

```js
setUser(null);
```

This ensures the UI no longer treats the user as authenticated.

### Register

`register()` submits registration data to the backend.

```js
await axiosRequest.post("/api/auth/registration/", {
  email,
  password1,
  password2,
});
```

The function returns a structured success or error response for the registration form to use.

### Change Password

`changePassword()` submits the current password and new password values to the backend.

```js
await axiosRequest.post("/api/auth/password/change/", {
  old_password: oldPassword,
  new_password1: newPassword1,
  new_password2: newPassword2,
});
```

The function returns a structured success or error response for the password change form to use.

## Shared Response Structure

Authentication actions return a consistent response shape.

```js
{
  success: true,
  errors: null,
}
```

or:

```js
{
  success: false,
  errors: {...}
}
```

This makes form handling consistent across login, registration, and password change features.

## Axios Relationship

Auth Context uses `axiosRequest` for authentication API requests.

Because authentication uses cookies, Axios must be configured to send credentials with requests.

The Auth Context does not manually store or manage JWT tokens.

Authentication cookies are handled by the browser and validated by the backend.

## Frontend Relationship

The Auth Context allows frontend components to:

```text
Check whether a user is authenticated
Access the current user
Trigger login and logout actions
Register new users
Change passwords
React to authentication loading state
```

The frontend uses this context for authentication-aware UI and route protection.

The backend remains responsible for validating credentials, managing cookies, and enforcing permissions.