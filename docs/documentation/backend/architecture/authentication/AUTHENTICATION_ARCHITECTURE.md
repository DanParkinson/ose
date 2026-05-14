# Registration and Authentication

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Authentication Stack](#authentication-stack)
- [Authentication Architecture](#authentication-architecture)

- [JWT Cookie Authentication](#jwt-cookie-authentication)
  - [REST Framework Authentication](#rest-framework-authentication)
  - [REST_AUTH Configuration](#rest_auth-configuration)
  - [SimpleJWT Configuration](#simplejwt-configuration)
  - [Access And Refresh Tokens](#access-and-refresh-tokens)
  - [Token Rotation And Blacklisting](#token-rotation-and-blacklisting)

- [Registration Configuration](#registration-configuration)
  - [Username Removal](#username-removal)
  - [Email Authentication](#email-authentication)
  - [Signup Fields](#signup-fields)
  - [Email Verification](#email-verification)

- [Custom Registration Serializer](#custom-registration-serializer)
  - [Email Validation](#email-validation)

- [Custom User Details Serializer](#custom-user-details-serializer)
  - [Frontend Authentication State](#frontend-authentication-state)

- [Frontend Integration](#frontend-integration)
  - [CORS Configuration](#cors-configuration)
  - [CSRF Trusted Origins](#csrf-trusted-origins)
  - [Frontend Authentication Flow](#frontend-authentication-flow)

- [Development Email Configuration](#development-email-configuration)
- [Authentication Philosophy](#authentication-philosophy)
- [Key Principle](#key-principle)

## Purpose

This document explains the registration and authentication architecture used throughout the platform.

The authentication system is built using:

```text
Django REST Framework
dj-rest-auth
django-allauth
SimpleJWT
JWT cookie authentication
```

The platform uses email-based authentication instead of username-based authentication.

## Authentication Stack

The backend authentication system uses the following applications:

```py
INSTALLED_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",

    "dj_rest_auth",
    "dj_rest_auth.registration",

    "allauth",
    "allauth.account",
    "allauth.socialaccount",
]
```

## Authentication Architecture

The authentication system is designed around:

```text
email authentication
JWT cookies
frontend-controlled authentication state
backend-managed token validation
```

The frontend communicates with the backend using authenticated API requests.

The backend validates authentication using JWT cookies automatically.

## JWT Cookie Authentication

### REST Framework Authentication

The backend configures DRF authentication using:

```py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
}
```

This enables JWT cookie authentication for authenticated API requests.

### REST_AUTH Configuration

The backend configures dj-rest-auth using:

```py
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access",
    "JWT_AUTH_REFRESH_COOKIE": "refresh",
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_SECURE": False,
    "JWT_AUTH_SAMESITE": "Lax",
    "JWT_AUTH_RETURN_EXPIRATION": True,
    "TOKEN_MODEL": None,
}
```

### SimpleJWT Configuration

The backend configures JWT behaviour using:

```py
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}
```

### Access And Refresh Tokens

The authentication system uses two JWT cookies.

| Cookie | Purpose |
|---|---|
| `access` | Short-lived authentication token |
| `refresh` | Long-lived refresh token |

The frontend does not directly manage token storage.

Cookies are automatically included in authenticated requests.

### Token Rotation And Blacklisting

```py
"ROTATE_REFRESH_TOKENS": True,
"BLACKLIST_AFTER_ROTATION": True,
```

When refresh tokens are used:

```text
a new refresh token is issued
the previous refresh token is invalidated
```

This improves authentication security.

## Registration Configuration

### Username Removal

The platform removes username authentication.

```py
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
```

Users authenticate using:

```text
email
password
```

instead of usernames.

### Email Authentication

The backend configures allauth to use email authentication.

```py
ACCOUNT_LOGIN_METHODS = {"email"}
```

The platform intentionally uses:

```text
email-first authentication
```

throughout the application.

### Signup Fields

The backend defines the registration fields using:

```py
ACCOUNT_SIGNUP_FIELDS = [
    "email*",
    "password1*",
    "password2*"
]
```

Required registration fields:

| Field | Purpose |
|---|---|
| `email` | Authentication identity |
| `password1` | Password |
| `password2` | Password confirmation |

### Email Verification

The backend currently disables email verification.

```py
ACCOUNT_EMAIL_VERIFICATION = "none"
```

This simplifies development authentication workflows.

## Custom Registration Serializer

The platform customizes registration behaviour using:

```py
class CustomRegisterSerializer(RegisterSerializer):
    username = None

    def validate_email(self, email):
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "A user with this email address already exists."
            )

        return email
```

### Email Validation

The serializer validates email uniqueness.

```py
if User.objects.filter(email=email).exists():
```

Duplicate registration attempts return a validation error instead of creating duplicate accounts.

## Custom User Details Serializer

Authenticated user data is exposed using:

```py
class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "is_staff",
            "is_superuser",
        ]
```

## Frontend Authentication State

The serializer provides the frontend with:

| Field | Purpose |
|---|---|
| `id` | User identifier |
| `email` | Authenticated user email |
| `is_staff` | Admin dashboard access |
| `is_superuser` | Superuser access checks |

This supports:

```text
authentication state management
admin-only UI rendering
permission-based frontend behaviour
```

## Frontend Integration

### CORS Configuration

The backend allows frontend authentication requests using:

```py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True
```

This allows JWT cookies to be sent between the frontend and backend during development.

### CSRF Trusted Origins

The backend trusts the frontend origin using:

```py
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]
```

This allows authenticated frontend requests to pass CSRF validation.

### Frontend Authentication Flow

High-level frontend authentication workflow:

```text
frontend sends login request
    ↓
backend validates credentials
    ↓
JWT cookies are issued
    ↓
frontend sends authenticated requests
    ↓
backend validates JWT cookies
    ↓
authenticated API response returns
```

## Development Email Configuration

The backend currently uses Django’s console email backend.

```py
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
```

Emails are printed to the terminal instead of being sent through a real email provider.

This is primarily used during development.

## Authentication Philosophy

The authentication system is designed around:

```text
email-first authentication
JWT cookie security
minimal frontend token handling
simple registration workflows
DRF-compatible authentication
```

The goal is to keep authentication predictable while reducing unnecessary account complexity.

# Key Principle
