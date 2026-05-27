# URL Conventions

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Core URL Structure](#core-url-structure)
- [UUID-Based Resource Access](#uuid-based-resource-access)
- [Slug Usage](#slug-usage)
- [Frontend URL Structure](#frontend-url-structure)
- [Backend URL Structure](#backend-url-structure)
- [Design Principles](#design-principles)

## Purpose

The platform uses separate URL strategies for backend resource identification and frontend readability.

The backend primarily uses UUID values for resource lookup and API operations.

The frontend additionally uses slugs to create cleaner and more readable URLs for users.

## Core URL Structure

API endpoints follow a resource-based structure.

Example:

```text
/api/core/subjects/
/api/core/subjects/{subject_id}/
```

Frontend routes follow a readability-focused structure.

Example:

```text
/subjects/mathematics-gcse-en/a1b2c3d4-e5f6-7890-abcd-1234567890ef/
```

## UUID-Based Resource Access

The backend uses UUID values for resource identification.

Example:

```text
subjects/<uuid:subject_id>/
```

UUIDs are used because they provide:

```text
Stable identifiers
Unique resource lookup
Non-sequential IDs
Safer public exposure
```

The backend uses UUID values for:

```text
Detail retrieval
Updates
Deletes
Relationship references
```

## Slug Usage

The frontend uses slugs for readability.

Example:

```text
mathematics-gcse-en
```

Slugs are designed for:

```text
Readable URLs
SEO-friendly routes
Improved navigation clarity
```

Slugs are not used as the primary backend lookup identifier.

The UUID remains the authoritative identifier for API operations.

## Frontend URL Structure

Frontend routes commonly combine:

```text
Readable slug
+
Stable UUID
```

Example:

```text
/subjects/mathematics-gcse-en/a1b2c3d4-e5f6-7890-abcd-1234567890ef/
```

This allows:

```text
Readable navigation
Stable backend fetching
Consistent resource lookup
```

The frontend can display readable URLs while still reliably retrieving resources through UUIDs.

## Backend URL Structure

Backend API routes focus on predictable resource access patterns.

Example:

```text
/api/core/subjects/{subject_id}/
```

The backend does not depend on slugs for resource retrieval.

This avoids problems caused by:

```text
Title changes
Slug updates
Duplicate naming
```

## Design Principles

The platform separates:

```text
Frontend readability
Backend resource identification
```

Frontend routes prioritise usability and readability.

Backend routes prioritise stable and reliable resource lookup.