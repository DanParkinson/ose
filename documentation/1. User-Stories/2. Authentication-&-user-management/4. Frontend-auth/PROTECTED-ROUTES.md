# Protected Routes

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Route Protection Approach](#route-protection-approach)
- [Loading State](#loading-state)
- [Protected Route](#protected-route)
- [Public Route](#public-route)
- [Admin Route](#admin-route)
- [App Routing Relationship](#app-routing-relationship)
- [Backend Relationship](#backend-relationship)

## Purpose

Protected routes control frontend page access based on the current authentication state.

They are used to prevent users from seeing pages that are not appropriate for their current state, such as account pages for anonymous users or login pages for authenticated users.

## Route Protection Approach

The frontend uses three route protection wrappers:

```text
ProtectedRoute
PublicRoute
AdminRoute
```

Each wrapper reads authentication state from `useAuth()`.

```js
const { user, loading } = useAuth();
```

The route wrapper then decides whether to render the page or redirect the user.

## Loading State

All route wrappers check the authentication loading state before making redirect decisions.

```jsx
if (loading) {
  return <LoadingSpinner label="Checking permissions..." />;
}
```

This prevents routes from redirecting incorrectly before the initial authentication check has finished.

## Protected Route

`ProtectedRoute` is used for pages that require an authenticated user.

If no user exists, the user is redirected to the login page.

```jsx
if (!user) {
  return <Navigate to="/login" replace />;
}
```

If the user is authenticated, the protected page is rendered.

Current protected routes include:

```text
/account
```

## Public Route

`PublicRoute` is used for pages intended for unauthenticated users.

If a user is already authenticated, they are redirected to the home page.

```jsx
if (user) {
  return <Navigate to="/" replace />;
}
```

Current public routes include:

```text
/login
/register
/forgot-password
/reset-password/:uid/:token
/reactivate-account
/reactivate-account/:uid/:token
```

## Admin Route

`AdminRoute` is used for staff-only pages.

The route first checks whether the user is authenticated.

```jsx
if (!user) {
  return <Navigate to="/login" replace />;
}
```

It then checks whether the user has staff access.

```jsx
if (!user.is_staff) {
  return <Navigate to="/" replace />;
}
```

Current admin routes include:

```text
/dashboard
```

## App Routing Relationship

Protected route wrappers are used inside the main routing configuration.

Example:

```jsx
<Route
  path="/dashboard"
  element={
    <AdminRoute>
      <AdminDashboardPage />
    </AdminRoute>
  }
/>
```

This keeps route access logic separate from the page components themselves.

Page components do not need to repeat authentication checks directly.

## Backend Relationship

Protected routes improve frontend navigation and user experience.

They do not replace backend permission checks.

The frontend is responsible for:

```text
Redirecting users
Hiding irrelevant pages
Waiting for authentication state
Controlling route access in the UI
```

The backend remains responsible for:

```text
Validating authentication cookies
Checking permissions
Protecting API endpoints
Rejecting unauthorised requests
```

Frontend route protection should therefore be treated as a user experience layer, while backend permissions remain the true security layer.