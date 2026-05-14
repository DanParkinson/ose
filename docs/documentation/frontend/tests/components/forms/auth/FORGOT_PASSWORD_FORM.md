## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## ForgotPasswordForm

| Test Name | Purpose |
|---|---|
| shows the initial forgot password form | Verifies the initial form content, input field, submit button, and login link are displayed correctly. |
| updates email input when user types | Verifies the email input updates correctly when the user types. |
| posts email and shows confirmation message on success | Verifies the password reset endpoint is called successfully and the confirmation message is displayed. |
| displays backend email error when reset request fails | Verifies backend email validation errors are displayed correctly. |
| displays backend non-field error when reset request fails | Verifies backend non-field errors are displayed correctly. |
| displays fallback error when no backend error data exists | Verifies a fallback error message is displayed when no backend error data is available. |
