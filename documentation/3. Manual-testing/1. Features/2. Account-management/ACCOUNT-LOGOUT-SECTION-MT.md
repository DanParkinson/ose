# Account Logout Section Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Section Display](#section-display)
* [Logout Form Display](#logout-form-display)
* [Logout Workflow](#logout-workflow)
* [Responsive Layout](#responsive-layout)

## Purpose

This document records the manual testing performed on the account logout section.

Testing verifies that the logout section displays correctly, provides appropriate user guidance, and allows users to successfully end their session.

## Test Environment

| Item        | Value                       |
| ----------- | --------------------------- |
| Browser     | Chrome                      |
| Device      | Desktop and mobile viewport |
| Environment | Development                 |

## Section Display

| Test                | Expected Result                           | Actual Result                             | Status             |
| ------------------- | ----------------------------------------- | ----------------------------------------- | ------------------ |
| Open logout section | Logout heading is displayed               | Logout heading is displayed               | :white_check_mark: |
| Open logout section | Logout description text is displayed      | Logout description text is displayed      | :white_check_mark: |
| Open logout section | Post-logout information text is displayed | Post-logout information text is displayed | :white_check_mark: |
| Open logout section | Logout form is displayed                  | Logout form is displayed                  | :white_check_mark: |

## Logout Form Display

| Test                | Expected Result                              | Actual Result                                | Status             |
| ------------------- | -------------------------------------------- | -------------------------------------------- | ------------------ |
| View logout section | Logout button is visible                     | Logout button is visible                     | :white_check_mark: |
| View logout section | Logout button is enabled                     | Logout button is enabled                     | :white_check_mark: |
| View logout section | User guidance text is visible below the form | User guidance text is visible below the form | :white_check_mark: |

## Logout Workflow

| Test                                                  | Expected Result                       | Actual Result                         | Status             |
| ----------------------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------ |
| Click logout button                                   | Logout request submitted successfully | Logout request submitted successfully | :white_check_mark: |
| Successful logout                                     | User redirected to homepage           | User redirected to homepage           | :white_check_mark: |
| Successful logout                                     | User session terminated               | User session terminated               | :white_check_mark: |
| Attempt to access protected account page after logout | User redirected to login page         | User redirected to login page         | :white_check_mark: |
| Log in again after logout                             | Login successful                      | Login successful                      | :white_check_mark: |

## Responsive Layout

| Test                                   | Expected Result                     | Actual Result                       | Status             |
| -------------------------------------- | ----------------------------------- | ----------------------------------- | ------------------ |
| View logout section on desktop screen  | Content displays correctly          | Content displays correctly          | :white_check_mark: |
| View logout section on tablet screen   | Content displays correctly          | Content displays correctly          | :white_check_mark: |
| View logout section on mobile screen   | Content displays correctly          | Content displays correctly          | :white_check_mark: |
| View logout section on smaller screens | No content overlap or layout issues | No content overlap or layout issues | :white_check_mark: |
