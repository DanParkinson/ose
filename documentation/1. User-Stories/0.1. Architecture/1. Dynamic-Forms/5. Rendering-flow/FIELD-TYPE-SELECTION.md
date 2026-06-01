# Field Type Selection

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Selection Responsibility](#selection-responsibility)
- [Selection Inputs](#selection-inputs)
- [Boolean Selection](#boolean-selection)
- [Relation Selection](#relation-selection)
- [Choice Selection](#choice-selection)
- [Text Fallback](#text-fallback)
- [Selection Order](#selection-order)

## Purpose

Field type selection determines which reusable field component should render for a configured form field.

The dynamic form system does not hardcode form inputs directly.

Instead, each field definition is passed into `FormFieldRenderer`, and the renderer selects the correct component based on field configuration and backend metadata.

## Selection Responsibility

Field type selection is handled inside:

```text
FormFieldRenderer
```

The renderer decides between:

```text
FormFieldBoolean
FormFieldRelation
FormFieldChoice
FormFieldText
```

The renderer does not decide which fields exist.

The parent form provides the configured fields.

## Selection Inputs

Field selection currently depends on two sources.

```text
Field configuration
Backend OPTIONS metadata
```

Field configuration controls explicit field types such as:

```text
boolean
relation
text
```

Backend OPTIONS metadata controls whether a field has available choices.

## Boolean Selection

Boolean fields are selected from the field configuration.

```js
if (field.type === "boolean") {
```

Example field:

```js
{
  name: "is_published",
  label: "Published",
  type: "boolean",
}
```

This renders:

```text
FormFieldBoolean
```

Boolean fields are selected before choice fields because they do not depend on backend OPTIONS choices.

## Relation Selection

Relation fields are selected from the field configuration.

```js
if (field.type === "relation") {
```

Example field:

```js
{
  name: "subjects",
  label: "Subjects",
  type: "relation",
}
```

This renders:

```text
FormFieldRelation
```

Relation fields require extra preparation before rendering, including loaded options, selected options, and filtered search results.

## Choice Selection

Choice fields are selected using backend OPTIONS metadata.

```js
const backendField = fieldOptions[field.name];
const choices = backendField?.choices || [];
```

If choices exist:

```js
if (choices.length > 0) {
```

the renderer returns:

```text
FormFieldChoice
```

This means the frontend field configuration marks the field as a choice field, while the backend supplies the actual available options.

## Text Fallback

If no specialised field type matches, the renderer falls back to:

```text
FormFieldText
```

This supports standard text fields and provides a safe default.

Example fallback:

```js
return (
  <FormFieldText
    field={field}
    value={formData[field.name]}
    error={fieldError}
    onChange={onChange}
  />
);
```

## Selection Order

Field type selection currently follows this order:

```text
1. Boolean
2. Relation
3. Choice
4. Text fallback
```

This order keeps rendering predictable.

Boolean and relation fields are explicit field types.

Choice fields depend on backend metadata.

Text fields act as the final fallback.