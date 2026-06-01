# Update Submission

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Submission Trigger](#submission-trigger)
- [Loading Guard](#loading-guard)
- [Pre-Submission Reset](#pre-submission-reset)
- [Update API Request](#update-api-request)
- [Record Identifier](#record-identifier)
- [Success Handling](#success-handling)
- [Error Handling](#error-handling)
- [Update Submission Workflow](#update-submission-workflow)

## Purpose

Update submission controls how a dynamic update form sends edited record data to the backend.

The form uses its configured detail endpoint, selected row identifier, and current `formData` state to submit an update request.

## Submission Trigger

Update submission runs when the update form is submitted.

```js
<form onSubmit={handleSubmit}>
```

The submit handler prevents the browser's default form behaviour.

```js
event.preventDefault();
```

This allows the React form to control the update request manually.

## Loading Guard

The submit handler prevents duplicate update requests while a request is already running.

```js
if (loading) return;
```

This avoids sending repeated update requests if the user submits multiple times.

## Pre-Submission Reset

Before submitting, the form clears previous feedback state.

```js
setLoading(true);
setFieldErrors({});
setGeneralError("");
setSuccess("");
```

This ensures the new update request starts with clean feedback state.

## Update API Request

The update form submits through:

```js
updateCoreModelItem()
```

Example:

```js
await updateCoreModelItem({
  detailEndpoint: model.detailEndpoint,
  id: row[model.keyField],
  data: formData,
});
```

The request uses:

| Value | Purpose |
|---|---|
| `model.detailEndpoint` | Backend detail endpoint |
| `row[model.keyField]` | Selected record identifier |
| `formData` | Current editable form values |

The form does not hardcode the API endpoint or record identifier field.

Both come from the model configuration and selected row data.

## Record Identifier

The update form uses:

```js
row[model.keyField]
```

to find the identifier for the selected record.

Example:

```js
keyField: "subject_id"
```

This allows the same update form to work with different resources that may use different identifier field names.

## Success Handling

If the request succeeds, the form sets a success message.

```js
setSuccess(`${model.title} updated successfully.`);
```

It then calls the optional parent callback.

```js
onUpdated?.();
```

This allows the parent feature to decide what should happen next.

Examples:

```text
Refetch data
Close a panel
Clear selected row
Update surrounding UI
```

## Error Handling

If the request fails, the backend errors are parsed.

```js
const parsedErrors = parseBackendErrors(error);
```

The parsed errors are stored in form state.

```js
setFieldErrors(parsedErrors.fieldErrors);
setGeneralError(parsedErrors.generalError);
setLoading(false);
```

This allows field-level and general errors to be displayed by the update form.

## Update Submission Workflow

```text
User submits update form
        ↓
Default browser submission prevented
        ↓
Duplicate submission check runs
        ↓
Loading state starts
        ↓
Previous errors and success message clear
        ↓
updateCoreModelItem sends PATCH request
        ↓
Backend updates record or returns errors
        ↓
Success message or validation errors stored
        ↓
Parent callback runs after success
```

The update form controls the submission workflow, while the API utility controls the actual request.