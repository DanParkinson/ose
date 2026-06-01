# ModelFieldRenderer

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why ModelFieldRenderer Exists](#why-modelfieldrenderer-exists)
- [Responsibilities](#responsibilities)
- [What ModelFieldRenderer Does Not Do](#what-modelfieldrenderer-does-not-do)
- [Props](#props)
- [Supported Value Types](#supported-value-types)
- [Boolean Values](#boolean-values)
- [Array Values](#array-values)
- [Object Arrays](#object-arrays)
- [Text Values](#text-values)
- [Empty Values](#empty-values)
- [Text Formatting](#text-formatting)
- [Relationship With DashboardTable](#relationship-with-dashboardtable)
- [Rendering Workflow](#rendering-workflow)

## Purpose

`ModelFieldRenderer` is a reusable display component used throughout the dashboard system.

It is responsible for rendering field values in a consistent way regardless of the resource being displayed.

The renderer automatically handles different value types and converts them into user-friendly output.

## Why ModelFieldRenderer Exists

Dashboard tables display many different field types.

Examples:

```text
Strings
Booleans
Arrays
Object arrays
Empty values
```

Without a shared renderer, each table would need to manually handle every possible value type.

`ModelFieldRenderer` centralises that logic into a single reusable component.

## Responsibilities

`ModelFieldRenderer` is responsible for:

```text
Displaying field values
Formatting text values
Displaying boolean icons
Formatting arrays
Formatting object arrays
Displaying fallback values
```

## What ModelFieldRenderer Does Not Do

`ModelFieldRenderer` does not:

```text
Fetch data
Manage state
Know which field is being rendered
Know which model is active
Perform API requests
Mutate values
```

Those responsibilities belong to:

```text
Dashboard orchestration
DashboardTable
coreModels
API utilities
```

## Props

| Prop | Purpose |
|---|---|
| `value` | Field value to display |
| `emptyValue` | Fallback value for empty values |

### Default Values

```js
emptyValue = "-"
```

## Supported Value Types

The renderer automatically chooses how to display values based on their type.

Supported types:

```text
Boolean
Array
Object Array
String
Number
Null
Undefined
```

## Boolean Values

Boolean values render as icons.

Example:

```js
true
```

renders:

```text
✓
```

Example:

```js
false
```

renders:

```text
✕
```

Implementation:

```js
if (typeof value === "boolean")
```

Styling:

```text
Green icon for true
Red icon for false
```

This makes status fields easier to scan visually inside tables.

## Array Values

Arrays are rendered as comma-separated values.

Example:

```js
["Math", "English"]
```

renders:

```text
Math, English
```

Implementation:

```js
if (Array.isArray(value))
```

This allows simple array values to display cleanly inside table cells.

## Object Arrays

Arrays containing objects receive additional formatting.

Example:

```js
[
  {
    title: "Mathematics",
    level: "secondary",
    language: "en",
  }
]
```

renders:

```text
Mathematics - secondary - en
```

Implementation:

```js
[item.title, item.level, item.language]
  .filter(Boolean)
  .join(" - ");
```

Only existing values are included.

Missing values are automatically removed.

## Text Values

Strings and numbers render as standard text.

Example:

```js
"mathematics"
```

renders:

```text
Mathematics
```

Example:

```js
42
```

renders:

```text
42
```

Text values are automatically formatted before rendering.

## Empty Values

The renderer handles empty values safely.

Handled values:

```js
null
undefined
""
```

These values render the fallback:

```text
-
```

Implementation:

```js
formatTextValue(value) || emptyValue
```

This keeps table layouts consistent even when data is missing.

## Text Formatting

Text values are formatted using:

```js
formatTextValue()
```

Example:

```js
"secondary"
```

becomes:

```text
Secondary
```

Implementation:

```js
const stringValue = String(value);

return (
  stringValue.charAt(0).toUpperCase() +
  stringValue.slice(1)
);
```

This improves readability without modifying the underlying data.

## Relationship With DashboardTable

`DashboardTable` decides:

```text
Which fields should render
```

`ModelFieldRenderer` decides:

```text
How values should render
```

Example:

```text
DashboardTable
        ↓
field value selected
        ↓
ModelFieldRenderer
        ↓
formatted output
```

This keeps table structure and value formatting separated.

## Rendering Workflow

```text
DashboardTable passes field value
        ↓
ModelFieldRenderer receives value
        ↓
Value type detected
        ↓
Boolean
Array
Object Array
Text
Empty
        ↓
Appropriate rendering path selected
        ↓
Formatted output displayed
```

## Key Architectural Principle

```text
DashboardTable decides WHAT to display.

ModelFieldRenderer decides HOW to display it.
```

This separation allows dashboard tables to remain reusable while ensuring values are rendered consistently across the application.