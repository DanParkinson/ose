# Hooks

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Hooks Are Used](#why-hooks-are-used)
- [Current Dynamic Form Hooks](#current-dynamic-form-hooks)
- [useCoreFieldOptions](#usecorefieldoptions)
- [useCoreRelationOptions](#usecorerelationoptions)
- [useDebouncedValue](#usedebouncedvalue)
- [Hook Responsibility Boundaries](#hook-responsibility-boundaries)
- [Dynamic Form Relationship](#dynamic-form-relationship)

## Purpose

Hooks provide reusable stateful logic for the dynamic form system.

They separate:

```text
Data loading
Metadata preparation
Debounced state handling
```

from:

```text
Rendering
Submission
Field UI
```

This keeps dynamic forms smaller and easier to reuse.

## Why Hooks Are Used

Without reusable hooks, dynamic forms would contain repeated logic for:

```text
Loading backend metadata
Loading relation options
Managing debounced search values
```

Hooks allow these workflows to remain modular and reusable across different forms.

The form components can focus on:

```text
Rendering fields
Managing form state
Handling submission
```

instead of low-level reusable workflows.

## Current Dynamic Form Hooks

The current system uses:

| Hook | Purpose |
|---|---|
| `useCoreFieldOptions` | Loads backend OPTIONS metadata |
| `useCoreRelationOptions` | Loads relation option records |
| `useDebouncedValue` | Delays rapidly changing values |

These hooks support the rendering and interaction layers of the dynamic form system.

## useCoreFieldOptions

`useCoreFieldOptions` loads backend OPTIONS metadata for a model endpoint.

Example:

```js
const fieldOptions =
  useCoreFieldOptions(model.endpoint);
```

This metadata is primarily used for:

```text
Choice field rendering
Backend-driven field choices
Field metadata access
```

The hook keeps OPTIONS loading separate from the form component itself.

## useCoreRelationOptions

`useCoreRelationOptions` loads selectable relation records for relation fields.

Example:

```js
const relationOptions =
  useCoreRelationOptions(model.createFields);
```

The hook:

```text
Detects relation fields
Loads relation endpoint data
Stores relation records by field name
```

This keeps relation loading separate from rendering and interaction workflows.

## useDebouncedValue

`useDebouncedValue` delays rapidly changing state values.

Example:

```js
const debouncedSearch =
  useDebouncedValue(relationSearch, 500);
```

This is primarily used for:

```text
Relation search filtering
Reducing unnecessary rerenders
Reducing expensive filtering operations
```

The hook separates:

```text
Immediate typing state
```

from:

```text
Delayed filtering state
```

This improves relation search usability.

## Hook Responsibility Boundaries

Hooks are responsible for:

```text
Loading reusable data
Managing reusable state logic
Preparing reusable values
```

Hooks are not responsible for:

```text
Rendering field UI
Submitting forms
Displaying errors
Managing parent workflows
```

This keeps hooks focused on reusable stateful behaviour.

## Dynamic Form Relationship

The dynamic form components use hooks to prepare reusable data before rendering begins.

Example:

```js
const fieldOptions =
  useCoreFieldOptions(model.endpoint);

const relationOptions =
  useCoreRelationOptions(model.createFields);

const debouncedSearch =
  useDebouncedValue(relationSearch, 500);
```

The prepared values are then passed into:

```text
FormFieldRenderer
Relation utilities
Field components
```

This keeps the dynamic form architecture layered and modular.