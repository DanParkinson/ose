# Testing

## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Purpose

This document tracks the testing strategy for the frontend application.

It explains:
- what has been tested
- what still needs testing
- how tests are organised
- how to run the test suite

---

## Testing Tools

| Tool | Purpose |
|---|---|
| Vitest | Test runner |
| React Testing Library | Component interaction testing |
| Jest DOM | Extra DOM assertions |
| jsdom | Browser-like test environment |

---

## Test Organisation

```text
src/
  components/
    ...
  context/
    AuthContext.test.jsx
  hooks/
    useCoreModelData.test.js
  api/
    coreApi.test.js
```

---

## Testing Pattern

Tests should follow:

```text
Arrange
Act
Assert
```

| Step | Purpose |
|---|---|
| Arrange | Set up mocks, props, and test data |
| Act | Perform the user action or function call |
| Assert | Check the expected result |

# Test Files

## API

| Feature / Module | Overview File |
|---|---|
| Axios Defaults | [Test Overview](./api/AXIOS_DEFAULTS.md) |
| CoreApi | [Test Overview](./api/CORE_API.md) |

## Context

| Feature / Module | Overview File |
|---|---|
| AuthContext | [Test Overview](./context/AUTH_CONTEXT.md) |

## Hooks

| Feature / Module | Overview File |
|---|---|
| useAuth | [Test Overview](./hooks/USE_AUTH.md) |
| useCoreFieldOptions | [Test Overview](./hooks/USE_CORE_FIELD_OPTIONS.md) |
| useCoreModelData | [Test Overview](./hooks/USE_CORE_MODEL_DATA.md) |
| useCoreRelationOptions | [Test Overview](./hooks/USE_CORE_RELATION_OPTIONS.md) |
| useDebouncedValue | [Test Overview](./hooks/USE_DEBOUNCED_VALUE.md) |

## Utils

| Feature / Module | Overview File |
|---|---|
| buildResetFilters | [Test Overview](./utils/BUILD_RESET_FILTERS.md) |
| formatRelationOption | [Test Overview](./utils/FORMAT_RELATION_OPTION.md) |
| getFieldError | [Test Overview](./utils/GET_FIELD_ERROR.md) |
| getFilteredRelationOptions | [Test Overview](./utils/GET_FILTERED_RELATION_OPTIONS.md) |
| getInitialFormData | [Test Overview](./utils/GET_INITIAL_FORM_DATA.md) |
| getSelectedRelationOptions | [Test Overview](./utils/GET_SELECTED_RELATION_OPTIONS.md) |
| getUpdatedRelationValues | [Test Overview](./utils/GET_UPDATED_RELATION_VALUES.md) |
| parseBackendErrors | [Test Overview](./utils/PARSE_BACKEND_ERRORS.md) |

## Components

### Filters

| Feature / Module | Overview File |
|---|---|
| FilterOptions | [Test Overview](./components/filters/FILTER_OPTIONS.md) |
| TextSearchFilter | [Test Overview](./components/filters/TEXT_SEARCH_FILTER.md) |

## Forms

### Auth

| Feature / Module | Overview File |
|---|---|
| ChangePasswordForm | [Test Overview](./components/forms/auth/CHANGE_PASSWORD_FORM.md) |
| DeactivateAccountForm | [Test Overview](./components/forms/auth/DEACTIVATE_ACCOUNT_FORM.md) |
| ForgotPasswordForm | [Test Overview](./components/forms/auth/FORGOT_PASSWORD_FORM.md) |
| LoginForm | [Test Overview](./components/forms/auth/LOGIN_FORM.md) |
| ReactivateConfirmForm | [Test Overview](./components/forms/auth/REACTIVATE_CONFIRM_FORM.md) |
| ReactivateRequestForm | [Test Overview](./components/forms/auth/REACTIVATE_REQUEST_FORM.md) |
| RegisterForm | [Test Overview](./components/forms/auth/REGISTER_FORM.md) |
| ResetPasswordForm | [Test Overview](./components/forms/auth/RESET_PASSWORD_FORM.md) |

### Core

| Feature / Module | Overview File |
|---|---|
| CoreModelCrateForm| [Test Overview](./components/forms/core/CORE_MODEL_CREATE_FORM.md) |
| CoreModelUpdateCreateForm| [Test Overview](./components/forms/core/CORE_MODEL_UPDATE_DELETE_FORM.md) |

## Pagination

| Feature / Module | Overview File |
|---|---|
| Pagination | [Test Overview](./components/pagination/PAGINATION.md) |
| PaginationLabel | [Test Overview](./components/pagination/PAGINATION_LABEL.md) |

## Renderers

| Feature / Module | Overview File |
|---|---|
| ModelFieldRenderer | [Test Overview](./components/renderers/MODEL_FIELD_RENDERER.md) |
| FormFieldRenderer  | [Test Overview](./components/renderers/FORM_FIELD_RENDERER.md)
## Structure

### Dashboard

| Feature / Module | Overview File |
|---|---|
| DashboardFilterPanel | [Test Overview](./components/structure/dashboard/DASHBOARD_FILTER_PANEL.md) |
| DashboardTable | [Test Overview](./components/structure/dashboard/DASHBOARD_TABLE.md) |
| DashboardTableHeader | [Test Overview](./components/structure/dashboard/DASHBOARD_TABLE_HEADER.md) |
| DashboardTableRow | [Test Overview](./components/structure/dashboard/DASHBOARD_TABLE_ROW.md) |

## Pages
| Feature / Module | Overview File |
|---|---|
| AdminDashboard | [Test Overview](./pages/ADMIN_DASHBOARD.md) |
