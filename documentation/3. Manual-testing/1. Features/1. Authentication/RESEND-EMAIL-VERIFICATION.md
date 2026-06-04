# Resend Verification Email Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Resend Request](#successful-resend-request)
* [Validation Testing](#validation-testing)
* [Error Handling](#error-handling)

## Purpose

This document records the manual testing performed on the resend verification email page.

Testing verifies that users can request a new verification email, receive appropriate feedback, and are shown validation or error messages when required.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Resend Request

| Test                                          | Expected Result                       | Actual Result                         | Status             |
| --------------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------ |
| Enter email address for an unverified account | Resend request submitted successfully | Resend request submitted successfully | :white_check_mark: |
| Submit resend verification email form         | Success message displayed             | Success message displayed             | :white_check_mark: |
| Submit resend verification email form         | New verification email sent           | New verification email sent           | :white_check_mark: |
| Click login link after success                | User is redirected to login page      | User is redirected to login page      | :white_check_mark: |

### Evidence

![Resend Verification Email Form](/documentation/assets/1.%20Manual-testing/resend-email-verification.md/resend-form.png)

![Resend Verification Email Success](/documentation/assets/1.%20Manual-testing/resend-email-verification.md/resend-confimartion-message.md.png)

![Resent Verification Email Received](/documentation/assets/1.%20Manual-testing/resend-email-verification.md/resend-email.png)

## Validation Testing

| Test                         | Expected Result              | Actual Result                | Status             |
| ---------------------------- | ---------------------------- | ---------------------------- | ------------------ |
| Email field left blank       | Validation message displayed | Validation message displayed | :white_check_mark: |
| Invalid email format entered | Validation message displayed | Validation message displayed | :white_check_mark: |

### Evidence

![Email Field Left Blank](/documentation/assets/1.%20Manual-testing/resend-email-verification.md/blank-email.png)

![Invalid Email Format](/documentation/assets/1.%20Manual-testing/resend-email-verification.md/invalid-email.png)

## Error Handling

| Test                                | Expected Result                                | Actual Result                                  | Status             |
| ----------------------------------- | ---------------------------------------------- | ---------------------------------------------- | ------------------ |
| Resend request fails                | Error message displayed                        | Error message displayed                        | :white_check_mark: |
| Already verified user submits email | Generic success message displayed for security | Generic success message displayed for security | :white_check_mark: |
| Unknown email address submitted     | Generic success message displayed for security | Generic success message displayed for security | :white_check_mark: |

### Evidence
