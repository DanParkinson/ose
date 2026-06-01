# Parent Callbacks

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Parent Callbacks Exist](#why-parent-callbacks-exist)
- [Callback Responsibility](#callback-responsibility)
- [Optional Callback Pattern](#optional-callback-pattern)
- [Create Form Callbacks](#create-form-callbacks)
- [Update Form Callbacks](#update-form-callbacks)
- [Parent Workflow Examples](#parent-workflow-examples)
- [Workflow Separation](#workflow-separation)
- [Parent Callback Workflow](#parent-callback-workflow)

## Purpose

Parent callbacks allow dynamic forms to notify surrounding features when a successful form action has completed.

The form itself handles:

```text
Field rendering
Form state
Submission
Validation
Success state
```

The parent feature handles:

```text
Refreshing data
Closing panels
Clearing selected rows
Updating surrounding UI
```

This keeps dynamic forms reusable and independent from page-specific workflows.

## Why Parent Callbacks Exist

Dynamic forms should not directly control surrounding application state.

Example:

```text
A form should not know:
- how a table reloads
- how a drawer closes
- how selected rows are managed
```

Instead, the parent component decides what should happen after successful submission.

Callbacks create a clean boundary between:

```text
Reusable form logic
Feature-specific UI behaviour
```

## Callback Responsibility

Dynamic forms are responsible for:

```text
Submitting data
Displaying validation errors
Displaying success messages
```

Parent components are responsible for:

```text
Refetching records
Closing side panels
Updating selected rows
Refreshing dashboard state
```

This separation prevents forms from becoming tightly coupled to specific pages or layouts.

## Optional Callback Pattern

The forms use optional chaining for callbacks.

Example:

```js
onCreated?.();
```

and:

```js
onUpdated?.();
```

This allows callbacks to remain optional.

If no callback is provided, the form still functions normally.

## Create Form Callbacks

After successful create submission:

```js
onCreated?.();
```

is executed.

The parent component may use this to:

```text
Refetch dashboard data
Close create panels
Refresh lists
Show updated records
```

The create form itself does not decide what should happen next.

## Update Form Callbacks

After successful update or delete submission:

```js
onUpdated?.();
```

is executed.

The parent component may use this to:

```text
Refetch updated data
Clear selected rows
Close update panels
Refresh visible records
```

This keeps update/delete workflows reusable across different pages.

## Parent Workflow Examples

Example parent workflow:

```text
User creates new item
        ↓
Create form submits successfully
        ↓
onCreated callback runs
        ↓
Parent component refetches data
        ↓
Dashboard table updates
        ↓
Parent closes side panel
```

Another example:

```text
User updates selected row
        ↓
Update form submits successfully
        ↓
onUpdated callback runs
        ↓
Parent clears selected row
        ↓
Parent refetches updated data
```

## Workflow Separation

The dynamic form system intentionally separates:

```text
Form workflow
```

from:

```text
Application workflow
```

This allows the same forms to be reused in:

```text
Admin dashboards
Modal forms
Page-level forms
User-facing workflows
Embedded forms
```

without changing the internal form logic.

## Parent Callback Workflow

```text
User submits form
        ↓
Form submission succeeds
        ↓
Success message stored
        ↓
Optional callback executes
        ↓
Parent feature updates surrounding UI
        ↓
Form remains reusable and independent
```

Parent callbacks keep the dynamic form system modular and reusable while allowing surrounding features to control application-specific behaviour.