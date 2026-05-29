# Create Fields

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [createFields](#createfields)
- [Field Structure](#field-structure)
- [Field Properties](#field-properties)
- [Supported Field Types](#supported-field-types)
- [Form Relationship](#form-relationship)
- [Example Configuration](#example-configuration)

## Purpose

`createFields` defines which fields should appear inside a create form.

The create form reads this configuration and dynamically generates the form fields.

This allows reusable forms to be built from configuration instead of manually writing separate create forms for each resource.

## createFields

`createFields` is an array of field definition objects.

Example:

```js
createFields: [
  { name: "title", label: "Title", type: "text" },
  { name: "level", label: "Level", type: "choice" },
]
```

Each object describes one form field.

The order of the array controls the render order inside the form.

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

This value is used when building the submitted form payload.

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

## Form Relationship

`CoreModelCreateForm` reads:

```js
model.createFields
```

and dynamically renders fields.

Example:

```jsx
{model.createFields.map((field) => (
  <FormFieldRenderer
    key={field.name}
    field={field}
  />
))}
```

The create form does not hardcode individual fields.

Instead, the configuration determines the rendered form structure.

## Example Configuration

```js
createFields: [
  { name: "title", label: "Title", type: "text" },

  { name: "level", label: "Level", type: "choice" },

  {
    name: "is_published",
    label: "Published",
    type: "boolean",
  },
]
```