## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Field Type Rendering

| Test Name | Purpose |
|---|---|
| renders FormFieldBoolean when field type is boolean | Verifies boolean field configurations render the boolean field component. |
| renders FormFieldRelation when field type is relation | Verifies relation field configurations render the relation field component. |
| renders FormFieldChoice when backend choices exist | Verifies fields with backend choice options render the choice field component. |
| renders FormFieldText by default when field has no special type or choices | Verifies standard fields fall back to the text field component. |

## Field Error Handling

| Test Name | Purpose |
|---|---|
| passes field error to the rendered field component | Verifies field-specific errors are passed to the rendered child component. |

## Relation Field Data

| Test Name | Purpose |
|---|---|
| passes relation search value to FormFieldRelation | Verifies the current relation search input value is passed to the relation field component. |
| passes selected relation options to FormFieldRelation | Verifies selected relation values are converted into selected option objects and passed through. |
| passes filtered relation options to FormFieldRelation | Verifies relation options are filtered using the debounced search value before being passed to the relation field component. |
