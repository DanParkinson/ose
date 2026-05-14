## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Boolean Field Initialisation

| Test Name | Purpose |
|---|---|
| boolean fields default to false | Verifies boolean fields initialise with a default value of `false`. |

## Relation Field Initialisation

| Test Name | Purpose |
|---|---|
| multiple relation fields default to empty arrays | Verifies multi-select relation fields initialise as empty arrays. |
| single relation fields default to empty strings | Verifies single relation fields initialise as empty strings. |

## Standard Field Initialisation

| Test Name | Purpose |
|---|---|
| standard fields default to empty strings | Verifies non-boolean and non-relation fields initialise as empty strings. |

## Mixed Field Initialisation

| Test Name | Purpose |
|---|---|
| multiple field types are initialised correctly together | Verifies multiple field types initialise correctly within the same form data object. |

## Empty State Handling

| Test Name | Purpose |
|---|---|
| empty field arrays return empty objects | Verifies empty field arrays return an empty object. |
