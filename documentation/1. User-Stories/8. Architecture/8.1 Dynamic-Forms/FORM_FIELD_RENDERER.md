# FormFieldRenderer

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Supported Field Types](#supported-field-types)
  - [Boolean Fields](#boolean-fields)
  - [Relation Fields](#relation-fields)
  - [Choice Fields](#choice-fields)
  - [Text Fields](#text-fields)
- [Supporting Utilities](#supporting-utilities)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Dynamic Rendering Behaviour](#dynamic-rendering-behaviour)
- [Key Architectural Principle](#key-architectural-principle)

## Purpose

`FormFieldRenderer` is a reusable orchestration component used to dynamically render form field components throughout the application.

It provides a consistent rendering system for:

- reusable form fields
- configuration-driven forms
- backend-driven field rendering
- relation field rendering
- dynamic field workflows

The component automatically determines which field component should render based on configured field metadata.

Supported field types include:

- booleans
- relations
- choices
- text fields

## Responsibilities

`FormFieldRenderer` is responsible for:

- determining which field component should render
- mapping field types to reusable field components
- preparing relation field state
- preparing searchable relation options
- preparing selected relation options
- extracting field validation errors
- passing prepared state into field components

## What It Does Not Do

`FormFieldRenderer` does not:

- manage overall form state
- submit forms
- perform API requests
- store backend data
- manage orchestration workflows
- decide which models exist

Those responsibilities belong to forms, hooks, and orchestration components.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `field` | object | Configured field definition |
| `formData` | object | Current form values |
| `fieldOptions` | object | Backend OPTIONS metadata |
| `fieldErrors` | object | Backend validation errors |
| `relationOptions` | object | Loaded relation options |
| `relationSearch` | object | Current relation search values |
| `debouncedSearch` | object | Debounced relation search values |
| `onChange` | function | Handles field value changes |
| `onRelationToggle` | function | Handles relation selection/removal |
| `onRelationSearchChange` | function | Handles relation search input changes |

# Supported Field Types

## Boolean Fields

Boolean fields render using:

```jsx
<FormFieldBoolean />
```

Used for:

- true/false fields
- switch-based field rendering

Example:

```js
{
  type: "boolean"
}
```

## Relation Fields

Relation fields render using:

```jsx
<FormFieldRelation />
```

Used for:

- searchable relation fields
- single-select relations
- multi-select relations

Example:

```js
{
  type: "relation"
}
```

Additional relation state is prepared automatically:

- filtered options
- selected options
- searchable values

## Choice Fields

Choice fields render using:

```jsx
<FormFieldChoice />
```

Used for:

- backend-driven dropdown fields
- OPTIONS metadata choices

Example:

```js
{
  type: "choice"
}
```

Choice rendering activates when backend choices exist.

## Text Fields

Text fields render using:

```jsx
<FormFieldText />
```

Used for:

- standard text inputs
- default field rendering

Example:

```js
{
  type: "text"
}
```

Fallback rendering defaults to text fields when no specialised field type is matched.

## Supporting Utilities

| Utility | Purpose |
|---|---|
| `getFieldError` | Extracts field validation errors |
| `formatRelationOptions` | Formats relation display labels |
| `getSelectedRelationOptions` | Returns selected relation option objects |
| `getFilteredRelationOptions` | Filters searchable relation options |

# Usage Example

```jsx
<FormFieldRenderer
  field={field}
  formData={formData}
  fieldOptions={fieldOptions}
  fieldErrors={fieldErrors}
  relationOptions={relationOptions}
  relationSearch={relationSearch}
  debouncedSearch={debouncedSearch}
  onChange={handleChange}
  onRelationToggle={handleRelationToggle}
  onRelationSearchChange={handleRelationSearchChange}
/>
```

# Example Workflow

```text
Configured field received
    ↓
FormFieldRenderer checks field type
    ↓
renderer prepares required field state
    ↓
matching reusable field component selected
    ↓
prepared props passed into field component
    ↓
field rendered inside form
```

# Dynamic Rendering Behaviour

The component dynamically switches rendering behaviour based on:

```js
field.type
choices.length
```

This allows:

- configuration-driven forms
- reusable field rendering
- scalable form systems
- reusable relation workflows

# Key Architectural Principle

```text
Orchestration decides WHAT fields exist.
FormFieldRenderer decides HOW fields render.
Reusable field components handle presentation.
```

This separation improves:

- reusability
- consistency
- scalability
- maintainability
