## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## ModelFieldRenderer

| Test Name | Purpose |
|---|---|
| renders check icon when value is true | Verifies a check icon is rendered when the value is `true`. |
| renders x icon when value is false | Verifies an X icon is rendered when the value is `false`. |
| renders array values as comma-separated text | Verifies primitive array values are joined and rendered as comma-separated text. |
| renders object array values using title, level, and language | Verifies object arrays are formatted using `title`, `level`, and `language`. |
| renders fallback value when value is null | Verifies the default fallback value is rendered when the value is `null`. |
| renders fallback value when value is undefined | Verifies the default fallback value is rendered when the value is `undefined`. |
| renders fallback value when value is an empty string | Verifies the default fallback value is rendered when the value is an empty string. |
| renders custom fallback value when emptyValue is provided | Verifies a custom fallback value is rendered when `emptyValue` is supplied. |
| renders string values normally | Verifies standard string values render correctly. |
| renders number values as strings | Verifies number values are converted to strings and rendered correctly. |
