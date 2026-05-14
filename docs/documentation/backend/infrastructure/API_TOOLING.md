# API Tooling

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Django REST Framework](#django-rest-framework)
- [Filtering Support](#filtering-support)
- [JWT Authentication Tooling](#jwt-authentication-tooling)
- [Authentication Extensions](#authentication-extensions)
- [API Schema Generation](#api-schema-generation)
- [API Pagination](#api-pagination)
- [Serializer Tooling](#serializer-tooling)
- [APIView Tooling](#apiview-tooling)
- [Response Handling](#response-handling)
- [API Development Philosophy](#api-development-philosophy)
- [Key Principle](#key-principle)

## Purpose

This document explains the API tooling used throughout the backend.

The backend API is built primarily around Django REST Framework and supporting ecosystem packages.

These tools provide:

```text
API views
serialization
authentication
filtering
pagination
schema generation
response handling
```

The goal is to create a predictable and reusable API architecture.

## Django REST Framework

The primary API framework is:

```py
"rest_framework"
```

Django REST Framework provides:

```text
generic API views
serializers
authentication support
permissions
pagination
request parsing
response handling
```

Most API functionality in the platform is built around DRF conventions.

## Filtering Support

The backend uses:

```py
"django_filters"
```

with:

```py
from django_filters.rest_framework import DjangoFilterBackend
```

This provides reusable query parameter filtering throughout list endpoints.

Example:

```py
filter_backends = [DjangoFilterBackend, filters.SearchFilter]
```

Filtering is primarily used for:

```text
dashboard filtering
subject filtering
frontend query parameters
```

## JWT Authentication Tooling

JWT authentication is provided through:

```py
"rest_framework_simplejwt"
```

and:

```py
"rest_framework_simplejwt.token_blacklist"
```

This tooling provides:

```text
JWT access tokens
refresh tokens
token rotation
token blacklisting
expiration handling
```

The platform uses JWT cookies instead of local storage token management.

## Authentication Extensions

The backend uses:

```py
"dj_rest_auth"
"dj_rest_auth.registration"
```

These packages provide:

```text
authentication endpoints
registration endpoints
password management
user detail endpoints
JWT integration
```

The platform extends these workflows using custom serializers.

## API Schema Generation

The backend uses:

```py
"drf_spectacular"
```

Schema generation is configured using:

```py
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
```

and:

```py
SPECTACULAR_SETTINGS = {
    "TITLE": "OSE API",
    "DESCRIPTION": "A simple open source resource library for teachers",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}
```

This tooling generates OpenAPI-compatible API schemas.

## API Pagination

Pagination is handled through DRF pagination tooling.

Configuration:

```py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.LimitOffsetPagination",

    "PAGE_SIZE": 20,
}
```

The backend currently uses:

```text
limit-offset pagination
```

for reusable frontend list workflows.

## Serializer Tooling

The backend primarily uses:

```py
serializers.ModelSerializer
```

This tooling simplifies:

```text
model serialization
validation
field configuration
relationship handling
```

Most API resources expose serializers through DRF model serializers.

## APIView Tooling

The backend primarily uses DRF generic views.

Examples:

```py
generics.ListCreateAPIView
generics.ListAPIView
generics.CreateAPIView
generics.RetrieveAPIView
generics.RetrieveUpdateDestroyAPIView
```

These views provide reusable API behaviour while reducing repeated code.

## Response Handling

The backend uses DRF response utilities.

Example:

```py
from rest_framework.response import Response
```

Responses are used for:

```text
custom API responses
validation messages
permission errors
manual response structures
```

The backend also uses DRF status utilities.

Example:

```py
from rest_framework import status
```

This keeps response status codes readable and consistent.

## API Development Philosophy

The API tooling stack is designed around:

```text
reusable API patterns
minimal repeated logic
frontend-compatible responses
predictable authentication
simple filtering workflows
DRF conventions
```

The platform prefers using existing DRF tooling before introducing highly custom implementations.
