# Delete Submission

## Navigation

[← Back to README.md](/README.md)


## Table of Contents

- [Purpose](#purpose)
- [Delete Confirmation](#delete-confirmation)
- [Delete Trigger](#delete-trigger)
- [Loading Guard](#loading-guard)
- [Pre-Deletion Reset](#pre-deletion-reset)
- [Delete API Request](#delete-api-request)
- [Record Identifier](#record-identifier)
- [Success Handling](#success-handling)
- [Error Handling](#error-handling)
- [Delete Submission Workflow](#delete-submission-workflow)

## Purpose

Delete submission controls how a dynamic update/delete form removes an existing backend record.

The form uses its configured detail endpoint and selected row identifier to send a delete request.

## Delete Confirmation

Delete actions require explicit user confirmation before deletion is allowed.

The current system uses:

```js
const [deleteConfirmed, setDeleteConfirmed] =
  useState(false);
```

The confirmation state is controlled through:

```jsx
<AppSwitch
  checked={deleteConfirmed}
  onCheckedChange={(details) =>
    setDeleteConfirmed(details.checked)
  }
>
  I understand this will permanently delete this item.
</AppSwitch>
```

The delete button remains disabled until confirmation is enabled.

```jsx
disabled={!deleteConfirmed || loading}
```

This helps prevent accidental record deletion.

## Delete Trigger

Delete submission runs when the delete button is clicked.

```jsx
<FormSubmitButtonDanger
  onClick={handleDelete}
>
  Delete
</FormSubmitButtonDanger>
```

The delete workflow is separate from the normal form submission handler.

## Loading Guard

The delete handler prevents duplicate delete requests while a request is already running.

```js
if (loading) return;
```

This avoids repeated delete requests if the user clicks multiple times.

## Pre-Deletion Reset

Before sending the delete request, the form clears previous feedback state.

```js
setLoading(true);
setFieldErrors({});
setGeneralError("");
setSuccess("");
```

This ensures the delete workflow starts with clean feedback state.

## Delete API Request

The delete form submits through:

```js
deleteCoreModelItem()
```

Example:

```js
await deleteCoreModelItem({
  detailEndpoint: model.detailEndpoint,
  id: row[model.keyField],
});
```

The request uses:

| Value | Purpose |
|---|---|
| `model.detailEndpoint` | Backend detail endpoint |
| `row[model.keyField]` | Selected record identifier |

The delete form does not hardcode model-specific API routes.

## Record Identifier

The delete workflow uses:

```js
row[model.keyField]
```

to determine which backend record should be deleted.

Example:

```js
keyField: "subject_id"
```

This keeps the delete workflow reusable across different resources.

## Success Handling

If the delete request succeeds, the form sets a success message.

```js
setSuccess(`${model.title} deleted successfully.`);
```

The form then triggers the parent callback.

```js
onUpdated?.();
```

The parent feature decides what should happen after deletion.

Examples:

```text
Refetch data
Close panels
Clear selected rows
Update surrounding UI
```

## Error Handling

If the delete request fails, the backend errors are parsed.

```js
const parsedErrors = parseBackendErrors(error);
```

The form stores the returned general error.

```js
setGeneralError(parsedErrors.generalError);
setLoading(false);
```

Delete requests typically return general permission or protection errors rather than field-level validation errors.

## Delete Submission Workflow

```text
User enables delete confirmation
        ↓
Delete button becomes available
        ↓
User clicks delete button
        ↓
Duplicate submission check runs
        ↓
Loading state starts
        ↓
Previous feedback state clears
        ↓
deleteCoreModelItem sends DELETE request
        ↓
Backend deletes record or returns errors
        ↓
Success message or general error stored
        ↓
Parent callback runs after success
```

The delete form controls the delete workflow, while the API utility controls the actual request.