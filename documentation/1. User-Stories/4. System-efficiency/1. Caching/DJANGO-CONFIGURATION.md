# Django Cache Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Django Cache Framework](#django-cache-framework)
- [Redis Cache Backend](#redis-cache-backend)
- [Cache Configuration](#cache-configuration)
- [Cache Database Selection](#cache-database-selection)
- [Cache Client Configuration](#cache-client-configuration)
- [Application Relationship](#application-relationship)

## Purpose

The platform uses Django's cache framework with Redis as the cache backend.

This configuration allows Django to store and retrieve cached data using Redis while keeping caching logic integrated with the Django application architecture.

## Django Cache Framework

Django provides a built-in cache framework that standardises cache operations.

The framework supports:

```text
Cache retrieval
Cache storage
Cache invalidation
Cache expiration
```

Application code interacts with Django's cache API rather than communicating with Redis directly.

## Redis Cache Backend

The platform uses `django-redis` as the Redis integration layer.

```py
"BACKEND": "django_redis.cache.RedisCache"
```

This allows Django's cache framework to use Redis as the underlying cache storage system.

## Cache Configuration

Redis caching is configured through Django's `CACHES` setting.

Example:

```py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
        "OPTIONS": {
            "CLIENT_CLASS":
                "django_redis.client.DefaultClient",
        },
    }
}
```

The default cache is used throughout the application unless another cache backend is explicitly configured.

## Cache Database Selection

The Redis connection is configured using:

```py
"LOCATION": REDIS_URL
```

Example:

```env
REDIS_URL=redis://redis:6379/1
```

Connection parts:

| Part | Purpose |
|---|---|
| `redis` | Docker Redis service name |
| `6379` | Redis default port |
| `/1` | Redis database number |

Redis supports multiple logical databases within the same Redis server.

## Cache Client Configuration

The platform uses Django Redis' default cache client.

```py
"CLIENT_CLASS":
    "django_redis.client.DefaultClient"
```

The client handles communication between Django and Redis.

Responsibilities include:

```text
Cache retrieval
Cache storage
Connection management
Serialization
```

## Application Relationship

Application code interacts with the cache through Django's cache framework.

Example operations include:

```py
cache.get()
cache.set()
cache.delete()
cache.delete_pattern()
```

This allows application logic to remain independent from Redis-specific implementation details while still benefiting from Redis-based caching.