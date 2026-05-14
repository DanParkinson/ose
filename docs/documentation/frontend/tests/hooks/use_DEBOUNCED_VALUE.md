## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Initial State

| Test Name | Purpose |
|---|---|
| returns initial value immediately | Verifies the hook immediately returns the initial value before any debounce delay occurs. |

## Debounce Behaviour

| Test Name | Purpose |
|---|---|
| updates value after debounce delay | Verifies the debounced value updates after the configured debounce delay completes. |
| does not update value before debounce delay finishes | Verifies the debounced value does not update before the debounce timer completes. |
| clears previous debounce timer when value changes | Verifies previous debounce timers are cancelled when the value changes before the delay completes. |

## Delay Configuration

| Test Name | Purpose |
|---|---|
| supports custom delay values | Verifies custom debounce delay values control update timing correctly. |

## Multiple Updates

| Test Name | Purpose |
|---|---|
| updates debounced value multiple times correctly | Verifies the hook correctly handles multiple sequential debounced updates. |
