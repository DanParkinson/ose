# Register Page Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Registration](#successful-registration)
* [Validation Testing](#validation-testing)
* [Error Handling](#error-handling)

## Purpose

This document records the manual testing performed on the user registration page.

Testing verifies that users can successfully create accounts and that validation and error handling behave as expected.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Registration

| Test                                             | Expected Result                   | Actual Result                     | Status               |
| ------------------------------------------------ | --------------------------------- | --------------------------------- | -------------------- |
| Register with valid email and matching passwords | User account created successfully | User account created successfully | :white_check_mark:   |

### Evidence

![Enter-details](/documentation/assets/1.%20Manual-testing/Registration/registration-enter-details.png)
![Account created](/documentation/assets/1.%20Manual-testing/Registration/registration-account-created.png)

## Validation Testing

| Test                             | Expected Result              | Actual Result                | Status |
| -------------------------------- | ---------------------------- | ---------------------------- | ------ |
| Email field left blank           | Validation message displayed | Validation message displayed | :white_check_mark:   |
| Invalid email format             | Validation message displayed | Validation message displayed | :white_check_mark:   |
| Password field left blank        | Validation message displayed | Validation message displayed | :white_check_mark:   |
| Password confirmation left blank | Validation message displayed | Validation message displayed | :white_check_mark:   |
| Passwords do not match           | Validation message displayed | Validation message displayed | :white_check_mark:   |

### Evidence

![Email Field Left Blank](/documentation/assets/1.%20Manual-testing/Registration/registration-email-field-left-blank.png)
![Invalid email format](/documentation/assets/1.%20Manual-testing/Registration/registration-invalid-email-format.png)
![Password Field Left blank](/documentation/assets/1.%20Manual-testing/Registration/registration-password-field-left-blank.png)
![Password Confirmation left blank](/documentation/assets/1.%20Manual-testing/Registration/registration-password-confirmation-left-blank.png)
![Passwords do not match](/documentation/assets/1.%20Manual-testing/Registration/registration-passwords-do-not-match.png)

## Error Handling

| Test                        | Expected Result                            | Actual Result                              | Status |
| --------------------------- | ------------------------------------------ | ------------------------------------------ | ------ |
| Existing email address used | Registration prevented and error displayed | Registration prevented and error displayed | :white_check_mark:   |

### Evidence

![Duplicate Email](/documentation/assets/1.%20Manual-testing/Registration/registration-existing-email-address-used.png)

