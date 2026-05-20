# Deployment

## Navgation

## Table of Contents

## 1. Dependencies

### Gunicorn

For a production web server for Python applications

```python
uv add gunicorn
```

### WhiteNoise

For handling static files in production.
- Admin CSS
- Admin JS
- Static Files

```python
uv add whitenoise
```

Append to middleware:

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]
```

Add to settings.py

```python
STATIC_ROOT = BASE_DIR / "staticfiles"
```

### dj-database-url

Makes Render PostgreSQL URLS easy to use

```python
uv add dj-database-url
```

In settings.py

```python
import dj_database_url

DATABASES = {
    "default": dj_database_url.config()
}
```

### djanog-cors-headers

For connection between frontedn and backend domains

```python
uv add django-cors-headers
```

<!-- ### python-dotenv

For secure environment env loading

```python
uv add python-dotenv
``` -->

## 2. Environment variables

### Developement variables

Developement variable are in .devcontainer/.env. These contain generic postgres image settings for a postgresql image.

### Backend Environment Variables

These are in backend/.env

## 3. Settings.py

### DEBUG

Environment variables are always strings. So ```DEBUG=True``` becomes ```"True"```. To accomodate, ```== "True"``` is appended to render truthy/falsey for correct returning of non-strings.

This allows ```if DEBUG``` to render correct True or False

```python
DEBUG = os.environ.get("DEBUG") == "True"
```

### SECRET KEY

SECRET KEY must never be exposed. Settings.py calls the secret key from enviroment file:

```python
SECRET_KEY = os.environ["SECRET_KEY"]
```

### ALLOWED HOSTS

Environment variables are always strings. split seperates them.

```python
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")
```

### CORS_ALLOWED_ORIGINS

Environment variables are always strings. split seperates them.

`""` allows Django to not crash if there is an error.

```python
CORS_ALLOWED_ORIGINS = os.environ.get(
    "CORS_ALLOWED_ORIGINS",
    "",
).split(",")
```

### CSRF_TRUSTED_ORIGINS

Environment variables are always strings. split seperates them.

`""` allows Django to not crash if there is an error.

```python
CSRF_TRUSTED_ORIGINS = os.environ.get(
    "CSRF_TRUSTED_ORIGINS",
    "",
).split(",")
```

### JWT AUTH SECURE

JWT Auth secure decides wether requests are sent over `HTTP` or `HTTPS`.

`HTTP` is fine for local development but not suitable for production.

It should always be the oppotsite of debug:

`DEBUG=True` : `JWT_AUTH_SECURE = False`

`DEBUG=False` : `JWT_AUTH_SECURE = True`

```python
JWT_AUTH_SECURE = not DEBUG
```

In REST_AUTH, use the variable loaded:

```python
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access",
    "JWT_AUTH_REFRESH_COOKIE": "refresh",
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_SECURE": JWT_AUTH_SECURE, # <----------
    "JWT_AUTH_SAMESITE": "Lax",
    "JWT_AUTH_RETURN_EXPIRATION": True,
    "TOKEN_MODEL": None,
    "REGISTER_SERIALIZER":
    "accounts.api.serializers.CustomRegisterSerializer",
    "USER_DETAILS_SERIALIZER": "accounts.api.serializers.CustomUserDetailsSerializer",
    "PASSWORD_RESET_CONFIRM_URL": "reset-password/{uid}/{token}",
}
```
