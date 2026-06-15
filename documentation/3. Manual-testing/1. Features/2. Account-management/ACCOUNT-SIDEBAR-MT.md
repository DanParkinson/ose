# Account Sidebar Testing

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

* [Purpose](#purpose)
* [Test Environment](#test-environment)
* [Desktop Sidebar Display](#desktop-sidebar-display)
* [Mobile Dropdown Display](#mobile-dropdown-display)
* [Section Navigation](#section-navigation)
* [Active Section Styling](#active-section-styling)
* [User Information Display](#user-information-display)

## Purpose

This document records the manual testing performed on the account sidebar component.

Testing verifies that users can navigate between account sections, that the sidebar displays correctly on desktop screens, and that the dropdown version works correctly on smaller screens.

## Test Environment

| Item        | Value                       |
| ----------- | --------------------------- |
| Browser     | Chrome                      |
| Device      | Desktop and mobile viewport |
| Environment | Development                 |

## Desktop Sidebar Display

| Test                                | Expected Result              | Actual Result                | Status             |
| ----------------------------------- | ---------------------------- | ---------------------------- | ------------------ |
| View account page on desktop screen | Sidebar is displayed         | Sidebar is displayed         | :white_check_mark: |
| View account page on desktop screen | Mobile dropdown is hidden    | Mobile dropdown is hidden    | :white_check_mark: |
| View desktop sidebar                | Profile option is displayed  | Profile option is displayed  | :white_check_mark: |
| View desktop sidebar                | Settings option is displayed | Settings option is displayed | :white_check_mark: |
| View desktop sidebar                | Logout option is displayed   | Logout option is displayed   | :white_check_mark: |

## Mobile Dropdown Display

| Test                               | Expected Result              | Actual Result                | Status             |
| ---------------------------------- | ---------------------------- | ---------------------------- | ------------------ |
| View account page on mobile screen | Dropdown button is displayed | Dropdown button is displayed | :white_check_mark: |
| View account page on mobile screen | Desktop sidebar is hidden    | Desktop sidebar is hidden    | :white_check_mark: |
| Click dropdown button              | Dropdown menu opens          | Dropdown menu opens          | :white_check_mark: |
| Click dropdown button again        | Dropdown menu closes         | Dropdown menu closes         | :white_check_mark: |
| Click outside dropdown menu        | Dropdown menu closes         | Dropdown menu closes         | :white_check_mark: |

## Section Navigation

| Test                                | Expected Result                      | Actual Result                        | Status             |
| ----------------------------------- | ------------------------------------ | ------------------------------------ | ------------------ |
| Click Profile option                | Profile section is selected          | Profile section is selected          | :white_check_mark: |
| Click Settings option               | Settings section is selected         | Settings section is selected         | :white_check_mark: |
| Click Logout option                 | Logout section is selected           | Logout section is selected           | :white_check_mark: |
| Select section from mobile dropdown | Selected section loads               | Selected section loads               | :white_check_mark: |
| Select section from mobile dropdown | Dropdown menu closes after selection | Dropdown menu closes after selection | :white_check_mark: |

## Active Section Styling

| Test                              | Expected Result                                   | Actual Result                                     | Status             |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------ |
| Profile section selected          | Profile option displays active styling            | Profile option displays active styling            | :white_check_mark: |
| Settings section selected         | Settings option displays active styling           | Settings option displays active styling           | :white_check_mark: |
| Logout section selected           | Logout option displays active styling             | Logout option displays active styling             | :white_check_mark: |
| View mobile dropdown button       | Current selected section title is displayed       | Current selected section title is displayed       | :white_check_mark: |
| Change selected section on mobile | Dropdown button updates to selected section title | Dropdown button updates to selected section title | :white_check_mark: |

## User Information Display

| Test                                       | Expected Result              | Actual Result                | Status             |
| ------------------------------------------ | ---------------------------- | ---------------------------- | ------------------ |
| View desktop sidebar while user is loaded  | User email is displayed      | User email is displayed      | :white_check_mark: |
| View desktop sidebar while user is loading | Loading text is displayed    | Loading text is displayed    | :white_check_mark: |
| View desktop sidebar                       | Avatar fallback is displayed | Avatar fallback is displayed | :white_check_mark: |
