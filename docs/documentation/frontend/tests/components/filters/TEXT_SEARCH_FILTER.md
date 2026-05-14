## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## TextSearchFilter

| Test Name | Purpose |
|---|---|
| renders the input field | Verifies the search input renders correctly. |
| renders a custom placeholder | Verifies a custom placeholder value is displayed correctly. |
| calls onChange with the correct input value | Verifies `onChange` receives the updated input value when typing. |
| calls onSearch after the debounce delay | Verifies `onSearch` is triggered after the configured debounce delay. |
| clears previous timeout before creating a new one | Verifies previous debounce timers are cleared before new searches are scheduled. |
