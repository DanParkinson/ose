# Authentication

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Authentication Flow](#authentication-flow)
- [Supporting Documentation](#supporting-documentation)
- [Authentication Endpoints](#authentication-endpoints)
- [Password Management Endpoints](#password-management-endpoints)
- [Account Management Endpoints](#account-management-endpoints)
- [Notes](#notes)
- [Frontend Requirement](#frontend-requirement)
- [Related Packages](#related-packages)

## Introduction

Authentication is handled using:

- dj-rest-auth
- SimpleJWT
- HTTP-only JWT cookies

The frontend does not manually store access or refresh tokens.

Authentication state is determined using:

```txt
/api/auth/user/
```

## Authentication Flow

1. User submits login credentials
2. Backend validates credentials
3. JWT cookies are set automatically
4. Frontend requests authenticated user data
5. Browser automatically sends authentication cookies with future requests

## Supporting Documentation

Docs:
- SimpleJWT: https://django-rest-framework-simplejwt.readthedocs.io/en/latest/
- dj-rest-auth: https://dj-rest-auth.readthedocs.io/

## Authentication Endpoints

| Method | Endpoint                    | Description                              | Authentication Required |
| ------ | --------------------------- | ---------------------------------------- | ----------------------- |
| POST   | `/api/auth/login/`          | Log in user                              | No                      |
| POST   | `/api/auth/logout/`         | Log out user                             | Yes                     |
| POST   | `/api/auth/token/refresh/`  | Refresh access token                     | No                      |
| GET    | `/api/auth/user/`           | Retrieve authenticated user              | Yes                     |
| PUT    | `/api/auth/user/`           | Update authenticated user                | Yes                     |
| PATCH  | `/api/auth/user/`           | Partially update authenticated user      | Yes                     |
| POST   | `/api/auth/registration/`   | Register new user                        | No                      |

## Password Management Endpoints

| Method | Endpoint                            | Description            | Authentication Required |
| ------ | ----------------------------------- | ---------------------- | ----------------------- |
| POST   | `/api/auth/password/reset/`         | Request password reset | No                      |
| POST   | `/api/auth/password/reset/confirm/` | Confirm password reset | No                      |
| POST   | `/api/auth/password/change/`        | Change password        | Yes                     |

## Account Management Endpoints

| Method | Endpoint                           | Description                  | Authentication Required |
| ------ | ---------------------------------- | ---------------------------- | ----------------------- |
| POST   | `/api/account/reactivate/request/` | Request account reactivation | No                      |
| POST   | `/api/account/reactivate/confirm/` | Confirm account reactivation | No                      |
| POST   | `/api/account/deactivate/`         | Deactivate current account   | Yes                     |

## Notes

- Authentication is cookie-based
- JWT tokens are not exposed to the frontend
- `Authorization: Bearer` headers are not used
- CSRF protection is required for unsafe requests
- Authentication state should be checked during frontend application load

## Frontend Requirement

Frontend requests must include:

```js
withCredentials: true
```

Example:

```js
axios.create({
  withCredentials: true,
});
```

## Related Packages

- dj-rest-auth
- djangorestframework-simplejwt
- django-cors-headers
