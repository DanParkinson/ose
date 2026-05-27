# Token Refresh

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Refresh Endpoint](#refresh-endpoint)
- [Refresh Workflow](#refresh-workflow)
- [Original Request Retry](#original-request-retry)
- [Retry Protection](#retry-protection)
- [Failure Behaviour](#failure-behaviour)

## Purpose

Token refresh allows the frontend to recover from expired access tokens without immediately failing the original API request.

The platform uses JWT cookies, so the frontend does not manually store or send refresh tokens.

## Refresh Endpoint

When an authenticated request fails with `401 Unauthorized`, the interceptor attempts to refresh the authentication token.

```js
await axiosRequest.post(
    "/api/auth/token/refresh/"
);
```

The refresh request uses browser-managed cookies.

## Refresh Workflow

```text
Authenticated API request sent
    ↓
Access token expired
    ↓
Backend returns 401 Unauthorized
    ↓
Axios interceptor detects 401
    ↓
Refresh request is sent
    ↓
Backend refreshes authentication cookies
    ↓
Original request is retried
```

## Original Request Retry

If the refresh request succeeds, the original failed request is retried.

```js
return axiosResponse(originalRequest);
```

This allows the frontend to continue the original API workflow without requiring the component to handle refresh manually.

## Retry Protection

The interceptor marks the original request before retrying it.

```js
originalRequest._retry = true;
```

This prevents the same request from repeatedly triggering refresh attempts.

Each failed request can only be retried once.

## Failure Behaviour

If token refresh fails, the refresh error is rejected.

```js
catch (refreshError) {
    return Promise.reject(refreshError);
}
```

At that point, the request layer stops trying to recover automatically.

The calling hook, utility, form, or component becomes responsible for handling the failed request.