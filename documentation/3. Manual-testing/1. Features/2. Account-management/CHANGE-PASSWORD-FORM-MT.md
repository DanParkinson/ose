# Change Password Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Password Change](#successful-password-change)
* [Validation Testing](#validation-testing)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)
* [Form Reset Behaviour](#form-reset-behaviour)

## Purpose

This document records the manual testing performed on the change password form.

Testing verifies that authenticated users can update their password, that password validation behaves correctly, and that appropriate success, loading, and error feedback is displayed.

## Test Environment

| Item        | Value                       |
| ----------- | --------------------------- |
| Browser     | Chrome                      |
| Device      | Desktop and mobile viewport |
| Environment | Development                 |

## Successful Password Change

| Test                                                            | Expected Result                                | Actual Result                                  | Status             |
| --------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------ |
| Enter correct current password and matching valid new passwords | Password change request submitted successfully | Password change request submitted successfully | :white_check_mark: |
| Submit valid password change form                               | Success message displayed                      | Success message displayed                      | :white_check_mark: |
| Submit valid password change form                               | Password updated successfully                  | Password updated successfully                  | :white_check_mark: |
| Log out and log in with new password                            | Login successful with new password             | Login successful with new password             | :white_check_mark: |
| Try logging in with old password                                | Login prevented                                | Login prevented                                | :white_check_mark: |

## Validation Testing

| Test                                             | Expected Result              | Actual Result                | Status             |
| ------------------------------------------------ | ---------------------------- | ---------------------------- | ------------------ |
| Current password field left blank                | Validation message displayed | Validation message displayed | :white_check_mark: |
| New password field left blank                    | Validation message displayed | Validation message displayed | :white_check_mark: |
| Confirm new password field left blank            | Validation message displayed | Validation message displayed | :white_check_mark: |
| New passwords do not match                       | Validation message displayed | Validation message displayed | :white_check_mark: |
| New password does not meet password requirements | Validation message displayed | Validation message displayed | :white_check_mark: |
| Incorrect current password entered               | Validation message displayed | Validation message displayed | :white_check_mark: |

## Loading State

| Test                                  | Expected Result                                    | Actual Result                                      | Status             |
| ------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Submit password change form           | Loading text displayed                             | Loading text displayed                             | :white_check_mark: |
| Submit password change form           | Submit button disabled while request is processing | Submit button disabled while request is processing | :white_check_mark: |
| Click submit repeatedly while loading | Duplicate submissions prevented                    | Duplicate submissions prevented                    | :white_check_mark: |

## Error Handling

| Test                                       | Expected Result                                     | Actual Result                                       | Status             |
| ------------------------------------------ | --------------------------------------------------- | --------------------------------------------------- | ------------------ |
| Password change fails with field error     | Field error message displayed beside relevant field | Field error message displayed beside relevant field | :white_check_mark: |
| Password change fails with non-field error | Non-field error message displayed                   | Non-field error message displayed                   | :white_check_mark: |
| Password change fails without API response | Fallback error message displayed                    | Fallback error message displayed                    | :white_check_mark: |
| Password change fails                      | Password fields remain available for correction     | Password fields remain available for correction     | :white_check_mark: |

## Form Reset Behaviour

| Test                                               | Expected Result                       | Actual Result                         | Status             |
| -------------------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------ |
| Password changed successfully                      | Current password field is cleared     | Current password field is cleared     | :white_check_mark: |
| Password changed successfully                      | New password field is cleared         | New password field is cleared         | :white_check_mark: |
| Password changed successfully                      | Confirm new password field is cleared | Confirm new password field is cleared | :white_check_mark: |
| Edit current password field after validation error | Current password error clears         | Current password error clears         | :white_check_mark: |
| Edit new password field after validation error     | New password error clears             | New password error clears             | :white_check_mark: |
| Edit confirm password field after validation error | Confirm password error clears         | Confirm password error clears         | :white_check_mark: |
