# Redis Environment Variables

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Redis URL Configuration](#redis-url-configuration)
- [Environment Variable Structure](#environment-variable-structure)
- [Docker Relationship](#docker-relationship)
- [Development Configuration](#development-configuration)
- [Production Configuration](#production-configuration)

## Purpose

Redis connection details are configured using environment variables.

This allows Redis configuration to change between development and production environments without modifying application code.

Environment variables also keep infrastructure configuration separate from Django settings logic.

## Redis URL Configuration

The platform uses:

```env
REDIS_URL=redis://redis:6379/1
```

This value is used inside Django's cache configuration.

Example:

```py
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": REDIS_URL,
    }
}
```

The Redis URL tells Django how to connect to the Redis server.

## Environment Variable Structure

The Redis URL contains several parts.

Example:

```text
redis://redis:6379/1
```

| Part | Purpose |
|---|---|
| `redis://` | Redis connection protocol |
| `redis` | Redis Docker service name |
| `6379` | Redis server port |
| `/1` | Redis database number |

Redis supports multiple logical databases within the same Redis instance.

The platform currently uses database `1` for caching.

## Docker Relationship

The Redis hostname:

```text
redis
```

matches the Redis Docker Compose service name.

Example:

```yaml
services:
  redis:
```

Docker networking automatically allows the backend container to resolve the Redis service by this name.

This allows the backend container to communicate with Redis without hardcoded IP addresses.

## Development Configuration

Local development uses the Redis container defined in Docker Compose.

Example:

```env
REDIS_URL=redis://redis:6379/1
```

The backend container communicates with the Redis container through Docker's internal network.

## Production Configuration

Production deployments may use:

```text
Dedicated Redis containers
Managed Redis services
Cloud-hosted Redis infrastructure
```

Because Redis configuration is environment-based, the connection URL can be changed without modifying Django application code.

Example:

```env
REDIS_URL=redis://production-redis-host:6379/1
```