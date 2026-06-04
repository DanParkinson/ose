# Password Reset Request Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Password Reset Request](#successful-password-reset-request)
* [Validation Testing](#validation-testing)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)
* [Navigation Links](#navigation-links)

## Purpose

This document records the manual testing performed on the password reset request page.

Testing verifies that users can request a password reset email, receive appropriate feedback, and are shown validation or error messages when required.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Password Reset Request

| Test                                        | Expected Result                                | Actual Result                                  | Status             |
| ------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------ |
| Enter email address for an existing account | Password reset request submitted successfully  | Password reset request submitted successfully  | :white_check_mark: |
| Submit password reset request form          | Success message displayed                      | Success message displayed                      | :white_check_mark: |
| Submit password reset request form          | Password reset email sent                      | Password reset email sent                      | :white_check_mark: |
| Submit unknown email address                | Generic success message displayed for security | Generic success message displayed for security | :white_check_mark: |

### Evidence


## Validation Testing

| Test                         | Expected Result              | Actual Result                | Status             |
| ---------------------------- | ---------------------------- | ---------------------------- | ------------------ |
| Email field left blank       | Validation message displayed | Validation message displayed | :white_check_mark: |
| Invalid email format entered | Validation message displayed | Validation message displayed | :white_check_mark: |

### Evidence


## Loading State

| Test                                  | Expected Result                                    | Actual Result                                      | Status             |
| ------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Submit password reset request         | Loading text displayed                             | Loading text displayed                             | :white_check_mark: |
| Submit password reset request         | Submit button disabled while request is processing | Submit button disabled while request is processing | :white_check_mark: |
| Click submit repeatedly while loading | Duplicate submissions prevented                    | Duplicate submissions prevented                    | :white_check_mark: |

### Evidence

## Error Handling

| Test                                              | Expected Result                  | Actual Result                    | Status             |
| ------------------------------------------------- | -------------------------------- | -------------------------------- | ------------------ |
| Password reset request fails with API error       | API error message displayed      | API error message displayed      | :white_check_mark: |
| Password reset request fails without API response | Fallback error message displayed | Fallback error message displayed | :white_check_mark: |

### Evidence
