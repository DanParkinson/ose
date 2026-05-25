# Account Deactivation

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Purpose](#purpose)

- [Account Deactivation Flow](#account-deactivation-flow)
  - [IsAuthenticated Permission](#isauthenticated-permission)
  - [Deactivation Logic](#deactivation-logic)
  - [Saving Updated Fields](#saving-updated-fields)
  - [JWT Cookie Removal](#jwt-cookie-removal)
  - [Deactivation Response](#deactivation-response)

- [Reactivation Request Flow](#reactivation-request-flow)
  - [AllowAny Permission](#allowany-permission)
  - [Email Lookup](#email-lookup)
  - [UID Generation](#uid-generation)
  - [Token Generation](#token-generation)
  - [Reactivation URL](#reactivation-url)
  - [Email Sending](#email-sending)
  - [Silent Failure Convention](#silent-failure-convention)

- [Reactivation Confirmation Flow](#reactivation-confirmation-flow)
  - [UID Decoding](#uid-decoding)
  - [User Validation](#user-validation)
  - [Invalid Link Handling](#invalid-link-handling)
  - [Token Validation](#token-validation)
  - [Reactivation Logic](#reactivation-logic)
  - [Reactivation Response](#reactivation-response)
  - [URL Configuration](#url-configuration)

- [Authentication Philosophy](#authentication-philosophy)

## Purpose

This document explains the account deactivation and reactivation workflow used throughout the platform.

The platform supports:

```text
account deactivation
reactivation requests
secure account reactivation
```

Accounts are not permanently deleted.

Instead, accounts are marked as inactive and can later be restored through a token-based reactivation process.

## Account Deactivation Flow

The platform allows authenticated users to deactivate their own account.

The deactivation endpoint uses:

```py
class AccountDeactivateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user.is_active = False
        user.deactivated_at = timezone.now()
        user.save(update_fields=["is_active", "deactivated_at"])

        response = Response(
            {"detail": "Account deactivated successfully."},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access")
        response.delete_cookie("refresh")

        return response
```

### IsAuthenticated Permission

```py
permission_classes = [IsAuthenticated]
```

Only authenticated users can deactivate an account.

The endpoint always operates on:

```py
request.user
```

This prevents users from attempting to deactivate other accounts.

### Deactivation Logic

```py
user.is_active = False
user.deactivated_at = timezone.now()
```

The account is not deleted.

Instead:

| Field | Purpose |
|---|---|
| `is_active=False` | Prevents authentication |
| `deactivated_at` | Stores the deactivation timestamp |

This creates a soft-deletion style workflow.

### Saving Updated Fields

```py
user.save(update_fields=["is_active", "deactivated_at"])
```

Only the modified fields are updated in the database.

This keeps the update operation smaller and more explicit.

### JWT Cookie Removal

```py
response.delete_cookie("access")
response.delete_cookie("refresh")
```

After deactivation:

```text
access token cookie is removed
refresh token cookie is removed
```

This immediately logs the user out on the frontend.

### Deactivation Response

```py
return response
```

The endpoint returns:

```json
{
  "detail": "Account deactivated successfully."
}
```

with:

```text
HTTP 200 OK
```

## Reactivation Request Flow

The platform allows users to request account reactivation through email.

The reactivation request endpoint uses:

```py
class ReactivationRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if email:
            try:
                user = User.objects.get(
                    email=email,
                    is_active=False
                )

                uid = urlsafe_base64_encode(
                    force_bytes(user.pk)
                )

                token = default_token_generator.make_token(user)

                reactivation_url = (
                    f"http://localhost:5173/reactivate-account/{uid}/{token}/"
                )

                send_mail(
                    subject="Reactivate your account",
                    message="...",
                    from_email="webmaster@localhost",
                    recipient_list=[user.email],
                )

            except User.DoesNotExist:
                pass

        return Response(
            {
                "detail": (
                    "If a deactivated account exists "
                    "with that email, a reactivation link has been sent."
                )
            },
            status=status.HTTP_200_OK,
        )
```

### AllowAny Permission

```py
permission_classes = [AllowAny]
```

Users do not need to be authenticated to request account reactivation.

This is necessary because deactivated users can no longer log in.

### Email Lookup

```py
user = User.objects.get(
    email=email,
    is_active=False
)
```

The endpoint only attempts reactivation for:

```text
existing accounts
inactive accounts
```

Active accounts are ignored.

### UID Generation

```py
uid = urlsafe_base64_encode(force_bytes(user.pk))
```

The user ID is encoded into a URL-safe value.

This allows the frontend reactivation URL to identify the user securely.

### Token Generation

```py
token = default_token_generator.make_token(user)
```

Django’s built-in token generator creates a secure temporary token.

The token is later used to verify the reactivation request.

### Reactivation URL

```py
reactivation_url = (
    f"http://localhost:5173/reactivate-account/{uid}/{token}/"
)
```

The backend generates a frontend URL containing:

```text
encoded user ID
secure token
```

The frontend then sends these values back to the backend for confirmation.

### Email Sending

```py
send_mail(
    subject="Reactivate your account",
    message="...",
    from_email="webmaster@localhost",
    recipient_list=[user.email],
)
```

The backend sends the reactivation link through email.

This ensures only users with access to the email account can reactivate the account.

### Silent Failure Convention

```py
except User.DoesNotExist:
    pass
```

The endpoint intentionally avoids exposing whether an email exists.

This prevents account enumeration attacks.

The response remains the same even if:

```text
the account does not exist
the account is already active
```

## Reactivation Confirmation Flow

The platform confirms account reactivation through a token validation endpoint.

```py
class ReactivationConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get("uid")
        token = request.data.get("token")

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(
                pk=user_id,
                is_active=False
            )

        except (User.DoesNotExist, ValueError, TypeError):
            return Response(
                {"detail": "Invalid reactivation link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reactivation link."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.is_active = True
        user.deactivated_at = None

        user.save(update_fields=[
            "is_active",
            "deactivated_at"
        ])

        return Response(
            {"detail": "Account reactivated successfully."},
            status=status.HTTP_200_OK,
        )
```

### UID Decoding

```py
user_id = force_str(urlsafe_base64_decode(uid))
```

The encoded UID is decoded back into the user’s database ID.

### User Validation

```py
user = User.objects.get(
    pk=user_id,
    is_active=False
)
```

The backend confirms:

```text
the user exists
the account is inactive
```

before continuing.

### Invalid Link Handling

```py
except (User.DoesNotExist, ValueError, TypeError):
```

Invalid reactivation requests return:

```json
{
  "detail": "Invalid reactivation link."
}
```

with:

```text
HTTP 400 Bad Request
```

### Token Validation

```py
default_token_generator.check_token(user, token)
```

The backend validates:

```text
token authenticity
token expiration
token-user relationship
```

Invalid or expired tokens are rejected.

### Reactivation Logic

```py
user.is_active = True
user.deactivated_at = None
```

Successful reactivation:

```text
reactivates the account
clears the deactivation timestamp
```

### Reactivation Response

Successful reactivation returns:

```json
{
  "detail": "Account reactivated successfully."
}
```

with:

```text
HTTP 200 OK
```

### URL Configuration

The accounts app exposes the following account lifecycle routes:

```py
urlpatterns = [
    path(
        "account/deactivate/",
        AccountDeactivateView.as_view()
    ),

    path(
        "account/reactivate/request/",
        ReactivationRequestView.as_view()
    ),

    path(
        "account/reactivate/confirm/",
        ReactivationConfirmView.as_view()
    ),
]
```

## Authentication Philosophy

The account lifecycle system is designed around:

```text
soft account deletion
secure token-based recovery
email ownership verification
frontend-controlled account recovery
```

The platform avoids permanently deleting user accounts unless explicitly required.
