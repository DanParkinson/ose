# Open-Source Education DRF API

## Introduction

**Open-Source Education** DRF API is built using Django REST Framework (DRF), designed to support educational staff to find and download lessons. It provides a structured and efficient way for Admins to perform CRUD related tasks, and all other users to find and download the resources provided

Providing:

This API intergrates with a frontend built in **React**. It Enables users to **authenticate, search and filter through lessons, Download resources.**

---

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [API Documentation](#api-documentation)
  - [Authentication Endpoints](#authentication-endpoints-not-yet-implemented)
  - [Account Endpoints](#account-endpoints-not-yet-implemented)
  - [Subject Endpoints](#subject-endpoints)
  - [Topic Endpoints](#topic-endpoints)
  - [Lesson Name Endpoints](#lesson-name-endpoints)
  - [Variation Endpoints](#variation-endpoints)
  - [Teaching Style Endpoints](#teaching-style-endpoints)
  - [Resource Endpoints](#resource-endpoints)
  - [Lesson Variant Endpoints](#lesson-variant-endpoints)
  - [Lesson Filtering and Search](#lesson-filtering-and-search)
  - [Lesson Resource Management Endpoints](#lesson-resource-management-endpoints)
  - [Lesson Filter Endpoints](#lesson-filter-endpoints)
- [Database Models Overview](#database-models-overview)
  - [Relationships](#relationships)
  - [ERD Diagram](#erd-diagram)
- [Frameworks, Libraries & Dependencies](#frameworks-libraries--dependencies)
  - [Core Backend Frameworks](#core-backend-frameworks)
  - [Authentication & Security](#authentication--security)
  - [Filtering & API Utilities](#filtering--api-utilities)
  - [Database & Caching](#database--caching)
  - [Development & Debugging Tools](#development--debugging-tools)
  - [Cross-Origin & Middleware](#cross-origin--middleware)
  - [Development Dependencies](#development-dependencies)

---

## Key Features

| Feature                     | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| **User Authentication**     | Secure user registration, login, and token-based authentication.                |
| **Resource Management**     | Users can View, filter, and search for resources by subject                     |
| **Admin Management**        | Admins can create, update and delte resources and lessons                       |
| **RESTful API Design**      | Follows RESTful principles for seamless integration with frontend applications. |

---

## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [API Documentation](#api-documentation)
-

---

## API Documentation

### Authentication Endpoints **Not Yet Implemented**

Authentication uses **JWT authentication**. All users can access the website and roam freely where permitted. Authorisation is required for CRUD related tasks (Admin), or downloading lessons/resources (public).

| Method | Endpoint                       | Description                 | Authentication Required? | Implemented |
| ------ | ------------------------------ | --------------------------- | ------------------------ | ----------- |
| POST   | `/dj-rest-auth/login/`         | Log in & receive token.     | ❌ **(All Users)**      | ❌         |
| POST   | `/dj-rest-auth/logout/`        | Log out & invalidate token. | ✅ **(All Users)**      | ❌         |
| POST   | `/dj-rest-auth/registration/`  | Register a new user.        | ❌ **(All Users)**      | ❌         |
| POST   | `/dj-rest-auth/token/refresh/` | Refresh access token.       | ✅ **(All Users)**      | ❌         |

---

### Account Endpoints **Not Yet Implemented**

Each user has an **Account** created automatically upon registration. Users can update **only their own Account**.

| Method | Endpoint            | Description                   | Authentication Required? | Implemented |
| ------ | ------------------- | ----------------------------- | ------------------------ | ----------- |
| GET    | `/accounts/`        | List all profiles             | ✅ **(Admin)**          | ❌         |
| GET    | `/accounts/{UUid}/` | Retrieve a specific profile.  | ✅ **(Owner Only)**     | ❌         |
| PUT    | `/accounts/{UUid}/` | Update profile details.       | ✅ **(Owner Only)**     | ❌         |

---

### Subject Endpoints

Users can retrieve available **subjects**. Admins can perform CRUD.
Each subject includes a title, level, language, publication status, and protection status.

| Method | Endpoint                                              | Description                      | Authentication Required? | Implemented |
| ------ | ----------------------------------------------------- | -------------------------------- | ------------------------ | ----------- |
| GET    | `/subjects/`                                          | List all subjects.               | ❌  **(All Users)**     | ✅          |
| POST   | `/subjects/`                                          | Create a new subject.            | ✅  **(Admin)**         | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/`              | Retrieve subject details.        | ❌  **(All Users)**     | ✅          |
| PUT    | `/subjects/{subject_slug}/{subject_id}/`              | Update subject details.          | ✅  **(Admin)**         | ✅          |
| DELETE | `/subjects/{subject_slug}/{subject_id}/`              | Delete a subject.                | ✅  **(Admin)**         | ✅          |

### Example Subject Response

```json
{
  "subject_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
  "title": "Mathematics",
  "slug": "mathematics-gcse-en",
  "level": "gcse",
  "language": "en",
  "is_published": true,
  "is_protected": false
}
```

---

### Topic Endpoints

Users can retrieve available **topics**. Admins can perform CRUD operations.
Each topic can be linked to multiple subjects and includes a title and protection status.

| Method | Endpoint                                          | Description                   | Authentication Required? | Implemented |
| ------ | ------------------------------------------------- | ----------------------------- | ------------------------ | ----------- |
| GET    | `/topics/`                                        | List all topics.              | ✅ **(Admin)**           | ✅          |
| POST   | `/topics/`                                        | Create a new topic.           | ✅ **(Admin)**           | ✅          |
| GET    | `/topics/{topic_slug}/{topic_id}/`                | Retrieve topic details.       | ✅ **(Admin)**           | ✅          |
| PUT    | `/topics/{topic_slug}/{topic_id}/`                | Update topic details.         | ✅ **(Admin)**           | ✅          |
| DELETE | `/topics/{topic_slug}/{topic_id}/`                | Delete a topic.               | ✅ **(Admin)**           | ✅          |

### Example Topic List Response

```json
{
  "count": 45,
  "next": "http://api.example.com/topics/?page=2",
  "previous": null,
  "results": [
    {
      "topic_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
      "title": "Algebra",
      "slug": "algebra",
      "subjects": [
        {
          "subject_id": "b2c3d4e5-f6a7-8901-bcde-2345678901ab",
          "title": "Mathematics"
        }
      ],
      "is_protected": false
    }
  ]
}
```

---

### Lesson Name Endpoints

Users can retrieve available **lesson names**. Admins can perform CRUD operations.
Each lesson name can be linked to multiple subjects and includes a title and protection status.

| Method | Endpoint                                              | Description                        | Authentication Required? | Implemented |
| ------ | ----------------------------------------------------- | ---------------------------------- | ------------------------ | ----------- |
| GET    | `/lesson_names/`                                      | List all lesson names.             | ❌ **(Admin)**           | ✅          |
| POST   | `/lesson_names/`                                      | Create a new lesson name.          | ✅ **(Admin)**           | ✅          |
| GET    | `/lesson_names/{lesson_name_slug}/{lesson_name_id}/`  | Retrieve lesson name details.      | ❌ **(Admin)**           | ✅          |
| PUT    | `/lesson_names/{lesson_name_slug}/{lesson_name_id}/`  | Update lesson name details.        | ✅ **(Admin)**           | ✅          |
| DELETE | `/lesson_names/{lesson_name_slug}/{lesson_name_id}/`  | Delete a lesson name.              | ✅ **(Admin)**           | ✅          |

### Example Lesson Name List Response

```json
{
  "count": 32,
  "next": "http://api.example.com/lesson_names/?page=2",
  "previous": null,
  "results": [
    {
      "lesson_name_id": "c3d4e5f6-a7b8-9012-cdef-3456789012bc",
      "title": "Introduction to Algebra",
      "slug": "introduction-to-algebra",
      "subjects": [
        {
          "subject_id": "b2c3d4e5-f6a7-8901-bcde-2345678901ab",
          "title": "Mathematics"
        }
      ],
      "is_protected": false
    }
  ]
}
```

---

### Variation Endpoints

Users can retrieve available **variations**.
Each variation includes a title and protection status.
Variation Creation handled by SpuerUser inside of Django Admin Panel

| Method | Endpoint                                              | Description                    | Authentication Required? | Implemented |
| ------ | ----------------------------------------------------- | ------------------------------ | ------------------------ | ----------- |
| GET    | `/variations/`                                        | List all variations.           | ❌ **(Admin)**          | ✅          |
| GET    | `/variations/{variation_slug}/{variation_id}/`         | Retrieve variation details.   | ❌ **(Admin)**          | ✅          |

### Example Variation List Response

```json
{
  "count": 18,
  "next": null,
  "previous": null,
  "results": [
    {
      "variation_id": "d4e5f6a7-b8c9-0123-def4-5678901234cd",
      "title": "Basic",
      "slug": "basic",
      "is_protected": false
    }
  ]
}
```

---

### Teaching Style Endpoints

Users can retrieve available **teaching styles**.
Each teaching style includes a title and protection status.

| Method | Endpoint                                                            | Description                         | Authentication Required? | Implemented |
| ------ | ------------------------------------------------------------------- | ----------------------------------- | ------------------------ | ----------- |
| GET    | `/teaching_styles/`                                                 | List all teaching styles.           | ❌ **(Admin)**          | ✅          |
| GET    | `/teaching_styles/{teaching_style_slug}/{teaching_style_id}/`       | Retrieve teaching style details.    | ❌ **(Admin)**          | ✅          |

### Example Teaching Style List Response

```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "teaching_style_id": "e5f6a7b8-c9d0-1234-ef56-6789012345de",
      "title": "Visual Learning",
      "slug": "visual-learning",
      "is_protected": false
    }
  ]
}
```

---

### Resource Endpoints

Users can retrieve available **resources** by subject.
Each resource includes a title, category, description, file or URL reference, author, protection status, timestamps, and linked subjects.

| Method | Endpoint                                                                         | Description                               | Authentication Required? | Implemented |
| ------ | -------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ | ----------- |
| GET    | `/subjects/{subject_slug}/{subject_id}/resources/`                               | List all resources for a subject.         | ❌ **(Admin)**          | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/resources/{resource_slug}/{resource_id}/` | Retrieve resource details for a subject.  | ❌ **(All Users)**       | ✅          |

### Example Resource List Response

```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
    {
      "resource_id": "f6a7b8c9-d0e1-2345-f678-7890123456ef",
      "title": "Algebra Introduction Slides",
      "slug": "algebra-introduction-slides",
      "category": "slide",
      "description": "Introductory slides covering the basics of algebra.",
      "file": "/media/resources/algebra-introduction.pdf",
      "url": null,
      "is_protected": false,
      "created_at": "22 Apr 2026",
      "updated_at": "22 Apr 2026",
      "author": "john_doe",
      "subjects": [
        {
          "subject_id": "b2c3d4e5-f6a7-8901-bcde-2345678901ab",
          "title": "Mathematics"
        }
      ]
    }
  ]
}
```

---

### Lesson Variant Endpoints

Users can retrieve available **lessons** by subject. Admins can create, update, and delete lessons.
Each lesson is linked to a subject, topic, lesson name, teaching style, and variation.
Lesson list endpoints support **filtering** and **searching**.

| Method | Endpoint                                                                                            | Description                                    | Authentication Required? | Implemented |
| ------ | --------------------------------------------------------------------------------------------------- | ---------------------------------- ----------- | ------------------------ | ----------- |
| GET    | `/subjects/{subject_slug}/{subject_id}/lessons/`                                                    | List all lessons for a subject.                | ❌ **(All Users)**       | ✅          |
| POST   | `/subjects/{subject_slug}/{subject_id}/lessons/create/`                                             | Create a new lesson.                           | ✅ **(Admin)**           | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/`          | Retrieve lesson details.                       | ❌ **(All Users)**       | ✅          |
| PUT    | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/`          | Update a lesson.                               | ✅ **(Admin)**           | ✅          |
| PATCH  | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/`          | Partially update a lesson.                     | ✅ **(Admin)**           | ✅          |
| DELETE | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/`          | Delete a lesson.                               | ✅ **(Admin)**           | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/resources/`| Retrieve lesson details with nested resources. | ❌ **(All Users)**       | ✅          |

### Lesson Filtering and Search

The lesson list endpoint supports filtering and search to make it easier to find lessons.

| Feature | Parameter | Description |
| ------ | ------ | ----------- |
| Search | `?search=` | Search lessons by lesson name, topic, or variation title. |
| Filter | `?topic=` | Filter lessons by topic. |
| Filter | `?lesson_name=` | Filter lessons by lesson name. |
| Filter | `?teaching_style=` | Filter lessons by teaching style. |
| Filter | `?variation=` | Filter lessons by variation. |

### Example Lesson List Response

```json
{
    "count": 12,
    "next": null,
    "previous": null,
    "results": [
        {
            "lesson_variant_id": "4fd94c1f-5af4-4cc1-8877-f28c00db2275",
            "subject": "subject-1",
            "topic": "topic-1",
            "lesson_name": "lesson-1",
            "teaching_style": "teaching-style-1",
            "variation": "variation-1",
            "slug": "lesson-1-teaching-style-1-variation-1",
            "is_published": true,
            "is_protected": false,
            "created_at": "21 Apr 2026",
            "updated_at": "21 Apr 2026",
            "author": "seeduser"
        },
    ]
}
```

---

### Lesson Resource Management Endpoints

Admins can create, attach, and delete **resources** for a specific lesson.
These endpoints manage the relationship between a lesson and its resources, including resource ordering.

| Method | Endpoint                                                                                                                 | Description                                           | Authentication Required? | Implemented |
| ------ | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------- | ------------------------ | ----------- |
| POST   | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/resources/create/`              | Create a new resource and attach it to the lesson.    | ✅ **(Admin)**           | ✅          |
| POST   | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/resources/attach/`              | Attach an existing resource to the lesson.            | ✅ **(Admin)**           | ✅          |
| DELETE | `/subjects/{subject_slug}/{subject_id}/lessons/{lesson_variant_slug}/{lesson_variant_id}/resources/{resource_id}/delete/`| Delete a resource from the lesson.                    | ✅ **(Admin)**           | ✅          |

### Example Lesson Resource Management Response

```json
{
  "lesson_variant": "a7b8c9d0-e1f2-3456-a789-8901234567ab",
  "resource": {
    "resource_id": "f6a7b8c9-d0e1-2345-f678-7890123456ef",
    "title": "Algebra Introduction Slides",
    "slug": "algebra-introduction-slides",
    "category": "slide",
    "description": "Introductory slides covering the basics of algebra.",
    "file": "/media/resources/algebra-introduction.pdf",
    "url": null,
    "is_protected": false,
    "author": "john_doe"
  },
  "order": 1
}
```

---

### Lesson Filter Endpoints

Users can retrieve available **filter options** for a specific subject.
These endpoints return the available topics, lesson names, teaching styles, and variations that can be used to filter lessons.

| Method | Endpoint                                                      | Description                                            | Authentication Required? | Implemented |
| ------ | ------------------------------------------------------------- | ------------------------------------------------------ | ------------------------ | ----------- |
| GET    | `/subjects/{subject_slug}/{subject_id}/filter/topics/`        | List available topics for the selected subject.        | ❌ **(All Users)**       | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/filter/lessonnames/`   | List available lesson names for the selected subject.  | ❌ **(All Users)**       | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/filter/teachingstyles/`| List available teaching styles.                        | ❌ **(All Users)**       | ✅          |
| GET    | `/subjects/{subject_slug}/{subject_id}/filter/variations/`    | List available variations for the selected subject.    | ❌ **(All Users)**       | ✅          |

### Example Lesson Filter Response

```json
[
  {
    "topic_id": "c3d4e5f6-a7b8-9012-cdef-3456789012bc",
    "title": "Algebra"
  },
  {
    "topic_id": "d4e5f6a7-b8c9-0123-def4-4567890123cd",
    "title": "Geometry"
  }
]
```

---

## Database Models Overview

The project uses a relational database to manage **subjects, lessons, resources, filters, and user accounts**.
All educational content models belong to the **Core** app.
Admins manage lesson content and resources.
General users do not perform CRUD operations and can only browse, search, and download public content where permitted.

| App        | Description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| `Accounts` | Stores user account and profile-related information.                        |
| `Core`     | Stores subjects, topics, lesson names, teaching styles, variations, lessons, resources, and lesson-resource relationships. |

---

### Relationships

- **Each user has one account/profile.** _(1-to-1 relationship)_
- **Each subject can have multiple topics.** _(many-to-many)_
- **Each subject can have multiple lesson names.** _(many-to-many)_
- **Each subject can have multiple resources.** _(many-to-many)_
- **Each subject can have multiple lesson variants.** _(1-to-many)_
- **Each topic can belong to multiple subjects.** _(many-to-many)_
- **Each lesson name can belong to multiple subjects.** _(many-to-many)_
- **Each lesson variant belongs to one subject.** _(many-to-1)_
- **Each lesson variant belongs to one topic.** _(many-to-1)_
- **Each lesson variant belongs to one lesson name.** _(many-to-1)_
- **Each lesson variant belongs to one teaching style.** _(many-to-1)_
- **Each lesson variant belongs to one variation.** _(many-to-1)_
- **Each lesson variant is created by one author.** _(many-to-1)_
- **Each resource is created by one author.** _(many-to-1)_
- **Each lesson variant can have multiple resources.** _(many-to-many through `LessonVariantResource`)_
- **Each resource can be linked to multiple lesson variants.** _(many-to-many through `LessonVariantResource`)_
- **Each lesson-resource link stores an order value.** _(through model relationship)_

---

### ERD Diagram

![ERD Diagram](../static/ERD_Diagram%2022_04_26.svg)

---

## Frameworks, Libraries & Dependencies

Various third-party libraries are used to support backend development, API functionality, authentication, performance, and database management.

---

### Core Backend Frameworks

| Library                         | Version   | Description                                  |
| ------------------------------- | --------- | -------------------------------------------- |
| **Django**                      | 5.2.12    | High-level Python web framework.             |
| **Django REST Framework (DRF)** | 3.17.1+   | Toolkit for building RESTful APIs.           |

---

### Authentication & Security

| Library                              | Version   | Description                                      |
| ------------------------------------ | --------- | ------------------------------------------------ |
| **dj-rest-auth**                     | 7.2.0+    | REST endpoints for authentication workflows.     |
| **django-allauth**                   | 65.15.1+  | Handles user registration and authentication.    |
| **djangorestframework-simplejwt**    | 5.5.1+    | JWT authentication for DRF APIs.                 |

---

### Filtering & API Utilities

| Library               | Version   | Description                                      |
| --------------------- | --------- | ------------------------------------------------ |
| **django-filter**     | 25.2+     | Enables filtering for API querysets.             |
| **drf-spectacular**   | 0.29.0+   | OpenAPI schema generation and API documentation. |

---

### Database & Caching

| Library               | Version   | Description                                      |
| --------------------- | --------- | ------------------------------------------------ |
| **psycopg**           | 3.3.3+    | PostgreSQL database adapter for Python.          |
| **django-redis**      | 6.0.0+    | Redis integration for caching.                   |
| **redis[hiredis]**    | 7.4.0+    | Redis client with performance optimisations.     |

---

### Development & Debugging Tools

| Library               | Version   | Description                                      |
| --------------------- | --------- | ------------------------------------------------ |
| **django-extensions** | 4.1+      | Additional management commands and utilities.    |
| **django-silk**       | 5.5.0+    | Profiling and performance monitoring tool.       |
| **django-summernote** | 0.8.20.0+ | WYSIWYG editor for content management.           |

---

### Cross-Origin & Middleware

| Library                   | Version   | Description                                  |
| ------------------------- | --------- | -------------------------------------------- |
| **django-cors-headers**   | 4.9.0+    | Handles Cross-Origin Resource Sharing (CORS). |

---

### Development Dependencies

| Library       | Version   | Description                                      |
| ------------- | --------- | ------------------------------------------------ |
| **pre-commit**| 4.5.1+    | Manages Git pre-commit hooks.                    |
| **ruff**      | 0.5.0+    | Fast Python linter and formatter.                |

---
