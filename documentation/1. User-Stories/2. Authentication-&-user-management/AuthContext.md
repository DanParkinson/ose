# Authentication Context Workflow

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Core Files](#core-files)
- [High-Level Architecture](#high-level-architecture)
- [AuthProvider](#authprovider)
  - [Global Authentication State](#global-authentication-state)
    - [user](#user)
    - [loading](#loading)
- [Initial Session Check](#initial-session-check)
- [fetchUser](#fetchuser)
  - [fetchUser Workflow](#fetchuser-workflow)
- [Authentication Actions](#authentication-actions)
  - [login](#login)
    - [login Workflow](#login-workflow)
  - [logout](#logout)
    - [logout Workflow](#logout-workflow)
  - [register](#register)
  - [changePassword](#changepassword)
- [Shared Response Structure](#shared-response-structure)
- [useAuth Hook](#useauth-hook)
  - [useAuth Workflow](#useauth-workflow)
  - [Example useAuth Usage](#example-useauth-usage)
- [Context Value Structure](#context-value-structure)
- [Relationship With axiosRequest](#relationship-with-axiosrequest)
- [Key Architectural Principle](#key-architectural-principle)
- [Responsibility Separation](#responsibility-separation)
  - [AuthContext](#authcontext)
  - [useAuth](#useauth)
  - [Components Using useAuth](#components-using-useauth)
- [Full Authentication Flow](#full-authentication-flow)

## Introduction

The authentication system is built around a shared React context.

The purpose of the auth context is to centralise:

- authentication state
- current user state
- authentication actions
- session checking
- global auth access

This prevents multiple components from needing to manage their own authentication requests independently.

## Core Files

| File | Purpose |
|---|---|
| `AuthContext.jsx` | Stores and manages global authentication state |
| `useAuth.js` | Custom hook used to access auth context values |

## High-Level Architecture

```text
AuthProvider wraps the application
    ↓
AuthContext stores auth state and actions
    ↓
Components access auth through useAuth()
    ↓
AuthContext communicates with backend API
    ↓
Global user state updates
    ↓
UI reacts automatically
```

## AuthProvider

`AuthProvider` is the orchestration layer of the authentication system.

It wraps the application and exposes authentication state globally.

```jsx
<AuthContext.Provider value={...}>
  {children}
</AuthContext.Provider>
```

Everything inside the provider can access authentication data using:

```js
useAuth()
```

## Global Authentication State

The provider stores:

```js
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```

## user

`user` represents the currently authenticated user.

Possible values:

```js
null
```

or:

```js
{
  id,
  email,
  ...
}
```

This allows the application to determine:

```text
is user authenticated?
who is the current user?
should protected UI render?
```

## loading

`loading` tracks whether the authentication check is still running.

This prevents the application from rendering incorrect UI before the auth check finishes.

Example:

```text
app loads
    ↓
loading = true
    ↓
fetchUser executes
    ↓
loading = false
```

## Initial Session Check

When the provider first mounts:

```js
useEffect(() => {
  fetchUser();
}, []);
```

runs.

This checks whether the browser already has a valid authenticated session.

## fetchUser

`fetchUser` is responsible for validating the current session.

```js
const fetchUser = async () => {
  try {
    const { data } = await axiosRequest.get("/api/auth/user/");
    setUser(data);
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
};
```

## fetchUser Workflow

```text
AuthProvider mounts
    ↓
fetchUser runs
    ↓
GET /api/auth/user/
    ↓
backend validates session cookies
    ↓
if valid:
    setUser(data)
else:
    setUser(null)
    ↓
loading becomes false
```

## Authentication Actions

The context exposes four main auth actions:

| Action | Purpose |
|---|---|
| `login` | Authenticate user |
| `logout` | End session |
| `register` | Create account |
| `changePassword` | Update password |

These actions centralise all authentication API communication.

### login

`login` sends credentials to the backend.

```js
await axiosRequest.post("/api/auth/login/", {
  email,
  password,
});
```

If successful:

```js
await fetchUser();
```

runs immediately afterwards.

This ensures global user state updates after login.

#### login Workflow

```text
Component calls login(email, password)
    ↓
POST /api/auth/login/
    ↓
backend validates credentials
    ↓
backend sets auth cookies
    ↓
fetchUser executes
    ↓
user state updates globally
```

### logout

`logout` ends the authenticated session.

```js
await axiosRequest.post("/api/auth/logout/");
```

Regardless of backend success:

```js
setUser(null);
```

runs.

This guarantees the frontend no longer treats the user as authenticated.

#### logout Workflow

```text
Component calls logout()
    ↓
POST /api/auth/logout/
    ↓
backend clears auth cookies
    ↓
frontend clears user state
```

### register

`register` creates a new account.

```js
await axiosRequest.post(
  "/api/auth/registration/",
  {
    email,
    password1,
    password2,
  }
);
```

The context returns structured success/error responses to the calling component.

### changePassword

`changePassword` updates the authenticated user's password.

```js
await axiosRequest.post(
  "/api/auth/password/change/",
  {
    old_password,
    new_password1,
    new_password2,
  }
);
```

Like the other auth actions, it returns consistent success/error objects.

## Shared Response Structure

All auth actions return:

```js
{
  success: boolean,
  errors: object | null,
}
```

This standardises frontend handling across forms and pages.

## useAuth Hook

`useAuth` is a helper hook for accessing auth context.

```js
const useAuth = () => useContext(AuthContext);
```

Without this hook:

```js
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const auth = useContext(AuthContext);
```

would need repeating everywhere.

### useAuth Workflow

```text
Component calls useAuth()
    ↓
useContext(AuthContext) executes
    ↓
current AuthContext value returned
    ↓
component gains access to:
    user
    loading
    login
    logout
    register
    changePassword
```

### Example useAuth Usage

```js
const {
  user,
  login,
  logout,
  loading,
} = useAuth();
```

## Context Value Structure

The provider exposes:

```js
<AuthContext.Provider
  value={{
    user,
    setUser,
    login,
    logout,
    register,
    changePassword,
    loading,
  }}
>
```

This becomes globally accessible throughout the app.

## Relationship With axiosRequest

AuthContext uses:

```js
axiosRequest
```

for all backend communication.

The auth system depends on:

```text
axios configuration
cookie/session handling
backend auth endpoints
```

but does not directly manage token storage itself.

## Key Architectural Principle

```text
AuthContext owns authentication state.
useAuth exposes authentication state.
Components consume authentication state.
```

# Responsibility Separation

## AuthContext

Responsible for:

- global auth state
- backend auth requests
- exposing auth actions
- session validation
- current user management

## useAuth

Responsible for:

- simplifying access to auth context

## Components Using useAuth

Responsible for:

- rendering UI
- triggering auth actions
- reacting to auth state

# Full Authentication Flow

```text
App loads
    ↓
AuthProvider mounts
    ↓
fetchUser checks session
    ↓
user state becomes authenticated user or null
    ↓
components access auth through useAuth()
    ↓
auth actions update backend + global state
    ↓
UI rerenders automatically from updated auth state
```
