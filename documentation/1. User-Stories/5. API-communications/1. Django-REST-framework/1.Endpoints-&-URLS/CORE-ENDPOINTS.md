# Core Endpoints

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Endpoint Group](#endpoint-group)
- [Subject Endpoints](#subject-endpoints)
- [Related Documentation](#related-documentation)

## Purpose

Core endpoints provide API access to the platform's educational resources.

This document lists the currently available core API routes.

Endpoint behaviour such as filtering, pagination, permissions, and serializers are documented separately.

## Endpoint Group

Core endpoints are grouped under:

```text
/api/core/
```

## Subject Endpoints

| Method | Endpoint | Purpose | Access |
|---|---|---|---|
| `GET` | `/api/core/subjects/` | Retrieve subject list | Public |
| `POST` | `/api/core/subjects/` | Create subject | Admin |
| `GET` | `/api/core/subjects/{subject_id}/` | Retrieve subject details | Public |
| `PUT` | `/api/core/subjects/{subject_id}/` | Update subject | Admin |
| `PATCH` | `/api/core/subjects/{subject_id}/` | Partially update subject | Admin |
| `DELETE` | `/api/core/subjects/{subject_id}/` | Delete subject | Admin |

<!-- ## Related Documentation

- [List/Create Views](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-rest-framework/LIST-CREATE-VIEWS.md)

- [Filtering & Search](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-rest-framework/FILTERING-&-SEARCH.md)

- [Pagination](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-rest-framework/PAGINATION.md)

- [Serializer Pattern](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-rest-framework/SERIALIZER-PATTERN.md) -->