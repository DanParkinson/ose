# Selected Relation Options

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Selected Options Are Needed](#why-selected-options-are-needed)
- [getSelectedRelationOptions](#getselectedrelationoptions)
- [Single Selection](#single-selection)
- [Multiple Selection](#multiple-selection)
- [Selected Value Matching](#selected-value-matching)
- [Dynamic Form Relationship](#dynamic-form-relationship)
- [Example Utility](#example-utility)

## Purpose

Selected relation options are responsible for determining which loaded relation records are currently selected inside a relation field.

The frontend stores selected relation values separately from the loaded relation option objects.

This utility converts stored relation values back into full option objects that can be displayed inside the UI.

## Why Selected Options Are Needed

Relation fields store selected values inside `formData`.

Example:

```js
{
  subjects: [
    "subject-id-1",
    "subject-id-2",
  ]
}
```

However, rendering components often need the full relation objects.

Example:

```js
{
  subject_id: "subject-id-1",
  title: "Mathematics",
}
```

The selected relation option workflow connects:

```text
Stored selected values
```

to:

```text
Loaded relation records
```

This allows the frontend to display selected relation labels correctly.

## getSelectedRelationOptions

The current system uses:

```js
getSelectedRelationOptions()
```

The utility receives:

| Parameter | Purpose |
|---|---|
| `options` | Loaded relation records |
| `selectedValues` | Current selected form values |
| `optionValue` | Record identifier field |
| `multiple` | Whether multi-selection is enabled |

The utility returns the selected relation option objects.

## Single Selection

Single relation fields store one selected value.

Example:

```js
{
  subject: "subject-id-1"
}
```

The utility matches:

```js
option[optionValue] === selectedValues
```

and returns the matching relation object.

## Multiple Selection

Multiple relation fields store arrays of selected values.

Example:

```js
{
  subjects: [
    "subject-id-1",
    "subject-id-2",
  ]
}
```

The utility checks whether each option identifier exists inside the selected value array.

Example:

```js
selectedValues.includes(
  option[optionValue]
)
```

Matching records are returned as the selected options.

## Selected Value Matching

The utility uses:

```js
option[optionValue]
```

to match loaded records against stored form values.

Example:

```js
optionValue: "subject_id"
```

This allows the utility to remain reusable across different backend models and relation types.

The utility does not hardcode model-specific identifiers.

## Dynamic Form Relationship

Selected relation options are used during:

```text
Selected relation rendering
Selection display
Relation toggle workflows
Search result rendering
```

The dynamic form stores only selected identifiers inside `formData`.

The selected option utility reconstructs the related option objects when rendering is required.

This keeps form state smaller and simpler.

## Example Utility

```js
const getSelectedRelationOptions = ({
  options,
  selectedValues,
  optionValue,
  multiple = false,
}) => {
  if (multiple) {
    return options.filter((option) =>
      selectedValues.includes(
        option[optionValue]
      )
    );
  }

  return options.filter(
    (option) =>
      option[optionValue] ===
      selectedValues
  );
};

export default getSelectedRelationOptions;
```

The utility is intentionally reusable and configuration-driven.

The frontend does not manually reconstruct selected relation records.