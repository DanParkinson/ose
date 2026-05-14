## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## DashboardTableRow

| Test Name | Purpose |
|---|---|
| renders row children | Verifies row child content renders correctly inside the table row. |
| passes templateColumns to the grid layout | Verifies the provided grid template columns are passed to the row layout. |
| applies selected state styles when row is selected | Verifies selected rows use the correct selected background and border styling. |
| applies default state styles when row is not selected | Verifies unselected rows use the correct default background and border styling. |
| calls onClick with row data when clicked | Verifies clicking the row calls the provided callback with the correct row object. |
| does not throw when clicked without onClick | Verifies rows without click handlers can still be clicked safely without errors. |
