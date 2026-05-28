# Backend OPTIONS Metadata

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why OPTIONS Metadata Is Needed](#why-options-metadata-is-needed)
- [OPTIONS Requests](#options-requests)
- [fetchCoreModelOptions](#fetchcoremodeloptions)
- [useCoreFieldOptions](#usecorefieldoptions)
- [Metadata Workflow](#metadata-workflow)
- [Choice Field Relationship](#choice-field-relationship)
- [Dynamic Form Relationship](#dynamic-form-relationship)
- [Example Workflow](#example-workflow)
- [Example Utility](#example-utility)

## Purpose

Backend OPTIONS metadata allows dynamic forms to retrieve field information directly from the backend API.

This removes the need to hardcode backend field choices inside frontend forms.

The metadata workflow allows the frontend to dynamically understand:

```text
Available field choices
Field types
Writable fields
Backend field metadata
```

without manually duplicating backend configuration.

## Why OPTIONS Metadata Is Needed

Dynamic forms are configuration-driven.

The frontend knows:

```text
Which fields should exist
Which field type should render
```

but some field data can only be provided by the backend.

Example:

```text
Serializer choice values
Writable field metadata
Backend field constraints
```

Without OPTIONS metadata, choice values would need to be manually duplicated inside frontend configuration.

This would create:

```text
Repeated configuration
Frontend/backend mismatch risk
Hardcoded dropdown values
```

The OPTIONS workflow keeps backend field definitions as the source of truth.

## OPTIONS Requests

The frontend retrieves metadata using HTTP `OPTIONS` requests.

Example:

```text
OPTIONS /core/subjects/
```

The backend returns serializer metadata describing the endpoint fields.

This metadata can include:

```text
Choice values
Field types
Required status
Writable fields
```

## fetchCoreModelOptions

The current system uses:

```js
fetchCoreModelOptions()
```

to request endpoint metadata.

Example:

```js
export const fetchCoreModelOptions = async ({
  endpoint,
}) => {
  const response =
    await axiosResponse.options(endpoint);

  return response.data;
};
```

The utility sends the OPTIONS request and returns the backend metadata object.

## useCoreFieldOptions

The frontend loads metadata through:

```js
useCoreFieldOptions()
```

Example:

```js
const fieldOptions =
  useCoreFieldOptions(model.endpoint);
```

The hook receives:

```js
model.endpoint
```

and loads backend metadata for the configured resource.

The hook keeps metadata loading separate from the form orchestration layer.

## Metadata Workflow

```text
Dynamic form receives model.endpoint
        ↓
useCoreFieldOptions executes
        ↓
fetchCoreModelOptions sends OPTIONS request
        ↓
Backend returns serializer metadata
        ↓
Metadata stored in frontend state
        ↓
Choice fields consume returned metadata
```

## Choice Field Relationship

Choice fields rely heavily on backend metadata.

Example field configuration:

```js
{
  name: "level",
  label: "Level",
  type: "choice",
}
```

The frontend knows the field should render as a choice field.

The backend metadata provides the actual available values.

Example:

```text
Primary
Secondary
```

This keeps frontend forms aligned with backend serializer definitions.

## Dynamic Form Relationship

Dynamic forms load metadata using:

```js
const fieldOptions =
  useCoreFieldOptions(model.endpoint);
```

The returned metadata is passed into:

```jsx
<FormFieldRenderer
  fieldOptions={fieldOptions}
/>
```

Field renderers and field components can then retrieve backend field choices dynamically.

The form itself does not hardcode choice values.

## Example Workflow

```text
Parent feature passes model config
        ↓
Dynamic form receives endpoint
        ↓
useCoreFieldOptions loads metadata
        ↓
Backend OPTIONS request executes
        ↓
Serializer metadata returned
        ↓
Choice fields receive backend values
        ↓
Dynamic fields render available choices
```

## Example Utility

```js
export const fetchCoreModelOptions = async ({
  endpoint,
}) => {
  const response =
    await axiosResponse.options(endpoint);

  return response.data;
};
```

Example usage:

```js
const fieldOptions =
  useCoreFieldOptions(model.endpoint);
```

The dynamic form system uses backend metadata to reduce duplicated frontend field configuration.