# Admin Update/Delete Model Form

## Purpose

The Admin Update/Delete Model Form provides a reusable form structure for updating and deleting admin-managed core model records.

It is designed to work from the model configuration defined in `coreModels`, especially the `updateFields` array and `detailEndpoint` configuration. This allows different models, such as Subjects, Topics, Lesson Names, Variations, and Teaching Styles, to share the same update/delete form system while rendering different editable fields.

The form is responsible for:

- loading existing row data into editable form state
- rendering the correct editable field type for each configured field
- handling field changes
- handling relation selection
- submitting update requests to the correct backend detail endpoint
- submitting delete requests to the correct backend detail endpoint
- displaying field-level and form-level errors
- requiring delete confirmation before deletion
- calling parent callbacks after successful updates or deletes

The form is intentionally kept reusable so the same architecture can support all admin-managed models.

## Main Flow

The admin update/delete workflow starts inside the Admin Dashboard when a user selects a table row.

The flow is:

```txt
AdminDashboard
→ DashboardTableRow clicked
→ SidePanel opens
→ CoreModelUpdateDeleteForm loads
→ Existing row data populates form state
→ Editable fields render from model.updateFields
→ User updates form values OR deletes item
→ Backend response handled
→ Dashboard data refetches
→ SidePanel closes
```

The form itself does not directly control dashboard state or table data.

Instead, the parent `AdminDashboard` component passes callbacks into the form. This allows the dashboard to decide what should happen after successful updates or deletes, such as:

- refetching dashboard table data
- closing the update side panel
- updating UI state

This separation keeps the update/delete form reusable and focused only on form behaviour and submission handling.

## Things Included That It Handles

The Admin Update/Delete Model Form is responsible for handling the complete update and delete workflow for configured admin models.

This includes:

- loading existing row data into form state
- rendering editable fields dynamically from model configuration
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
- submitting update requests to the backend API
- submitting delete requests to the backend API
- requiring delete confirmation before deletion
- triggering parent callbacks after successful update/delete actions

The form separates responsibilities across reusable field components, hooks, and utility functions to keep the main form component focused on orchestration and submission flow.

## Key Supporting Files

| File | Purpose |
|---|---|
| `CoreModelUpdateDeleteForm.jsx` | Main orchestration component for admin update/delete workflows |
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
| `getInitialFormData.js` | Generates initial form state from existing row data |
| `parseBackendErrors.js` | Extracts backend validation errors |
| `getUpdatedRelationValues.js` | Handles relation selection updates |

## Supported Field Types

The update/delete form supports multiple reusable field types through configuration-driven rendering.

| Field Type | Renderer | Purpose |
|---|---|---|
| `text` | `FormFieldText` | Standard text-based editable fields |
| `choice` | `FormFieldChoice` | Backend-driven dropdown fields |
| `boolean` | `FormFieldBoolean` | True/false switch fields |
| `relation` | `FormFieldRelation` | Searchable relation fields |

Field rendering is controlled by:

```js
field.type
```

inside the configured `updateFields` array.

This allows different models to render completely different update forms while sharing the same reusable architecture.

## Form State

The form manages reusable state for:

| State | Purpose |
|---|---|
| `formData` | Stores current editable form values |
| `relationSearch` | Stores searchable relation input values |
| `fieldErrors` | Stores field-level backend validation errors |
| `generalError` | Stores general backend submission errors |
| `success` | Stores success messages |
| `loading` | Tracks submission state |
| `deleteConfirmed` | Tracks delete confirmation state |

Initial form state is generated dynamically using:

```js
getInitialFormData(editableFields, row)
```

This allows existing row data to populate editable form fields automatically.

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

### Update Requests

Update submissions use:

```js
updateCoreModelItem()
```

The detail endpoint is dynamically provided by:

```js
model.detailEndpoint
```

### Delete Requests

Delete submissions use:

```js
deleteCoreModelItem()
```

The detail endpoint is dynamically provided by:

```js
model.detailEndpoint
```

This allows one reusable update/delete system to support many different model types.

## Hooks

The update/delete form uses reusable hooks to separate orchestration logic from rendering.

| Hook | Purpose |
|---|---|
| `useCoreFieldOptions` | Loads backend OPTIONS metadata |
| `useCoreRelationOptions` | Loads searchable relation options |
| `useDebouncedValue` | Debounces searchable relation input |

These hooks keep backend loading logic outside the main form component.

## Utils

The update/delete form uses reusable utilities to separate transformation logic from orchestration logic.

| Utility | Purpose |
|---|---|
| `getInitialFormData` | Generates initial editable form state |
| `getFieldError` | Extracts field validation errors |
| `parseBackendErrors` | Extracts backend validation errors |
| `formatRelationOptions` | Formats relation display labels |
| `getFilteredRelationOptions` | Filters searchable relation options |
| `getSelectedRelationOptions` | Returns selected relation option objects |
| `getUpdatedRelationValues` | Updates selected relation values |

These utilities keep the form orchestration layer smaller and easier to maintain.

## Update Success Flow

After successful update submission:

```txt
update request succeeds
    ↓
success message displayed
    ↓
onUpdated callback executes
    ↓
AdminDashboard refetches table data
    ↓
SidePanel closes
```

## Delete Success Flow

After successful deletion:

```txt
delete confirmed
    ↓
delete request succeeds
    ↓
success message displayed
    ↓
onDeleted callback executes
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
