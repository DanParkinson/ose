# Email Authentication

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Authentication Identifier](#authentication-identifier)
- [User Creation](#user-creation)
- [Registration Validation](#registration-validation)
- [Authentication Integration](#authentication-integration)
- [Frontend Relationship](#frontend-relationship)

## Purpose

The platform uses email-based authentication instead of Django's default username-based authentication.

This simplifies account management by providing a single authentication identifier for all users and removes the need to manage usernames throughout the application.

## Authentication Identifier

Users authenticate using:

```text
Email Address
Password
```

The default Django `username` field is removed from the custom user model and email becomes the primary authentication field.

```py
username = None
email = models.EmailField(unique=True)

USERNAME_FIELD = "email"
REQUIRED_FIELDS = []
```

This ensures every account is uniquely identified by its email address.

## Authentication Configuration

The authentication system is configured to use email-only authentication.

```py
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_LOGIN_METHODS = {"email"}
```

User registration requires:

```text
Email Address
Password
Password Confirmation
```

No username field is collected or stored during registration.

## User Creation

All user creation is handled through the custom user manager.

The manager requires an email address when creating users and normalises email values before saving them to the database.

```py
email = self.normalize_email(email)
```

This helps maintain consistent account data and prevents duplicate accounts caused by email formatting differences.

Superusers are also created using email-based authentication and must always have the required administrative permissions.

## Registration Validation

Registration is customised through a custom registration serializer.

Before creating a new account, the serializer verifies that the supplied email address is not already in use.

```py
if User.objects.filter(email=email).exists():
    raise serializers.ValidationError(
        "A user with this email address already exists."
    )
```

This ensures each email address can only be associated with a single account.

## Authentication Integration

The email authentication system integrates with:

```text
Django Authentication
django-allauth
dj-rest-auth
JWT Cookie Authentication
```

All authentication workflows operate through the custom user model and use email as the authentication identifier.



## Frontend Relationship

The frontend does not communicate directly with the user model.

Authenticated user information is exposed through serializers and authentication endpoints.

The frontend uses this information to:

```text
Determine authentication state
Control protected route access
Display user information
Support permission-based rendering
```