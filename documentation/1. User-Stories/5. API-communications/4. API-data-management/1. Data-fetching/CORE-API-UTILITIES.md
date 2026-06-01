# Core API Utilities

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [fetchCoreModelList](#fetchcoremodellist)
- [fetchCoreModelOptions](#fetchcoremodeloptions)
- [createCoreModelItem](#createcoremodelitem)
- [updateCoreModelItem](#updatecoremodelitem)
- [deleteCoreModelItem](#deletecoremodelitem)

## Purpose

Core API utilities provide reusable frontend functions for communicating with core model endpoints.

They keep API request logic separate from components, forms, and dashboard pages.

## fetchCoreModelList

`fetchCoreModelList` retrieves list data from a model endpoint.

It supports:

```text
Pagination
Search
Filtering
```

```js
fetchCoreModelList({
  endpoint,
  limit,
  offset,
  searchQuery,
  filters,
});
```

The function builds query parameters and sends a `GET` request using `axiosResponse`.

Filters with the value `"all"` are excluded from the request.

## fetchCoreModelOptions

`fetchCoreModelOptions` sends an `OPTIONS` request to a model endpoint.

```js
fetchCoreModelOptions({
  endpoint,
});
```

This is used by dynamic forms to retrieve backend metadata such as available field choices.

## createCoreModelItem

`createCoreModelItem` creates a new model record.

```js
createCoreModelItem({
  endpoint,
  data,
});
```

It sends a `POST` request to the configured endpoint.

## updateCoreModelItem

`updateCoreModelItem` updates an existing model record.

```js
updateCoreModelItem({
  detailEndpoint,
  id,
  data,
});
```

It sends a `PATCH` request to:

```text
{detailEndpoint}{id}/
```

## deleteCoreModelItem

`deleteCoreModelItem` deletes an existing model record.

```js
deleteCoreModelItem({
  detailEndpoint,
  id,
});
```

It sends a `DELETE` request to:

```text
{detailEndpoint}{id}/
```