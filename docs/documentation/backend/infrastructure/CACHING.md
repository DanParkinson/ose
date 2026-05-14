# Caching

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [Caching Technology](#caching-technology)
- [Redis](#redis)
- [Django Cache Framework](#django-cache-framework)
- [django-redis](#django-redis)
- [View Caching](#view-caching)
- [Cache Invalidation](#cache-invalidation)
- [Why Caching Is Used](#why-caching-is-used)
- [Infrastructure Role](#infrastructure-role)
- [Notes](#notes)

## Purpose

This document provides an overview of the caching technologies and caching concepts used within the backend infrastructure.

It explains:
- what caching tools are used
- the role of caching within the project
- how Django integrates with Redis
- the purpose of cache invalidation

## Caching Technology

| Technology | Purpose |
|---|---|
| Redis | In-memory data storage used for caching |
| django-redis | Connects Django's cache framework to Redis |
| Django cache framework | Provides a unified caching interface |
| cache_page decorator | Caches view responses |
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

## Django Cache Framework

Django provides a built-in caching framework that abstracts cache usage behind a consistent API.

This allows the application to:
- store cached data
- retrieve cached data
- invalidate cached data
- switch cache providers without changing application logic

## django-redis

`django-redis` allows Django's cache framework to communicate with Redis.

It acts as the integration layer between:
- Django
- Redis
- the cache backend configuration

## View Caching

Django provides response-level caching through decorators such as:

```py
cache_page()
```

This allows entire API responses to be cached for a configurable duration.

View caching is commonly used for:
- public endpoints
- frequently requested data
- expensive database queries

## Cache Invalidation

Caching systems require invalidation to prevent stale data from being returned.

Django signals can be used to automatically invalidate cached data when:
- records are created
- records are updated
- records are deleted

This keeps cached responses synchronised with the database.

## Why Caching Is Used

Caching is used to improve:

| Benefit | Description |
|---|---|
| Performance | Reduces repeated database queries |
| Scalability | Handles repeated requests more efficiently |
| Response Times | Improves API speed |
| Infrastructure Efficiency | Reduces backend resource usage |

## Infrastructure Role

Within the infrastructure layer, caching provides:

```text
- reusable backend performance optimisation
- shared cache storage
- framework-level response caching
- automatic invalidation capabilities
```

## Notes

```text
Caching is intentionally implemented through Django's built-in cache
framework to keep the infrastructure reusable and maintainable.

Redis is used as the cache backend because it integrates cleanly with
Django and provides fast in-memory performance.

Implementation-specific caching behaviour is documented separately from
this infrastructure overview.
```
