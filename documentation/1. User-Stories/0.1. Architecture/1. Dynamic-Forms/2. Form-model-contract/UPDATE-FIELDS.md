# Update Fields

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [updateFields](#updatefields)
- [Field Structure](#field-structure)
- [Field Properties](#field-properties)
- [Supported Field Types](#supported-field-types)
- [Update Form Relationship](#update-form-relationship)
- [Existing Data Relationship](#existing-data-relationship)
- [Example Configuration](#example-configuration)

## Purpose

`updateFields` defines which fields should appear inside update forms.

The update form reads this configuration and dynamically generates editable fields using existing model data.

This allows reusable update forms to be built from configuration instead of manually creating separate update forms for every resource.

## updateFields

`updateFields` is an array of field definition objects.

Example:

```js
updateFields: [
  { name: "title", label: "Title", type: "text" },
  { name: "level", label: "Level", type: "choice" },
]
```

Each object describes one editable field.

The order of the array controls the render order inside the update form.

## Field Structure

Each field currently follows this structure:

```js
{
  name: "title",
  label: "Title",
  type: "text",
}
```

## Field Properties

| Property | Purpose |
|---|---|
| `name` | Backend field name |
| `label` | User-facing field label |
| `type` | Field renderer type |

### name

The `name` value must match the backend serializer field.

Example:

```js
name: "title"
```

This value is used when building the update payload.

### label

The `label` value controls the displayed field label.

Example:

```js
label: "Title"
```

### type

The `type` value determines which field renderer should be used.

Example:

```js
type: "text"
```

## Supported Field Types

The current system supports:

```text
text
choice
boolean
relation
```

Field types are interpreted by `FormFieldRenderer`.

## Update Form Relationship

`CoreModelUpdateDeleteForm` reads:

```js
model.updateFields
```

and dynamically renders editable fields.

Example:

```jsx
{model.updateFields.map((field) => (
  <FormFieldRenderer
    key={field.name}
    field={field}
  />
))}
```

The update form does not hardcode individual fields.

Instead, the configuration determines the editable form structure.

## Existing Data Relationship

Unlike create forms, update forms use existing row data to populate initial values.

Example:

```js
{
  title: "Mathematics",
  level: "secondary",
  is_published: true,
}
```

The field `name` values are used to match existing row data to rendered fields.

This allows the form to automatically display the current backend values.

## Example Configuration

```js
updateFields: [
  { name: "title", label: "Title", type: "text" },

  { name: "level", label: "Level", type: "choice" },

  {
    name: "is_published",
    label: "Published",
    type: "boolean",
  },
]
```