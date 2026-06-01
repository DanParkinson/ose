# Relation Option Formatting

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Formatting Is Needed](#why-formatting-is-needed)
- [formatRelationOption](#formatrelationoption)
- [Display Fields](#display-fields)
- [Fallback Formatting](#fallback-formatting)
- [optionLabel Relationship](#optionlabel-relationship)
- [Dynamic Form Relationship](#dynamic-form-relationship)
- [Example Utility](#example-utility)

## Purpose

Relation option formatting is responsible for converting loaded relation records into display-safe labels.

Backend relation records often contain multiple fields.

The frontend must decide which values should be displayed to the user.

Formatting is separated into its own utility so display logic remains reusable and independent from rendering components.

## Why Formatting Is Needed

Relation records are returned as backend objects.

Example:

```js
{
  subject_id: "uuid",
  title: "Mathematics",
  level: "secondary",
  language: "en",
}
```

These objects cannot be displayed directly inside relation fields.

The frontend must convert them into readable labels.

Example:

```text
Mathematics - secondary - en
```

The formatting utility standardises this process across the dynamic form system.

## formatRelationOption

The current system uses:

```js
formatRelationOption(option, field)
```

The utility receives:

| Parameter | Purpose |
|---|---|
| `option` | Loaded backend relation record |
| `field` | Relation field configuration |

The utility returns a formatted display label.

## Display Fields

Relation fields can optionally define:

```js
displayFields
```

Example:

```js
{
  name: "subjects",
  type: "relation",
  displayFields: [
    "title",
    "level",
    "language",
  ],
}
```

When `displayFields` exists, the formatter combines those values.

Example result:

```text
Mathematics - secondary - en
```

This allows relation labels to display richer contextual information.

## Fallback Formatting

If `displayFields` is not provided, the formatter falls back to standard formatting rules.

Current fallback behaviour:

```js
if (
  option.title &&
  option.level &&
  option.language
)
```

Example result:

```text
Mathematics - secondary - en
```

This provides readable default formatting without requiring every relation field to define custom display fields.

## optionLabel Relationship

If no custom formatting rules match, the utility falls back to:

```js
option[field.optionLabel]
```

Example:

```js
optionLabel: "title"
```

Result:

```text
Mathematics
```

This guarantees every relation option can still produce a display label.

## Dynamic Form Relationship

Formatted relation labels are used throughout the relation workflow.

Examples:

```text
Search filtering
Selected option display
Relation dropdown rendering
Selection lists
```

The formatting utility keeps display logic outside reusable relation field components.

This prevents rendering components from containing model-specific formatting rules.

## Example Utility

```js
const formatRelationOption = (
  option,
  field
) => {
  if (field.displayFields) {
    return field.displayFields
      .map(
        (displayField) =>
          option[displayField]
      )
      .filter(Boolean)
      .join(" - ");
  }

  if (
    option.title &&
    option.level &&
    option.language
  ) {
    return `${option.title} - ${option.level} - ${option.language}`;
  }

  return option[field.optionLabel];
};

export default formatRelationOption;
```

The utility is intentionally reusable and configuration-driven.

The renderer does not manually construct relation labels.