## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

---

## displayFields Formatting

| Test Name | Purpose |
|---|---|
| combines displayFields correctly | Verifies configured display fields are combined correctly into a formatted string. |
| ignores missing displayField values | Verifies missing display field values are excluded from the formatted output. |
| joins displayFields using " - " | Verifies display field values are joined using the `" - "` separator. |
| single displayFields work correctly | Verifies single display fields format correctly without additional separators. |
| empty displayFields return empty strings | Verifies empty display field arrays return an empty string. |

## Fallback Formatting

| Test Name | Purpose |
|---|---|
| uses title, level, and language fallback formatting | Verifies the title-level-language fallback format is used when displayFields are not configured. |
| returns optionLabel fallback values | Verifies optionLabel values are used as the final formatting fallback. |
