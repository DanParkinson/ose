## Navigation

[← Back to TESTING_OVERVIEW.md](/docs/documentation/frontend/tests/TESTING_OVERVIEW.md)

## DeactivateAccountForm

| Test Name | Purpose |
|---|---|
| shows the initial deactivate account button and warning text | Verifies the initial warning text and deactivate button are shown before confirmation. |
| shows confirmation options when deactivate account is clicked | Verifies clicking deactivate opens the confirmation state. |
| returns to initial state when cancel is clicked | Verifies clicking cancel exits the confirmation state and restores the initial view. |
| deactivates account, logs out, and navigates home on success | Verifies successful deactivation calls the API, logs the user out, and redirects home. |
| displays backend error when deactivation fails | Verifies backend error messages are displayed when deactivation fails. |
| displays fallback error when no backend error data exists | Verifies a fallback error message is shown when no backend error data is available. |
