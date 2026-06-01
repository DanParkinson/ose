# Cache Operations

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Manual List Caching](#manual-list-caching)
- [Cache Key Structure](#cache-key-structure)
- [Cache Lookup](#cache-lookup)
- [Cache Miss Behaviour](#cache-miss-behaviour)
- [Cache Storage](#cache-storage)
- [Relationship With Filtering and Search](#relationship-with-filtering-and-search)

## Purpose

Cache operations define how API list responses are stored, retrieved, and reused through Django's cache framework.

The platform uses manual low-level caching for selected list endpoints so repeated requests can be served from Redis instead of repeatedly querying the database.

## Manual List Caching

List endpoints can override the DRF `list()` method to control cache behaviour directly.

Example:

```py
def list(self, request, *args, **kwargs):
    cache_key = f"subject_list:{request.get_full_path()}"

    cached_data = cache.get(cache_key)

    if cached_data is not None:
        return Response(cached_data)

    response = super().list(request, *args, **kwargs)

    cache.set(cache_key, response.data, timeout=60 * 60 * 24)

    return response
```

This creates the following flow:

```text
Request received
    ↓
Cache key generated
    ↓
Redis cache checked
    ↓
If cached data exists, return cached response
    ↓
If no cached data exists, query database through DRF
    ↓
Store response data in cache
    ↓
Return response
```

## Cache Key Structure

Cache keys are generated from a resource-specific prefix and the full request path.

Example:

```py
cache_key = f"subject_list:{request.get_full_path()}"
```

The prefix identifies the resource being cached.

```text
subject_list
```

The request path keeps different query combinations separate.

Examples:

```text
subject_list:/core/subjects/
subject_list:/core/subjects/?limit=20&offset=0
subject_list:/core/subjects/?search=math
subject_list:/core/subjects/?level=secondary
```

This prevents filtered, searched, and paginated responses from overwriting each other.

## Cache Lookup

The cache is checked before the database is queried.

```py
cached_data = cache.get(cache_key)
```

If cached data exists, it is returned immediately.

```py
if cached_data is not None:
    return Response(cached_data)
```

This avoids unnecessary database queries for repeated list requests.

## Cache Miss Behaviour

If no cached data exists, the view continues with the normal DRF list behaviour.

```py
response = super().list(request, *args, **kwargs)
```

This allows DRF to handle:

```text
Queryset evaluation
Filtering
Searching
Pagination
Serialization
Permissions
```

The endpoint therefore keeps the normal DRF behaviour while adding a cache layer around the final response data.

## Cache Storage

After DRF generates the list response, the response data is stored in the cache.

```py
cache.set(cache_key, response.data, timeout=60 * 60 * 24)
```

The current timeout is:

```text
60 * 60 * 24 = 24 hours
```

This means cached list responses can be reused for up to one day unless they are invalidated earlier.

## Relationship With Filtering and Search

Because the cache key includes:

```py
request.get_full_path()
```

different query strings produce different cache entries.

This supports separate cached responses for:

```text
Pagination
Filtering
Searching
Ordering
```

For example:

```text
/core/subjects/?search=math
/core/subjects/?level=secondary
/core/subjects/?limit=20&offset=20
```

Each request receives its own cache key and cached response.

This keeps cache behaviour compatible with DRF filtering, search, and pagination.