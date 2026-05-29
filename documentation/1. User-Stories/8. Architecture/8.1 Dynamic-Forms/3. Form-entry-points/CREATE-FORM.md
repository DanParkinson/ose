# Create Form

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [CoreModelCreateForm](#coremodelcreateform)
- [Form Responsibilities](#form-responsibilities)
- [Required Props](#required-props)
- [High-Level Workflow](#high-level-workflow)
- [Form State](#form-state)
- [Configuration Relationship](#configuration-relationship)
- [Field Rendering Relationship](#field-rendering-relationship)
- [Submission Relationship](#submission-relationship)
- [Parent Callback Relationship](#parent-callback-relationship)
- [Example Usage](#example-usage)

## Purpose

`CoreModelCreateForm` is the main entry point for reusable create form workflows.

The component receives a model configuration object and dynamically generates a create form from that configuration.

This allows the same form system to support multiple resources without manually building separate create forms for each model.

## CoreModelCreateForm

The create form currently uses:

```jsx
<CoreModelCreateForm
  model={model}
  onCreated={handleCreated}
/>
```

The form receives configuration and orchestration callbacks from a parent feature.

The parent feature decides:

```text
Which model should be used
What should happen after successful creation
```

The create form handles:

```text
Form state
Field rendering
Metadata loading
Submission flow
Error handling
Success handling
```

## Form Responsibilities

`CoreModelCreateForm` is responsible for:

```text
Generating initial form state
Rendering configured fields
Managing field updates
Managing relation selection
Submitting create requests
Displaying validation errors
Displaying success messages
Triggering parent callbacks
```

The form is not responsible for:

```text
Hardcoding model-specific fields
Hardcoding API endpoints
Managing dashboard data state
Rendering model tables
```

## Required Props

The create form currently requires:

| Prop | Purpose |
|---|---|
| `model` | Form configuration object |
| `onCreated` | Callback triggered after successful creation |

The `model` prop provides the configuration contract required by the form system.

## High-Level Workflow

```text
Parent feature passes model config
        ↓
Create form generates initial state
        ↓
Backend metadata loads
        ↓
Relation options load
        ↓
Fields render dynamically
        ↓
User updates form values
        ↓
Create request submitted
        ↓
Success or validation errors returned
        ↓
Parent callback executes
```

## Form State

The create form manages multiple state layers.

Current state includes:

| State | Purpose |
|---|---|
| `formData` | Current form values |
| `relationSearch` | Relation field search values |
| `fieldErrors` | Backend field validation errors |
| `generalError` | Non-field backend errors |
| `success` | Success message |
| `loading` | Submission loading state |

Example:

```js
const [formData, setFormData] = useState(() =>
  getInitialFormData(model.createFields)
);
```

The initial form state is generated dynamically from the configured fields.

## Configuration Relationship

The create form reads configuration from:

```js
model.createFields
model.endpoint
model.title
```

These values determine:

```text
Which fields should render
Which endpoint should receive submissions
Which success messages should display
```

The create form does not know anything about specific backend models.

It only consumes the provided configuration.

## Field Rendering Relationship

The form dynamically renders fields using:

```jsx
{model.createFields.map((field) => (
  <FormFieldRenderer
    key={field.name}
    field={field}
  />
))}
```

`FormFieldRenderer` decides which reusable field component should display based on the configured field type.

The create form controls orchestration.

The renderer controls field presentation.

## Submission Relationship

The create form submits requests using:

```js
createCoreModelItem({
  endpoint: model.endpoint,
  data: formData,
});
```

The submission workflow is fully configuration-driven.

The create form does not manually construct API URLs.

## Parent Callback Relationship

After successful creation, the form triggers:

```js
onCreated?.();
```

This allows the parent feature to react to successful creation.

Examples:

```text
Refetch dashboard data
Close side panels
Display updated tables
Reset parent state
```

The create form does not directly control parent feature state.

## Example Usage

```jsx
<CoreModelCreateForm
  model={selectedModel}
  onCreated={() => {
    refetch();
    closePanel();
  }}
/>
```

The parent feature provides:

```text
Model configuration
Post-create behaviour
```

The create form handles the reusable form workflow automatically.