# Credentials

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [withCredentials Configuration](#withcredentials-configuration)
- [Cookie-Based Authentication](#cookie-based-authentication)
- [Browser Behaviour](#browser-behaviour)
- [Authentication Relationship](#authentication-relationship)
- [Backend Relationship](#backend-relationship)

## Purpose

The frontend uses credential-enabled requests so authentication cookies can be automatically included with API communication.

This is required because the platform uses:

```text
JWT cookie authentication
```

rather than local storage token management.

## withCredentials Configuration

Axios requests are configured using:

```js
withCredentials: true
```

Example:

```js
export const axiosResponse = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});
```

Global Axios defaults also include:

```js
axios.defaults.withCredentials = true;
```

## Cookie-Based Authentication

The backend stores authentication tokens inside HTTP cookies.

Examples:

```text
access
refresh
```

Because cookies are browser-managed, the frontend must allow credentials to be included with requests.

Without `withCredentials`, authentication cookies would not be sent to the backend.

## Browser Behaviour

When `withCredentials` is enabled:

```text
Browser automatically includes authentication cookies
```

with supported requests to the backend.

This allows authenticated sessions to persist across frontend API communication.

The frontend does not manually attach JWT tokens to request headers.

## Authentication Relationship

Credential-enabled requests are required for:

```text
Authenticated API requests
Session persistence
Automatic token refresh
Protected routes
Authenticated user retrieval
```

The frontend relies on browser-managed authentication cookies throughout the authentication workflow.

## Backend Relationship

Credential-based authentication also depends on backend security configuration.

The backend must correctly configure:

```text
CORS
CSRF trusted origins
Secure cookies
HTTPS settings
```

for browser credential handling to work correctly.

The frontend and backend must both support credential-enabled communication for authentication to function properly.