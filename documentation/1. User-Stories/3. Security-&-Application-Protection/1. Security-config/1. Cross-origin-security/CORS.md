# CORS Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Cross-Origin Requests](#cross-origin-requests)
- [Allowed Origins](#allowed-origins)
- [Credential Support](#credential-support)
- [Frontend Relationship](#frontend-relationship)
- [Production Configuration](#production-configuration)

## Purpose

Cross-Origin Resource Sharing (CORS) controls which frontend applications are permitted to communicate with the backend API.

The platform uses CORS because the frontend and backend run on separate origins.

Without CORS configuration, browsers block requests between different origins.

## Cross-Origin Requests

A cross-origin request occurs when a frontend application attempts to communicate with a backend running on a different domain, protocol, or port.

Example:

```text
Frontend:
http://localhost:5173

Backend:
http://localhost:8000
```

Although both run locally, they are considered different origins by the browser.

The backend must explicitly allow these requests before the browser will permit communication.

## Allowed Origins

Allowed frontend origins are configured through:

```py
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "",
).split(",")
```

This allows trusted frontend applications to access the API.

Development example:

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

Production example:

```env
CORS_ALLOWED_ORIGINS=https://open-source-education.co.uk,https://www.open-source-education.co.uk
```

Only origins included in this list are permitted to make browser requests to the API.

## Credential Support

The platform enables credential support through:

```py
CORS_ALLOW_CREDENTIALS = True
```

This allows browsers to include authentication cookies with API requests.

Without credential support:

```text
Authentication cookies are not sent
Authenticated requests fail
Protected API endpoints become inaccessible
```

Credential support is required because authentication uses JWT cookies rather than manually managed tokens.

## Frontend Relationship

The frontend must be configured to send credentials with requests.

Example:

```js
axios.defaults.withCredentials = true;

export const axiosRequest = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});
```

This allows authentication cookies to be included automatically with API requests.

Both frontend and backend must support credentials for cookie-based authentication to function correctly.

## Production Configuration

Production deployments should restrict access to known frontend domains only.

Example:

```env
CORS_ALLOWED_ORIGINS=https://open-source-education.co.uk,https://www.open-source-education.co.uk
```

This prevents unknown websites from making browser requests to the API while still allowing the official frontend application to communicate with the backend.