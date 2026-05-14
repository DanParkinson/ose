# Form Metadata Hooks

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Hook Group Purpose](#hook-group-purpose)
- [Hook List](#hook-list)
- [useCoreFieldOptions](#usecorefieldoptions)
  - [Purpose](#purpose-1)
  - [Parameters](#parameters)
  - [State Managed](#state-managed)
  - [Data Fetching](#data-fetching)
  - [Returned Values](#returned-values)
  - [Example Usage](#example-usage)
  - [Design Goals](#design-goals)
- [useCoreRelationOptions](#usecorerelationoptions)
  - [Purpose](#purpose-2)
  - [Parameters](#parameters-1)
  - [State Managed](#state-managed-1)
  - [Data Fetching](#data-fetching-1)
  - [Returned Values](#returned-values-1)
  - [Example Usage](#example-usage-1)
  - [Design Goals](#design-goals-1)
- [useDebouncedValue](#usedebouncedvalue)
  - [Purpose](#purpose-3)
  - [Parameters](#parameters-2)
  - [State Managed](#state-managed-2)
  - [Returned Values](#returned-values-2)
  - [Example Usage](#example-usage-2)
  - [Design Goals](#design-goals-2)
- [Shared Architectural Principle](#shared-architectural-principle)

## Purpose

The form metadata hooks provide reusable orchestration logic for backend-driven forms.

These hooks are responsible for:

- loading backend field metadata
- loading relation field options
- debouncing searchable relation values

The hooks are intentionally orchestration-focused and do not render UI directly.

## Hook Group Purpose

The form metadata hook system is designed to:

- separate backend orchestration from field rendering
- support configuration-driven forms
- support reusable relation field workflows
- reduce repeated backend loading logic
- support scalable create/update forms

## Hook List

| Hook | Purpose |
|---|---|
| `useCoreFieldOptions` | Loads backend OPTIONS metadata for create fields |
| `useCoreRelationOptions` | Loads relation field options from backend endpoints |
| `useDebouncedValue` | Debounces rapidly changing values |

## useCoreFieldOptions

### Purpose

`useCoreFieldOptions` is a reusable hook used to load backend OPTIONS metadata for dynamic form rendering.

It provides backend field metadata used for:

- choice field rendering
- field validation metadata
- backend-driven form configuration

### Parameters

```js
useCoreFieldOptions(endpoint)
```

| Parameter | Description |
|---|---|
| `endpoint` | API endpoint used to request OPTIONS metadata |

### State Managed

| State | Description |
|---|---|
| `fieldOptions` | Stores backend OPTIONS metadata |

### Data Fetching

The hook uses:

```js
fetchCoreModelOptions()
```

to request backend OPTIONS metadata.

Example:

```js
const data = await fetchCoreModelOptions({
  endpoint,
});
```

The hook extracts:

```js
data.actions?.POST || {}
```

This provides backend field metadata for create forms.

### Returned Values

| Value | Description |
|---|---|
| `fieldOptions` | Backend OPTIONS field metadata |

### Example Usage

```js
const fieldOptions = useCoreFieldOptions(
  model.endpoint
);
```

### Design Goals

| Goal | Description |
|---|---|
| Reusability | Supports any compatible create endpoint |
| Backend-driven forms | Uses backend OPTIONS metadata |
| Separation of concerns | Keeps metadata loading outside form components |
| Scalable field rendering | Supports dynamic field systems |

## useCoreRelationOptions

### Purpose

`useCoreRelationOptions` is a reusable hook used to load relation field options for searchable relation fields.

It supports:

- single-select relation fields
- multi-select relation fields
- searchable relation workflows

### Parameters

```js
useCoreRelationOptions(createFields)
```

| Parameter | Description |
|---|---|
| `createFields` | Configured form field definitions |

### State Managed

| State | Description |
|---|---|
| `relationOptions` | Stores loaded relation field options |

### Data Fetching

The hook:

- detects relation fields
- requests relation data from configured endpoints
- stores loaded relation options by field name

The hook uses:

```js
fetchCoreModelList()
```

Example:

```js
const data = await fetchCoreModelList({
  endpoint: field.endpoint,
  limit: 100,
  offset: 0,
});
```

Loaded data is stored using:

```js
loadedRelations[field.name]
```

This allows relation fields to access their own reusable option collections.

### Returned Values

| Value | Description |
|---|---|
| `relationOptions` | Loaded relation options grouped by field name |

### Example Usage

```js
const relationOptions = useCoreRelationOptions(
  model.createFields
);
```

### Design Goals

| Goal | Description |
|---|---|
| Reusability | Supports any relation field configuration |
| Searchable relations | Supports reusable searchable relation workflows |
| Separation of concerns | Keeps relation loading outside form rendering |
| Scalable relation systems | Supports reusable relation architecture |

## useDebouncedValue

### Purpose

`useDebouncedValue` is a reusable hook used to delay rapidly changing values.

It is primarily used for:

- searchable relation inputs
- reducing unnecessary filtering operations
- improving searchable field performance

### Parameters

```js
useDebouncedValue(value, delay)
```

| Parameter | Description |
|---|---|
| `value` | Current value to debounce |
| `delay` | Delay duration in milliseconds |

### State Managed

| State | Description |
|---|---|
| `debouncedValue` | Stores the delayed value |

### Returned Values

| Value | Description |
|---|---|
| `debouncedValue` | Debounced version of the provided value |

### Example Usage

```js
const debouncedSearch = useDebouncedValue(
  relationSearch,
  1000
);
```

### Design Goals

| Goal | Description |
|---|---|
| Reusability | Can debounce any changing value |
| Performance | Reduces unnecessary filtering operations |
| Separation of concerns | Keeps debounce logic outside field rendering |
| Search optimisation | Supports scalable searchable workflows |

## Shared Architectural Principle

```text
Hooks manage backend orchestration and reusable state logic.
Utilities manage pure data transformations.
Renderers decide what components should render.
Field components handle presentation.
Forms orchestrate submission workflows.
```
