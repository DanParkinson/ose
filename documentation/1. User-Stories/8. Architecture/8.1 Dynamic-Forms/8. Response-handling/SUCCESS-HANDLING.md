# Success Handling

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Success State Is Needed](#why-success-state-is-needed)
- [Success State](#success-state)
- [Setting Success Messages](#setting-success-messages)
- [Success Rendering](#success-rendering)
- [Submission Relationship](#submission-relationship)
- [Success Clearing](#success-clearing)
- [Parent Workflow Relationship](#parent-workflow-relationship)
- [Success Workflow](#success-workflow)

## Purpose

Success handling controls how successful form actions are communicated to the user.

The dynamic form system stores success state separately from errors so successful operations can provide immediate feedback.

## Why Success State Is Needed

Dynamic forms perform asynchronous API requests.

Users need confirmation that actions completed successfully.

Examples:

```text
Record created successfully
Record updated successfully
Record deleted successfully
```

Without success feedback, users may not know whether the request completed correctly.

## Success State

Success messages are stored in dedicated form state.

```js
const [success, setSuccess] =
  useState("");
```

The success state stores a single success message string.

## Setting Success Messages

Success messages are set after successful API requests.

Example create success:

```js
setSuccess(
  `${model.title} created successfully.`
);
```

Example update success:

```js
setSuccess(
  `${model.title} updated successfully.`
);
```

Example delete success:

```js
setSuccess(
  `${model.title} deleted successfully.`
);
```

The model configuration supplies the display title.

## Success Rendering

Success messages are rendered near the top of the form.

Example:

```jsx
<FormSuccess>
  {success}
</FormSuccess>
```

The success component is rendered separately from field-level and general error messages.

This keeps positive feedback visually separated from validation and submission failures.

## Submission Relationship

Success messages are typically triggered after:

```text
Create submission
Update submission
Delete submission
```

The success message is only set after the API request completes successfully.

## Success Clearing

Success messages are cleared before each new submission attempt.

Example:

```js
setSuccess("");
```

This prevents old success messages from remaining visible during later requests.

Success messages are also cleared before failed requests so outdated success feedback does not remain visible beside new errors.

## Parent Workflow Relationship

After successful submission, forms typically trigger parent callbacks.

Examples:

```js
onCreated?.();
onUpdated?.();
```

The parent workflow may then:

```text
Refetch data
Close side panels
Clear selected rows
Refresh surrounding UI
```

The success state communicates successful completion to the user, while the parent callback controls surrounding application behaviour.

## Success Workflow

```text
User submits form
        ↓
API request succeeds
        ↓
Success message stored
        ↓
FormSuccess renders message
        ↓
Parent callback executes
        ↓
Parent workflow updates surrounding UI
        ↓
User performs another submission
        ↓
Success state clears before next request
```

The success handling system keeps successful submission feedback predictable and reusable across all dynamic forms.