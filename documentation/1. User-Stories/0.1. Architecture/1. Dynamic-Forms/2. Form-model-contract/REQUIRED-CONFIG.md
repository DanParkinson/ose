# Required Form Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Form Configuration Contract](#form-configuration-contract)
- [Required Model Values](#required-model-values)
- [Required Field Values](#required-field-values)
- [Create Form Requirements](#create-form-requirements)
- [Update Form Requirements](#update-form-requirements)
- [Example Configuration](#example-configuration)

## Purpose

Dynamic forms are built from configuration.

Instead of manually writing a separate form for each feature, the parent feature passes a configuration object into the form system.

The form uses this configuration to determine:

```text
Which endpoint to submit to
Which fields to render
Which field names match the backend
Which labels to display
Which field type each input should use
```

## Form Configuration Contract

A form configuration object acts as a contract between the parent feature and the dynamic form.

The parent feature is responsible for providing the configuration.

The dynamic form is responsible for reading that configuration and building the form from it.

```text
Parent feature
    ↓
passes form config
    ↓
dynamic form reads config
    ↓
fields render
    ↓
form submits to configured endpoint
```

The current implementation receives this configuration through the `model` prop.

```jsx
<CoreModelCreateForm
  model={model}
  onCreated={handleCreated}
/>
```

## Required Model Values

A dynamic form needs enough information to identify the resource it is working with.

| Property | Purpose |
|---|---|
| `title` | Human-readable name used in messages |
| `endpoint` | API endpoint used for create requests |
| `detailEndpoint` | API endpoint used for update/delete requests |
| `createFields` | Fields rendered by create forms |
| `updateFields` | Fields rendered by update forms |

Not every form needs every property.

Create forms mainly require:

```text
title
endpoint
createFields
```

Update/delete forms mainly require:

```text
title
detailEndpoint
updateFields
```

## Required Field Values

Each field definition needs a minimum structure.

```js
{
  name: "title",
  label: "Title",
  type: "text",
}
```

| Property | Purpose |
|---|---|
| `name` | Backend field name |
| `label` | User-facing field label |
| `type` | Field type used by the renderer |

The `name` value must match the field expected by the backend API.

The `label` value controls what the user sees.

The `type` value tells the renderer which input component to use.

## Create Form Requirements

A create form uses `createFields` to build the form.

```js
createFields: [
  { name: "title", label: "Title", type: "text" },
]
```

The create form uses:

```text
model.endpoint
model.createFields
```

to:

```text
generate initial form state
render the correct fields
submit form data to the backend
```

## Update Form Requirements

An update form uses `updateFields` to build the editable form.

```js
updateFields: [
  { name: "title", label: "Title", type: "text" },
]
```

The update/delete form uses:

```text
model.detailEndpoint
model.updateFields
existing row data
```

to:

```text
populate initial values
render editable fields
submit updates to the backend
delete the selected record
```

## Example Configuration

```js
const model = {
  id: "subjects",
  title: "Subjects",
  endpoint: "/core/subjects/",
  detailEndpoint: "/core/subjects/",

  createFields: [
    { name: "title", label: "Title", type: "text" },
    { name: "level", label: "Level", type: "choice" },
    { name: "language", label: "Language", type: "choice" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "is_protected", label: "Protected", type: "boolean" },
  ],

  updateFields: [
    { name: "title", label: "Title", type: "text" },
    { name: "level", label: "Level", type: "choice" },
    { name: "language", label: "Language", type: "choice" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "is_protected", label: "Protected", type: "boolean" },
  ],
};
```

This configuration gives the dynamic form enough information to:

```text
Build create forms
Build update forms
Match frontend fields to backend fields
Render the correct input types
Submit to the correct API endpoints
```