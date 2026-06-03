# Reactivate Account Confirm Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Account Reactivation](#successful-account-reactivation)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)
* [Navigation Links](#navigation-links)

## Purpose

This document records the manual testing performed on the account reactivation confirm page.

Testing verifies that users can reactivate their account using a valid reactivation link, that loading feedback is displayed, and that invalid or expired links are handled correctly.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Account Reactivation

| Test                                    | Expected Result                             | Actual Result                               | Status             |
| --------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------ |
| Open valid reactivation link from email | Reactivate account page displayed           | Reactivate account page displayed           | :white_check_mark: |
| Click reactivate account button         | Reactivation request submitted successfully | Reactivation request submitted successfully | :white_check_mark: |
| Submit valid reactivation request       | Success message displayed                   | Success message displayed                   | :white_check_mark: |
| Submit valid reactivation request       | Account reactivated successfully            | Account reactivated successfully            | :white_check_mark: |
| Login after successful reactivation     | Login successful                            | Login successful                            | :white_check_mark: |

### Evidence

## Loading State

| Test                                      | Expected Result                             | Actual Result                               | Status             |
| ----------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------ |
| Click reactivate account button           | Loading message displayed                   | Loading message displayed                   | :white_check_mark: |
| Click reactivate account button           | Loading button displayed                    | Loading button displayed                    | :white_check_mark: |
| Click reactivate account button           | Button disabled while request is processing | Button disabled while request is processing | :white_check_mark: |
| Click reactivate repeatedly while loading | Duplicate submissions prevented             | Duplicate submissions prevented             | :white_check_mark: |

### Evidence

## Error Handling

| Test                                            | Expected Result                            | Actual Result                              | Status             |
| ----------------------------------------------- | ------------------------------------------ | ------------------------------------------ | ------------------ |
| Open invalid reactivation link                  | Error message displayed                    | Error message displayed                    | :white_check_mark: |
| Open expired reactivation link                  | Error message displayed                    | Error message displayed                    | :white_check_mark: |
| Submit reactivation with invalid UID or token   | Reactivation prevented and error displayed | Reactivation prevented and error displayed | :white_check_mark: |
| Reactivation request fails without API response | Fallback error message displayed           | Fallback error message displayed           | :white_check_mark: |

### Evidence

## Navigation Links

| Test                                             | Expected Result                                    | Actual Result                                      | Status             |
| ------------------------------------------------ | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Click login link after successful reactivation   | User redirected to login page                      | User redirected to login page                      | :white_check_mark: |
| Click request one link after failed reactivation | User redirected to reactivate account request page | User redirected to reactivate account request page | :white_check_mark: |

### Evidence
