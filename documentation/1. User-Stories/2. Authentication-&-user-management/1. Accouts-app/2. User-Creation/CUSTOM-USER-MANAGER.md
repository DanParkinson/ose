# Custom User Manager

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [User Creation](#user-creation)
- [Email Validation](#email-validation)
- [Email Normalisation](#email-normalisation)
- [Password Handling](#password-handling)
- [Superuser Creation](#superuser-creation)
- [Custom User Model Integration](#custom-user-model-integration)

## Purpose

The custom user manager controls how users and superusers are created for the platform.

It supports the email-based authentication system by requiring an email address instead of a username during account creation.

## User Creation

Standard users are created through `create_user()`.

```py
def create_user(self, email, password=None, **extra_fields):
```

This method handles the full user creation workflow:

```text
Validate email exists
Normalise email
Create user instance
Hash password
Save user
Return user
```

This keeps user creation consistent across the application.

## Email Validation

The custom user manager requires every user to have an email address.

```py
if not email:
    raise ValueError("The email field must be set")
```

Because email is the platform's authentication identifier, a user account cannot be created without one.

## Email Normalisation

Before the user is saved, the email address is normalised.

```py
email = self.normalize_email(email)
```

This helps keep stored email addresses consistent.

Example:

```text
USER@EMAIL.COM
    ↓
USER@email.com
```

Django normalises the domain part of the email address.

## Password Handling

Passwords are handled using Django's built-in password hashing.

```py
user.set_password(password)
```

The raw password is never stored directly in the database.

Instead, Django stores a securely hashed version of the password.

## Superuser Creation

Admin users are created through `create_superuser()`.

```py
def create_superuser(self, email, password=None, **extra_fields):
```

The manager automatically sets the required admin flags:

```py
extra_fields.setdefault("is_staff", True)
extra_fields.setdefault("is_superuser", True)
extra_fields.setdefault("is_active", True)
```

This ensures superusers have access to Django admin and full administrative permissions.

The manager also validates these values before creating the account.

```py
if extra_fields.get("is_staff") is not True:
    raise ValueError("Superuser must have is_staff=True.")

if extra_fields.get("is_superuser") is not True:
    raise ValueError("Superuser must have is_superuser=True.")
```

These checks prevent incorrectly configured superuser accounts from being created.

### Automatic Email Verification

Superuser accounts are automatically marked as verified when they are created.

After the user account is created:

```py
EmailAddress.objects.update_or_create(
    user=user,
    email=user.email,
    defaults={
        "verified": True,
        "primary": True,
    },
)
```

This creates or updates the associated Allauth `EmailAddress` record and marks the email address as:

```text
Verified
Primary
```

This ensures superuser accounts can immediately access authentication-protected areas of the platform without completing the normal email verification workflow.

Because superusers are created directly by platform administrators, requiring email verification would provide no additional security benefit while adding unnecessary setup steps.

## Custom User Model Integration

The custom user model uses this manager through the `objects` property.

```py
objects = CustomUserManager()
```

This ensures all user creation workflows use the platform's email-based user creation logic.

The custom user manager therefore acts as the creation layer for the custom user model.
