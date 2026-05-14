# Core Model Test Overview

## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/backend/testing/TESTING_OVERVIEW.md)

## Legend

| Symbol | Meaning |
|---------|---------|
| ✅      | Test implemented |
| ❌      | Test not implemented |
| ➖      | Not required for this model |

## Field / Save Behaviour

| Test Case                                      | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Slug is generated automatically on create      | ✅      | ✅    | ✅          | ✅        | ✅             |

## Model Meta

| Test Case                                           | Subject | Topic | Lesson Name | Variation | Teaching Style |
|-----------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Objects are ordered by title                        | ✅      | ✅    | ✅          | ✅        | ✅             |
| Duplicate title is not allowed                      | ➖      | ✅    | ✅          | ✅        | ✅             |
| Duplicate title, level, and language is not allowed | ✅      | ➖    | ➖          | ➖        | ➖             |
| Same title with different level is allowed          | ✅      | ➖    | ➖          | ➖        | ➖             |

## Relationships

| Test Case                                      | Subject | Topic | Lesson Name | Variation | Teaching Style |
|------------------------------------------------|---------|-------|-------------|-----------|----------------|
| Object can be assigned to one subject          | ➖      | ✅    | ✅          | ➖        | ➖             |
| Object can be assigned to multiple subjects    | ➖      | ✅    | ✅          | ➖        | ➖             |

# Notes

```text
These tests cover the core model-level business rules used by the
education content models.

The tests intentionally focus on custom model behaviour rather than
Django internals.

The main behaviours covered are:

- automatic slug generation
- default model ordering
- database-level uniqueness constraints
- many-to-many subject relationships where applicable

Subject uses a compound uniqueness rule based on title, level, and
language. This allows the same subject title to exist across different
levels while preventing duplicate title, level, and language
combinations.

Topic and LessonName include many-to-many relationships with Subject,
so their model tests also confirm that objects can be linked to one or
more subjects.

Variation and TeachingStyle follow a simpler model structure. They do
not contain subject relationships, so relationship tests are not
required for those models.

Serializer and view behaviour is documented separately because these
model tests are only responsible for validating model-level rules.
```
