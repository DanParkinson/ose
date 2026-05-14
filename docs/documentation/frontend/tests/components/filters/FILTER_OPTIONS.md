## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## FilterOptions

| Test Name | Purpose |
|---|---|
| renders all filter options | Verifies all provided filter options are rendered correctly. |
| defaults to "all" when no active filter exists | Verifies the component defaults to the `"all"` filter when no active filter is provided. |
| applies active styling to the selected option | Verifies the selected filter option receives active styling while inactive options remain inactive. |
| calls onFilterChange with correct values when clicked | Verifies clicking a filter option calls `onFilterChange` with the correct filter key and value. |
