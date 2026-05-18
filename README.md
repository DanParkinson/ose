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

- [Installation Guide](docs/documentation/INSTALLATION.md)
- [Useful commands](docs/documentation/COMMANDS.md)
- [Docker Guide](docs/documentation/DOCKER.md)
- [Backend](docs/documentation/backend/BACKEND.md)
- [Frontend](docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Introduction](#introduction)
- [Supporting Docs](#supporting-docs)
- [User Stories](#user-stories)
    - [Public User Authentication & Authorisation](#public-user-authentication--authorisation-)
    - [User Account Management](#user-account-management)
    - [Subjects](#subjects)
    - [Topics](#topics)
    - [Lesson Names](#lesson-names)

## User Stories

## **Public User Authentication & Authorisation** ✅❌

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **User Registration**       | Secure user registration, login, and token-based authentication.                | ✅     | ✅       |
| **User Login**              | Secure login so that a user can aquire their token                              | ✅     | ✅       |
| **User Logout**             | Log out to end the users session                                                | ✅     | ✅       |
| **User Profile**            | A user profile page to allow a user to access / update personal info            | ❌     | ❌       |
| **User auto create**        | Account creation auto create an account for the user                            | ✅     | ✅       |
| **User Account Deactivation** | Users can deactivate their account                                            | ✅     | ✅       |
| **Reset Password**          | Users can recevie an email to reset their password                              | ✅     | ❌       |
| **Change Password**         | Users can update their password if needed                                       | ✅     | ❌       |

## **User Account Management**

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **User View Profile**       | Authenticated Users can access their account page                               | ❌     | ❌       |
| **User Update Profile**     | Authenticated Users can update the account information                          | ❌     | ❌       |
| **User upload CV**          | Authenticated User can upload their CV                                          | ❌     | ❌       |


## **Admin Dashboard**

### **General**

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Access**                  | **Only Admin User** can access the dashboard                                    | ➖     | ❌       |


### **Lesson related Crud**

#### Subjects

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Subject List**            | **Admin User** can access list of subjects                                      | ✅     | ✅       |
| **Subject Detail**          | **Admin User** can access Detail of Subject                                     | ❌     | ❌       |
| **Subject Create**          | **Admin User** can create a subject                                             | ✅     | ✅       |
| **Subject Update**          | **Admin User** can update a subject                                             | ✅     | ❌       |
| **Subject Delete**          | **Admin User** can delete a subject                                             | ✅     | ❌       |
| **Subject Publish**         | **Admin User** can change the publish status of a subject                       | ✅     | ❌       |
| **Subject Protect**         | **Admin User** can set a subject to not protected for delete                    | ✅     | ❌       |
