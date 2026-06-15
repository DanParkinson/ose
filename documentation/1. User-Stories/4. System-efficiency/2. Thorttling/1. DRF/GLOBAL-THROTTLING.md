# Global Throttling

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Global Throttle Configuration](#global-throttle-configuration)
* [Anonymous User Throttling](#anonymous-user-throttling)
* [Authenticated User Throttling](#authenticated-user-throttling)
* [Throttle Behaviour](#throttle-behaviour)
* [Current Implementation](#current-implementation)

## Purpose

Global throttling limits the number of API requests that can be made within a specified time period.

The platform uses Django REST Framework throttling to help protect API availability and prevent excessive request volumes from consuming unnecessary server resources.

Throttling is applied globally to API views through Django REST Framework settings.

## Global Throttle Configuration

The platform configures throttling using:

```py
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],

    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "1000/hour",
    },
}
```

Two separate throttle classes are configured:

```text
Anonymous Users
Authenticated Users
```

This allows different request limits to be applied depending on whether a user is authenticated.

## Anonymous User Throttling

Anonymous users are limited using:

```py
"rest_framework.throttling.AnonRateThrottle"
```

Rate:

```py
"anon": "100/hour"
```

This allows an unauthenticated client to make:

```text
100 requests per hour
```

before throttling is applied.

Anonymous throttling is identified using the client's IP address.

## Authenticated User Throttling

Authenticated users are limited using:

```py
"rest_framework.throttling.UserRateThrottle"
```

Rate:

```py
"user": "1000/hour"
```

This allows an authenticated user to make:

```text
1000 requests per hour
```

before throttling is applied.

Authenticated throttling is tracked per user account rather than per IP address.

## Throttle Behaviour

When a request exceeds the configured limit:

```text
Request Received
        ↓
Throttle Limit Exceeded
        ↓
Request Rejected
        ↓
HTTP 429 Returned
```

Example response:

```json
{
    "detail": "Request was throttled. Expected available in 3600 seconds."
}
```

The exact wait time depends on the remaining throttle window.

## Current Implementation

The platform currently uses global throttling only.

This means all API views inherit the configured throttle rates automatically.

Future implementations may introduce:

```text
Per-View Throttling
Authentication Endpoint Throttling
Resource-Specific Throttling
```

to allow different request limits for different parts of the API.
