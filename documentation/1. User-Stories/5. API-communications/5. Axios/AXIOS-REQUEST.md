# Axios Request

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Axios Request Instance](#axios-request-instance)
- [Configuration](#configuration)
- [Primary Responsibilities](#primary-responsibilities)
- [Authentication Relationship](#authentication-relationship)
- [Frontend Relationship](#frontend-relationship)

## Purpose

`axiosRequest` is the base Axios instance used for low-level frontend API requests.

It provides a reusable request layer without automatic response interception behaviour.

The instance is primarily used for authentication-related utility requests.

## Axios Request Instance

The frontend defines a reusable Axios request instance.

```js
export const axiosRequest = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});
```

This instance uses the shared API base configuration.

## Configuration

The request instance currently includes:

```js
baseURL: API_BASE_URL
withCredentials: true
```

This ensures requests:

```text
Use the configured backend server
Automatically include authentication cookies
```

## Primary Responsibilities

`axiosRequest` is responsible for:

```text
Sending direct API requests
Supporting authentication utility workflows
Providing a reusable low-level request instance
```

The instance intentionally does not include automatic response retry behaviour.

## Authentication Relationship

`axiosRequest` is currently used for authentication utility requests such as token refresh handling.

Example:

```js
await axiosRequest.post(
    "/api/auth/token/refresh/"
);
```

This avoids recursive interceptor behaviour during authentication recovery workflows.

## Frontend Relationship

`axiosRequest` works alongside:

```text
axiosResponse
Authentication context
Request interceptors
Reusable API utilities
```

The platform separates request instances so authentication recovery logic remains isolated from normal API request handling.