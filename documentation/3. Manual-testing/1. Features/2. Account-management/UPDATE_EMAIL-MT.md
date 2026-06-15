# Update Email Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Email Update Request](#successful-email-update-request)
* [Verification Pending State](#verification-pending-state)
* [Resend Verification](#resend-verification)
* [Cancel Update](#cancel-update)
* [Email Confirmation](#email-confirmation)
* [Validation Testing](#validation-testing)
* [Loading State](#loading-state)
* [Error Handling](#error-handling)

## Purpose

This document records the manual testing performed on the update email functionality.

Testing verifies that authenticated users can request an email address change, confirm the change through a verification link, resend verification emails, cancel pending email changes, and receive appropriate validation, loading, and error feedback throughout the process.

## Test Environment

| Item        | Value                       |
| ----------- | --------------------------- |
| Browser     | Chrome                      |
| Device      | Desktop and mobile viewport |
| Environment | Development                 |

## Successful Email Update Request

| Test                              | Expected Result                        | Actual Result                          | Status             |
| --------------------------------- | -------------------------------------- | -------------------------------------- | ------------------ |
| Enter a valid new email address   | Submit button becomes enabled          | Submit button becomes enabled          | :white_check_mark: |
| Submit valid email change request | Verification email is sent             | Verification email is sent             | :white_check_mark: |
| Submit valid email change request | Verification pending message displayed | Verification pending message displayed | :white_check_mark: |
| Submit valid email change request | Current email remains unchanged        | Current email remains unchanged        | :white_check_mark: |
| Submit valid email change request | New email field becomes disabled       | New email field becomes disabled       | :white_check_mark: |
| Submit valid email change request | Submit button is hidden                | Submit button is hidden                | :white_check_mark: |

## Verification Pending State

| Test                 | Expected Result                      | Actual Result                        | Status             |
| -------------------- | ------------------------------------ | ------------------------------------ | ------------------ |
| Verification pending | Verification message displayed       | Verification message displayed       | :white_check_mark: |
| Verification pending | Resend verification button displayed | Resend verification button displayed | :white_check_mark: |
| Verification pending | Cancel update button displayed       | Cancel update button displayed       | :white_check_mark: |
| Verification pending | Update email field remains populated | Update email field remains populated | :white_check_mark: |
| Verification pending | Update email field cannot be edited  | Update email field cannot be edited  | :white_check_mark: |

## Resend Verification

| Test                          | Expected Result                      | Actual Result                        | Status             |
| ----------------------------- | ------------------------------------ | ------------------------------------ | ------------------ |
| Click resend verification     | New verification email sent          | New verification email sent          | :white_check_mark: |
| Click resend verification     | Loading indicator displayed          | Loading indicator displayed          | :white_check_mark: |
| Click resend verification     | Resend button disabled while loading | Resend button disabled while loading | :white_check_mark: |
| Resend completes successfully | Success confirmation displayed       | Success confirmation displayed       | :white_check_mark: |
| Repeated clicks while loading | Duplicate resend requests prevented  | Duplicate resend requests prevented  | :white_check_mark: |

## Cancel Update

| Test                  | Expected Result                        | Actual Result                          | Status             |
| --------------------- | -------------------------------------- | -------------------------------------- | ------------------ |
| Cancel pending update | Pending email removed                  | Pending email removed                  | :white_check_mark: |
| Cancel pending update | Pending verification token invalidated | Pending verification token invalidated | :white_check_mark: |
| Cancel pending update | Verification message hidden            | Verification message hidden            | :white_check_mark: |
| Cancel pending update | Resend button hidden                   | Resend button hidden                   | :white_check_mark: |
| Cancel pending update | Cancel button hidden                   | Cancel button hidden                   | :white_check_mark: |
| Cancel pending update | Update email field becomes editable    | Update email field becomes editable    | :white_check_mark: |
| Cancel pending update | Update email field cleared             | Update email field cleared             | :white_check_mark: |

## Email Confirmation

| Test                         | Expected Result                              | Actual Result                                | Status             |
| ---------------------------- | -------------------------------------------- | -------------------------------------------- | ------------------ |
| Open valid confirmation link | Confirmation request submitted automatically | Confirmation request submitted automatically | :white_check_mark: |
| Valid confirmation link      | User email updated                           | User email updated                           | :white_check_mark: |
| Valid confirmation link      | User session remains active                  | User session remains active                  | :white_check_mark: |
| Valid confirmation link      | User details refreshed                       | User details refreshed                       | :white_check_mark: |
| Valid confirmation link      | User redirected to account page              | User redirected to account page              | :white_check_mark: |
| Account page loads           | Updated email displayed as current email     | Updated email displayed as current email     | :white_check_mark: |

## Validation Testing

| Test                         | Expected Result                  | Actual Result                    | Status             |
| ---------------------------- | -------------------------------- | -------------------------------- | ------------------ |
| Enter invalid email format   | Validation message displayed     | Validation message displayed     | :white_check_mark: |
| Enter existing email address | Validation message displayed     | Validation message displayed     | :white_check_mark: |
| Leave email field empty      | Submit button disabled           | Submit button disabled           | :white_check_mark: |
| Backend validation fails     | Appropriate validation displayed | Appropriate validation displayed | :white_check_mark: |

## Loading State

| Test                   | Expected Result                          | Actual Result                            | Status             |
| ---------------------- | ---------------------------------------- | ---------------------------------------- | ------------------ |
| Submit email update    | Loading text displayed                   | Loading text displayed                   | :white_check_mark: |
| Submit email update    | Submit button disabled                   | Submit button disabled                   | :white_check_mark: |
| Resend verification    | Loading text displayed                   | Loading text displayed                   | :white_check_mark: |
| Resend verification    | Resend button disabled                   | Resend button disabled                   | :white_check_mark: |
| Open confirmation link | Verification loading indicator displayed | Verification loading indicator displayed | :white_check_mark: |

## Error Handling

| Test                                         | Expected Result                | Actual Result                  | Status             |
| -------------------------------------------- | ------------------------------ | ------------------------------ | ------------------ |
| Update request returns field error           | Field error displayed          | Field error displayed          | :white_check_mark: |
| Update request returns non-field error       | Non-field error displayed      | Non-field error displayed      | :white_check_mark: |
| Resend request fails                         | Appropriate error displayed    | Appropriate error displayed    | :white_check_mark: |
| Cancel request fails                         | Appropriate error displayed    | Appropriate error displayed    | :white_check_mark: |
| Invalid confirmation link                    | Invalid link message displayed | Invalid link message displayed | :white_check_mark: |
| Expired confirmation link                    | Expired link message displayed | Expired link message displayed | :white_check_mark: |
| Confirmation request returns non-field error | Non-field error displayed      | Non-field error displayed      | :white_check_mark: |
| Confirmation fails                           | Loading indicator removed      | Loading indicator removed      | :white_check_mark: |
| Confirmation fails                           | User is not redirected         | User is not redirected         | :white_check_mark: |
