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

| User Story | Title                | Complete           | Story Specific Documentation |
| ---------- | -------------------- | ------------------ | ---------------------------- |
|**US 1.1**  | Django Project Setup | :white_check_mark: |                              |
|**US 1.2**  | PostgreSQL Setup     | :white_check_mark: |                              |
|**US 1.3**  | Redis Setup          | :white_check_mark: |                              |
|**US 1.4**  | React Setup          | :white_check_mark: |                              |

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

| User Story | Title                | Section               | Sub Section           | Story Specific Documentation |
| ---------- | -------------------- | --------------------- | --------------------- | ---------------------------- |
|**US 2.1**  | Accounts App         | User Model            | Email Authentication  | [Email Authentication](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/1.%20User-Model/EMAIL-AUTHENTICATION.md)
|            |                      | User Creation         | Custom User Manager   | [Custom User Manager](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/2.%20User-Creation/CUSTOM-USER-MANAGER.md)
|            |                      | Account Lifecycle     | Account Deactivation  | [Account Deactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-DEACTIVATION.md)
|            |                      |                       | Account Reactivation  | [Account Reactivation](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/3.%20Account-Lifecycle/ACCOUNT-REACTIVATION.md)
|            |                      | API Serializers       | Registration          | [Registration](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/4.%20API-Serializers/REGISTRATION_SERIALIZER.md)
|            |                      |                       | User Details          | [User Details](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/1.%20Accouts-app/4.%20API-Serializers/USER-DETAILS-SERIALIZER.md)
|**US 2.2**  | Authentication System| Backend Auth          | DJ-Rest-Auth          | [DJ-REST-auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/DJ-REST-AUTH.md)
|            |                      |                       | JWT Cookie Auth       | [JWT-Cookie-auth](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/2.%20Authentication-system/JWT-COOKIE-AUTH.md)
|            |                      | Permissions           | Staff Permissions     |
|            |                      |                       | User Permissions      |
| **US 2.3** | Frontend Auth System | Frontend Auth         | Auth Context          | [Auth Context](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTH-CONTEXT.md)
|            |                      |                       | Protected Routes      | [Protected Routes](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/PROTECTED-ROUTES.md)
|            |                      |                       | Auth Forms            | [Authentication Forms](/documentation/1.%20User-Stories/2.%20Authentication-&-user-management/4.%20Frontend-auth/AUTHENTICATION-FORMS.md)

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

| User Story | Title                | Section               | Sub Section           | Story Specific Documentation |
| ---------- | -------------------- | --------------------- | --------------------- | ---------------------------- |
| **US 3.1** | Security Config      | Application Security  | CORS                  |
|            |                      |                       | CSRF Trusted Orgins   |
|            |                      |                       | HTTPS Redirects       |
|            |                      |                       | Secure Cookies        |
|            |                      |                       | HSTS                  |

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

| User Story | Title                | Section               | Sub Section           | Story Specific Documentation |
| ---------- | -------------------- | --------------------- | --------------------- | ---------------------------- |
| **US 4.1** | Caching              | Redis                 |                       |
|            |                      |                       | Django Configuration  |
|            |                      |                       | Environment Variables |

## 5. API Communications

```
As a **Developer**,
I want a dedicated, reusable system for communication between frontend & backend
So that development is quicker.
```

| User Story | Title                    | Section               | Sub Section           | Story Specific Documentation |
| ---------- | ------------------------ | --------------------- | --------------------- | ---------------------------- |
| **US 5.1** | Django REST Framework    | Endpoints & URLS      |                       |
|            |                          |                       | API Endpoints         |
|            |                          |                       | URL Conventions       |
|            |                          | Views                 |                       |
|            |                          |                       | List/Create Views     |
|            |                          |                       | Filtering & Search    |
|            |                          |                       | Pagination            |
|            |                          |                       | Permssions            |
|            |                          | Serializers           |                       |
|            |                          |                       | Serializer Pattern    |
| **US 5.2** | Axios Configuration      | Axios                 |                       |
|            |                          |                       | Base Configuration    |
|            |                          |                       | API Base URL          |
|            |                          |                       | Axios Request         |
|            |                          |                       | Axios Response        |
|            |                          |                       | Credentials           |
| **US 5.3** | Request Handling         | Request Lifecycle     |                       |
|            |                          |                       | Interceptors          |
|            |                          |                       | Error Handling        |
|            |                          |                       | Token Refresh         |
| **US 5.4** | API Data Management      | Data Fetching         |                       |
|            |                          |                       | Pagination            |
|            |                          |                       | Filtering             |
|            |                          |                       | Searching             |

## 6. Deployment
```
As a **Developer**,
I want documentation of the deployment process,
So that replication is possible of required.
```

| User Story | Title                    | Section               | Sub Section           | Story Specific Documentation |
| ---------- | ------------------------ | --------------------- | --------------------- | ---------------------------- |
| **US 6.1** | Deployment               | Render                |                       |
|            |                          |                       | Documentation         |

## 7. Features

```
As a **User**,
I want a dedicated list of features, 
So that I know what i can do
```
| User Story | Title                    | Section               | Sub Section           | Implemented        |
| ---------- | ------------------------ | --------------------- | --------------------- | ------------------ |
| **US 7.1** | Authentication           | Auth                  |                       |                    |
|            |                          |                       | Register              | :white_check_mark: |
|            |                          |                       | Login                 | :white_check_mark: |
|            |                          |                       | Logout                | :white_check_mark: |
|            |                          |                       | Reset Password        | :white_check_mark: |
|            |                          |                       | Reactivate Request    | :white_check_mark: |
|            |                          |                       | Reactivate Confirm    | :white_check_mark: |
| **US 7.2** | Account Management       | Structure             |                       |                    |
|            |                          |                       | Account Sidebar       | :white_check_mark: |
|            |                          | Profile               |                       |
|            |                          |                       | View Email            | :white_check_mark: |
|            |                          | Settings              |                       |
|            |                          |                       | Change Password       | :white_check_mark: |
|            |                          |                       | Change email          | :x:                |
|            |                          |                       | Deactivate Account    | :white_check_mark: |
|            |                          |                       | Logout                | :white_check_mark: |


## 8. Architecture
```
As a **Developer**,
I want a dedicated list of architecture in place,
So that I know what i can do
```
| User Story | Title         | Section           | Sub Section             | Story Specific Documentation |
| ---------- | ------------- | ----------------- | ----------------------- | ---------------------------- |
| **US 8.1** | Dynamic Forms | Configuration     |                         | |
|            |               |                   | Model Field Definitions | |
|            |               |                   | Create Fields           | |
|            |               |                   | Update Fields           | |
|            |               | Form Entry Points |                         | |
|            |               |                   | Create Form             | |
|            |               |                   | Update/Delete Form      | |
|            |               | Data Preparation  |                         | |
|            |               |                   | Initial Form Data       | |
|            |               |                   | Backend OPTIONS Metadata| |
|            |               |                   | Relation Options        | |
|            |               | Rendering Flow    |                         | |
|            |               |                   | FormFieldRenderer       | |
|            |               |                   | Field Wrapper           | |
|            |               |                   | Field Label             | |
|            |               |                   | Field Error             | |
|            |               | Field Types       |                         | |
|            |               |                   | Text Field              | |
|            |               |                   | Choice Field            | |
|            |               |                   | Boolean Field           | |
|            |               |                   | Relation Field          | |
|            |               | User Interaction  |                         | |
|            |               |                   | Field Changes           | |
|            |               |                   | Relation Search         | |
|            |               |                   | Relation Selection      | |
|            |               | Submission Flow   |                         | |
|            |               |                   | Create Submission       | |
|            |               |                   | Update Submission       | |
|            |               |                   | Delete Submission       | |
|            |               | Response Handling |                         | |
|            |               |                   | Field Errors            | |
|            |               |                   | General Errors          | |
|            |               |                   | Success Messages        | |
|            |               | Supporting Logic  |                         | |
|            |               |                   | Hooks                   | |
|            |               |                   | Utilities               | |

| User Story | Title                  | Section           | Sub Section          | Story Specific Documentation |
| ---------- | ---------------------- | ----------------- | -------------------- | ---------------------------- |
| **US 8.2** | Admin Dashboard System | Configuration     |                      |
|            |                        |                   | co reModels          |
|            |                        |                   | Model Definitions    |
|            |                        |                   | Table Configuration  |
|            |                        |                   | Filter Configuration |
|            |                        | Orchestration     | |
|            |                        |                   | Dashboard Workflow   |
|            |                        |                   | Model Selection      | 
|            |                        |                   | Create Flow          |
|            |                        | Data Loading      | |
|            |                        |                   | useCoreModelData     |
|            |                        |                   | fetchCoreModelList   |
|            |                        | Display System    | |
|            |                        |                   | Dashboard Layout     |
|            |                        |                   | Dashboard Tables     |
|            |                        |                   | ModelFieldRenderer   |
|            |                        | Search System     | |
|            |                        |                   | TextSearchFilter     |
|            |                        |                   | searchInput          |
|            |                        |                   |  searchQuery         |
|            |                        |                   | Debounced Search     |
|            |                        | Filtering System  | |
|            |                        |                   | DashboardFilterPanel |
|            |                        |                   | FilterOptions        |
|            |                        | Pagination System | |
|            |                        |                   | Pagination Component |