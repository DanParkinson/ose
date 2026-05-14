## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## DashboardTable

| Test Name | Purpose |
|---|---|
| renders table header with columns and template columns | Verifies the table header receives and renders the correct column labels and grid template configuration. |
| renders rows using renderRow | Verifies row content renders correctly using the provided `renderRow` function. |
| calls renderRow for each row | Verifies `renderRow` is called once for each row with the correct row data. |
| uses getRowKey when provided | Verifies `getRowKey` is called for each row when supplied. |
| passes selected state to matching rows | Verifies selected rows receive the correct `isSelected` state. |
| calls onRowClick with row data when a row is clicked | Verifies clicking a row triggers `onRowClick` with the correct row object. |
