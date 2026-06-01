# Axios Base Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Environment Configuration](#environment-configuration)
- [Global Axios Defaults](#global-axios-defaults)
- [Axios Instances](#axios-instances)
- [withCredentials](#withcredentials)
- [Content Type Configuration](#content-type-configuration)

## Purpose

Axios provides the shared HTTP communication layer between the React frontend and the Django REST Framework backend.

The base Axios configuration centralises:

```text
API base URL
Credentials handling
Shared request defaults
Reusable Axios instances
```

This keeps API communication consistent throughout the frontend.

## Environment Configuration

The backend API URL is loaded through environment variables.

```js
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;
```

This allows different backend URLs to be used for:

```text
Development
Production
Deployment environments
```

without changing frontend source code.

## Global Axios Defaults

The application defines shared Axios defaults.

```js
axios.defaults.baseURL = API_BASE_URL;

axios.defaults.headers.post[
    "Content-Type"
] = "application/json";

axios.defaults.withCredentials = true;
```

These defaults apply shared configuration across requests.

## Axios Instances

The frontend currently uses two reusable Axios instances.

```js
export const axiosRequest = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const axiosResponse = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});
```

| Instance | Purpose |
|---|---|
| `axiosRequest` | Base request instance |
| `axiosResponse` | Request instance with response interceptor handling |

The separation allows response interception logic to remain isolated from low-level authentication requests.

## withCredentials

Axios requests are configured using:

```js
withCredentials: true
```

This allows the browser to automatically include authentication cookies with requests.

The platform uses:

```text
Cookie-based JWT authentication
```

rather than manually storing tokens inside local storage.

## Content Type Configuration

POST requests default to:

```js
"Content-Type": "application/json"
```

This ensures request payloads are sent as JSON-compatible API data.

The backend expects JSON request bodies for authentication and API workflows.