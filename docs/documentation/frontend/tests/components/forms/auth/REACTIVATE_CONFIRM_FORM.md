## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## ReactivateConfirmForm

| Test Name | Purpose |
|---|---|
| shows initial idle state | Verifies the initial idle state renders correctly with heading, helper text, and reactivate button. |
| calls API with uid and token when button is clicked | Verifies the reactivation endpoint is called with the correct uid and token values. |
| shows loading state while request is in progress | Verifies the loading state message is displayed while the reactivation request is pending. |
| shows success state after successful reactivation | Verifies the success confirmation and login link are displayed after successful account reactivation. |
| shows backend error when request fails | Verifies backend error messages are displayed correctly when reactivation fails. |
| shows fallback error when no backend data exists | Verifies a fallback error message is displayed when no backend error data is available. |
