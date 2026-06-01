# Update/Delete Flow

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Update/Delete Flow Exists](#why-updatedelete-flow-exists)
- [Update/Delete State](#updatedelete-state)
- [Opening the Update Panel](#opening-the-update-panel)
- [Update/Delete Form Relationship](#updatedelete-form-relationship)
- [Successful Update/Delete Callback](#successful-updatedelete-callback)
- [Update/Delete Flow Workflow](#updatedelete-flow-workflow)

## Purpose

The update/delete flow controls how the dashboard opens an edit form for an existing row.

The dashboard does not build the editable fields itself.

It stores the selected model and selected row, opens the update side panel, and passes both into the dynamic update/delete form.

## Why Update/Delete Flow Exists

The dashboard system supports reusable update and delete workflows.

Instead of creating separate edit pages or delete handlers for each resource, the dashboard uses:

```text
model configuration
selected row data
update side panel
dynamic update/delete form
parent callback
```

to update or delete records through the same workflow.

## Update/Delete State

The dashboard stores update-specific state.

```js
const [updateModel, setUpdateModel] =
  useState(null);

const [updateRow, setUpdateRow] =
  useState(null);

const [isUpdatePanelOpen, setIsUpdatePanelOpen] =
  useState(false);
```

| State | Purpose |
|---|---|
| `updateModel` | Stores the model being edited |
| `updateRow` | Stores the selected row data |
| `isUpdatePanelOpen` | Controls update panel visibility |

## Opening the Update Panel

The dashboard opens the update panel when a row is selected.

```js
const openUpdatePanel = (row) => {
  setUpdateModel(selectedModel);
  setUpdateRow(row);
  setIsUpdatePanelOpen(true);
};
```

This:

```text
stores the active model
stores the selected row
opens the update side panel
```

The selected model provides the form configuration.

The selected row provides the existing values.

## Update/Delete Form Relationship

The update side panel renders:

```jsx
<CoreModelUpdateDeleteForm
  key={updateRow[updateModel.keyField]}
  model={updateModel}
  row={updateRow}
  onUpdated={handleUpdated}
/>
```

The dashboard provides:

```text
model configuration
selected row data
post-update/delete callback
```

The dynamic form handles:

```text
initial form data
field rendering
validation
update submission
delete submission
success handling
```

## Successful Update/Delete Callback

After a successful update or delete, the form calls:

```js
onUpdated?.();
```

The dashboard responds by:

```js
setIsUpdatePanelOpen(false);
setUpdateRow(null);
setUpdateModel(null);
refetch();
```

This:

```text
closes the update panel
clears selected row state
clears update model state
reloads table data
```

## Update/Delete Flow Workflow

```text
User clicks table row
        ↓
Dashboard stores selected row
        ↓
Dashboard stores active model
        ↓
Update side panel opens
        ↓
CoreModelUpdateDeleteForm receives model and row
        ↓
Dynamic form loads existing row values
        ↓
User updates or deletes record
        ↓
onUpdated callback runs
        ↓
Update side panel closes
        ↓
Selected row state clears
        ↓
Dashboard refetches data
        ↓
Updated rows render
```

The update/delete flow keeps dashboard orchestration separate from dynamic form generation and API submission logic.