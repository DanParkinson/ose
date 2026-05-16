# Testing

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Purpose

This document tracks the testing strategy for the backend application.

It explains:
- what has been tested
- what still needs testing
- how tests are organised
- how to run the test suite

## Testing Tools

| Tool | Purpose |
|---|---|
| Django Test Framework | Core backend testing framework |
| Django REST Framework APITestCase | API endpoint testing |
| unittest.mock | Mocking and patching signal behaviour |
| Coverage.py | Test coverage reporting |

## Test Organisation

```text
core/
  tests/
    base.py
    test_subject_views.py
    test_topic_views.py
    test_lesson_name_views.py
    test_signals.py
```

## Testing Pattern

Tests should follow:

```text
Arrange
Act
Assert
```

| Step | Purpose |
|---|---|
| Arrange | Set up test data, authentication, and mocks |
| Act | Perform the API request or model action |
| Assert | Verify the expected response or behaviour |

# Running Tests

## Run Entire Test Suite

```bash
python manage.py test
```

## Run Core Tests

```bash
python manage.py test core.tests
```

## Run Specific Test File

```bash
python manage.py test core.tests.test_subject_views
```

## Run With Coverage

```bash
coverage run manage.py test
coverage report
```

## Test Overview Files

### Accounts

#### Models

| Test Area | Overview File |
|---|---|
| Custom User Manager  | [Test Overview](./accounts/models/CUSTOM_USER_MANAGER.md) |
| Custom User          | [Test Overview](./accounts/models/CUSTOM_USER_MODEL.md) |

#### Serializers

| Test Area | Overview File |
|---|---|
| Register Serializer  | [Test Overview](./accounts/serializers/REGISTER_SERIALIZER.md) |

#### Views

| Test Area | Overview File |
|---|---|
| Account Deactivation | [Test Overview](./accounts/views/ACCOUNT_DEACTIVATE.md) |
| Reactivation confirm | [Test Overview](./accounts/views/REACTIVATION_CONFIRM.md) |
| Reactivation Request | [Test Overview](./accounts/views/REACTIVATION_REQUEST.md) |

### Core

#### Models

| Test Area | Overview File |
|---|---|
| Core Models | [Test Overview](./core/models/CORE_MODELS.md) |

#### Serailizers

No current need for serializer testing in core

#### Views

| Test Area | Overview File |
|---|---|
| List/Create API Views | [Test Overview](./core/views/LIST_CREATE_VIEWS.md) |

#### Signals

| Test Area | Overview File |
|---|---|
| Cache Invalidation Signals | [Test Overview](./core/signals/SIGNALS.md) |

## Testing Principles

```text
Backend tests should prioritise:

- predictable API behaviour
- consistent response structures
- authentication and permission validation
- serializer validation
- business rule enforcement
- relationship integrity
- cache invalidation behaviour
- reusable testing patterns
```

## Notes

```text
The backend test suite is intentionally designed around reusable
patterns because the core API structure is highly standardised.

The detailed test coverage is split across two overview files:

- LIST_CREATE_VIEWS.md documents endpoint behaviour tests.
- SIGNALS.md documents cache invalidation signal tests.

Most ListCreateAPIView endpoints follow the same implementation
pattern, allowing tests and documentation structures to remain
consistent across models.
```
