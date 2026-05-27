# Axios Response

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Axios Response Instance](#axios-response-instance)
- [Configuration](#configuration)
- [Response Interceptor](#response-interceptor)
- [Interceptor Conditions](#interceptor-conditions)
- [Retry Protection](#retry-protection)
- [Authentication Relationship](#authentication-relationship)
- [Frontend Relationship](#frontend-relationship)

## Purpose

`axiosResponse` is the primary Axios instance used throughout the frontend for authenticated API communication.

The instance includes automatic response interception behaviour for authentication recovery workflows.

This allows expired authentication sessions to attempt token refresh automatically before rejecting requests.

## Axios Response Instance

The frontend defines a reusable Axios response instance.

```js
export const axiosResponse = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});
```

This instance uses the shared API base configuration.

## Configuration

The response instance currently includes:

```js
baseURL: API_BASE_URL
withCredentials: true
```

This ensures requests:

```text
Use the configured backend server
Automatically include authentication cookies
```

## Response Interceptor

`axiosResponse` includes a response interceptor.

```js
axiosResponse.interceptors.response.use(
    (response) => response,
    async (error) => {
```

The interceptor detects failed authenticated requests and attempts token refresh before retrying the original request.

High-level flow:

```text
Request fails with 401
    ↓
Interceptor checks retry conditions
    ↓
Refresh request sent
    ↓
Original request retried
```

## Interceptor Conditions

The interceptor only attempts token refresh when:

```js
error.response?.status === 401
```

and:

```js
!originalRequest._retry
```

and:

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

These checks prevent unnecessary or recursive retry behaviour.

## Retry Protection

The interceptor adds a retry flag to the original request.

```js
originalRequest._retry = true;
```

This prevents infinite refresh loops if authentication recovery fails.

Each request is only retried once.

## Authentication Relationship

If the access token has expired:

```text
Backend returns HTTP 401
```

The interceptor attempts:

```js
await axiosRequest.post(
    "/api/auth/token/refresh/"
);
```

If refresh succeeds:

```text
Original request retries automatically
```

If refresh fails:

```text
Request error is rejected
```

The frontend never manually stores or refreshes JWT tokens itself.

## Frontend Relationship

`axiosResponse` is used throughout the frontend API layer including:

```text
Core API utilities
Authentication workflows
Dashboard requests
Protected API requests
Reusable data hooks
```

The interceptor keeps token refresh behaviour centralised so individual components do not need to manually handle authentication recovery.