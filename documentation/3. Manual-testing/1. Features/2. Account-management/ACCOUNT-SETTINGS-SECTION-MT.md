# Account Settings Section Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Settings Section Display](#settings-section-display)
* [Tab Navigation](#tab-navigation)
* [Change Password Form Display](#change-password-form-display)
* [Deactivate Account Form Display](#deactivate-account-form-display)
* [Responsive Layout](#responsive-layout)

## Purpose

This document records the manual testing performed on the account settings section.

Testing verifies that users can navigate between account management forms, that the correct form is displayed based on the selected tab, and that the layout adapts correctly across screen sizes.

## Test Environment

| Item        | Value                       |
| ----------- | --------------------------- |
| Browser     | Chrome                      |
| Device      | Desktop and mobile viewport |
| Environment | Development                 |

## Settings Section Display

| Test                          | Expected Result                        | Actual Result                          | Status             |
| ----------------------------- | -------------------------------------- | -------------------------------------- | ------------------ |
| Open account settings section | Account Settings heading is displayed  | Account Settings heading is displayed  | :white_check_mark: |
| Open account settings section | Settings description text is displayed | Settings description text is displayed | :white_check_mark: |
| Open account settings section | Change Password tab is displayed       | Change Password tab is displayed       | :white_check_mark: |
| Open account settings section | Deactivate Account tab is displayed    | Deactivate Account tab is displayed    | :white_check_mark: |

## Tab Navigation

| Test                           | Expected Result                            | Actual Result                              | Status             |
| ------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------ |
| Open settings section          | Change Password tab is selected by default | Change Password tab is selected by default | :white_check_mark: |
| Click Change Password tab      | Change Password tab becomes active         | Change Password tab becomes active         | :white_check_mark: |
| Click Deactivate Account tab   | Deactivate Account tab becomes active      | Deactivate Account tab becomes active      | :white_check_mark: |
| Switch between tabs repeatedly | Correct tab content loads each time        | Correct tab content loads each time        | :white_check_mark: |
| Switch tabs                    | Only one tab is active at a time           | Only one tab is active at a time           | :white_check_mark: |

## Change Password Form Display

| Test                         | Expected Result                              | Actual Result                                | Status             |
| ---------------------------- | -------------------------------------------- | -------------------------------------------- | ------------------ |
| Open settings section        | Change Password form is displayed by default | Change Password form is displayed by default | :white_check_mark: |
| Change Password tab selected | Change Password section heading is displayed | Change Password section heading is displayed | :white_check_mark: |
| Change Password tab selected | Change Password form is visible              | Change Password form is visible              | :white_check_mark: |
| Change Password tab selected | Deactivate Account form is hidden            | Deactivate Account form is hidden            | :white_check_mark: |

## Deactivate Account Form Display

| Test                          | Expected Result                                 | Actual Result                                   | Status             |
| ----------------------------- | ----------------------------------------------- | ----------------------------------------------- | ------------------ |
| Click Deactivate Account tab  | Deactivate Account section heading is displayed | Deactivate Account section heading is displayed | :white_check_mark: |
| Click Deactivate Account tab  | Deactivate Account form is visible              | Deactivate Account form is visible              | :white_check_mark: |
| Click Deactivate Account tab  | Change Password form is hidden                  | Change Password form is hidden                  | :white_check_mark: |
| Return to Change Password tab | Change Password form becomes visible again      | Change Password form becomes visible again      | :white_check_mark: |

## Responsive Layout

| Test                                    | Expected Result                       | Actual Result                         | Status             |
| --------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------ |
| View settings section on desktop screen | Tabs display in a multi-column layout | Tabs display in a multi-column layout | :white_check_mark: |
| View settings section on mobile screen  | Tabs stack vertically                 | Tabs stack vertically                 | :white_check_mark: |
| Switch tabs on mobile screen            | Correct form content is displayed     | Correct form content is displayed     | :white_check_mark: |
| Switch tabs on desktop screen           | Correct form content is displayed     | Correct form content is displayed     | :white_check_mark: |
