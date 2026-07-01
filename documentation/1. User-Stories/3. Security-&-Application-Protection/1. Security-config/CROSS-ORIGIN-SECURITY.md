# Cross-Origin Security

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Cross-Origin Resource Sharing (CORS)](#cross-origin-resource-sharing-cors)
- [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)

## Purpose

The frontend and backend are deployed on separate origins, requiring additional browser security configuration before they can communicate securely.

Cross-origin security is implemented using Cross-Origin Resource Sharing (CORS) and Cross-Site Request Forgery (CSRF) protection. Together, these ensure that only trusted frontend applications can communicate with the API while supporting secure cookie-based authentication.

---

## Cross-Origin Resource Sharing (CORS)

CORS defines which frontend applications are permitted to access the backend API.

Allowed origins are configured using:

```python
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "",
).split(",")

CORS_ALLOW_CREDENTIALS = True
```

Enabling credentials allows JWT authentication cookies to be included with API requests, supporting secure authentication between the React frontend and Django backend.

---

## Cross-Site Request Forgery (CSRF)

CSRF protection helps ensure authenticated requests originate from trusted frontend applications.

Trusted origins are configured using:

```python
CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "",
).split(",")
```

Because authentication uses JWT cookies, browsers automatically include authentication cookies with requests. Restricting trusted origins helps prevent unauthorised websites from performing authenticated actions on behalf of users.
