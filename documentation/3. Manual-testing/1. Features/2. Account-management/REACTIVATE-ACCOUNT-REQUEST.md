# Reactivate Account Request Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Reactivation Request](#successful-reactivation-request)
* [Validation Testing](#validation-testing)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)
* [Navigation Links](#navigation-links)

## Purpose

This document records the manual testing performed on the account reactivation request page.

Testing verifies that users can request a reactivation email for deactivated accounts, receive appropriate feedback, and are shown validation or error messages when required.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Reactivation Request

| Test                                          | Expected Result                                | Actual Result                                  | Status             |
| --------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------ |
| Enter email address for a deactivated account | Reactivation request submitted successfully    | Reactivation request submitted successfully    | :white_check_mark: |
| Submit reactivation request form              | Success message displayed                      | Success message displayed                      | :white_check_mark: |
| Submit reactivation request form              | Reactivation email sent                        | Reactivation email sent                        | :white_check_mark: |
| Submit valid request                          | Login link displayed                           | Login link displayed                           | :white_check_mark: |
| Submit email for an active account            | Generic success message displayed for security | Generic success message displayed for security | :white_check_mark: |
| Submit unknown email address                  | Generic success message displayed for security | Generic success message displayed for security | :white_check_mark: |

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
| Submit reactivation request           | Loading text displayed                             | Loading text displayed                             | :white_check_mark: |
| Submit reactivation request           | Submit button disabled while request is processing | Submit button disabled while request is processing | :white_check_mark: |
| Click submit repeatedly while loading | Duplicate submissions prevented                    | Duplicate submissions prevented                    | :white_check_mark: |

### Evidence


## Error Handling

| Test                                                   | Expected Result                  | Actual Result                    | Status             |
| ------------------------------------------------------ | -------------------------------- | -------------------------------- | ------------------ |
| Reactivation request fails with email validation error | Email validation error displayed | Email validation error displayed | :white_check_mark: |
| Reactivation request fails with API error              | Error message displayed          | Error message displayed          | :white_check_mark: |
| Reactivation request fails without API response        | Fallback error message displayed | Fallback error message displayed | :white_check_mark: |

### Evidence


## Navigation Links

| Test                                      | Expected Result               | Actual Result                 | Status             |
| ----------------------------------------- | ----------------------------- | ----------------------------- | ------------------ |
| Click login link before submitting form   | User redirected to login page | User redirected to login page | :white_check_mark: |
| Click login link after successful request | User redirected to login page | User redirected to login page | :white_check_mark: |

### Evidence
