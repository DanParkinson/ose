## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## CoreModelCreateForm

| Test Name | Purpose |
|---|---|
| submits form data successfully | Verifies `createCoreModelItem` is called with the correct endpoint and form data when the form is submitted successfully. |
| renders all configured create fields | Verifies all fields defined in `model.createFields` are rendered correctly. |
| updates form values when users type into fields | Verifies form state updates correctly when field values change. |
| displays success message after successful creation | Verifies a success message is shown after a successful create request. |
| displays backend validation errors when creation fails | Verifies backend validation errors are rendered correctly when submission fails. |
| clears field errors when users update a field | Verifies field-specific validation errors are cleared after editing the related field. |
| disables submit button during form submission | Verifies the submit button becomes disabled while the create request is processing. |
| updates relation values correctly when relation options are toggled | Verifies relation field values update correctly when relation options are selected or removed. |
| updates relation search state when relation search input changes | Verifies relation search values update correctly when users type into relation search inputs. |
