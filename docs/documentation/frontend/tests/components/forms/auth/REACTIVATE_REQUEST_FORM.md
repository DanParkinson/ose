## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## ReactivateRequestForm

| Test Name | Purpose |
|---|---|
| shows the initial reactivate request form | Verifies the initial form content, input field, submit button, and login link render correctly. |
| updates email input when user types | Verifies the email input updates correctly when the user types. |
| posts email and shows confirmation message on success | Verifies the reactivation request endpoint is called successfully and the confirmation message is displayed. |
| displays backend email error when request fails | Verifies backend email validation errors are displayed correctly. |
| clears email error when email field changes | Verifies email-specific validation errors are cleared when the user updates the email field. |
| displays backend non-field error when request fails | Verifies backend non-field errors are displayed correctly. |
| displays fallback error when no backend error data exists | Verifies a fallback error message is displayed when no backend error data is available. |
