# API Architecture

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [High-Level API Flow](#high-level-api-flow)
- [URL structure](#url-structure)
- [Resource-Based Endpoints](#resource-based-endpoints)
- [List and Create Views](#list-and-create-views)
  - [Permissions Pattern](#permissions-pattern)
  - [Serializer Pattern](#serializer-pattern)
  - [Filtering and Search](#filtering-and-search)
  - [Pagination](#pagination)
- [Model Structure](#model-structure)
  - [Slug and UUID Pattern](#slug-and-uuid-pattern)
  - [Automatic Slug Generation](#automatic-slug-generation)
  - [Unique Constraints](#unique-constraints)
- [Core API Principles](#core-api-principles)
- [Key Principle](#key-principle)


## Purpose

This document explains the high-level API architecture used in the backend.

The backend API is built with Django REST Framework and provides frontend-facing endpoints for educational content such as:

- subjects
- topics
- lesson names
- variations
- teaching styles
- resources
- lesson variants
- filter option lists

This document focuses on how the API is structured, not the detailed behaviour of every individual endpoint.

## High-Level API Flow

```text
Frontend request
    ↓
URL pattern
    ↓
DRF API view
    ↓
Queryset
    ↓
Serializer
    ↓
Model / database
    ↓
Serialized API response
    ↓
Frontend
```

The API follows a consistent flow where URL routes connect frontend requests to DRF views.
The view controls the queryset, permissions, filtering, searching, and serializer used for the response.

## URL Structure

API routes are grouped by resource type.

Example:

```py
path(
    "subjects/",
    subject_views.SubjectListCreateView.as_view(),
    name="subject-list"
)
```

Detail endpoints commonly include both a slug and UUID.

Example:

```py
path(
    "subjects/<slug:subject_slug>/<uuid:subject_id>/",
    subject_views.SubjectDetailView.as_view(),
    name="subject-detail",
)
```

This gives URLs that are both readable and uniquely identifiable.

```text
slug = human-readable identifier
uuid = stable database identifier
```

## Resource-Based Endpoints

The API is organised around backend resources.

Current route groups include:

| Resource Area | Example Purpose |
|---|---|
| `subjects` | Subject list, creation, and detail access |
| `topics` | Topic list, creation, detail access, and subject-based topic access |
| `lesson_names` | Lesson name list, creation, detail access, and subject-based access |
| `variations` | Variation list and detail access |
| `teaching_styles` | Teaching style list and detail access |
| `resources` | Subject-based resource access |
| `lessons` | Lesson variant list, creation, detail, and nested resource access |
| `filter` | Lightweight option lists used by frontend filters |

## List and Create Views

List/create endpoints use DRF generic views.

Example:

```py
class SubjectListCreateView(generics.ListCreateAPIView):
    queryset = models.Subject.objects.all()
    serializer_class = subject_serializers.SubjectSerializer
```

This allows a single endpoint to support:

```text
GET  -> list records
POST -> create records
```

The view decides which permissions apply to each request method.

## Permissions Pattern

Some endpoints allow public read access but restrict creation to admin users.

Example:

```py
def get_permissions(self):
    if self.request.method == "POST":
        return [permissions.IsAdminUser()]
    return [permissions.AllowAny()]
```

For the subject list/create endpoint:

| Method | Permission |
|---|---|
| `GET` | Anyone can view subjects |
| `POST` | Only admin users can create subjects |

This pattern allows public frontend pages to read data while protecting write operations.

## Serializer Pattern

Serializers define which model fields are exposed through the API.

Example:

```py
class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subject
        fields = [
            "subject_id",
            "title",
            "slug",
            "level",
            "language",
            "is_published",
            "is_protected",
        ]
        read_only_fields = ["subject_id", "slug"]
```

The serializer controls:

```text
which fields appear in API responses
which fields can be submitted by the frontend
which fields are read-only
```

In this example:

| Field | Behaviour |
|---|---|
| `subject_id` | Read-only UUID primary key |
| `slug` | Read-only generated slug |
| `title` | Editable |
| `level` | Editable choice field |
| `language` | Editable choice field |
| `is_published` | Editable boolean |
| `is_protected` | Editable boolean |

## Filtering and Search

List endpoints can support filtering and searching.

Example:

```py
filter_backends = [DjangoFilterBackend, filters.SearchFilter]

filterset_fields = [
    "level",
    "language",
    "is_published",
    "is_protected",
]

search_fields = ["title"]
```

This allows the frontend to request filtered or searched data using query parameters.

Example behaviour:

```text
?level=secondary
?language=en
?is_published=true
?search=math
```

Filtering is used for exact field matching.
Search is used for text-based lookup.

## Pagination

Pagination is configured globally in Django REST Framework settings.

The backend uses limit-offset pagination.

API list responses are expected to return pagination metadata such as:

```text
count
next
previous
results
```

This allows the frontend to manage paginated dashboard data using an offset-based workflow.

## Model Structure

API views are backed by Django models.

Example:

```py
class Subject(models.Model):
    subject_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)
    slug = models.SlugField(blank=True, max_length=500)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES)
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES)
    is_published = models.BooleanField(default=False)
    is_protected = models.BooleanField(default=False)
```

The model defines:

```text
database structure
field types
choice values
ordering
constraints
automatic slug generation
string representation
```

The API exposes this model through serializers and views.

## Slug and UUID Pattern

Some detail routes use both a slug and UUID.

Example:

```text
subjects/<slug:subject_slug>/<uuid:subject_id>/
```

This gives each detail URL:

| Part | Purpose |
|---|---|
| `slug` | Human-readable URL value |
| `uuid` | Unique database identifier |

The UUID is the reliable identifier.
The slug improves readability.

# Automatic Slug Generation

models generate their slug automatically.

Example:

```py
def save(self, *args, **kwargs):
    if not self.slug:
        self.slug = slugify(f"{self.title}-{self.level}-{self.language}")
    super().save(*args, **kwargs)
```

For subjects, the slug is generated from:

```text
title
level
language
```

Example:

```text
Mathematics + secondary + en
    ↓
mathematics-secondary-en
```

## Unique Constraints

The subject model prevents duplicate subject records for the same title, level, and language.

```py
models.UniqueConstraint(
    fields=["title", "level", "language"],
    name="unique_subject_title_level_language",
)
```

This means the same subject title can only exist once for the same level and language combination.

## Core API Principles

```text
URLs route requests.
Views control API behaviour.
Querysets define available data.
Serializers shape the response.
Permissions protect write actions.
Filters and search refine list responses.
Pagination controls list size.
Models define the database structure.
```

## Key Principle

```text
The API should expose predictable, resource-based endpoints that the frontend can consume through reusable request, filtering, search, and pagination logic.
```
