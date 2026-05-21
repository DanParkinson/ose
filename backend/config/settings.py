from pathlib import Path
from datetime import timedelta
import os
import dj_database_url

# ==============================
# Base Directory
# ==============================
# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================
# Environment / Security
# ==============================

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ["SECRET_KEY"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.environ.get("DEBUG") == "True"

# ==============================
# Hosts, CORS and CSRF
# ==============================

ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")

CORS_ALLOWED_ORIGINS = os.environ.get("CORS_ALLOWED_ORIGINS", "").split(",")

CSRF_TRUSTED_ORIGINS = os.environ.get("CSRF_TRUSTED_ORIGINS", "").split(",")

CORS_ALLOW_CREDENTIALS = True

# ==============================
# Authentication and Authorisation
# ==============================

AUTH_USER_MODEL = "accounts.CustomUser"

SITE_ID = 1

# settings

# Use secure HTTPS-only JWT cookies in production
# Local development still allows HTTP
JWT_AUTH_SECURE = not DEBUG

# Automatically redirect all HTTP traffic to HTTPS in production
SECURE_SSL_REDIRECT = not DEBUG

# Only allow session cookies over HTTPS in production
# Helps protect authenticated sessions from interception
SESSION_COOKIE_SECURE = not DEBUG

# Only allow CSRF cookies over HTTPS in production
# Helps protect CSRF tokens from insecure transport
CSRF_COOKIE_SECURE = not DEBUG

# Enable HTTP Strict Transport Security (HSTS) in production
# Forces browsers to always use HTTPS after first secure visit
# 31536000 = 1 year
SECURE_HSTS_SECONDS = 0 if DEBUG else 31536000

# Apply HSTS rules to all subdomains in production
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG

# Allow the domain to be submitted to browser HSTS preload lists
SECURE_HSTS_PRELOAD = not DEBUG

# custom account setup
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*", "password2*"]
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_EMAIL_VERIFICATION = "none"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# rest auth
REST_AUTH = {
    "USE_JWT": True,
    "JWT_AUTH_COOKIE": "access",
    "JWT_AUTH_REFRESH_COOKIE": "refresh",
    "JWT_AUTH_HTTPONLY": True,
    "JWT_AUTH_SECURE": JWT_AUTH_SECURE,
    "JWT_AUTH_SAMESITE": "None",
    "JWT_AUTH_RETURN_EXPIRATION": True,
    "TOKEN_MODEL": None,
    "REGISTER_SERIALIZER": "accounts.api.serializers.CustomRegisterSerializer",
    "USER_DETAILS_SERIALIZER": "accounts.api.serializers.CustomUserDetailsSerializer",
    "PASSWORD_RESET_CONFIRM_URL": "reset-password/{uid}/{token}",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}

# ==============================
# Django REST Framework
# ==============================

REST_FRAMEWORK = {
    "DATETIME_FORMAT": "%d %b %Y",
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
    ],
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 20,
}

# ==============================
# API Schema Documentation
# ==============================

SPECTACULAR_SETTINGS = {
    "TITLE": "OSE API",
    "DESCRIPTION": "A simple open source resource library for teachers",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# ==============================
# Installed Applications
# ==============================

INSTALLED_APPS = [
    # Django Applications
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.sites",
    # REST Framework
    "rest_framework",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    # Authentication
    "dj_rest_auth",
    "dj_rest_auth.registration",
    # Allauth
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    # CORS
    "corsheaders",
    # Filtering
    "django_filters",
    # Development Tools
    "django_extensions",
    "silk",
    # Rich Text Editors
    "django_summernote",
    # API Documentation
    "drf_spectacular",
    # Local Applications
    "core.apps.CoreConfig",
    "accounts",
]

# ==============================
# Middleware
# ==============================

MIDDLEWARE = [
    # Security
    "django.middleware.security.SecurityMiddleware",
    # CORS
    "corsheaders.middleware.CorsMiddleware",
    # Sessions
    "django.contrib.sessions.middleware.SessionMiddleware",
    # Static file loading
    "whitenoise.middleware.WhiteNoiseMiddleware",
    # Common Django Middleware
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    # Authentication
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    # Messaging
    "django.contrib.messages.middleware.MessageMiddleware",
    # Clickjacking Protection
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    # Development Tools
    "silk.middleware.SilkyMiddleware",
]

# ==============================
# Templates and Application Entry
# ==============================

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"


# ==============================
# Database
# ==============================
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {"default": dj_database_url.parse(os.environ["DATABASE_URL"])}

# ==============================
# Password Validation
# ==============================
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# ==============================
# Internationalization
# ==============================
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True

# ==============================
# Static Files
# ==============================
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# ==============================
# Default Primary Key Field
# ==============================
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ==============================
# Caching
# ==============================
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": os.environ["REDIS_URL"],
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}
