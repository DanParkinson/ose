# Core App

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Core App Responsibilities](#core-app-responsibilities)
- [High-Level Structure](#high-level-structure)
- [Relationship Structure](#relationship-structure)
- [UUID Convention](#uuid-convention)
- [Slug Convention](#slug-convention)
- [Protected Content Convention](#protected-content-convention)
- [Published Content Convention](#published-content-convention)
- [Author Ownership](#author-ownership)
- [Constraint Philosophy](#constraint-philosophy)
- [API Integration](#api-integration)
- [Frontend Relationship](#frontend-relationship)
- [Architectural Philosophy](#architectural-philosophy)

## Purpose

The `core` app contains the main educational content system used throughout the platform.

It is responsible for managing:

```text
subjects
topics
lesson names
resources
lesson variants
lesson-resource relationships
```

The app provides the primary backend API consumed by the frontend application.

## Core App Responsibilities

The `core` app is responsible for:

| Responsibility | Purpose |
|---|---|
| Educational content structure | Organising educational resources into reusable structures |
| Resource relationships | Connecting lessons, topics, styles, variations, and resources |
| Frontend API data | Providing frontend-facing API endpoints |
| Filtering and search | Supporting reusable filtering and search workflows |
| Content protection | Preventing protected records from modification |
| Resource management | Managing files, links, and learning resources |

The `core` app should contain educational domain logic.

It should not contain:

```text
authentication logic
user account management
JWT configuration
frontend state logic
```

Those responsibilities belong elsewhere.

## High-Level Structure

The `core` app is built around a layered educational content structure.

```text
Subject
    ↓
Topic
    ↓
Lesson Name
```

This allows lessons to exist in multiple reusable variations and teaching approaches.

## Relationship Structure

The app heavily uses relationships to support reusable educational content.

| Relationship | Purpose |
|---|---|
| `ManyToManyField` | Shared subjects, resources, and reusable relationships |
| `ForeignKey` | Parent-child educational structures |
| `through` relationships | Ordered lesson resources |

The system is designed to minimise duplicated lesson content.

## UUID Convention

All primary educational models use UUID primary keys.

Examples:

```text
subject_id
topic_id
lesson_name_id
```

UUIDs are used to:

```text
avoid predictable numeric IDs
support stable frontend references
improve API consistency
```

## Slug Convention

models generate slugs automatically.

Examples:

```text
mathematics-secondary-en
adding-fractions
direct-instruction
```

Slugs are used for:

```text
readable frontend URLs
detail endpoint routing
SEO-friendly paths
```

## Protected Content Convention

Most core models support:

```py
is_protected = models.BooleanField(default=False)
```

Protected records cannot normally be:

```text
updated
deleted
```

This helps preserve important seed or system-managed content.

## Published Content Convention

Some models support:

```py
is_published = models.BooleanField(default=False)
```

This allows content to exist in:

```text
draft state
published state
```

Published content can be exposed to frontend users while unpublished content remains hidden.

## Author Ownership

User-created content tracks the creating user.

Example:

```py
author = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
)
```

This is primarily used by:

```text
resources
lesson variants
```

Author ownership supports future moderation and ownership workflows.

## Constraint Philosophy

The app uses database constraints to prevent duplicate educational structures.

Examples:

```text
unique subject title per level/language
unique topic title
```

This helps preserve data consistency throughout the educational system.

## API Integration

The `core` app is tightly integrated with Django REST Framework.

The app provides:

```text
list endpoints
detail endpoints
nested subject routes
filter endpoints
search support
pagination
```

Frontend pages primarily consume data from the `core` app APIs.

## Frontend Relationship

The frontend uses the `core` app to:

```text
load educational content
filter lesson variants
load subject-specific resources
populate filter dropdowns
display reusable lesson structures
```

Most frontend dashboard workflows are built around `core` app APIs.

## Architectural Philosophy

The `core` app is designed around:

```text
reusable educational structures
composable lesson systems
frontend-driven filtering
resource relationships
predictable APIs
```

The goal is to minimise duplicated educational content while supporting flexible lesson organisation.
