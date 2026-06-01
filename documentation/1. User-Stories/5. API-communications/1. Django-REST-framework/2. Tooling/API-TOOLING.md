# API Tooling

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Django REST Framework](#django-rest-framework)
- [Filtering Support](#filtering-support)
- [JWT Authentication Tooling](#jwt-authentication-tooling)
- [Authentication Extensions](#authentication-extensions)
- [API Schema Generation](#api-schema-generation)
- [Pagination Tooling](#pagination-tooling)
- [Serializer Tooling](#serializer-tooling)
- [Generic View Tooling](#generic-view-tooling)
- [Response Utilities](#response-utilities)

## Purpose

The backend API is built around Django REST Framework and supporting ecosystem packages.

These tools provide reusable API architecture for:

```text
Views
Serializers
Authentication
Filtering
Pagination
Schema generation
Response handling
```

The platform primarily follows standard DRF conventions rather than heavily custom API implementations.

## Django REST Framework

The primary API framework is:

```py
rest_framework
```

Django REST Framework provides:

```text
Generic API views
Serializers
Permissions
Authentication support
Pagination
Request parsing
Response handling
```

Most backend API functionality is built using DRF generic patterns.

## Filtering Support

Filtering support is provided through:

```py
django_filters
```

and:

```py
from django_filters.rest_framework import DjangoFilterBackend
```

This allows reusable query parameter filtering for list endpoints.

Example:

```py
filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
]
```

## JWT Authentication Tooling

JWT authentication support is provided through:

```py
rest_framework_simplejwt
```

and:

```py
rest_framework_simplejwt.token_blacklist
```

This tooling provides:

```text
Access tokens
Refresh tokens
Token rotation
Token blacklisting
Expiration handling
```

The platform uses JWT cookies rather than local storage token management.

## Authentication Extensions

Authentication endpoints are provided through:

```py
dj_rest_auth
dj_rest_auth.registration
```

These packages provide reusable authentication workflows including:

```text
Registration
Login
Logout
Password management
Authenticated user retrieval
```

The platform extends these workflows using custom serializers where required.

## API Schema Generation

OpenAPI schema generation is handled through:

```py
drf_spectacular
```

Configuration:

```py
REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS":
        "drf_spectacular.openapi.AutoSchema",
}
```

This allows automatic API schema generation for documentation and development tooling.

## Pagination Tooling

Pagination is handled through DRF pagination utilities.

Configuration:

```py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.LimitOffsetPagination",

    "PAGE_SIZE": 20,
}
```

The platform currently uses:

```text
Limit-offset pagination
```

for reusable frontend list workflows.

## Serializer Tooling

The backend primarily uses:

```py
serializers.ModelSerializer
```

This simplifies:

```text
Model serialization
Validation
Field configuration
Relationship handling
```

Most API resources expose serializers through DRF model serializers.

## Generic View Tooling

The backend primarily uses DRF generic views.

Examples:

```py
generics.ListCreateAPIView
generics.ListAPIView
generics.CreateAPIView
generics.RetrieveAPIView
generics.RetrieveUpdateDestroyAPIView
```

These views provide reusable API behaviour while reducing repeated boilerplate code.

## Response Utilities

The backend uses DRF response utilities.

Examples:

```py
from rest_framework.response import Response
```

and:

```py
from rest_framework import status
```

These utilities are used for:

```text
Custom responses
Validation responses
Error responses
Status code handling
```

This keeps API responses consistent throughout the platform.