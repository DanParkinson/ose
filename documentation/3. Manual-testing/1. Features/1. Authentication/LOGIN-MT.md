# Login Page Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Successful Login](#successful-login)
* [Validation Testing](#validation-testing)
* [Error Handling](#error-handling)
* [Navigation Links](#navigation-links)

## Purpose

This document records the manual testing performed on the login page.

Testing verifies that verified users can log in successfully, invalid login attempts are handled correctly, loading feedback is displayed, and users can access related authentication links.

## Test Environment

| Item        | Value       |
| ----------- | ----------- |
| Browser     | Chrome      |
| Device      | Desktop     |
| Environment | Development |

## Successful Login

| Test                                              | Expected Result                                    | Actual Result                                      | Status             |
| ------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Login with verified account and valid credentials | User logged in successfully                        | User logged in successfully                        | :white_check_mark: |
| Login with verified account and valid credentials | User redirected to home page                       | User redirected to home page                       | :white_check_mark: |
| Submit login form                                 | Loading text displayed while request is processing | Loading text displayed while request is processing | :white_check_mark: |
| Submit login form while loading                   | Duplicate submission prevented                     | Duplicate submission prevented                     | :white_check_mark: |

### Evidence

## Validation Testing

| Test                         | Expected Result              | Actual Result                | Status             |
| ---------------------------- | ---------------------------- | ---------------------------- | ------------------ |
| Email field left blank       | Validation message displayed | Validation message displayed | :white_check_mark: |
| Invalid email format entered | Validation message displayed | Validation message displayed | :white_check_mark: |
| Password field left blank    | Validation message displayed | Validation message displayed | :white_check_mark: |

### Evidence

[Screenshot - Email Field Left Blank]

[Screenshot - Invalid Email Format]

[Screenshot - Password Field Left Blank]

## Error Handling

| Test                             | Expected Result                                    | Actual Result                                      | Status             |
| -------------------------------- | -------------------------------------------------- | -------------------------------------------------- | ------------------ |
| Login with incorrect credentials | Login prevented and error message displayed        | Login prevented and error message displayed        | :white_check_mark: |
| Login with unverified account    | Login prevented and verification message displayed | Login prevented and verification message displayed | :white_check_mark: |
| Login with unverified account    | Resend verification email link displayed           | Resend verification email link displayed           | :white_check_mark: |

### Evidence

## Navigation Links

| Test                                 | Expected Result                                   | Actual Result                                     | Status             |
| ------------------------------------ | ------------------------------------------------- | ------------------------------------------------- | ------------------ |
| Click register link                  | User redirected to register page                  | User redirected to register page                  | :white_check_mark: |
| Click reactivate link                | User redirected to reactivate account page        | User redirected to reactivate account page        | :white_check_mark: |
| Click reset password link            | User redirected to forgot password page           | User redirected to forgot password page           | :white_check_mark: |
| Click resend verification email link | User redirected to resend verification email page | User redirected to resend verification email page | :white_check_mark: |

### Evidence

