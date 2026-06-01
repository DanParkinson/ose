# Initial Form Data

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Initial Form Data Is Needed](#why-initial-form-data-is-needed)
- [getInitialFormData](#getinitialformdata)
- [Configuration Relationship](#configuration-relationship)
- [Existing Data Relationship](#existing-data-relationship)
- [Generated Form State](#generated-form-state)
- [Field Type Defaults](#field-type-defaults)
- [Create Form Relationship](#create-form-relationship)
- [Update Form Relationship](#update-form-relationship)
- [Example Workflow](#example-workflow)
- [Example Utility](#example-utility)

## Purpose

Initial form data is responsible for generating predictable form state for dynamic forms.

The utility converts:

```text
Field configuration
Optional existing backend data
```

into a stable frontend `formData` object.

This allows the same form system to support both:

```text
Create workflows
Update workflows
```

without manually defining form state for each model.

## Why Initial Form Data Is Needed

Dynamic forms are generated from configuration instead of hardcoded inputs.

Because the fields are dynamic, the form system must automatically generate:

```text
Initial field values
Boolean defaults
Relation defaults
Editable update values
Consistent formData structure
```

Without this workflow, the form would not know:

```text
Which keys should exist
Which values should be editable
Which defaults should be used
How existing data should populate fields
```

## getInitialFormData

The current system uses:

```js
getInitialFormData()
```

to generate initial form state.

Example:

```js
const [formData, setFormData] = useState(() =>
  getInitialFormData(model.createFields)
);
```

The utility can also receive existing backend data.

Example:

```js
getInitialFormData(
  model.updateFields,
  existingData
);
```

This allows the same utility to support both empty create forms and populated update forms.

## Configuration Relationship

The utility reads field configuration.

Example:

```js
createFields: [
  { name: "title", type: "text" },
  { name: "level", type: "choice" },
  { name: "is_published", type: "boolean" },
]
```

The configuration determines:

```text
Which form keys should exist
Which field types require special defaults
How relation fields should initialise
```

The utility does not hardcode model-specific logic.

## Existing Data Relationship

The utility optionally accepts:

```js
existingData
```

Example:

```js
{
  title: "Mathematics",
  level: "secondary",
  is_published: true,
}
```

If existing data contains a matching field value:

```js
existingData[field.name]
```

that value becomes the initial form value.

Example:

```js
if (
  existingData &&
  existingData[field.name] !== undefined
)
```

This allows update forms to automatically hydrate form state using backend data.

## Generated Form State

The generated object becomes the form's `formData` state.

Example:

```js
{
  title: "",
  level: "",
  is_published: false,
}
```

or when existing data is provided:

```js
{
  title: "Mathematics",
  level: "secondary",
  is_published: true,
}
```

The generated structure always matches the configured field names.

This guarantees predictable form state throughout the form lifecycle.

## Field Type Defaults

Different field types require different default values.

Current defaults:

| Field Type | Default Value |
|---|---|
| `text` | `""` |
| `choice` | `""` |
| `boolean` | `false` |
| `relation` (multiple) | `[]` |
| `relation` (single) | `""` |

Relation fields use:

```js
field.multiple
```

to determine whether the default should be an array or a single value.

## Create Form Relationship

Create forms use generated defaults because no existing backend record exists yet.

Example:

```js
getInitialFormData(model.createFields)
```

The generated object provides the initial empty form structure before user interaction begins.

## Update Form Relationship

Update forms provide existing backend data.

Example:

```js
getInitialFormData(
  model.updateFields,
  row
)
```

The utility combines:

```text
Field configuration
Existing backend values
```

to generate editable form state.

This keeps create and update workflows consistent while avoiding duplicated logic.

## Example Workflow

```text
Parent feature passes model config
        ↓
Form receives field configuration
        ↓
Optional existing data provided
        ↓
getInitialFormData executes
        ↓
Stable formData object generated
        ↓
Fields render using generated values
```

## Example Utility

```js
const getInitialFormData = (
  fields,
  existingData = null
) => {
  const initialData = {};

  fields.forEach((field) => {
    if (
      existingData &&
      existingData[field.name] !== undefined
    ) {
      initialData[field.name] =
        existingData[field.name];

    } else if (field.type === "boolean") {
      initialData[field.name] = false;

    } else if (field.type === "relation") {
      initialData[field.name] =
        field.multiple ? [] : "";

    } else {
      initialData[field.name] = "";
    }
  });

  return initialData;
};
```

The utility is intentionally configuration-driven.

The form system does not manually define model-specific initial state.