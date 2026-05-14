# Custom User Model

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Custom User Manager](#custom-user-manager)
  - [create_user()](#create_user)
  - [Email Validation](#email-validation)
  - [Email Normalization](#email-normalization)
  - [Password Hashing](#password-hashing)
- [create_superuser()](#create_superuser)
  - [Default Superuser Fields](#default-superuser-fields)
  - [Superuser Validation](#superuser-validation)
- [Custom User Model](#custom-user-model)
  - [Removing Username Authentication](#removing-username-authentication)
  - [Email Field](#email-field)
  - [USERNAME_FIELD](#username_field)
  - [REQUIRED_FIELDS](#required_fields)
  - [Custom User Manager Integration](#custom-user-manager-integration)
- [Account Deactivation Support](#account-deactivation-support)
  - [String Representation](#string-representation)
- [Settings Integration](#settings-integration)
- [Authentication Philosophy](#authentication-philosophy)

## Purpose

This document explains the custom user model used throughout the platform.

The platform replaces Django’s default username-based authentication system with an email-based authentication system.

The custom user model is responsible for:

```text
email authentication
user creation
superuser creation
password handling
account activation state
```

## Custom User Manager

The platform uses a custom user manager.

```py
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The email field must be set")

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(
            email=email,
            password=password,
            **extra_fields
        )
```

### create_user()

```py
def create_user(self, email, password=None, **extra_fields):
```

This method handles standard user creation.

The workflow:

```text
validate email exists
normalize email
create user instance
hash password
save user
return user
```

### Email Validation

```py
if not email:
    raise ValueError("The email field must be set")
```

The platform requires email-based authentication.

A user cannot exist without an email address.

### Email Normalization

```py
email = self.normalize_email(email)
```

This normalizes email addresses before saving them.

Example:

```text
USER@EMAIL.COM
    ↓
user@email.com
```

This helps maintain consistent email storage.

### Password Hashing

```py
user.set_password(password)
```

Passwords are never stored directly.

Django hashes the password securely before saving the user.

## create_superuser()

```py
def create_superuser(self, email, password=None, **extra_fields):
```

This method handles Django superuser creation.

The manager automatically enables:

```text
staff access
superuser permissions
active account state
```

### Default Superuser Fields

```py
extra_fields.setdefault("is_staff", True)
extra_fields.setdefault("is_superuser", True)
extra_fields.setdefault("is_active", True)
```

These values ensure the created account has full admin access.

### Superuser Validation

```py
if extra_fields.get("is_staff") is not True:
    raise ValueError("Superuser must have is_staff=True.")
```

```py
if extra_fields.get("is_superuser") is not True:
    raise ValueError("Superuser must have is_superuser=True.")
```

These checks prevent incorrectly configured superusers from being created.

## Custom User Model

The platform uses a custom user model instead of Django’s default user model.

```py
class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    deactivated_at = models.DateTimeField(null=True, blank=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
```

### Removing Username Authentication

```py
username = None
```

The platform intentionally removes username authentication.

Users authenticate only through:

```text
email
password
```

### Email Field

```py
email = models.EmailField(unique=True)
```

The email field is unique across all users.

This ensures:

```text
one account per email address
stable authentication identity
```

### USERNAME_FIELD

```py
USERNAME_FIELD = "email"
```

This tells Django to use email as the authentication identifier.

The authentication system no longer uses usernames.

### REQUIRED_FIELDS

```py
REQUIRED_FIELDS = []
```

No additional required fields are needed during user or superuser creation.

The platform only requires:

```text
email
password
```

### Custom User Manager Integration

```py
objects = CustomUserManager()
```

This connects the model to the custom user manager.

All user creation workflows will now use the custom email-based logic.

## Account Deactivation Support

```py
deactivated_at = models.DateTimeField(null=True, blank=True)
```

This field supports account deactivation workflows.

The platform stores:

```text
when an account was deactivated
```

instead of permanently deleting user accounts.

### String Representation

```py
def __str__(self):
    return self.email
```

The model uses the email address as its string representation.

This improves:

```text
admin readability
debugging
logging
```

## Settings Integration

The backend activates the custom user model using:

```py
AUTH_USER_MODEL = "accounts.CustomUser"
```

This ensures the entire authentication system uses the custom user model.

## Authentication Philosophy

The custom user model is designed around:

```text
email-first authentication
minimal account complexity
JWT compatibility
simple frontend authentication workflows
```
