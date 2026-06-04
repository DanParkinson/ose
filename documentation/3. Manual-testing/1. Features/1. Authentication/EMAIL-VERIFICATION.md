# Email Verification Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Registration Flow](#registration-flow)
* [Email Delivery](#email-delivery)
* [Verification Process](#verification-process)
* [Access Restrictions](#access-restrictions)
* [Error Handling](#error-handling)

## Purpose

This document records the manual testing performed on the email verification system.

Testing verifies that verification emails are sent correctly, users can verify their accounts successfully, and unverified users are prevented from accessing authenticated areas of the application.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Registration Flow

| Test                                   | Expected Result                   | Actual Result                     | Status             |
| -------------------------------------- | --------------------------------- | --------------------------------- | ------------------ |
| Register with valid email and password | Verification email page displayed | Verification email page displayed | :white_check_mark: |
| Register with valid email and password | Verification email sent           | Verification email sent           | :white_check_mark: |

### Evidence

![Verification Email Page](/documentation/assets/1.%20Manual-testing/Email-Verification/register-email-notifcation.png)
![development terminal email](/documentation/assets/1.%20Manual-testing/Email-Verification/development-terminal-email.png)
![production actual email](/documentation/assets/1.%20Manual-testing/Email-Verification/production-actual-email.png)   

## Verification Process

| Test                               | Expected Result                             | Actual Result                               | Status             |
| ---------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------ |
| Click verification link from email | Verification request processed successfully | Verification request processed successfully | :white_check_mark: |
| Click verification link from email | Verification success page displayed         | Verification success page displayed         | :white_check_mark: |
| Verified account attempts login    | Login successful                            | Login successful                            | :white_check_mark: |

### Evidence

![Verification link loads](/documentation/assets/1.%20Manual-testing/Email-Verification/verification-link-loads.png)

![Verification link works](/documentation/assets/1.%20Manual-testing/Email-Verification/verification-link-works.png)

![Verified User Login](/documentation/assets/1.%20Manual-testing/Email-Verification/verified-user-login.png)

## Access Restrictions

| Test                                                           | Expected Result                                    | Actual Result                                      | Status             |
| -------------------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Unverified user attempts login                                 | Login prevented and verification message displayed | Login prevented and verification message displayed | :white_check_mark: |
| Unverified user attempts access to authenticated functionality | Access denied                                      | Access denied                                      | :white_check_mark: |

### Evidence

![Unverified Login Attempt](/documentation/assets/1.%20Manual-testing/Email-Verification/unverified-login-attempt.png)

## Error Handling

| Test                           | Expected Result                     | Actual Result                       | Status             |
| ------------------------------ | ----------------------------------- | ----------------------------------- | ------------------ |
| Verification link already used | Appropriate error message displayed | Appropriate error message displayed | :white_check_mark: |
| Invalid verification link used | Appropriate error message displayed | Appropriate error message displayed | :white_check_mark: |

### Evidence

![Invalid Verification Link](/documentation/assets/1.%20Manual-testing/Email-Verification/invalid-verification-link.png)
