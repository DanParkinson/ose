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
|**US 2.1**  | Accounts App         | User Model            | [Email Authentication](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/1.%20User-Model/EMAIL-AUTHENTICATION.md) | [Custom User Model](/backend/accounts/tests/email_authentication/test_email_custom_user.py)|
|            |                      | User Creation         | [Custom User Manager](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/2.%20User-Creation/CUSTOM-USER-MANAGER.md) | [Custom User Manager](/backend/accounts/tests/user_creation/test_user_creation_custom_user_manager.py) |
|            |                      | Account Lifecycle     | [Account Deactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-DEACTIVATION.md)|
|            |                      |                       | [Account Reactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-REACTIVATION.md)|
|            |                      | API Serializers       | [Registration](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/4.%20API-Serializers/REGISTRATION_SERIALIZER.md)|
|            |                      |                       | [User Details](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/4.%20API-Serializers/USER-DETAILS-SERIALIZER.md)|
|**US 2.2**  | Authentication System| Backend Auth          |[DJ-REST-auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/1.%20Backend-auth/DJ-REST-AUTH.md)|
|            |                      |                       | [JWT-Cookie-auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/1.%20Backend-auth/JWT-COOKIE-AUTH.md)|
|            |                      | Permissions           |
| **US 2.3** | Frontend Auth System | Frontend Auth         | [Auth Context](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTH-CONTEXT.md)|
|            |                      |                       | [Protected Routes](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/PROTECTED-ROUTES.md)|
|            |                      |                       | [Authentication Forms](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTHENTICATION-FORMS.md)|

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

## Features

```
As a **User**,
I want a dedicated list of features, 
So that I know what i can do
```
| Feature                  | Section               | Sub Section           | Implemented        |
| ------------------------ | --------------------- | --------------------- | ------------------ |
| Authentication           | Auth                  | Register              | :white_check_mark: |
|                          |                       | Login                 | :white_check_mark: |
|                          |                       | Logout                | :white_check_mark: |
|                          |                       | Reset Password        | :white_check_mark: |
|                          |                       | Reactivate Request    | :white_check_mark: |
|                          |                       | Reactivate Confirm    | :white_check_mark: |
| Account Management       | Structure             | Account Sidebar       | :white_check_mark: |
|                          | Profile               | View Email            | :white_check_mark: |
|                          | Settings              | Change Password       | :white_check_mark: |
|                          |                       | Change email          | :x:                |
|                          |                       | Deactivate Account    | :white_check_mark: |
|                          |                       | Logout                | :white_check_mark: |


## 8. Architecture
```
As a **Developer**,
I want a dedicated list of architecture in place,
So that I know what i can do
```
| Title         | Section             | Sub Section |
| ------------- | ------------------- | ----------- |
| Dynamic Forms | System Overview     | Architecture Flow |
|               | Form Model Contract | [Required Config](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/2.%20Form-model-contract/REQUIRED-CONFIG.md) |
|               |                     | [Create Fields](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/2.%20Form-model-contract/CREATE-FIELDS.md) |
|               |                     | [Update Fields](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/2.%20Form-model-contract/UPDATE-FIELDS.md) |
|               |                     | [Endpoint Requirements](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/2.%20Form-model-contract/ENDPOINT-REQUIREMENTS.md) |
|               | Form Entry Points   | [Create Form](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/3.%20Form-entry-points/CREATE-FORM.md) |
|               |                     | [Update/Delete Form](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/3.%20Form-entry-points/UPDATE-DELETE-FORM.md) |
|               | Data Preparation    | [Initial Form Data](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/4.%20Data-preperation/INITIAL-FORM-DATA.md) |
|               |                     | [Backend OPTIONS Metadata](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/4.%20Data-preperation/BACKEND-OPTIONS-METADATA.md) |
|               |                     | [Relation Options Overview](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTIONS-OVERVIEW.md) |
|               |                     | [Relation Option Loading](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTION-LOADING.md) |
|               |                     | [Relation Option Formatting](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTION-FORMATTING.md) |
|               |                     | [Selected Relation Options](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/4.%20Data-preperation/RELATION-OPTION-SELECTED.md)|
|               | Rendering Flow      | [FormFieldRenderer](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/5.%20Rendering-flow/FORM-FIELD-RENDERER.md) |
|               |                     | [Field Type Selection](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/5.%20Rendering-flow/FIELD-TYPE-SELECTION.md)|
|               |                     | [Field Components](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/5.%20Rendering-flow/FORM-FIELD-COMPONENTS.md) |
|               |                     | [Relation Field Rendering](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/5.%20Rendering-flow/RELATION-FIELD-RENDERING.md) |
|               | User Interaction    | [Field Changes](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/6.%20User-interaction/FIELD-CHANGES.md) |
|               |                     | [Relation Search](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/6.%20User-interaction/RELATION-SEARCH.md) |
|               |                     | [Relation Selection](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/6.%20User-interaction/RELATION-SELECTION.md) |
|               |                     | [Relation Value Updates](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/6.%20User-interaction/RELATION-VALUE-UPDATES.md) |
|               | Submission Flow     | [Create Submission](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/7.%20submission-flow/CREATE-SUBMISSION.md) |
|               |                     | [Update Submission](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/7.%20submission-flow/UPDATE-SUBMISSION.md) |
|               |                     | [Delete Submission](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/7.%20submission-flow/DELETE-SUBMISSION.md) |
|               | Response Handling   | [Field Errors](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/8.%20Response-handling/FIELD-ERRORS.md) |
|               |                     | [General Errors](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/8.%20Response-handling/GENERAL-ERRORS.md) |
|               |                     | [Success Handling](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/8.%20Response-handling/SUCCESS-HANDLING.md) |
|               | Parent Workflow     | [Parent Callbacks](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/9.%20Parent-callbacks/PARENT-CALLBACKS.md) |
|               | Supporting Logic    | [Hooks](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/10.%20Supporting-Logic/HOOKS.md)
|               |                     | [Utilities](/documentation/1.%20User-Stories/8.%20Architecture/8.1%20Dynamic-Forms/10.%20Supporting-Logic/UTILS.md) |

| User Story             | Section           | Sub Section          |
| ---------------------- | ----------------- | -------------------- |
| Dashboard System       | Overview          | Overview             |
|                        | Configuration     | [coreModels](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/2.%20Configuration/CORE-MODELS.md)          |
|                        |                   | [Model Definitions](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/2.%20Configuration/MODEL-DEFINITIONS.md)   |
|                        |                   | [Table Configuration](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/2.%20Configuration/TABLE-CONFIGURATION.md)  |
|                        |                   | [Filter Configuration](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/2.%20Configuration/FILTER-CONFIGURATION.md) |
|                        | Orchestration     | [Dashboard Workflow](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/3.%20Orchestration/DASHBOARD-WORKFLOW.md)  |
|                        |                   | [Model Selection](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/3.%20Orchestration/MODEL-SELECTION.md)    | 
|                        |                   | [Create Flow](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/3.%20Orchestration/CREATE-FLOW.md)       |
|                        |                   | [Update/Delete Flow](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/3.%20Orchestration/UPDATE-DELETE-FLOW.md)   |
|                        | Data Loading      | [useCoreModelData](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/4.%20Data-loading/USE-CORE-MODEl-DATA.md)     |
|                        |                   | [fetchCoreModelList](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/4.%20Data-loading/FETCH-CORE-MODEL-LIST.md)   |
|                        | Display System    | [Dashboard Layout](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/5.%20Display-system/DASHBOARD-LAYOUT.md)     |
|                        |                   | [Dashboard Tables](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/5.%20Display-system/DASHBOARD-TABLES.md)     |
|                        |                   | [ModelFieldRenderer](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/5.%20Display-system/MODEL-FIELD-RENDERER.md)   |
|                        | Search System     | [TextSearchFilter](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/6.%20Search-system/TEXT-SEARCH-FILTER.md)     |
|                        |                   | [searchInput](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/6.%20Search-system/SEARCH-INPUT.md)          |
|                        |                   | [searchQuery](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/6.%20Search-system/SEARCH-QUERY.md)         |
|                        |                   | [Debounced Search](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/6.%20Search-system/DEBOUNCED-SEARCH.md)     |
|                        | Filtering System  | [DashboardFilterPanel](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/7.%20Filtering-system/DASHBOARD-FILTER-PANEL.md) |
|                        |                   | [FilterOptions](/documentation/1.%20User-Stories/8.%20Architecture/8.2%20Dashboard/7.%20Filtering-system/FILTER-OPTIONS.md)        |
|                        | Pagination System | [Pagination Component](/documentation/1.%20User-Stories/) |