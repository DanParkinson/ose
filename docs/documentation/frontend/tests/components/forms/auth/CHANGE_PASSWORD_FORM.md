## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## ChangePasswordForm

| Test Name | Purpose |
|---|---|
| calls changePassword with the entered password values | Verifies `changePassword` receives the correct password values when the form is submitted. |
| shows success message and clears fields when password change succeeds | Verifies successful password changes clear all fields and display a success message. |
| displays backend validation errors when password change fails | Verifies backend validation errors are rendered correctly when submission fails. |
| clears old password error when current password field changes | Verifies the old password error is removed after editing the current password field. |
| clears new password error when new password field changes | Verifies the new password error is removed after editing the new password field. |
| clears confirm password error when confirm password field changes | Verifies the confirm password error is removed after editing the confirm password field. |
