# API Base URL

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Environment Variable](#environment-variable)
- [Current Usage](#current-usage)
- [Why Environment Variables Are Used](#why-environment-variables-are-used)
- [Frontend Relationship](#frontend-relationship)

## Purpose

The frontend uses a shared API base URL so all Axios requests communicate with the correct backend server.

The API base URL is configured through frontend environment variables.

This keeps backend connection settings centralised and environment-specific.

## Environment Variable

The backend API URL is loaded using:

```js
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL;
```

This value is provided through the frontend environment configuration.

Example:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Current Usage

The API base URL is applied to:

```js
axios.defaults.baseURL = API_BASE_URL;
```

and:

```js
axios.create({
    baseURL: API_BASE_URL,
})
```

This allows Axios requests to use relative endpoint paths.

Example:

```js
axiosResponse.get("/api/core/subjects/")
```

instead of manually writing the full backend URL every time.

## Why Environment Variables Are Used

Environment variables allow different backend URLs to be used without changing frontend source code.

This supports:

```text
Development environments
Production deployments
Different backend servers
Local testing
```

The frontend only depends on the configured environment value.

## Frontend Relationship

The API base URL is used throughout:

```text
axiosRequest
axiosResponse
Authentication requests
Core API requests
Dashboard requests
```

All reusable API utilities depend on the shared Axios base URL configuration.