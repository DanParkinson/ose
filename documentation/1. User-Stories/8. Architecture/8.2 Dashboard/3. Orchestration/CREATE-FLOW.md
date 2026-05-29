# Create Flow

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Create Flow Exists](#why-create-flow-exists)
- [Create State](#create-state)
- [Opening the Create Panel](#opening-the-create-panel)
- [Create Form Relationship](#create-form-relationship)
- [Successful Create Callback](#successful-create-callback)
- [Create Flow Workflow](#create-flow-workflow)

## Purpose

The create flow controls how the dashboard opens a create form for the selected resource.

The dashboard does not build the form fields itself.

It selects the model configuration, opens the create panel, and passes the model into the dynamic form system.

## Why Create Flow Exists

The dashboard system supports reusable create workflows.

Instead of creating separate create pages or forms for each resource, the dashboard uses:

```text
model configuration
create side panel
dynamic create form
parent callback
```

to create new records through the same workflow.

## Create State

The dashboard stores create-specific state.

```js
const [createModel, setCreateModel] =
  useState(null);

const [isCreatePanelOpen, setIsCreatePanelOpen] =
  useState(false);
```

| State | Purpose |
|---|---|
| `createModel` | Stores the model being created |
| `isCreatePanelOpen` | Controls create panel visibility |

## Opening the Create Panel

The dashboard opens the create panel using:

```js
const openCreatePanel = (model) => {
  setSelectedModel(model);
  setCreateModel(model);
  setOffset(0);
  setIsCreatePanelOpen(true);
};
```

This:

```text
sets the selected model
stores the create model
resets pagination
opens the create side panel
```

The create button stops the row click event from also triggering model selection.

```js
event.stopPropagation();
```

## Create Form Relationship

The create panel renders:

```jsx
<CoreModelCreateForm
  key={createModel.id}
  model={createModel}
  onCreated={handleCreated}
/>
```

The dashboard provides:

```text
model configuration
post-create callback
```

The dynamic form handles:

```text
field rendering
form state
validation
submission
success handling
```

## Successful Create Callback

After successful creation, the create form calls:

```js
onCreated?.();
```

The dashboard responds by:

```js
setIsCreatePanelOpen(false);
setSelectedModel(createModel);
setOffset(0);
refetch();
```

This:

```text
closes the create panel
keeps the created model selected
resets pagination
reloads table data
```

## Create Flow Workflow

```text
User clicks create button
        ↓
Click event stops row selection side effects
        ↓
Dashboard stores create model
        ↓
Dashboard resets pagination
        ↓
Create side panel opens
        ↓
CoreModelCreateForm receives model config
        ↓
Dynamic form creates record
        ↓
onCreated callback runs
        ↓
Create side panel closes
        ↓
Dashboard refetches data
        ↓
Updated rows render
```

The create flow keeps dashboard orchestration separate from form generation and submission logic.