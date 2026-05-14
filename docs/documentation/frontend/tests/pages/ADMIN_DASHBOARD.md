## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

# AdminDashboard

| Test Name | Purpose |
|---|---|
| renders dashboard layout areas | Verifies the orchestrator, filters, main, and pagination layout areas render correctly. |
| renders core model navigation rows | Verifies dashboard navigation rows render from the configured core models. |
| fetches data for the initially selected model | Verifies the initial selected model endpoint and state values are passed into `useCoreModelData`. |
| changes selected model and resets filters when model row is clicked | Verifies selecting a new model resets search state, pagination offset, and filter values. |
| updates search query and resets offset when searching | Verifies search updates the query state and resets pagination to the first page. |
| resets active filters and search when reset filters is clicked | Verifies resetting filters restores default filter values and clears search state. |
| moves to next page when next button is clicked | Verifies pagination increases offset when a next page exists. |
| does not move to previous page when previous page is unavailable | Verifies pagination does not reduce offset below zero when no previous page exists. |
| opens create panel for selected model | Verifies clicking the create button opens the create side panel for the selected model. |
| successful creation closes panel and refetches data | Verifies successful creation triggers refetching and closes the create side panel. |
| opens filter panel and updates active filters | Verifies the filter side panel opens and updates active filters correctly. |
