# Field Changes

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Field Change Flow](#field-change-flow)
- [handleChange](#handlechange)
- [Text Field Changes](#text-field-changes)
- [Choice Field Changes](#choice-field-changes)
- [Boolean Field Changes](#boolean-field-changes)
- [Error Clearing](#error-clearing)
- [Create and Update Form Relationship](#create-and-update-form-relationship)

## Purpose

Field changes update the dynamic form's `formData` state when a user interacts with a form field.

The same field change pattern is shared across create and update forms.

## Field Change Flow

```text
User changes field value
        ↓
Field component calls onChange
        ↓
FormFieldRenderer passes callback upward
        ↓
Parent form handleChange runs
        ↓
formData updates
        ↓
field error clears
        ↓
form rerenders with new value
```

## handleChange

Both create and update forms use the same state update pattern.

```js
const handleChange = (name, value) => {
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setFieldErrors((prev) => ({
    ...prev,
    [name]: null,
  }));
};
```

The function receives:

| Parameter | Purpose |
|---|---|
| `name` | Field name being updated |
| `value` | New field value |

The `name` value matches the backend field name from the field configuration.

## Text Field Changes

Text fields call `onChange` with the field name and input value.

```js
onChange(field.name, event.target.value)
```

Example flow:

```text
User types into text input
        ↓
FormFieldText reads event.target.value
        ↓
onChange(field.name, value)
        ↓
handleChange updates formData
```

## Choice Field Changes

Choice fields follow the same change contract as text fields.

```js
onChange(field.name, event.target.value)
```

The selected option value is stored in `formData` using the field name.

## Boolean Field Changes

Boolean fields use switch state instead of `event.target.value`.

```js
onChange(field.name, details.checked)
```

This stores a boolean value in `formData`.

Example:

```js
{
  is_published: true
}
```

## Error Clearing

When a field changes, its field-level error is cleared.

```js
setFieldErrors((prev) => ({
  ...prev,
  [name]: null,
}));
```

This means the user does not continue seeing an old validation error after editing the field.

General form errors are not cleared by this function.

## Create and Update Form Relationship

Create and update forms both use the same field change workflow.

Create forms update empty initial form state.

Update forms update state generated from existing row data.

The field components do not need to know whether they are inside a create or update form.

They only call the provided `onChange` handler.