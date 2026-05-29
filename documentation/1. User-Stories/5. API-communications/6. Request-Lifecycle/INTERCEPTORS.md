# Interceptors

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Response Interceptor](#response-interceptor)
- [Interceptor Workflow](#interceptor-workflow)
- [401 Handling](#401-handling)
- [Retry Protection](#retry-protection)
- [Authentication Endpoint Exclusions](#authentication-endpoint-exclusions)
- [Request Retry](#request-retry)
- [Architecture Responsibility](#architecture-responsibility)

## Purpose

The frontend uses Axios response interceptors to centralise authentication recovery behaviour.

The interceptor detects expired authenticated sessions and attempts token refresh automatically before rejecting requests.

This prevents authentication recovery logic from being duplicated across components.

## Response Interceptor

The interceptor is attached to:

```js
axiosResponse
```

Example:

```js
axiosResponse.interceptors.response.use(
    (response) => response,
    async (error) => {
```

Successful responses pass through normally.

Failed responses are checked for authentication recovery behaviour.

## Interceptor Workflow

High-level workflow:

```text
API request sent
    ↓
Backend returns response
    ↓
If successful → return response
    ↓
If 401 → check retry conditions
    ↓
Attempt token refresh
    ↓
Retry original request
```

## 401 Handling

The interceptor only attempts recovery when the backend returns:

```text
HTTP 401 Unauthorized
```

Condition:

```js
error.response?.status === 401
```

This usually indicates:

```text
Expired access token
Unauthenticated session
```

## Retry Protection

The interceptor prevents infinite retry loops using:

```js
originalRequest._retry = true;
```

Condition:

```js
!originalRequest._retry
```

This ensures each failed request is only retried once.

## Authentication Endpoint Exclusions

Certain authentication endpoints are excluded from retry behaviour.

Conditions:

```js
!originalRequest.url.includes(
    "/api/auth/login/"
)
```

and:

```js
!originalRequest.url.includes(
    "/api/auth/token/refresh/"
)
```

This prevents:

```text
Login retry loops
Refresh retry loops
Recursive authentication failures
```

## Request Retry

If refresh succeeds:

```js
await axiosRequest.post(
    "/api/auth/token/refresh/"
);
```

the original request is retried:

```js
return axiosResponse(originalRequest);
```

The retry uses the refreshed authentication cookies automatically.

## Architecture Responsibility

The interceptor is responsible for:

```text
401 detection
Token refresh attempts
Retry protection
Automatic request retry
```

The interceptor is not responsible for:

```text
Displaying UI errors
Managing authentication state
Route protection
Permission handling
```

Those responsibilities belong elsewhere in the frontend authentication architecture.