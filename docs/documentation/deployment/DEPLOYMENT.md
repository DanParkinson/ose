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

### Production HTTPS Security

Production deployments should always use HTTPS.

These settings automatically switch between:
- local HTTP development
- secure HTTPS production deployment

using:

```python
DEBUG = os.environ.get("DEBUG") == "True"
```

When:

```python
DEBUG=True
```

development remains HTTP-friendly.

When:

```python
DEBUG=False
```

production security settings automatically activate.

#### JWT Authentication Cookie Security

JWT authentication cookies should only be sent over HTTPS in production.

```python
# Use secure HTTPS-only JWT cookies in production
# Local development still allows HTTP
JWT_AUTH_SECURE = not DEBUG
```

In `REST_AUTH`, use the variable:

```python
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access",
    "JWT_AUTH_REFRESH_COOKIE": "refresh",
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_SECURE": JWT_AUTH_SECURE,
    "JWT_AUTH_SAMESITE": "Lax",
    "JWT_AUTH_RETURN_EXPIRATION": True,
    "TOKEN_MODEL": None,
    "REGISTER_SERIALIZER":
    "accounts.api.serializers.CustomRegisterSerializer",
    "USER_DETAILS_SERIALIZER":
    "accounts.api.serializers.CustomUserDetailsSerializer",
    "PASSWORD_RESET_CONFIRM_URL":
    "reset-password/{uid}/{token}",
}
```

#### HTTPS Redirects

Automatically redirect all HTTP requests to HTTPS in production.

```python
# Automatically redirect all HTTP traffic to HTTPS in production
SECURE_SSL_REDIRECT = not DEBUG
```

#### Secure Session Cookies

Session cookies should only be transmitted over HTTPS in production.

```python
# Only allow session cookies over HTTPS in production
# Helps protect authenticated sessions from interception
SESSION_COOKIE_SECURE = not DEBUG
```

#### Secure CSRF Cookies

CSRF cookies should only be transmitted over HTTPS in production.

```python
# Only allow CSRF cookies over HTTPS in production
# Helps protect CSRF tokens from insecure transport
CSRF_COOKIE_SECURE = not DEBUG
```

#### HTTP Strict Transport Security (HSTS)

HSTS tells browsers to always use HTTPS after the first secure visit.

```python
# Enable HTTP Strict Transport Security (HSTS) in production
# Forces browsers to always use HTTPS after first secure visit
# 31536000 = 1 year
SECURE_HSTS_SECONDS = 0 if DEBUG else 31536000

# Apply HSTS rules to all subdomains in production
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG

# Allow the domain to be submitted to browser HSTS preload lists
SECURE_HSTS_PRELOAD = not DEBUG
```

These settings improve:
- transport security
- cookie security
- browser HTTPS enforcement
- session protection
- CSRF protection

while still allowing normal local HTTP development.
### Redis Location

Redis url needs to be configured:

```python
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ["REDIS_URL"],
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}
```

### Database config

In development a postgres image will be used, in production a deployed database

```python
DATABASES = {
    "default": dj_database_url.parse(
        os.environ["DATABASE_URL"]
    )
}
```

### Django Static Files

Django does not automatically serve static files properly in production.

WhiteNoise allows Django to serve:
- admin CSS
- admin JavaScript
- uploaded static assets
- frontend static assets

without requiring Nginx during early deployment stages.

Install WhiteNoise:

```python
uv add whitenoise
```

Add WhiteNoise middleware directly after SecurityMiddleware:

```python
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]
```

Configure static file settings:

```python
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
```

Collect static files:

```python
uv run python manage.py collectstatic --noinput
```

This gathers all static assets into:

```text
/backend/staticfiles
```

These files are generated automatically and should not be committed to Git.

Add to `.gitignore`:

```text
staticfiles/
```

### Gunicorn Production Server

Django's built-in development server:

```python
python manage.py runserver
```

is not suitable for production deployment.

Gunicorn is used as the production WSGI application server.

Install Gunicorn:

```python
uv add gunicorn
```

Local Gunicorn test:

```python
uv run gunicorn config.wsgi:application --bind 127.0.0.1:8001
```

Production start command:

```python
uv run gunicorn config.wsgi:application
```

Render automatically provides the production port during deployment.

Gunicorn replaces Django's development server in production environments.
