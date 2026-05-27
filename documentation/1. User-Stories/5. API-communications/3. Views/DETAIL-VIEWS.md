# Detail Views

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Implemented Views](#implemented-views)
- [Generic View Pattern](#generic-view-pattern)
- [Queryset](#queryset)
- [Serializer Class](#serializer-class)
- [Permissions](#permissions)
- [Object Lookup](#object-lookup)
- [Update Protection](#update-protection)
- [Delete Protection](#delete-protection)

## Purpose

Detail views provide API behaviour for endpoints that need to retrieve, update, or delete a single resource.

The platform uses Django REST Framework generic views so detail endpoints can follow consistent structures with minimal repeated logic.

## Implemented Views

| View | Purpose | Implemented |
|---|---|---|
| `SubjectDetailView` | Retrieve, update, and delete individual subjects | :white_check_mark: |

## Generic View Pattern

The platform currently uses:

```py
generics.RetrieveUpdateDestroyAPIView
```

Example:

```py
class SubjectDetailView(
    generics.RetrieveUpdateDestroyAPIView
):
```

This automatically provides:

```text
Retrieve behaviour
Update behaviour
Partial update behaviour
Delete behaviour
Serializer integration
Permission handling
```

## Queryset

The queryset defines which records are available to the detail view.

Example:

```py
queryset = models.Subject.objects.all()
```

The queryset becomes the base dataset used when retrieving the requested object.

## Serializer Class

The serializer controls:

```text
Response structure
Update validation
Deserialization
```

Example:

```py
serializer_class =
    subject_serializers.SubjectSerializer
```

The serializer is used for:

```text
GET detail responses
PUT update validation
PATCH partial update validation
```

## Permissions

The detail view currently restricts all access to admin users.

```py
def get_permissions(self):
    return [permissions.IsAdminUser()]
```

This means:

| Method | Access |
|---|---|
| `GET` | Admin only |
| `PUT` | Admin only |
| `PATCH` | Admin only |
| `DELETE` | Admin only |

## Object Lookup

The detail view retrieves objects using the UUID value from the URL.

```py
def get_object(self):
    queryset = self.get_queryset()
    subject_id = self.kwargs.get("subject_id")
    return get_object_or_404(
        queryset,
        subject_id=subject_id
    )
```

The URL provides:

```text
subject_id
```

The backend uses this value to find the matching subject.

If no matching subject exists, a `404 Not Found` response is returned.

## Update Protection

The update method is overridden to prevent protected records from being updated.

```py
def update(self, request, *args, **kwargs):
    instance = self.get_object()

    if instance.is_protected:
        return Response(
            {
                "detail":
                    "This Subject is protected and cannot be updated. Contact Admin"
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    return super().update(request, *args, **kwargs)
```

If the record is protected, the update request is rejected with:

```text
HTTP 403 Forbidden
```

If the record is not protected, the normal DRF update behaviour runs.

## Delete Protection

The destroy method is overridden to prevent protected records from being deleted.

```py
def destroy(self, request, *args, **kwargs):
    instance = self.get_object()

    if instance.is_protected:
        return Response(
            {
                "detail":
                    "This Subject cannot be deleted. Contact Admin"
            },
            status=status.HTTP_403_FORBIDDEN,
        )

    self.perform_destroy(instance)
    return Response(status=status.HTTP_204_NO_CONTENT)
```

If the record is protected, the delete request is rejected with:

```text
HTTP 403 Forbidden
```

If the record is not protected, the object is deleted and the endpoint returns:

```text
HTTP 204 No Content
```