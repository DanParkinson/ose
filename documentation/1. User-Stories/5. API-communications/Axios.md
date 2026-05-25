# Axios

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Global Axios Defaults](#global-axios-defaults)
- [Axios Instances](#axios-instances)
  - [`axiosRequest`](#axiosrequest)
  - [`axiosResponse`](#axiosresponse)
  - [Response Interceptor](#response-interceptor)
    - [Interceptor Conditions](#interceptor-conditions)
    - [Retry Protection](#retry-protection)
- [Authentication Flow](#authentication-flow)
- [Usage Rules](#usage-rules)

Axios is used to handle communication between the React frontend and the Django REST Framework API.

The Axios setup is defined in `axiosDefaults.js`.

## Global Axios Defaults

The application sets shared Axios defaults so that all requests use the same base configuration.

```js
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
```

| Setting           | Purpose                                 |
|-------------------|-----------------------------------------|
| `baseURL`         | Defines the backend API server URL      |
| `Content-Type`    | Sends POST request data as JSON         |
| `withCredentials` | Allows cookies to be sent with requests |

`withCredentials` is required because authentication is handled using cookies.

## Axios Instances

The project uses two Axios instances:

| Instance        | Purpose                                                                |
|-----------------|------------------------------------------------------------------------|
| `axiosRequest`  | Used for direct authentication-related requests, such as token refresh |
| `axiosResponse` | Used for normal API requests that need automatic `401` handling        |

### `axiosRequest`

```js
export const axiosRequest = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
```

`axiosRequest` is a basic Axios instance.

It is used when a request should not go through the response interceptor.

A common example is refreshing the authentication token.

### `axiosResponse`

```js
export const axiosResponse = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});
```

`axiosResponse` is the main Axios instance used for API requests across the application.

It includes a response interceptor that handles expired authentication sessions.

### Response Interceptor

The `axiosResponse` instance includes a response interceptor.

Its job is to detect `401 Unauthorized` responses and attempt to refresh the authentication token before retrying the original request.

```text
API request is made
    ↓
If successful, return response
    ↓
If 401 Unauthorized, check if request can be retried
    ↓
Send token refresh request
    ↓
If refresh succeeds, retry original request
    ↓
If refresh fails, reject the error
```

#### Interceptor Conditions

The interceptor only attempts token refresh when:

| Condition                            | Reason                                       |
|--------------------------------------|----------------------------------------------|
| Response status is `401`             | The request failed due to authentication     |
| Request has not already been retried | Prevents infinite retry loops                |
| Request is not the login endpoint    | Login failures should not trigger refresh    |
| Request is not the refresh endpoint  | Refresh failures should not retry themselves |

#### Retry Protection

The `_retry` property is added to the original request after the first retry attempt.

```js
originalRequest._retry = true;
```

This prevents the same failed request from repeatedly refreshing the token and creating an infinite loop.

### Authentication Flow

```text
User makes authenticated request
    ↓
Request is sent with cookies
    ↓
Backend checks authentication
    ↓
If access token is valid, request succeeds
    ↓
If access token is expired, backend returns 401
    ↓
Frontend sends refresh request
    ↓
Backend refreshes token cookie
    ↓
Original request is retried
```

### Usage Rules

- Use `axiosResponse` for protected or authenticated API requests.
- Use `axiosRequest` for authentication utility requests such as token refresh.
- Do not manually retry protected requests in components.
- Keep token refresh logic inside the Axios interceptor.
- Do not bypass `withCredentials` for authenticated endpoints.
- Authentication endpoints should be excluded from automatic retry logic.
