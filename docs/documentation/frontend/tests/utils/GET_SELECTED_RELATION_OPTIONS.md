## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

---

## Multiple Relation Selection

| Test Name | Purpose |
|---|---|
| returns multiple selected relation options | Verifies multiple selected values return all matching relation options. |
| excludes non-selected options | Verifies options not included in the selected values are excluded. |
| empty selectedValues arrays return empty arrays | Verifies empty selected value arrays return no selected options. |

## Single Relation Selection

| Test Name | Purpose |
|---|---|
| returns single selected relation options | Verifies a single selected value returns the matching relation option. |
| missing selectedValues return empty arrays for single relations | Verifies empty single selected values return no selected options. |

## optionValue Matching

| Test Name | Purpose |
|---|---|
| custom optionValue keys are supported | Verifies custom option identifier keys are used when matching selected values. |
