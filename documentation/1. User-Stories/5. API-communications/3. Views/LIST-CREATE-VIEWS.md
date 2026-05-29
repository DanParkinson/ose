# List/Create Views

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Implemented Views](#implemented-views)
- [Generic View Pattern](#generic-view-pattern)
- [Queryset](#queryset)
- [Serializer Class](#serializer-class)
- [Filtering and Search](#filtering-and-search)
- [Permissions](#permissions)
- [List Method Override](#list-method-override)

## Purpose

List/create views provide reusable API behaviour for endpoints that need both:

```text
GET  → list resources
POST → create resources
```

The platform uses Django REST Framework generic views so endpoints can follow consistent structures with minimal repeated logic.

## Implemented Views

| View | Purpose | Implemented |
|---|---|---|
| `SubjectListCreateView` | List and create subjects | :white_check_mark: |

## Generic View Pattern

The platform currently uses:

```py
generics.ListCreateAPIView
```

Example:

```py
class SubjectListCreateView(
    generics.ListCreateAPIView
):
```

This automatically provides:

```text
List behaviour
Create behaviour
Serializer integration
Pagination support
Filtering support
Permission handling
```

## Queryset

The queryset defines which records are available to the view.

Example:

```py
queryset = models.Subject.objects.all()
```

The queryset becomes the base dataset used for:

```text
Filtering
Searching
Pagination
Serialization
```

## Serializer Class

The serializer controls:

```text
Response structure
Validation
Deserialization
```

Example:

```py
serializer_class =
    subject_serializers.SubjectSerializer
```

The serializer is used for both:

```text
GET responses
POST validation
```

## Filtering and Search

List/create views support filtering and search through DRF filter backends.

Example:

```py
filter_backends = [
    DjangoFilterBackend,
    filters.SearchFilter,
]
```

Filtering fields are configured using:

```py
filterset_fields = [...]
```

Search fields are configured using:

```py
search_fields = [...]
```

This allows query parameter filtering and text search support.

## Permissions

Views can dynamically change permissions depending on the request method.

Example:

```py
def get_permissions(self):
    if self.request.method == "POST":
        return [permissions.IsAdminUser()]

    return [permissions.AllowAny()]
```

This allows:

```text
Public read access
Protected write access
Different permissions per method
```

within the same endpoint.

## List Method Override

The subject list/create view overrides the DRF `list()` method to add Redis response caching.

```py
def list(self, request, *args, **kwargs):
    cache_key = f"subject_list:{request.get_full_path()}"

    cached_data = cache.get(cache_key)

    if cached_data is not None:
        return Response(cached_data)

    response = super().list(request, *args, **kwargs)

    cache.set(cache_key, response.data, timeout=60 * 60 * 24)

    return response
```

The override adds custom behaviour around the normal DRF list workflow.

The current implementation uses the override for:

```text
Redis cache lookup
Redis cache storage
Cached response handling
```

while still relying on the default DRF list behaviour for queryset handling, filtering, pagination, and serialization.