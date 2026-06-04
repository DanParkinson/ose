# Open-Source Education

## Introduction

**Open-Source Education** is a full stack application providing a resource sharing site designed to support users build lessons, units of work, and curriculums.

Providing:

**API** built using **Django Rest Framwork (DRF)** following **RESTful principles** to provide a strucutured approach for admins to **Create, Organise and manage lessons** as well as a way for users to download them.

This API intergrates with a frontend built in **React**. It Enables users to **authenticate, search and filter through lessons, Download resources.**

## Key Features

| Feature                     | Description                                                                     |
| --------------------------- | ------------------------------------------------------------------------------- |
| **User Authentication**     | Secure user registration, login, and token-based authentication.                |
| **Resource Management**     | Users can View, filter, and search for resources by subject                     |
| **Admin Management**        | Admins can create, update and delte resources and lessons                       |
| **RESTful API Design**      | Follows RESTful principles for seamless integration with frontend applications. |

## Supporting Docs

For more in depth documentation, the following is provided:

- [Installation Guide](./documentation/1.%20User-Stories/1.%20Development-environment-setup/INSTALLATION.md)

# User Stories

## 1. Development Environment Setup

```
As a **Developer**,
I want an easy to install environement that works on all machines,
So that I can quickly begin work.
```

| User Story | Title                | Complete           |
| ---------- | -------------------- | ------------------ |
|**US 1.1**  | Django Project Setup | :white_check_mark: |
|**US 1.2**  | PostgreSQL Setup     | :white_check_mark: |
|**US 1.3**  | Redis Setup          | :white_check_mark: |
|**US 1.4**  | React Setup          | :white_check_mark: |

### Related Documentation

- [Installation Guide](./documentation/1.%20User-Stories/1.%20Development-environment-setup/INSTALLATION.md)
- [Backend Dependencies](./documentation/1.%20User-Stories/1.%20Development-environment-setup/BACKEND-DEPENDENCIES.md)
- [Frontend Dependencies](./documentation/1.%20User-Stories/1.%20Development-environment-setup/FRONTEND-DEPENDENCIES.md)
- [Docker Setup](./documentation/1.%20User-Stories/1.%20Development-environment-setup/DEV_ENVIRONMNET.md)
- [Useful Commands](./documentation/1.%20User-Stories/1.%20Development-environment-setup/COMMANDS.md)

## 2. Authentication & User Management

```
As a User,
I want to create and access my account,
So that I can securely use the platform.
```

| User Story | Title                | Section               | Sub Section           | Infrastructure Testing |
| ---------- | -------------------- | --------------------- | --------------------- | ---------------------- |
|**US 2.1**  | Accounts App         | User Model            | [Email Authentication](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/1.%20User-Model/EMAIL-AUTHENTICATION.md) | [Custom User Model](/backend/accounts/tests/email_authentication/test_email_custom_user.py), [Registration Serializer](/backend/accounts/tests/email_authentication/test_email_register_serializer.py)|
|            |                      | User Creation         | [Custom User Manager](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/2.%20User-Creation/CUSTOM-USER-MANAGER.md) | [Custom User Manager](/backend/accounts/tests/user_creation/test_user_creation_custom_user_manager.py) |
|            |                      | Account Lifecycle     | [Account Deactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-DEACTIVATION.md)| [Account Deactivation](/backend/accounts/tests/account_lifecycle/test_account_deactivation.py)|
|            |                      |                       | [Account Reactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-REACTIVATION.md)| [Reactivation Request](/backend/accounts/tests/account_lifecycle/test_account_reactivation_request.py), [Reactivation Confirm](/backend/accounts/tests/account_lifecycle/test_account_reactivation_confirm.py)   |
|            |                      | API Serializers       | [Registration](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/4.%20API-Serializers/REGISTRATION_SERIALIZER.md)| [Registration Serializer](/backend/accounts/tests/email_authentication/test_email_register_serializer.py)|
|            |                      |                       | [User Details](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/4.%20API-Serializers/USER-DETAILS-SERIALIZER.md)| [User Details Serializer](/backend/accounts/tests/user_details/test_user_details_serializer.py) |
|**US 2.2**  | Authentication System| Backend Auth          |[DJ-REST-auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/1.%20Backend-auth/DJ-REST-AUTH.md)| [Registration](/backend/accounts/tests/dj_rest_auth/test_register.py), [Login](/backend/accounts/tests/dj_rest_auth/test_login.py), [Logout](/backend/accounts/tests/dj_rest_auth/test_logout.py), [Password Reset Request](/backend/accounts/tests/reset_password/test_password_reset_request.py), [Password Reser Confirm](/backend/accounts/tests/reset_password/test_password_reset_confirm.py)|
|            |                      |                       | [JWT-Cookie-auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/1.%20Backend-auth/JWT-COOKIE-AUTH.md)| [JWT Cookies](/backend/accounts/tests/jwt_cookie/test_jwt_cookies.py) |
|            |                       | Email Verification | [Overview](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/2.%20Email-verification/OVERVIEW.md) |
|            |                       |                    | [Mandatory Verification](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/2.%20Email-verification/MANDATORY-VERIFICATION.md) | [Email verification](/backend/accounts/tests/email_verification/test_verify_email.py) |
|            |                       |                    | [Custom Account Adapter](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/2.%20Email-verification/CUSTOM-ACCOUNT-ADAPTER.md) | [Account adapter](/backend/accounts/tests/email_verification/test_account_adapter.py) |
|            |                       |                    | [Verification Email Template](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/2.%20Email-verification/VERIFICATION-EMAIL-TEMPLATE.md) |
|            |                       |                    | [Resend Verification](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/2.%20Email-verification/RESEND-VERIFICATION.md)| [Resend verification](/backend/accounts/tests/email_verification/test_resend_verify_email.py) |
|            |                      | Permissions           |
| **US 2.3** | Frontend Auth System | Frontend Auth         | [Auth Context](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTH-CONTEXT.md)| [Auth Context](/frontend/src/context/AuthContext.jsx) |
|            |                      |                       | [Protected Routes](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/PROTECTED-ROUTES.md)| [Public Route](/frontend/src/routes/PublicRoute.test.jsx), [Protected Route](/frontend/src/routes/ProtectedRoute.test.jsx), [Admin Route](/frontend/src/routes/AdminRoute.test.jsx) |
|            |                      |                       | [Authentication Forms](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTHENTICATION-FORMS.md)| Test in DJ-Rest-Auth and Features |

### Related Documentation

## 3. Security & Application Protection

```
As a **Developer**,
I want to set up a secure platform,
So that i dont get sued.

As a **User**,
I want to use a secure platform,
So that I dont have to sue anyone.
```

| User Story | Title                | Section               | Sub Section           |
| ---------- | -------------------- | --------------------- | --------------------- |
| **US 3.1** | Security Config      | Cross Origin Security | [CORS](/documentation/1.%20User-Stories/3.%20Security-&-Application-Protection/1.%20Security-config/1.%20Cross-origin-security/CORS.md)|
|            |                      |                       | [CSRF](/documentation/1.%20User-Stories/3.%20Security-&-Application-Protection/1.%20Security-config/1.%20Cross-origin-security/CSRF.md)|
|            |                      | HTTPS Security        | [HTTPS Redirects](/documentation/1.%20User-Stories/3.%20Security-&-Application-Protection/1.%20Security-config/2.%20HTTPS-security/HTTPS-REDIRECTS.md)|
|            |                      |                       | [Secure Cookies](/documentation/1.%20User-Stories/3.%20Security-&-Application-Protection/1.%20Security-config/2.%20HTTPS-security/SECURE-COOKIES.md)|
|            |                      |                       | [HSTS](/documentation/1.%20User-Stories/3.%20Security-&-Application-Protection/1.%20Security-config/2.%20HTTPS-security/HSTS.md)|

### Related Documentation


## 4. System Efficiency

```
As a **Stake Holder**,
I want my application to be efficient,
So that i can improve performance and reduce cost

As a **User**,
I want to have quick response for the website,
So that I dont have to wait.
```

| User Story | Title                | Section  | Sub Section           |
| ---------- | -------------------- | -------- | --------------------- |
| **US 4.1** | Caching              | Redis    | [Redis](/documentation/1.%20User-Stories/4.%20System-efficiency/1.%20Caching/1.%20Redis/REDIS.md) |
|            |                      |          | [Django Config](/documentation/1.%20User-Stories/4.%20System-efficiency/1.%20Caching/1.%20Redis/DJANGO-CONFIGURATION.md)|
|            |                      |          | [env var](/documentation/1.%20User-Stories/4.%20System-efficiency/1.%20Caching/1.%20Redis/ENVIRONMENT-VARIABLES.md)|
|            |                      |          | [Operations](/documentation/1.%20User-Stories/4.%20System-efficiency/1.%20Caching/1.%20Redis/CAHCE-OPERATIONS.md)|
|            |                      |          | [Invalidation](/documentation/1.%20User-Stories/4.%20System-efficiency/1.%20Caching/1.%20Redis/CACHE-INVALIDATION.md)|

## 5. API Communications

```
As a **Developer**,
I want a dedicated, reusable system for communication between frontend & backend
So that development is quicker.
```

| User Story | Title                    | Section          | Sub Section           |
| ---------- | ------------------------ | ---------------- | --------------------- |
| **US 5.1** | Django REST Framework    | Endpoints & URLS | [Auth](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/1.Endpoints-&-URLS/AUTH-ENDPOINTS.md)
|            |                          |                  | [Account](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/1.Endpoints-&-URLS/ACCOUNT-ENDPOINTS.md)|
|            |                          |                  | [Core](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/1.Endpoints-&-URLS/CORE-ENDPOINTS.md)|
|            |                          |                  | [URL COnventions](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/1.Endpoints-&-URLS/URL-CONVENTIONS.md)
|            |                          | Tools            | [API Tools](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/2.%20Tooling/API-TOOLING.md)
|            |                          | Views            | [List/Create Views](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/3.%20Views/LIST-CREATE-VIEWS.md)
|            |                          |                  | [Detail Views](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/3.%20Views/DETAIL-VIEWS.md)
|            |                          | Serializers      | [Serializers](/documentation/1.%20User-Stories/5.%20API-communications/1.%20Django-REST-framework/4.%20Serializers/SERIALIZERS.md)
| **US 5.2** | Axios Configuration      | Axios            | [Axios Base Configuration](/documentation/1.%20User-Stories/5.%20API-communications/2.%20Axios-configuration/1.%20Axios/BASE-CONFIGURATION.md)
|            |                          |                  | [API Base URL](/documentation/1.%20User-Stories/5.%20API-communications/2.%20Axios-configuration/1.%20Axios/API-BASE-URL.md)
|            |                          |                  | [Axios Request](/documentation/1.%20User-Stories/5.%20API-communications/2.%20Axios-configuration/1.%20Axios/AXIOS-REQUEST.md)
|            |                          |                  | [Axios Response](/documentation/1.%20User-Stories/5.%20API-communications/2.%20Axios-configuration/1.%20Axios/AXIOS-RESPONSE.md)
|            |                          |                  | [Credentials](/documentation/1.%20User-Stories/5.%20API-communications/2.%20Axios-configuration/1.%20Axios/CREDENTIALS.md)
| **US 5.3** | Request Handling         | Request Lifecycle| [Interceptors](/documentation/1.%20User-Stories/5.%20API-communications/3.%20Request-handling/1.%20Request-Lifecycle/INTERCEPTORS.md)
|            |                          |                  | [Error Handling](/documentation/1.%20User-Stories/5.%20API-communications/3.%20Request-handling/1.%20Request-Lifecycle/ERROR-HANDLING.md)
|            |                          |                  | [Token Refresh](/documentation/1.%20User-Stories/5.%20API-communications/3.%20Request-handling/1.%20Request-Lifecycle/TOKEN-REFRESH.md)
| **US 5.4** | API Data Management      | Data Fetching    | [CoreModels](/documentation/1.%20User-Stories/5.%20API-communications/4.%20API-data-management/1.%20Data-fetching/CORE-MODELS.md)
|            |                          |                  | [Core API Utlities](/documentation/1.%20User-Stories/5.%20API-communications/4.%20API-data-management/1.%20Data-fetching/CORE-API-UTILITIES.md)
|            |                          |                  | [useCoreModelData](/documentation/1.%20User-Stories/5.%20API-communications/4.%20API-data-management/1.%20Data-fetching/USE-CORE-MODEL-DATA.md)
|            |                          |                  | [Pagination](/documentation/1.%20User-Stories/5.%20API-communications/4.%20API-data-management/1.%20Data-fetching/PAGINATION.md)
|            |                          |                  | [Filtering](/documentation/1.%20User-Stories/5.%20API-communications/4.%20API-data-management/1.%20Data-fetching/FILTERING.md)
|            |                          |                  | [Searching](/documentation/1.%20User-Stories/5.%20API-communications/4.%20API-data-management/1.%20Data-fetching/SEARCHING.md)

## 6. Deployment
```
As a **Developer**,
I want documentation of the deployment process,
So that replication is possible of required.
```

| User Story | Title                    | Section               | Sub Section           |
| ---------- | ------------------------ | --------------------- | --------------------- |
| **US 6.1** | Deployment               | Render                | [Deployment Docs](/documentation/1.%20User-Stories/6.%20Deployment/DEPLOYMENT.md)|
|            |                          | emails                | [Email setup](/documentation/1.%20User-Stories/6.%20Deployment/EMAIL-SETUP.md) |

## 7. Email Infrastructure
```
As a **Developer**,
I want an overview of the email infrastructure that is in place.
So that configuring emails later is easier.
```

| User Story | Title                | Section               | Sub Section |
| ---------- | -------------------- | --------------------- | ----------- |
| **US 7.1** | Email Infrastructure | Configuration         | [Domain](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/1.%20Configuration/DOMAIN.md) |
|            |                      |                       | [Google Workspace](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/1.%20Configuration/GOOGLE-WORKSPACE.md) |
|            |                      | Email Authentication  | [SPF](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/2.%20Email-authentication/SPF.md) |
|            |                      |                       | [DKIM](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/2.%20Email-authentication/DKIM.md) |
|            |                      |                       | [DMARC](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/2.%20Email-authentication/DMARC.md) |
|            |                      | Mailboxes             | [Primary Mailbox](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/3.%20Mailboxes/PRIMARY-MAILBOX.md) |
|            |                      |                       | [Email Aliases](/documentation/1.%20User-Stories/7.%20Email-infrastructure/1.%20Email-Infrastructure/3.%20Mailboxes/EMAIL-ALIASES.md) |
| US 7.2     | Email Delivery       | Configuration         | [SMTP Configuration](/documentation/1.%20User-Stories/7.%20Email-infrastructure/2.%20Email-delivery/1.%20Configuration/SMTP-CONFIGURATION.md) |
|            |                      |                       | [Email Backend](/documentation/1.%20User-Stories/7.%20Email-infrastructure/2.%20Email-delivery/1.%20Configuration/EMAIL-BACKEND.md) |
|            |                      |                       | [Default Sender](/documentation/1.%20User-Stories/7.%20Email-infrastructure/2.%20Email-delivery/1.%20Configuration/DEFAULT-SENDER.md) |
|            |                      |                       | [Frontend URL Configuration](/documentation/1.%20User-Stories/7.%20Email-infrastructure/2.%20Email-delivery/1.%20Configuration/FRONTEND-URL-CONFIGURATION.md) |


## Features

```
As a **User**,
I want a dedicated list of features,
So that I know what i can do
```
| Feature                  | Section               | Sub Section           | Backend testing | Frontend Testing | Manual Testing |
| ------------------------ | --------------------- | --------------------- | --------------- | ---------------- | -------------- |
| Authentication           | Auth                  | Register              | [Backend](/backend/accounts/tests/dj_rest_auth/test_register.py) |[Frontend](/frontend/src/components/forms/auth/RegisterForm.test.jsx) |[Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/REGISTRATION-MT.md)|
|                          |                       | Email Verification    | [backend](/backend/accounts/tests/email_verification/base_email_verification.py) | [Frontend](/frontend/src/components/forms/auth/VerifyEmailForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/EMAIL-VERIFICATION.md) |
|                          |                       | Resend Email Verification | [backend](/backend/accounts/tests/email_verification/test_resend_verify_email.py) | [Frontend](/frontend/src/components/forms/auth/VerifyResendEmailForm.test.jsx)| [Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/RESEND-EMAIL-VERIFICATION.md) |
|                          |                       | Login                 | [Backend](/backend/accounts/tests/dj_rest_auth/test_login.py) | [Frontend](/frontend/src/components/forms/auth/LoginForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/LOGIN-MT.md) |
|                          |                       | Logout                | [Backend](/backend/accounts/tests/dj_rest_auth/test_logout.py) | [Frontend](/frontend/src/components/forms/auth/LogoutForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/LOGOUT-MT.md) |
|                          |                       | Reset Password request| [Backend](/backend/accounts/tests/reset_password/test_password_reset_request.py) | [Frontend](/frontend/src/components/forms/auth/ForgotPasswordForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/RESET-PASSWORD-REQUEST-MT.md) |
|                          |                       | Reset Password confirm| [Backend](/backend/accounts/tests/reset_password/test_password_reset_confirm.py) | [Frontend](/frontend/src/components/forms/auth/ResetPasswordForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/1.%20Authentication/RESET-PASSWORD-CONFIRM-MT.md) |
|                          |                       | Reactivate Request    | [Backend](/backend/accounts/tests/account_lifecycle/test_account_reactivation_request.py) | [Frontend](/frontend/src/components/forms/auth/ReactivateRequestForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/2.%20Account-management/REACTIVATE-ACCOUNT-REQUEST.md) |
|                          |                       | Reactivate Confirm    | [Backend](/backend/accounts/tests/account_lifecycle/test_account_reactivation_request.py) | [Frontend](/frontend/src/components/forms/auth/ReactivateConfirmForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/2.%20Account-management/REACTIVATE-ACCOUNT-CONFIRM-MT.md) |
| Account Management       | Structure             | Account Sidebar       |
|                          | Profile               | View Email            |
|                          | Settings              | Change Password       |
|                          |                       | Change email          |
|                          |                       | Deactivate account    | [Backend](/backend/accounts/tests/account_lifecycle/test_account_deactivation.py) | [Frontend](/frontend/src/components/forms/profile/DeactivateAccountForm.test.jsx) | [Manual](/documentation/3.%20Manual-testing/1.%20Features/2.%20Account-management/DEACTIVATE-ACCOUNT-MT.md) |
|                          |                       | Logout                |


## Architecture
```
As a **Developer**,
I want a dedicated list of architecture in place,
So that I know what i can do
```
| Title         | Section             | Sub Section |
| ------------- | ------------------- | ----------- |
| Dynamic Forms | System Overview     | Architecture Flow |
|               | Form Model Contract | [Required Config](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/2.%20Form-model-contract/REQUIRED-CONFIG.md) |
|               |                     | [Create Fields](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/2.%20Form-model-contract/CREATE-FIELDS.md) |
|               |                     | [Update Fields](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/2.%20Form-model-contract/UPDATE-FIELDS.md) |
|               |                     | [Endpoint Requirements](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/2.%20Form-model-contract/ENDPOINT-REQUIREMENTS.md) |
|               | Form Entry Points   | [Create Form](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/3.%20Form-entry-points/CREATE-FORM.md) |
|               |                     | [Update/Delete Form](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/3.%20Form-entry-points/UPDATE-DELETE-FORM.md) |
|               | Data Preparation    | [Initial Form Data](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/4.%20Data-preperation/INITIAL-FORM-DATA.md) |
|               |                     | [Backend OPTIONS Metadata](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/4.%20Data-preperation/BACKEND-OPTIONS-METADATA.md) |
|               |                     | [Relation Options Overview](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTIONS-OVERVIEW.md) |
|               |                     | [Relation Option Loading](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTION-LOADING.md) |
|               |                     | [Relation Option Formatting](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTION-FORMATTING.md) |
|               |                     | [Selected Relation Options](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTION-SELECTED.md) |
|               | Rendering Flow      | [FormFieldRenderer](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/5.%20Rendering-flow/FORM-FIELD-RENDERER.md) |
|               |                     | [Field Type Selection](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/5.%20Rendering-flow/FIELD-TYPE-SELECTION.md) |
|               |                     | [Field Components](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/5.%20Rendering-flow/FORM-FIELD-COMPONENTS.md) |
|               |                     | [Relation Field Rendering](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/5.%20Rendering-flow/RELATION-FIELD-RENDERING.md) |
|               | User Interaction    | [Field Changes](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/6.%20User-interaction/FIELD-CHANGES.md) |
|               |                     | [Relation Search](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/6.%20User-interaction/RELATION-SEARCH.md) |
|               |                     | [Relation Selection](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/6.%20User-interaction/RELATION-SELECTION.md) |
|               |                     | [Relation Value Updates](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/6.%20User-interaction/RELATION-VALUE-UPDATES.md) |
|               | Submission Flow     | [Create Submission](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/7.%20submission-flow/CREATE-SUBMISSION.md) |
|               |                     | [Update Submission](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/7.%20submission-flow/UPDATE-SUBMISSION.md) |
|               |                     | [Delete Submission](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/7.%20submission-flow/DELETE-SUBMISSION.md) |
|               | Response Handling   | [Field Errors](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/8.%20Response-handling/FIELD-ERRORS.md) |
|               |                     | [General Errors](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/8.%20Response-handling/GENERAL-ERRORS.md) |
|               |                     | [Success Handling](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/8.%20Response-handling/SUCCESS-HANDLING.md) |
|               | Parent Workflow     | [Parent Callbacks](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/9.%20Parent-callbacks/PARENT-CALLBACKS.md) |
|               | Supporting Logic    | [Hooks](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/10.%20Supporting-Logic/HOOKS.md) |
|               |                     | [Utilities](/documentation/1.%20User-Stories/0.1.%20Architecture/1.%20Dynamic-Forms/10.%20Supporting-Logic/UTILS.md) |

| User Story       | Section           | Sub Section |
| ---------------- | ----------------- | ----------- |
| Dashboard System | Overview          | Overview |
|                  | Configuration     | [coreModels](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/2.%20Configuration/CORE-MODELS.md) |
|                  |                   | [Model Definitions](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/2.%20Configuration/MODEL-DEFINITIONS.md) |
|                  |                   | [Table Configuration](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/2.%20Configuration/TABLE-CONFIGURATION.md) |
|                  |                   | [Filter Configuration](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/2.%20Configuration/FILTER-CONFIGURATION.md) |
|                  | Orchestration     | [Dashboard Workflow](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/3.%20Orchestration/DASHBOARD-WORKFLOW.md) |
|                  |                   | [Model Selection](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/3.%20Orchestration/MODEL-SELECTION.md) |
|                  |                   | [Create Flow](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/3.%20Orchestration/CREATE-FLOW.md) |
|                  |                   | [Update/Delete Flow](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/3.%20Orchestration/UPDATE-DELETE-FLOW.md) |
|                  | Data Loading      | [useCoreModelData](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/4.%20Data-loading/USE-CORE-MODEL-DATA.md) |
|                  |                   | [fetchCoreModelList](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/4.%20Data-loading/FETCH-CORE-MODEL-LIST.md) |
|                  | Display System    | [Dashboard Layout](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/5.%20Display-system/DASHBOARD-LAYOUT.md) |
|                  |                   | [Dashboard Tables](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/5.%20Display-system/DASHBOARD-TABLES.md) |
|                  |                   | [ModelFieldRenderer](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/5.%20Display-system/MODEL-FIELD-RENDERER.md) |
|                  | Search System     | [TextSearchFilter](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/6.%20Search-system/TEXT-SEARCH-FILTER.md) |
|                  |                   | [searchInput](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/6.%20Search-system/SEARCH-INPUT.md) |
|                  |                   | [searchQuery](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/6.%20Search-system/SEARCH-QUERY.md) |
|                  |                   | [Debounced Search](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/6.%20Search-system/DEBOUNCED-SEARCH.md) |
|                  | Filtering System  | [DashboardFilterPanel](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/7.%20Filtering-system/DASHBOARD-FILTER-PANEL.md) |
|                  |                   | [FilterOptions](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/7.%20Filtering-system/FILTER-OPTIONS.md) |
|                  | Pagination System | [Pagination Component](/documentation/1.%20User-Stories/0.1.%20Architecture/2.%20Dashboard/8.%20Pagination/PAGINATION-COMPONENTS.md) |
