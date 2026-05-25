# Admin Create Form Workflow

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [High-Level Flow](#high-level-flow)
- [Main State](#main-state)
- [Field Metadata Loading](#field-metadata-loading)
- [Relation Option Loading](#relation-option-loading)
- [Initial Form State Flow](#initial-form-state-flow)
- [Field Rendering Flow](#field-rendering-flow)
- [Text Field Flow](#text-field-flow)
- [Choice Field Flow](#choice-field-flow)
- [Boolean Field Flow](#boolean-field-flow)
- [Relation Field Flow](#relation-field-flow)
- [Validation Error Flow](#validation-error-flow)
- [Submit Flow](#submit-flow)
- [Create Success Flow](#create-success-flow)
- [Core Dependency Chain](#core-dependency-chain)
- [Key Principle](#key-principle)

## Purpose

This document explains how the admin create form workflow works.

The create form brings together:

- model configuration
- backend field metadata
- relation option data
- reusable field components
- field rendering logic
- form state
- backend submission
- success and error handling

Individual component details are documented separately.

This file focuses on how the pieces connect together.

## High-Level Flow

```text
AdminDashboard opens create side panel
    ↓
CoreModelCreateForm receives model config
    ↓
initial form state is generated from model.createFields
    ↓
field metadata is loaded from backend OPTIONS request
    ↓
relation options are loaded for relation fields
    ↓
FormFieldRenderer renders each field
    ↓
user enters form data
    ↓
form submits data to backend endpoint
    ↓
backend response is handled
    ↓
onCreated callback runs
    ↓
AdminDashboard refetches rows and closes panel
```

## Main State

`CoreModelCreateForm` owns the form state.

```js
const [formData, setFormData] = useState({});
const [relationSearch, setRelationSearch] = useState({});
const [fieldErrors, setFieldErrors] = useState({});
const [generalError, setGeneralError] = useState("");
const [success, setSuccess] = useState("");
const [loading, setLoading] = useState(false);
```

| State | Purpose |
|---|---|
| `formData` | Stores current field values |
| `relationSearch` | Stores search text for relation fields |
| `fieldErrors` | Stores field-level validation errors |
| `generalError` | Stores general backend errors |
| `success` | Stores success message after creation |
| `loading` | Tracks whether the form is submitting |

## Field Metadata Loading

Backend field metadata is loaded through `useCoreFieldOptions`.

```js
const fieldOptions = useCoreFieldOptions(model.endpoint);
```

This hook requests OPTIONS metadata for the selected model endpoint.

The metadata is used mainly for choice fields.

```text
model.endpoint
    ↓
useCoreFieldOptions
    ↓
fetchCoreModelOptions
    ↓
fieldOptions
    ↓
FormFieldRenderer
    ↓
FormFieldChoice
```

## Relation Option Loading

Relation options are loaded through `useCoreRelationOptions`.

```js
const relationOptions = useCoreRelationOptions(model.createFields);
```

This hook checks the field configuration for relation fields.

Each relation field can define its own endpoint.

```js
{
  name: "subjects",
  type: "relation",
  endpoint: "/core/subjects/",
  optionLabel: "title",
  optionValue: "subject_id",
  multiple: true
}
```

Flow:

```text
model.createFields
    ↓
useCoreRelationOptions
    ↓
relation fields detected
    ↓
fetchCoreModelList runs for each relation endpoint
    ↓
relationOptions stored by field name
```

## Initial Form State Flow

Initial form state is generated from `model.createFields`.

```js
setFormData(getInitialFormData(model.createFields));
```

The utility creates default values based on field type.

```text
text field          → ""
choice field        → ""
boolean field       → false
single relation     → ""
multi relation      → []
```

This means every configured field starts with a predictable value.

## Field Rendering Flow

Fields are rendered by mapping over `model.createFields`.

```jsx
{model.createFields.map((field) => (
  <FormFieldRenderer
    key={field.name}
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
))}
```

`FormFieldRenderer` decides which field component should render.

```text
field.type === "boolean"   → FormFieldBoolean
field.type === "relation"  → FormFieldRelation
choices exist              → FormFieldChoice
fallback                   → FormFieldText
```

## Text Field Flow

Text fields use `FormFieldText`.

```text
FormFieldRenderer
    ↓
FormFieldText
    ↓
FormFieldWrapper
    ↓
FormTextInput
```

When the user types:

```text
input changes
    ↓
onChange runs
    ↓
formData updates
    ↓
field error clears
```

## Choice Field Flow

Choice fields use backend OPTIONS metadata.

```text
useCoreFieldOptions
    ↓
fieldOptions
    ↓
choices extracted
    ↓
FormFieldRenderer
    ↓
FormFieldChoice
    ↓
AppSelect
```

When the user selects an option:

```text
select changes
    ↓
onChange runs
    ↓
formData[field.name] updates
    ↓
field error clears
```

## Boolean Field Flow

Boolean fields use `FormFieldBoolean`.

```text
FormFieldRenderer
    ↓
FormFieldBoolean
    ↓
FormFieldWrapper
    ↓
AppSwitch
```

When the switch changes:

```text
switch changes
    ↓
details.checked is read
    ↓
onChange runs
    ↓
formData[field.name] updates
```

## Relation Field Flow

Relation fields use searchable option logic.

```text
FormFieldRenderer
    ↓
relation options prepared
    ↓
selected options prepared
    ↓
filtered options prepared
    ↓
FormFieldRelation
```

The relation field renders:

```text
FormTextInput
SelectableOptionList
SelectedOptionList
```

Search flow:

```text
user types search
    ↓
relationSearch updates
    ↓
useDebouncedValue delays value
    ↓
getFilteredRelationOptions filters options
    ↓
SelectableOptionList displays matches
```

Selection flow:

```text
user selects option
    ↓
handleRelationToggle runs
    ↓
getUpdatedRelationValues calculates next value
    ↓
formData updates
    ↓
SelectedOptionList updates
```

## Validation Error Flow

Field-level errors are stored in `fieldErrors`.

```js
const fieldError = getFieldError(fieldErrors, field.name);
```

General errors are stored separately.

```js
setGeneralError(parsedErrors.generalError);
```

Flow:

```text
backend returns validation error
    ↓
parseBackendErrors extracts errors
    ↓
fieldErrors stores field-specific messages
    ↓
generalError stores non-field/detail messages
    ↓
field components display errors
```

## Submit Flow

The form submits through `handleSubmit`.

```js
await createCoreModelItem({
  endpoint: model.endpoint,
  data: formData,
});
```

Flow:

```text
user submits form
    ↓
loading becomes true
    ↓
previous errors clear
    ↓
createCoreModelItem sends POST request
    ↓
backend response handled
    ↓
loading becomes false
```

## Create Success Flow

After successful creation:

```js
setSuccess(`${model.title} created successfully.`);
await onCreated?.();
```

`onCreated` is passed from `AdminDashboard`.

```jsx
<CoreModelCreateForm
  model={createModel}
  onCreated={() => {
    setIsCreatePanelOpen(false);
    refetch();
  }}
/>
```

Flow:

```text
create request succeeds
    ↓
success message set
    ↓
onCreated callback runs
    ↓
AdminDashboard closes side panel
    ↓
AdminDashboard refetches main table rows
```

## Core Dependency Chain

```text
coreModels
    ↓
createModel
    ↓
CoreModelCreateForm
    ↓
model.createFields
    ↓
getInitialFormData
    ↓
useCoreFieldOptions / useCoreRelationOptions
    ↓
FormFieldRenderer
    ↓
field components
    ↓
createCoreModelItem
    ↓
onCreated callback
    ↓
AdminDashboard refetch
```

## Key Principle

```text
AdminDashboard controls the workflow.
CoreModelCreateForm controls the form.
FormFieldRenderer controls field selection.
Field components control presentation.
Hooks load reusable backend metadata.
Utilities transform form data.
```

The create form should understand form behaviour, but it should not manage dashboard state, table data, or side panel orchestration.
