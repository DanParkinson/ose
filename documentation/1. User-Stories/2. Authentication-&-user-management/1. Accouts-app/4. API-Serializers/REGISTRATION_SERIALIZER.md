# Registration Serializer

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Registration Configuration](#registration-configuration)
- [Username Removal](#username-removal)
- [Signup Fields](#signup-fields)
- [Email Verification](#email-verification)
- [Custom Registration Serializer](#custom-registration-serializer)
- [Email Validation](#email-validation)

## Purpose

The registration serializer customises how new users register with the platform.

It supports the platform's email-based authentication system by removing username registration and validating that each email address is unique.

## Registration Configuration

Registration is configured through Django Allauth and dj-rest-auth settings.

The platform uses email and password fields for account creation.

```py
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
```

This means users register with:

```text
Email Address
Password
Password Confirmation
```

## Username Removal

The registration serializer removes username-based registration.

```py
class CustomRegisterSerializer(RegisterSerializer):
    username = None
```

This keeps registration aligned with the custom user model, which uses email as the authentication identifier.

## Signup Fields

The required signup fields are:

| Field | Purpose |
|---|---|
| `email` | Unique authentication identifier |
| `password1` | Account password |
| `password2` | Password confirmation |

No username field is collected during registration.

## Email Verification

Email verification is currently disabled.

```py
ACCOUNT_EMAIL_VERIFICATION = "none"
```

This keeps the development registration flow simple.

Email verification can be enabled later for production if required.

## Custom Registration Serializer

The custom registration serializer extends dj-rest-auth's default registration serializer.

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

The serializer is registered in `REST_AUTH`.

```py
REST_AUTH = {
    "REGISTER_SERIALIZER": "accounts.api.serializers.CustomRegisterSerializer",
}
```

## Email Validation

The serializer checks whether the submitted email address is already linked to an existing account.

```py
if User.objects.filter(email=email).exists():
```

If the email already exists, registration is rejected with a validation error.

This prevents duplicate accounts from being created with the same email address.