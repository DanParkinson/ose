# API List/Create Serializers

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Standard Serializer Pattern](#standard-serializer-pattern)
- [Standard Serializer Structure](#standard-serializer-structure)
- [Field Convention](#field-convention)
- [Read-Only Field Convention](#read-only-field-convention)
- [UUID Field Convention](#uuid-field-convention)
- [Slug Convention](#slug-convention)
- [Relationship Field Convention](#relationship-field-convention)
- [Many-To-Many Convention](#many-to-many-convention)
- [Response Representation Convention](#response-representation-convention)
  - [Why The Representation Pattern Is Used](#why-the-representation-pattern-is-used)
- [Naming Convention](#naming-convention)

## Purpose

This document explains the standard serializer conventions used for list/create API endpoints.

These serializers are primarily used by:

```text
ListCreateAPIView
RetrieveUpdateDestroyAPIView
```

They are responsible for:

```text
serializing database records
validating incoming request data
controlling writable fields
controlling read-only fields
shaping API responses
```

Unless a resource requires specialised behaviour, serializers should follow these conventions.

## Standard Serializer Pattern

Most serializers should inherit from:

```py
serializers.ModelSerializer
```

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

## Standard Serializer Structure

Most serializers should contain:

| Section | Purpose |
|---|---|
| `model` | Defines which model the serializer represents |
| `fields` | Defines which fields appear in the API |
| `read_only_fields` | Prevents frontend modification of protected/generated fields |

## Field Convention

Serializers should explicitly declare fields.

Example:

```py
fields = [
    "subject_id",
    "title",
    "slug",
    "level",
    "language",
    "is_published",
    "is_protected",
]
```

Avoid using:

```py
fields = "__all__"
```

Explicit field definitions make the API:

```text
safer
clearer
more predictable
easier to maintain
```

## Read-Only Field Convention

Automatically generated or protected fields should use:

```py
read_only_fields = []
```

Example:

```py
read_only_fields = ["subject_id", "slug"]
```

Use read-only fields for:

```text
UUID identifiers
generated slugs
system-managed values
protected metadata
```

This prevents the frontend from modifying values controlled by the backend.

## UUID Field Convention

Models commonly use UUID primary keys.

Example:

```py
subject_id
topic_id
lesson_name_id
```

These identifiers should normally be:

```text
included in serializer responses
marked as read-only
```

This allows the frontend to:

```text
identify records
build URLs
send filter values
manage selections
```

without allowing direct modification.

## Slug Convention

Slugs are commonly exposed in serializers.

Example:

```py
"slug"
```

Slugs are usually:

```text
generated automatically by the model
used in frontend URLs
included in API responses
read-only
```

## Relationship Field Convention

Relationships should usually use:

```py
serializers.PrimaryKeyRelatedField
```

Example:

```py
subjects = serializers.PrimaryKeyRelatedField(
    many=True,
    queryset=models.Subject.objects.all()
)
```

This allows the frontend to submit related object UUIDs during create and update requests.

Example request:

```json
{
  "subjects": [
    "uuid-1",
    "uuid-2"
  ]
}
```

## Many-To-Many Convention

Many-to-many relationships should generally follow this structure:

```py
subjects = serializers.PrimaryKeyRelatedField(
    many=True,
    queryset=models.Subject.objects.all()
)
```

This keeps write operations simple while still allowing related objects to be attached.

## Response Representation Convention

Some serializers override:

```py
to_representation()
```

This is used when the frontend needs richer nested output than the write structure.

Example:

```py
def to_representation(self, instance):
    data = super().to_representation(instance)

    data["subjects"] = [
        {
            "subject_id": str(subject.subject_id),
            "title": subject.title,
            "level": subject.level,
            "language": subject.language,
        }
        for subject in instance.subjects.all()
    ]

    return data
```

This creates a split between:

| Operation | Structure |
|---|---|
| Write requests | UUID relationships |
| Read responses | Expanded nested object data |

### Why The Representation Pattern Is Used

The frontend often needs:

```text
display-ready related data
```

instead of only UUID values.

Without `to_representation()`:

```json
{
  "subjects": [
    "uuid-1",
    "uuid-2"
  ]
}
```

With `to_representation()`:

```json
{
  "subjects": [
    {
      "subject_id": "uuid-1",
      "title": "Mathematics",
      "level": "secondary",
      "language": "en"
    }
  ]
}
```

This reduces additional frontend lookup requests.

## Naming Convention

Serializers should follow this naming pattern:

```text
<ModelName>Serializer
```

Examples:

```text
SubjectSerializer
TopicSerializer
LessonNameSerializer
VariationSerializer
```
