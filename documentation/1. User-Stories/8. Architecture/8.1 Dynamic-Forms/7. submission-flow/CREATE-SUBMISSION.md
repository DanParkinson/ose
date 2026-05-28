# Create Submission

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Submission Trigger](#submission-trigger)
- [Loading Guard](#loading-guard)
- [Pre-Submission Reset](#pre-submission-reset)
- [Create API Request](#create-api-request)
- [Success Handling](#success-handling)
- [Error Handling](#error-handling)
- [Create Submission Workflow](#create-submission-workflow)

## Purpose

Create submission controls how a dynamic create form sends new record data to the backend.

The form uses its configured endpoint and current `formData` state to submit a create request.

## Submission Trigger

Create submission runs when the form is submitted.

```js
<form onSubmit={handleSubmit}>
```

The submit handler prevents the browser's default form behaviour.

```js
event.preventDefault();
```

This allows the React form to control the API request manually.

## Loading Guard

The submit handler prevents duplicate submissions while a request is already running.

```js
if (loading) return;
```

This avoids sending repeated create requests if the user clicks submit multiple times.

## Pre-Submission Reset

Before submitting, the form clears previous feedback state.

```js
setLoading(true);
setFieldErrors({});
setGeneralError("");
setSuccess("");
```

This ensures the new request starts with a clean error and success state.

## Create API Request

The create form submits through:

```js
createCoreModelItem()
```

Example:

```js
await createCoreModelItem({
  endpoint: model.endpoint,
  data: formData,
});
```

The request uses:

| Value | Purpose |
|---|---|
| `model.endpoint` | Backend create endpoint |
| `formData` | Current form values |

The form does not hardcode the API endpoint.

The configured model decides where the create request is sent.

## Success Handling

If the request succeeds, the form sets a success message.

```js
setSuccess(`${model.title} created successfully.`);
```

It then calls the optional parent callback.

```js
onCreated?.();
```

This allows the parent feature to decide what should happen next.

Examples:

```text
Refetch data
Close a panel
Reset selected state
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

This allows field-level and general errors to be displayed by the form.

## Create Submission Workflow

```text
User submits create form
        ↓
Default browser submission prevented
        ↓
Duplicate submission check runs
        ↓
Loading state starts
        ↓
Previous errors and success message clear
        ↓
createCoreModelItem sends POST request
        ↓
Backend creates record or returns errors
        ↓
Success message or validation errors stored
        ↓
Parent callback runs after success
```

The create form controls the submission workflow, while the API utility controls the actual request.