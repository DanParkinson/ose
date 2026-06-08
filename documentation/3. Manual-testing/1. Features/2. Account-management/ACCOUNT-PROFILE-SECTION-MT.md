# Account Profile Section Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Profile Section Display](#profile-section-display)
* [User Information Display](#user-information-display)
* [Read-Only Behaviour](#read-only-behaviour)

## Purpose

This document records the manual testing performed on the account profile section.

Testing verifies that users can view their account profile information and that profile details are displayed as read-only fields.

## Test Environment

| Item        | Value                       |
| ----------- | --------------------------- |
| Browser     | Chrome                      |
| Device      | Desktop and mobile viewport |
| Environment | Development                 |

## Profile Section Display

| Test                         | Expected Result                        | Actual Result                          | Status             |
| ---------------------------- | -------------------------------------- | -------------------------------------- | ------------------ |
| Open account profile section | Account Profile heading is displayed   | Account Profile heading is displayed   | :white_check_mark: |
| Open account profile section | Profile description text is displayed  | Profile description text is displayed  | :white_check_mark: |
| Open account profile section | Email label is displayed               | Email label is displayed               | :white_check_mark: |
| Open account profile section | Settings instruction text is displayed | Settings instruction text is displayed | :white_check_mark: |

## User Information Display

| Test                                          | Expected Result                        | Actual Result                          | Status             |
| --------------------------------------------- | -------------------------------------- | -------------------------------------- | ------------------ |
| View profile section while user is loaded     | User email is displayed in email field | User email is displayed in email field | :white_check_mark: |
| View profile section without loaded user data | Email field displays empty value       | Email field displays empty value       | :white_check_mark: |

## Read-Only Behaviour

| Test                              | Expected Result             | Actual Result               | Status             |
| --------------------------------- | --------------------------- | --------------------------- | ------------------ |
| Click email input field           | Field cannot be edited      | Field cannot be edited      | :white_check_mark: |
| Try typing into email input field | Email value does not change | Email value does not change | :white_check_mark: |
| Try deleting email value          | Email value does not change | Email value does not change | :white_check_mark: |
