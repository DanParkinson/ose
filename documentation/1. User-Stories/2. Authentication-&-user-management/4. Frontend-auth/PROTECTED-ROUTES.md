# Protected Routes

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Route Protection Approach](#route-protection-approach)
* [Authentication Check](#authentication-check)
* [Loading State](#loading-state)
* [Redirect Behaviour](#redirect-behaviour)
* [App Routing Relationship](#app-routing-relationship)
* [Backend Relationship](#backend-relationship)

## Purpose

Protected routes control frontend page access based on the current authentication state.

They prevent unauthenticated users from accessing pages that require an active user session.

## Route Protection Approach

`ProtectedRoute` wraps page components that should only be available to authenticated users.

It reads authentication state from the global auth context.

```js
const { user, loading, fetchUser } = useAuth();
```

The route then decides whether to:

```text
Show loading feedback
Redirect to login
Render the protected page
```

## Authentication Check

When the protected route loads, it verifies the current user by calling:

```js
fetchUser();
```

This ensures the route checks the backend for the latest authentication state before deciding whether the page should render.

```js
useEffect(() => {
  const verifyUser = async () => {
    await fetchUser();
    setCheckingAuth(false);
  };

  verifyUser();
}, [fetchUser]);
```

The separate `checkingAuth` state prevents the route from making redirect decisions before the authentication check has finished.

## Loading State

While authentication is being checked, the route displays a loading spinner.

```jsx
if (loading || checkingAuth) {
  return <LoadingSpinner label="Checking permissions..." />;
}
```

This prevents users from being redirected too early while the application is still confirming their session.

## Redirect Behaviour

If no authenticated user exists after the check, the user is redirected to the login page.

```jsx
if (!user) {
  return <Navigate to="/login" replace />;
}
```

If a user exists, the protected content is rendered.

```jsx
return children;
```

## App Routing Relationship

Protected routes are used inside the main routing configuration.

Example:

```jsx
<Route
  path="/account"
  element={
    <ProtectedRoute>
      <AccountPage />
    </ProtectedRoute>
  }
/>
```

This keeps authentication route logic separate from the page components themselves.

Page components do not need to repeat authentication checks directly.

## Backend Relationship

Protected routes improve frontend navigation and user experience.

They do not replace backend permission checks.

The frontend is responsible for:

```text
Redirecting unauthenticated users
Waiting for authentication state
Preventing protected pages from rendering too early
```

The backend remains responsible for:

```text
Validating authentication cookies
Checking permissions
Protecting API endpoints
Rejecting unauthorised requests
```

Frontend route protection should therefore be treated as a user experience layer, while backend permissions remain the true security layer.
