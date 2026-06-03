# Password Reset Confirm Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Password Reset](#successful-password-reset)
* [Validation Testing](#validation-testing)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)
* [Navigation Links](#navigation-links)

## Purpose

This document records the manual testing performed on the password reset confirm page.

Testing verifies that users can set a new password from a valid password reset link, validation behaves correctly, and appropriate feedback is displayed when the reset request fails.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Password Reset

| Test                                      | Expected Result                               | Actual Result                                 | Status             |
| ----------------------------------------- | --------------------------------------------- | --------------------------------------------- | ------------------ |
| Open valid password reset link from email | Password reset form displayed                 | Password reset form displayed                 | :white_check_mark: |
| Enter matching valid passwords            | Password reset request submitted successfully | Password reset request submitted successfully | :white_check_mark: |
| Submit valid password reset form          | Success message displayed                     | Success message displayed                     | :white_check_mark: |
| Login using new password                  | Login successful                              | Login successful                              | :white_check_mark: |

### Evidence

## Validation Testing

| Test                                           | Expected Result              | Actual Result                | Status             |
| ---------------------------------------------- | ---------------------------- | ---------------------------- | ------------------ |
| New password field left blank                  | Validation message displayed | Validation message displayed | :white_check_mark: |
| Confirm password field left blank              | Validation message displayed | Validation message displayed | :white_check_mark: |
| Passwords do not match                         | Validation message displayed | Validation message displayed | :white_check_mark: |
| Password does not meet validation requirements | Validation message displayed | Validation message displayed | :white_check_mark: |

### Evidence

## Loading State

| Test                                  | Expected Result                                    | Actual Result                                      | Status             |
| ------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Submit password reset confirm form    | Loading text displayed                             | Loading text displayed                             | :white_check_mark: |
| Submit password reset confirm form    | Submit button disabled while request is processing | Submit button disabled while request is processing | :white_check_mark: |
| Click submit repeatedly while loading | Duplicate submissions prevented                    | Duplicate submissions prevented                    | :white_check_mark: |

### Evidence

## Error Handling

| Test                                              | Expected Result                              | Actual Result                                | Status             |
| ------------------------------------------------- | -------------------------------------------- | -------------------------------------------- | ------------------ |
| Open invalid password reset link                  | Error message displayed                      | Error message displayed                      | :white_check_mark: |
| Open expired password reset link                  | Error message displayed                      | Error message displayed                      | :white_check_mark: |
| Submit form with invalid token                    | Password reset prevented and error displayed | Password reset prevented and error displayed | :white_check_mark: |
| Password reset request fails without API response | Fallback error message displayed             | Fallback error message displayed             | :white_check_mark: |

### Evidence

## Navigation Links

| Test                                             | Expected Result               | Actual Result                 | Status             |
| ------------------------------------------------ | ----------------------------- | ----------------------------- | ------------------ |
| Click login link after successful password reset | User redirected to login page | User redirected to login page | :white_check_mark: |

### Evidence
