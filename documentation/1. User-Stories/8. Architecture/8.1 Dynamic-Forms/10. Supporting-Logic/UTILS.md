# Utilities

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Utilities Are Used](#why-utilities-are-used)
- [Current Dynamic Form Utilities](#current-dynamic-form-utilities)
- [Form State Utilities](#form-state-utilities)
- [Relation Utilities](#relation-utilities)
- [Error Utilities](#error-utilities)
- [Utility Responsibility Boundaries](#utility-responsibility-boundaries)
- [Dynamic Form Relationship](#dynamic-form-relationship)

## Purpose

Utilities provide reusable pure logic for the dynamic form system.

Utilities separate:

```text
Data transformation
Selection logic
Formatting logic
Error parsing
```

from:

```text
Rendering
Submission
Component state
```

This keeps the dynamic form architecture modular and reusable.

## Why Utilities Are Used

Without reusable utilities, dynamic forms would contain repeated logic for:

```text
Preparing initial form state
Formatting relation labels
Filtering relation options
Updating selected relation values
Parsing backend errors
```

Utilities allow these workflows to remain isolated and reusable across multiple forms and features.

The utilities are intentionally stateless and reusable.

## Current Dynamic Form Utilities

The current system uses:

| Utility | Purpose |
|---|---|
| `getInitialFormData` | Creates initial form state |
| `formatRelationOption` | Formats relation display labels |
| `getFilteredRelationOptions` | Filters relation options from search input |
| `getSelectedRelationOptions` | Calculates selected relation objects |
| `getUpdatedRelationValues` | Updates selected relation values |
| `parseBackendErrors` | Separates backend field and general errors |
| `getFieldError` | Retrieves a field-specific validation error |

These utilities support the data preparation, interaction, and response handling layers.

## Form State Utilities

### getInitialFormData

`getInitialFormData` generates the initial form state structure.

Example:

```js
const initialData =
  getInitialFormData(model.createFields);
```

The utility:

```text
Creates default field values
Supports existing update data
Supports relation defaults
Supports boolean defaults
```

This keeps initial state generation outside the form component itself.

## Relation Utilities

### formatRelationOption

Formats backend relation records into display-safe labels.

Example:

```text
Mathematics - secondary - en
```

### getFilteredRelationOptions

Filters loaded relation options using search input.

This supports searchable relation fields.

### getSelectedRelationOptions

Calculates the currently selected relation objects from stored relation IDs.

### getUpdatedRelationValues

Handles adding, removing, and replacing selected relation values.

Supports:

```text
Single relation selection
Multiple relation selection
```

These utilities keep relation logic separated from rendering components.

## Error Utilities

### parseBackendErrors

Separates backend API errors into:

```text
fieldErrors
generalError
```

This standardises backend error handling across forms.

### getFieldError

Retrieves the validation error for a specific field.

Example:

```js
getFieldError(fieldErrors, field.name)
```

This keeps field error lookup reusable and consistent.

## Utility Responsibility Boundaries

Utilities are responsible for:

```text
Pure logic
Data transformation
Reusable calculations
Formatting
Error parsing
```

Utilities are not responsible for:

```text
Rendering UI
Managing React state
Submitting requests
Managing component lifecycle
```

This keeps utilities highly reusable and easy to maintain.

## Dynamic Form Relationship

The dynamic form system uses utilities throughout the workflow.

Examples:

```text
Initial form state generation
Relation formatting
Relation filtering
Selection updates
Error handling
```

The forms and renderers orchestrate the workflow, while the utilities handle the reusable logic underneath.

This separation keeps the dynamic form architecture layered and scalable.