# Caching

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Caching Technology](#caching-technology)
- [Redis](#redis)
- [Django Cache Framework](#django-cache-framework)
- [django-redis](#django-redis)
- [Manual List Caching](#manual-list-caching)
- [Cache Keys](#cache-keys)
- [Cache Invalidation](#cache-invalidation)
- [Browser Cache vs Backend Cache](#browser-cache-vs-backend-cache)
- [Why Caching Is Used](#why-caching-is-used)
- [Infrastructure Role](#infrastructure-role)
- [Notes](#notes)

## Purpose

This document provides an overview of the caching technologies and caching concepts used within the backend infrastructure.

It explains:

- what caching tools are used
- how Redis integrates with Django
- how list endpoint caching works
- how cache invalidation works
- the difference between browser caching and backend caching
- why manual cache control is used

## Caching Technology

| Technology | Purpose |
|---|---|
| Redis | In-memory data storage used for caching |
| django-redis | Connects Django's cache framework to Redis |
| Django cache framework | Provides a unified caching API |
| Low-level cache API | Provides explicit cache control |
| Django signals | Used to trigger cache invalidation behaviour |

## Redis

Redis is an in-memory data store used to improve application performance.

Within this project Redis is used as the backend cache store for Django.

Benefits include:

```text
- fast read/write operations
- reduced database load
- improved response times
- reusable shared cache storage
```

Redis runs as a dedicated Docker container and stores cached API responses separately from PostgreSQL.

## Django Cache Framework

Django provides a built-in caching framework that abstracts cache usage behind a consistent API.

This allows the application to:

- store cached data
- retrieve cached data
- invalidate cached data
- switch cache providers without changing application logic

The primary cache methods used are:

```py
cache.get()
cache.set()
cache.delete_pattern()
```

## django-redis

`django-redis` allows Django's cache framework to communicate with Redis.

It acts as the integration layer between:

- Django
- Redis
- the cache backend configuration

Example configuration:

```py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://redis:6379/1",
        "OPTIONS": {
            "CLIENT_CLASS": "django_redis.client.DefaultClient",
        },
    }
}
```

## Manual List Caching

List endpoints use manual low-level caching inside the `list()` method.

This approach was chosen instead of Django's `cache_page()` decorator because it provides:

```text
- explicit cache control
- simpler invalidation behaviour
- easier debugging
- better separation between backend cache and browser cache
- reduced browser disk-cache issues
```

### Example pattern:

```py
from django.core.cache import cache
from rest_framework.response import Response


def list(self, request, *args, **kwargs):
    cache_key = f"subject_list:{request.get_full_path()}"

    cached_data = cache.get(cache_key)

    if cached_data is not None:
        return Response(cached_data)

    response = super().list(request, *args, **kwargs)

    cache.set(
        cache_key,
        response.data,
        timeout=60 * 60 * 24,
    )

    return response
```

### Cache Keys

Each resource should have its own cache prefix.

Examples:

```text
subject_list
topic_list
lesson_name_list
teaching_style_list
variation_list
```

Cache keys also include the full request path.

This allows separate caching for:

```text
pagination
filtering
searching
ordering
```

Example generated keys:

```text
subject_list:/core/subjects/?limit=20&offset=0
subject_list:/core/subjects/?search=math
subject_list:/core/subjects/?level=secondary
```

### Cache Invalidation

Caching systems require invalidation to prevent stale data from being returned.

Django signals are used to automatically invalidate cache entries when:

- records are created
- records are updated
- records are deleted

Example:

```py
@receiver([post_save, post_delete], sender=Subject)
def invalidate_subject_cache(sender, instance, **kwargs):
    cache.delete_pattern("*subject_list:*")
```

This ensures cached responses stay synchronised with the database.

## Backend Cache

Backend caching refers to Redis storing cached API response data.

This is controlled directly through Django's cache framework.

Example:

```text
Redis cache
Django cache API
cache.get()
cache.set()
cache.delete_pattern()
```

### Browser Cache

Browsers may also cache API responses locally using disk cache.

This can cause stale frontend data even when backend cache invalidation is working correctly.

The project originally used Django's `cache_page()` decorator, which introduced browser caching behaviour alongside Redis caching.

Manual low-level caching was adopted to avoid browser disk-cache interference while still benefiting from Redis backend caching.

## Why Caching Is Used

Caching is used to improve:

| Benefit | Description |
|---|---|
| Performance | Reduces repeated database queries |
| Scalability | Handles repeated requests more efficiently |
| Response Times | Improves API speed |
| Infrastructure Efficiency | Reduces backend resource usage |

### Infrastructure Role

Within the infrastructure layer, caching provides:

```text
- reusable backend performance optimisation
- shared cache storage
- backend response caching
- automatic invalidation capabilities
```

Caching is intentionally implemented through Django's cache framework to keep infrastructure reusable and maintainable.

## Notes

```text
Manual low-level caching is intentionally preferred over cache_page()
for dashboard list endpoints because it provides clearer cache control
and avoids browser disk-cache side effects.

Redis is used as the cache backend because it integrates cleanly with
Django and provides fast in-memory performance.

Implementation-specific cache behaviour should be documented alongside
the relevant view or endpoint documentation.
```
