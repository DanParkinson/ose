## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Pagination

| Test Name | Purpose |
|---|---|
| renders pagination label and buttons | Verifies the pagination label, Previous button, and Next button render correctly. |
| disables previous button when there is no previous page | Verifies the Previous button is disabled when there is no previous page available. |
| disables previous button when offset is zero | Verifies the Previous button is disabled when the current offset is `0`. |
| disables next button when there is no next page | Verifies the Next button is disabled when there is no next page available. |
| calls onPrevious when previous button is clicked | Verifies clicking the Previous button triggers the `onPrevious` handler. |
| calls onNext when next button is clicked | Verifies clicking the Next button triggers the `onNext` handler. |
