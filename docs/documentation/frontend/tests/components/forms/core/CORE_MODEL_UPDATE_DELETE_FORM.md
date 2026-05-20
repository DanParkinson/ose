## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## CoreModelUpdateDeleteForm

| Test Name | Purpose |
|---|---|
| loads existing row data into form fields | Verifies existing row values are loaded correctly into editable form fields. |
| submits updated form data successfully | Verifies `updateCoreModelItem` is called with the correct detail endpoint, id, and updated form data. |
| delete button is disabled until delete confirmation is enabled | Verifies delete actions cannot be triggered until delete confirmation is checked. |
| submits delete successfully when delete confirmation is enabled | Verifies `deleteCoreModelItem` is called with the correct detail endpoint and id after delete confirmation is enabled. |
