# API List Views

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Standard Structure](#standard-structure)
- [Purpose Of Each Section](#purpose-of-each-section)
- [Queryset Convention](#queryset-convention)
  - [Prefetch Related Convention](#prefetch-related-convention)
  - [Select Related Convention](#select-related-convention)
- [Permission Convention](#permission-convention)
- [Caching Convention](#caching-convention)
  - [Cache Structure](#cache-structure)
  - [Cache Key Convention](#cache-key-convention)
  - [Cache Behaviour](#cache-behaviour)
  - [Cache Invalidation Convention](#cache-invalidation-convention)
  - [Why Cache Invalidation Is Required](#why-cache-invalidation-is-required)
- [Naming Convention](#naming-convention)

## Purpose

This document explains the standard structure for `ListCreateAPIView` endpoints used throughout the backend.

Unless there is a specific reason not to, all list/create endpoints should follow this structure.

This keeps the API:

```text
consistent
predictable
filterable
searchable
easy to maintain
```

## Standard Structure

All list/create views should generally follow this pattern.

```py
class LessonNameListCreateView(generics.ListCreateAPIView):
    queryset = models.LessonName.objects.prefetch_related("subjects")
    serializer_class = lesson_name_serializers.LessonNameSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = [
        "subjects",
        "is_protected",
    ]
    search_fields = ["title"]

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]

    def list(self, request, *args, **kwargs):
        cache_key = f"subject_list:{request.get_full_path()}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        response = super().list(request, *args, **kwargs)

        cache.set(cache_key, response.data, timeout=60 * 60 * 24)

        return response
```

## Purpose Of Each Section

| Section | Purpose |
|---|---|
| `queryset` | Defines the base queryset for the endpoint |
| `serializer_class` | Defines the serializer used for reading and creating data |
| `filter_backends` | Enables filtering and search support |
| `filterset_fields` | Defines exact-match filter fields |
| `search_fields` | Defines searchable text fields |
| `get_permissions()` | Protects create requests while allowing public reads |
| `list with decorator` | Adds Redis caching to the list endpoint |

## Queryset Convention

The queryset should define the default data returned by the endpoint.

Simple querysets:

```py
queryset = models.Subject.objects.all()
```

Use this when:

```text
no related objects are needed
the serializer does not load related data
query optimisation is unnecessary
```

### Prefetch Related Convention

Use `prefetch_related()` when the serializer needs reverse or many-to-many relationships.

Example:

```py
queryset = models.LessonName.objects.prefetch_related("subjects")
```

Use this when:

```text
many-to-many relationships are accessed
reverse relationships are accessed
serializers include nested related data
```

This helps reduce unnecessary database queries.

### Select Related Convention

Use `select_related()` for foreign key relationships.

Example:

```py
queryset = models.LessonVariant.objects.select_related(
    "lesson_name",
    "teaching_style",
    "variation",
    "topic",
    "subject",
    "author",
)
```

Use this when:

```text
the serializer accesses foreign key relationships
related objects are commonly displayed together
```

## Permission Convention

List views should allow public safe methods but restrict create access.

Standard pattern:

```py
def get_permissions(self):
    if self.request.method == "POST":
        return [permissions.IsAdminUser()]
    return [permissions.AllowAny()]
```

This creates:

| Method | Access |
|---|---|
| `GET` | Public |
| `HEAD` | Public |
| `OPTIONS` | Public |
| `POST` | Admin only |

## Caching Convention

List endpoints should use Redis caching to reduce repeated database queries and improve response performance.

Caching is handled manually inside the `list()` method using Django's low-level cache API.

This approach provides explicit control over:

- cache creation
- cache invalidation
- cache keys
- browser caching behaviour

It also avoids browser disk-cache issues caused by `cache_page`.

### Standard List Cache Pattern

```py
from django.core.cache import cache
from rest_framework.response import Response


def list(self, request, *args, **kwargs):
    cache_key = f"subject_list:{request.get_full_path()}"

    cached_data = cache.get(cache_key)

    if cached_data is not None:
        return Response(cached_data)

    response = super().list(request, *args, **kwargs)

    cache.set(
        cache_key,
        response.data,
        timeout=60 * 60 * 24,
    )

    return response
```

### Cache Structure

| Section | Purpose |
|---|---|
| `cache.get()` | Retrieves cached response data |
| `cache.set()` | Stores serialized response data |
| `cache_key` | Unique identifier for cached resource |
| `request.get_full_path()` | Includes query parameters in the cache key |
| `timeout` | Cache duration in seconds |

### Cache Key Convention

Each resource should have its own cache prefix.

Examples:

```text
subject_list
topic_list
lesson_name_list
teaching_style_list
variation_list
```

Cache keys should include the full request path to support pagination, filtering, and searching.

Example generated keys:

```text
subject_list:/core/subjects/?limit=20&offset=0
subject_list:/core/subjects/?search=math
subject_list:/core/subjects/?level=secondary
```

This ensures each query variation stores its own cached response.

### Cache Behaviour

The cache stores the final serialized API response.

This includes:

```text
pagination
filtering
search results
ordering
serialized data
```

Responses are stored in Redis and reused until invalidated or expired.

### Cache Invalidation Convention

When a model is created, updated, or deleted, related cache entries should be invalidated using Django signals.

Example:

```py
from django.core.cache import cache
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver


@receiver([post_save, post_delete], sender=Subject)
def invalidate_subject_cache(sender, instance, **kwargs):
    cache.delete_pattern("*subject_list:*")
```

### Why Cache Invalidation Is Required

Without invalidation:

```text
new records may not appear
updated data may remain outdated
deleted records may still appear
```

Signals ensure cached responses stay synchronised with the database.

## Naming Convention

List/create views should follow this naming pattern:

```text
<ModelName>ListCreateView
```

Examples:

```text
SubjectListCreateView
LessonNameListCreateView
TopicListCreateView
```
