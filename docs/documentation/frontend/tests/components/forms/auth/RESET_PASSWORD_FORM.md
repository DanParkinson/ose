## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## Reset Password Form Rendering

| Test Name | Purpose |
|---|---|
| shows the initial reset password form | Verifies the reset password form renders correctly with headings, password inputs, submit button, and login link. |

## Reset Password Form Input Handling

| Test Name | Purpose |
|---|---|
| updates password fields when user types | Verifies the new password and confirm password inputs update correctly from user interaction. |

## Reset Password Validation

| Test Name | Purpose |
|---|---|
| shows mismatch error and does not call API when passwords do not match | Verifies mismatched passwords are validated before the API request and prevent submission. |

## Reset Password Submission — Success Handling

| Test Name | Purpose |
|---|---|
| posts reset data and redirects to login on success | Verifies the reset password endpoint receives the correct uid, token, and password values and redirects the user to login after success. |

## Reset Password Submission — Backend Error Handling

| Test Name | Purpose |
|---|---|
| displays backend validation errors when reset request fails | Verifies backend field and non-field validation errors display correctly after a failed reset request. |
| displays fallback error when no backend error data exists | Verifies a fallback error message is displayed when the reset request fails without backend validation data. |

## Reset Password Field Error Clearing

| Test Name | Purpose |
|---|---|
| clears new password error when new password field changes | Verifies the new password validation error clears after the user edits the new password field. |
