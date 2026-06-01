# Redis

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Redis Is Used](#why-redis-is-used)
- [Architecture Role](#architecture-role)
- [Django Relationship](#django-relationship)
- [Docker Relationship](#docker-relationship)

## Purpose

Redis is used as the platform's caching backend.

It provides fast in-memory storage for frequently requested data, allowing the application to reduce database queries and improve API response times.

Redis is not used as the primary data store.

Persistent application data remains stored in PostgreSQL, while Redis is used to temporarily store cached data that can be regenerated when required.

## Why Redis Is Used

Redis provides several benefits for the platform:

```text
Fast in-memory data access
Reduced database load
Improved API response times
Reusable shared cache storage
Scalable caching infrastructure
```

By serving cached responses instead of repeatedly querying the database, the application can respond more efficiently to common requests.

## Architecture Role

Redis forms part of the backend infrastructure layer.

Its primary responsibility is:

```text
Temporary cache storage
```

Typical workflow:

```text
Request received
    ↓
Django checks Redis cache
    ↓
Cached response found
    ↓
Response returned immediately

OR

Cache miss
    ↓
Database queried
    ↓
Response cached in Redis
    ↓
Response returned
```

This allows frequently requested data to be served without repeatedly executing the same database queries.

## Django Relationship

Redis integrates with Django through Django's cache framework.

The cache framework provides a consistent API for:

```text
Retrieving cached data
Storing cached data
Removing cached data
Invalidating cached data
```

Application code interacts with Django's cache framework rather than communicating with Redis directly.

This keeps caching implementation details isolated from business logic.

## Docker Relationship

Redis runs as a dedicated Docker container alongside the backend and database services.

Separating Redis into its own container provides:

```text
Independent service management
Reusable infrastructure
Container isolation
Simplified deployment
```

The Django application communicates with Redis through the configured cache backend while Redis remains responsible for storing cached data in memory.