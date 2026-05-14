# Admin Create Model Form

## Purpose

The Admin Create Model Form provides a reusable form structure for creating admin-managed core model records.

It is designed to work from the model configuration defined in `coreModels`, especially the `createFields` array. This allows different models, such as Subjects, Topics, Lesson Names, Variations, and Teaching Styles, to share the same create form system while rendering different fields.

The form is responsible for:

- building initial form data from the selected model config
- rendering the correct field type for each configured field
- handling field changes
- handling relation selection
- submitting create requests to the correct backend endpoint
- displaying field-level and form-level errors
- calling a parent callback after successful creation

The form is intentionally kept reusable so the same patterns can later support update forms and other admin form workflows.

## Main Flow

The admin create workflow starts inside the Admin Dashboard when a user selects the create button for a model.

The flow is:

```txt
AdminDashboard
→ CreateButton clicked
→ SidePanel opens
→ CoreModelCreateForm loads
→ Form fields render from model.createFields
→ User enters form data
→ Form submits to backend endpoint
→ Backend response handled
→ Dashboard data refetches
→ SidePanel closes
```

The form itself does not directly control dashboard state or table data.

Instead, the parent `AdminDashboard` component passes an `onCreated` callback into the form. This allows the dashboard to decide what should happen after successful creation, such as:

- refetching dashboard table data
- closing the create side panel
- updating UI state

This separation keeps the create form reusable and focused only on form behaviour and submission handling.

## Things Included That It Handles

The Admin Create Model Form is responsible for handling the complete create workflow for configured admin models.

This includes:

- rendering fields dynamically from model configuration
- generating initial form state
- handling text, choice, boolean, and relation field types
- handling searchable relation selection
- handling multi-select relation fields
- displaying selected relation items
- handling field-level validation errors
- handling general backend submission errors
- handling success messages
- debouncing relation search input
- fetching backend field metadata using OPTIONS requests
- fetching relation options for searchable relation fields
- formatting relation display labels
- submitting create requests to the backend API
- triggering parent callbacks after successful creation

The form separates responsibilities across reusable field components, hooks, and utility functions to keep the main form component focused on orchestration and submission flow.

## Key Supporting Files

| File | Purpose |
|---|---|
| `CoreModelCreateForm.jsx` | Main orchestration component for admin create workflows |
| `FormFieldRenderer.jsx` | Dynamically renders reusable field components |
| `FormFieldText.jsx` | Reusable text field renderer |
| `FormFieldChoice.jsx` | Reusable choice field renderer |
| `FormFieldBoolean.jsx` | Reusable boolean field renderer |
| `FormFieldRelation.jsx` | Reusable searchable relation field renderer |
| `SelectableOptionList.jsx` | Displays searchable selectable relation options |
| `SelectedOptionList.jsx` | Displays selected relation items |
| `useCoreFieldOptions.js` | Loads backend OPTIONS metadata |
| `useCoreRelationOptions.js` | Loads relation field options |
| `useDebouncedValue.js` | Debounces searchable relation input |
| `getInitialFormData.js` | Generates initial form state |
| `parseBackendErrors.js` | Extracts backend validation errors |
| `getUpdatedRelationValues.js` | Handles relation selection updates |

## Supported Field Types

The create form supports multiple reusable field types through configuration-driven rendering.

| Field Type | Renderer | Purpose |
|---|---|---|
| `text` | `FormFieldText` | Standard text-based fields |
| `choice` | `FormFieldChoice` | Backend-driven dropdown fields |
| `boolean` | `FormFieldBoolean` | True/false switch fields |
| `relation` | `FormFieldRelation` | Searchable relation fields |

Field rendering is controlled by:

```js
field.type
```

inside the configured `createFields` array.

This allows different models to render completely different forms while sharing the same reusable architecture.

## Form State

The form manages reusable state for:

| State | Purpose |
|---|---|
| `formData` | Stores current form values |
| `relationSearch` | Stores searchable relation input values |
| `fieldErrors` | Stores field-level backend validation errors |
| `generalError` | Stores general backend submission errors |
| `success` | Stores success messages |
| `loading` | Tracks submission state |

Initial form state is generated dynamically using:

```js
getInitialFormData(model.createFields)
```

This keeps the form fully configuration-driven.

## Backend Data Used

The form relies on multiple backend data sources.

### OPTIONS Metadata

The form loads backend OPTIONS metadata using:

```js
fetchCoreModelOptions()
```

This metadata provides:

- field choices
- backend field definitions
- backend-driven dropdown options

### Relation Field Data

Relation fields load searchable option data using:

```js
fetchCoreModelList()
```

Relation options are loaded from configured relation endpoints defined inside field configuration.

### Create Requests

Create submissions use:

```js
createCoreModelItem()
```

The endpoint is dynamically provided by:

```js
model.endpoint
```

This allows one reusable form system to create many different model types.

## Hooks

The create form uses reusable hooks to separate orchestration logic from rendering.

| Hook | Purpose |
|---|---|
| `useCoreFieldOptions` | Loads backend OPTIONS metadata |
| `useCoreRelationOptions` | Loads searchable relation options |
| `useDebouncedValue` | Debounces searchable relation input |

These hooks keep backend loading logic outside the main form component.

## Utils

The create form uses reusable utilities to separate transformation logic from orchestration logic.

| Utility | Purpose |
|---|---|
| `getInitialFormData` | Generates initial form state |
| `getFieldError` | Extracts field validation errors |
| `parseBackendErrors` | Extracts backend validation errors |
| `formatRelationOptions` | Formats relation display labels |
| `getFilteredRelationOptions` | Filters searchable relation options |
| `getSelectedRelationOptions` | Returns selected relation option objects |
| `getUpdatedRelationValues` | Updates selected relation values |

These utilities keep the form orchestration layer smaller and easier to maintain.

## Create Success Flow

After successful submission:

```txt
create request succeeds
    ↓
success message displayed
    ↓
onCreated callback executes
    ↓
AdminDashboard refetches table data
    ↓
SidePanel closes
```

The form itself does not directly manage:

- dashboard table state
- dashboard pagination
- side panel visibility

Those responsibilities remain inside the parent dashboard orchestration layer.
