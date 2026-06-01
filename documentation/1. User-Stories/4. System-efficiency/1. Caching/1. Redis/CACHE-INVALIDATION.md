# Cache Invalidation

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Invalidation Is Needed](#why-invalidation-is-needed)
- [Signal Registration](#signal-registration)
- [Invalidation Trigger](#invalidation-trigger)
- [Cache Deletion Pattern](#cache-deletion-pattern)
- [Subject Cache Invalidation](#subject-cache-invalidation)
- [Relationship With Cache Operations](#relationship-with-cache-operations)

## Purpose

Cache invalidation keeps cached API responses synchronised with database changes.

When cached list responses are stored in Redis, they can become outdated if records are created, updated, or deleted.

Cache invalidation removes stale cached responses so future requests receive fresh data.

## Why Invalidation Is Needed

List endpoints cache response data for repeated requests.

If a model changes after a response has been cached, the cached response may no longer match the database.

Example:

```text
Subject list is cached
    ↓
New subject is created
    ↓
Cached subject list is now outdated
    ↓
Cache must be cleared
```

Without invalidation, users may continue seeing stale data until the cache timeout expires.

## Signal Registration

Cache invalidation is handled through Django signals.

The signals file is imported inside the app configuration.

```py
class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core"

    def ready(self):
        import core.signals  # noqa: F401
```

The `ready()` method ensures the signal handlers are registered when the Django app starts.

Without this import, the signal receivers may not be loaded and cache invalidation would not run.

## Invalidation Trigger

The cache is invalidated when model changes occur.

```py
@receiver([post_save, post_delete], sender=Subject)
```

This listens for:

```text
post_save   → model instance created or updated
post_delete → model instance deleted
```

When either event occurs, the invalidation function runs.

## Cache Deletion Pattern

Cached list responses are deleted using a pattern.

```py
cache.delete_pattern("*subject_list:*")
```

This removes all cached subject list responses.

The wildcard pattern is needed because each filtered, searched, or paginated request creates a different cache key.

Examples removed:

```text
subject_list:/core/subjects/
subject_list:/core/subjects/?search=math
subject_list:/core/subjects/?level=secondary
subject_list:/core/subjects/?limit=20&offset=20
```

## Subject Cache Invalidation

Subject cache invalidation is currently handled with:

```py
@receiver([post_save, post_delete], sender=Subject)
def invalidate_subject_cache(sender, instance, **kwargs):
    """
    Invalidate Subject list, detail caches when a Subject is created, updated, deleted
    """
    cache.delete_pattern("*subject_list:*")
```

This ensures subject list cache entries are cleared whenever subject data changes.

The next request to a subject list endpoint will rebuild the cache using fresh database data.

## Relationship With Cache Operations

Cache operations and cache invalidation work together.

```text
List request
    ↓
Response cached in Redis
    ↓
Model changes
    ↓
Signal runs
    ↓
Matching cache keys deleted
    ↓
Next request rebuilds cache
```

This keeps cached API responses fast while still allowing database updates to appear correctly after create, update, or delete actions.