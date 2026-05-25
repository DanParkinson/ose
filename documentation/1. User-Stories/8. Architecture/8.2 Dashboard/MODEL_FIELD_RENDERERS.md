# ModelFieldRenderer

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Default Props](#default-props)
- [Supported Value Types](#supported-value-types)
  - [Boolean Values](#boolean-values)
  - [Array Values](#array-values)
  - [Object Arrays](#object-arrays)
  - [Primitive Values](#primitive-values)
  - [Empty Values](#empty-values)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Dynamic Rendering Behaviour](#dynamic-rendering-behaviour)
- [Key Architectural Principle](#key-architectural-principle)

## Purpose

`ModelFieldRenderer` is a reusable display component used to render dynamic model field values throughout the application.

It provides a consistent rendering system for:
- table field values
- API response data
- model property displays
- reusable dashboard data rendering

The component automatically handles multiple value types including:
- booleans
- arrays
- objects
- primitive values
- empty values

## Responsibilities

`ModelFieldRenderer` is responsible for:

- rendering field values consistently
- handling different data types safely
- displaying boolean icons
- formatting array/object values
- displaying fallback empty values
- maintaining consistent typography and styling

## What It Does Not Do

`ModelFieldRenderer` does not:
- fetch data
- manage state
- mutate values
- know anything about APIs or models
- decide which fields should render

Those responsibilities belong to orchestration components/pages.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `value` | any | The field value to render |
| `emptyValue` | string | Fallback value shown when data is empty |

## Default Props

| Prop | Default |
|---|---|
| `emptyValue` | `"-"` |

# Supported Value Types

## Boolean Values

Boolean values render as icons.

```js
true  → check icon
false → cross icon
```

Styling:
- green for true
- red for false

Example:

```jsx
<ModelFieldRenderer value={true} />
```

## Array Values

Arrays are joined into a readable string.

Primitive values:

```js
["Math", "English"]
```

becomes:

```text
Math, English
```

## Object Arrays

Objects are automatically formatted using:

```js
[item.title, item.level, item.language]
```

Example:

```js
[
  {
    title: "Mathematics",
    level: "Secondary",
    language: "EN",
  }
]
```

becomes:

```text
Mathematics - Secondary - EN
```

## Primitive Values

Strings and numbers render normally:

```jsx
<ModelFieldRenderer value="Mathematics" />
```

## Empty Values

Empty values render the fallback:

```text
-
```

Handled conditions:

```js
value == null || value === ""
```

# Usage Example

```jsx
<ModelFieldRenderer
  value={row[field]}
/>
```

# Example Workflow

```text
API response data received
    ↓
field value passed into ModelFieldRenderer
    ↓
renderer detects value type
    ↓
appropriate display output selected
    ↓
formatted value rendered in table
```

# Dynamic Rendering Behaviour

The component dynamically switches rendering behaviour based on:

```js
typeof value
Array.isArray(value)
```

This allows:
- reusable table rendering
- flexible API structures
- scalable model support

# Key Architectural Principle

```text
Orchestration decides WHAT to render.
ModelFieldRenderer decides HOW to render it.
```

This separation improves:
- reusability
- consistency
- scalability
- maintainability
