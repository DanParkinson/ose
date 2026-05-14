# Form Infrastructure Utilities

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Utility Group Purpose](#utility-group-purpose)
- [Utilities Included](#utilities-included)
- [getInitialFormData](#getinitialformdata)
  - [Purpose](#purpose-1)
  - [Parameters](#parameters)
  - [Returns](#returns)
  - [Usage Example](#usage-example)
- [getFieldError](#getfielderror)
  - [Purpose](#purpose-2)
  - [Parameters](#parameters-1)
  - [Returns](#returns-1)
  - [Usage Example](#usage-example-1)
- [parseBackendErrors](#parsebackenderrors)
  - [Purpose](#purpose-3)
  - [Parameters](#parameters-2)
  - [Returns](#returns-2)
  - [Usage Example](#usage-example-2)
- [formatRelationOptions](#formatrelationoptions)
  - [Purpose](#purpose-4)
  - [Parameters](#parameters-3)
  - [Returns](#returns-3)
  - [Usage Example](#usage-example-3)
- [getFilteredRelationOptions](#getfilteredrelationoptions)
  - [Purpose](#purpose-5)
  - [Parameters](#parameters-4)
  - [Returns](#returns-4)
  - [Usage Example](#usage-example-4)
- [getSelectedRelationOptions](#getselectedrelationoptions)
  - [Purpose](#purpose-6)
  - [Parameters](#parameters-5)
  - [Returns](#returns-5)
  - [Usage Example](#usage-example-5)
- [getUpdatedRelationValues](#getupdatedrelationvalues)
  - [Purpose](#purpose-7)
  - [Parameters](#parameters-6)
  - [Returns](#returns-6)
  - [Usage Example](#usage-example-6)

- [Shared Architectural Principle](#shared-architectural-principle)

## Purpose

The form infrastructure utilities provide reusable pure utility logic used throughout the form system.

These utilities are responsible for:

- generating initial form state
- extracting validation errors
- formatting relation labels
- filtering searchable relation options
- managing selected relation state
- parsing backend validation responses

The utilities are intentionally pure and do not manage:

- React state
- rendering
- API requests
- orchestration workflows

## Utility Group Purpose

The form utility system is designed to:

- separate transformation logic from components
- reduce duplicated form logic
- support reusable relation workflows
- support scalable create/update forms
- keep components smaller and easier to maintain

## Utilities Included

| Utility | Purpose |
|---|---|
| `getInitialFormData` | Generates initial form state |
| `getFieldError` | Extracts field validation errors |
| `parseBackendErrors` | Parses backend validation responses |
| `formatRelationOptions` | Formats relation option display labels |
| `getFilteredRelationOptions` | Filters searchable relation options |
| `getSelectedRelationOptions` | Returns selected relation option objects |
| `getUpdatedRelationValues` | Updates selected relation values |

## getInitialFormData

### Purpose

`getInitialFormData` generates the initial form state object from configured field definitions.

It automatically prepares default values based on field type.

### Parameters

```js
getInitialFormData(createFields)
```

| Parameter | Description |
|---|---|
| `createFields` | Configured field definitions |

## Returns

```js
{
  fieldName: defaultValue
}
```

### Usage Example

```js
const initialData = getInitialFormData(
  model.createFields
);
```

## getFieldError

### Purpose

`getFieldError` extracts and formats backend validation errors for a specific field.

It safely handles:

- arrays
- strings
- missing errors

### Parameters

```js
getFieldError(fieldErrors, fieldName)
```

| Parameter | Description |
|---|---|
| `fieldErrors` | Backend validation error object |
| `fieldName` | Field name to retrieve |

### Returns

```js
string | null
```

### Usage Example

```js
const fieldError = getFieldError(
  fieldErrors,
  field.name
);
```

## parseBackendErrors

### Purpose

`parseBackendErrors` extracts reusable error structures from backend validation responses.

It separates:

- field errors
- general form errors

### Parameters

```js
parseBackendErrors(error)
```

| Parameter | Description |
|---|---|
| `error` | Backend request error |

### Returns

```js
{
  fieldErrors,
  generalError,
}
```

### Usage Example

```js
const parsedErrors = parseBackendErrors(error);
```

## formatRelationOptions

### Purpose

`formatRelationOptions` formats relation objects into readable display labels.

It supports:

- custom display fields
- fallback formatting
- reusable relation display rendering

### Parameters

```js
formatRelationOptions(option, field)
```

| Parameter | Description |
|---|---|
| `option` | Relation option object |
| `field` | Relation field configuration |

### Returns

```js
string
```

### Usage Example

```js
formatRelationOptions(option, field)
```

## getFilteredRelationOptions

### Purpose

`getFilteredRelationOptions` filters searchable relation options using the current search value.

### Parameters

```js
getFilteredRelationOptions({
  options,
  searchValue,
  field,
  formatOption,
})
```

| Parameter | Description |
|---|---|
| `options` | Relation options |
| `searchValue` | Current search value |
| `field` | Relation field config |
| `formatOption` | Relation formatting function |

### Returns

```js
array
```

### Usage Example

```js
const filteredOptions =
  getFilteredRelationOptions({
    options,
    searchValue,
    field,
    formatOption,
  });
```

## getSelectedRelationOptions

### Purpose

`getSelectedRelationOptions` returns the currently selected relation option objects.

It supports:

- single-select relations
- multi-select relations

### Parameters

```js
getSelectedRelationOptions({
  options,
  selectedValues,
  optionValue,
  multiple,
})
```

| Parameter | Description |
|---|---|
| `options` | Relation options |
| `selectedValues` | Currently selected values |
| `optionValue` | Option identifier field |
| `multiple` | Whether multiple values are allowed |

### Returns

```js
array
```

### Usage Example

```js
const selectedOptions =
  getSelectedRelationOptions({
    options,
    selectedValues,
    optionValue,
    multiple,
  });
```

## getUpdatedRelationValues

### Purpose

`getUpdatedRelationValues` generates updated relation values during relation toggle workflows.

It handles:

- selecting values
- removing values
- single-select replacement
- multi-select toggling

### Parameters

```js
getUpdatedRelationValues({
  field,
  option,
  currentValues,
})
```

| Parameter | Description |
|---|---|
| `field` | Relation field configuration |
| `option` | Selected relation option |
| `currentValues` | Current selected values |

### Returns

```js
string | array
```

### Usage Example

```js
const updatedValues =
  getUpdatedRelationValues({
    field,
    option,
    currentValues,
  });
```

## Shared Architectural Principle

```text
Utilities handle pure data transformations.
Hooks manage reusable orchestration logic.
Renderers decide what components should render.
Components handle presentation.
Forms orchestrate submission workflows.
```
