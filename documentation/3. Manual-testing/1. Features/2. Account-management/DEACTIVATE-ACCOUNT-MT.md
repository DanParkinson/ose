# Deactivate Account Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Account Deactivation](#successful-account-deactivation)
* [Confirmation Workflow](#confirmation-workflow)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)

## Purpose

This document records the manual testing performed on the account deactivation functionality.

Testing verifies that users can deactivate their accounts successfully, that confirmation safeguards work correctly, and that appropriate feedback is displayed when deactivation fails.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Account Deactivation

| Test                             | Expected Result                           | Actual Result                             | Status             |
| -------------------------------- | ----------------------------------------- | ----------------------------------------- | ------------------ |
| Click deactivate account button  | Confirmation prompt displayed             | Confirmation prompt displayed             | :white_check_mark: |
| Confirm account deactivation     | Account deactivated successfully          | Account deactivated successfully          | :white_check_mark: |
| Successful deactivation          | User logged out automatically             | User logged out automatically             | :white_check_mark: |
| Successful deactivation          | User redirected to home page              | User redirected to home page              | :white_check_mark: |
| Attempt login after deactivation | Login prevented and reactivation required | Login prevented and reactivation required | :white_check_mark: |

### Evidence

## Confirmation Workflow

| Test                               | Expected Result                | Actual Result                  | Status             |
| ---------------------------------- | ------------------------------ | ------------------------------ | ------------------ |
| Click deactivate account button    | Confirmation options displayed | Confirmation options displayed | :white_check_mark: |
| Click cancel button                | Confirmation prompt closed     | Confirmation prompt closed     | :white_check_mark: |
| Click cancel button                | Account remains active         | Account remains active         | :white_check_mark: |
| View deactivation information text | Deactivation warning displayed | Deactivation warning displayed | :white_check_mark: |

### Evidence

## Loading State

| Test                                   | Expected Result                      | Actual Result                        | Status             |
| -------------------------------------- | ------------------------------------ | ------------------------------------ | ------------------ |
| Submit deactivation request            | Loading text displayed               | Loading text displayed               | :white_check_mark: |
| Submit deactivation request            | Confirm deactivation button disabled | Confirm deactivation button disabled | :white_check_mark: |
| Submit deactivation request            | Cancel button disabled               | Cancel button disabled               | :white_check_mark: |
| Click confirm repeatedly while loading | Duplicate submissions prevented      | Duplicate submissions prevented      | :white_check_mark: |

### Evidence


## Error Handling

| Test                                            | Expected Result                  | Actual Result                    | Status             |
| ----------------------------------------------- | -------------------------------- | -------------------------------- | ------------------ |
| Deactivation request fails with API error       | API error message displayed      | API error message displayed      | :white_check_mark: |
| Deactivation request fails without API response | Fallback error message displayed | Fallback error message displayed | :white_check_mark: |
| Deactivation request fails                      | User remains logged in           | User remains logged in           | :white_check_mark: |
| Deactivation request fails                      | Account remains active           | Account remains active           | :white_check_mark: |

### Evidence
