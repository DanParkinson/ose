# FormFieldRenderer

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Renderer Responsibility](#renderer-responsibility)
- [Inputs](#inputs)
- [Backend Field Metadata](#backend-field-metadata)
- [Field Error Preparation](#field-error-preparation)
- [Boolean Field Rendering](#boolean-field-rendering)
- [Relation Field Rendering](#relation-field-rendering)
- [Choice Field Rendering](#choice-field-rendering)
- [Text Field Fallback](#text-field-fallback)
- [Rendering Order](#rendering-order)

## Purpose

`FormFieldRenderer` decides which reusable field component should render for a configured form field.

It acts as the connection point between:

```text
field configuration
form state
backend metadata
relation options
field errors
field components
```

The renderer does not manage form state or submit forms.

It prepares the data needed by each field type and returns the correct field component.

## Renderer Responsibility

`FormFieldRenderer` is responsible for:

```text
Reading field configuration
Reading backend OPTIONS metadata
Extracting field errors
Selecting the correct field component
Preparing relation field data
Passing prepared props into field components
```

It is not responsible for:

```text
Submitting form data
Fetching backend metadata
Fetching relation options
Managing parent workflow
Managing full form state
```

## Inputs

The renderer receives the data it needs from the parent form.

```jsx
<FormFieldRenderer
  field={field}
  formData={formData}
  fieldOptions={fieldOptions}
  fieldErrors={fieldErrors}
  relationOptions={relationOptions}
  relationSearch={relationSearch}
  debouncedSearch={debouncedSearch}
  onChange={handleChange}
  onRelationToggle={handleRelationToggle}
  onRelationSearchChange={handleRelationSearchChange}
/>
```

| Prop | Purpose |
|---|---|
| `field` | Current field configuration |
| `formData` | Current form values |
| `fieldOptions` | Backend OPTIONS metadata |
| `fieldErrors` | Backend validation errors |
| `relationOptions` | Loaded relation records |
| `relationSearch` | Current relation search values |
| `debouncedSearch` | Debounced relation search values |
| `onChange` | Standard field change handler |
| `onRelationToggle` | Relation selection handler |
| `onRelationSearchChange` | Relation search handler |

## Backend Field Metadata

The renderer checks backend metadata for the current field.

```js
const backendField = fieldOptions[field.name];
const choices = backendField?.choices || [];
```

This is mainly used for choice fields.

If backend metadata provides choices, the renderer can display a dropdown without hardcoding those values in the frontend.

## Field Error Preparation

The renderer extracts the field error for the current field.

```js
const fieldError = getFieldError(
  fieldErrors,
  field.name
);
```

That error is passed into whichever field component is rendered.

This keeps error extraction consistent across all field types.

## Boolean Field Rendering

Boolean fields are rendered first.

```js
if (field.type === "boolean") {
  return (
    <FormFieldBoolean
      field={field}
      value={formData[field.name]}
      error={fieldError}
      onChange={onChange}
    />
  );
}
```

Boolean fields are selected directly from the field configuration.

```js
type: "boolean"
```

## Relation Field Rendering

Relation fields require additional preparation before rendering.

```js
if (field.type === "relation") {
```

The renderer prepares:

```text
loaded relation options
selected values
selected option objects
search value
debounced search value
filtered options
```

The relation field then receives everything it needs to render searchable options and selected values.

```jsx
<FormFieldRelation
  field={field}
  error={fieldError}
  searchValue={searchValue}
  filteredOptions={filteredOptions}
  selectedValues={selectedValues}
  selectedOptions={selectedOptions}
  onSearchChange={onRelationSearchChange}
  onRelationToggle={onRelationToggle}
  formatRelationOption={formatRelationOption}
/>
```

Relation fields are selected directly from the field configuration.

```js
type: "relation"
```

## Choice Field Rendering

Choice fields are rendered when backend metadata provides choices.

```js
if (choices.length > 0) {
  return (
    <FormFieldChoice
      field={field}
      value={formData[field.name]}
      error={fieldError}
      choices={choices}
      onChange={onChange}
    />
  );
}
```

The renderer does not hardcode choice values.

Choice options come from backend OPTIONS metadata.

## Text Field Fallback

If no specialised field type matches, the renderer falls back to a text field.

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

This provides a safe default for standard input fields.

## Rendering Order

The renderer checks field types in this order:

```text
Boolean field
    ↓
Relation field
    ↓
Choice field from backend metadata
    ↓
Text field fallback
```

This order matters because choice rendering depends on backend metadata, while boolean and relation fields are controlled directly by field configuration.