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

---

## Supporting Docs

For more in depth documentation, the following is provided:

- [Installation Guide](docs/documentation/INSTALLATION.md)
- [Useful commands](docs/documentation/COMMANDS.md)
- [Docker Guide](docs/documentation/DOCKER.md)
- [Django REST API](docs/documentation/BACKEND.md)
- REACT FRONTEND
- DEPLOYMENT
- Testing
    - [Testing Checklist Backend](docs/documentation/TESTING_CHECKLIST_BACKEND.md)
    - [Test - Backend](docs/documentation/TEST_BACKEND.md)

---

## Table of Contents

- [Introduction](#introduction)
- [Supporting Docs](#supporting-docs)
- [User Stories](#user-stories)
    - [Public User Authentication & Authorisation](#public-user-authentication--authorisation-)
    - [User Account Management](#user-account-management)
    - [Subjects](#subjects)
    - [Topics](#topics)
    - [Lesson Names](#lesson-names)
    - [Variation](#variation)
    - [Teaching Style](#teaching-style)
    - [Resource](#resource)
    - [lesson Variant](#lessonvariant)
    - [lesson Variant Resource](#lessonvariantresource)
    - [Filtering & Searching (Public)](#filtering--searching-public)

---

## User Stories

### **Public User Authentication & Authorisation** ✅❌

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **User Registration**       | Secure user registration, login, and token-based authentication.                | ❌     | ❌       |
| **User Login**              | Secure login so that a user can aquire their token                              | ❌     | ❌       |
| **User Logout**             | Log out to end the users session                                                | ❌     | ❌       |
| **User Profile**            | A user profile page to allow a user to access / update personal info            | ❌     | ❌       |
| **User auto create**        | Account creation auto create an account for the user                            | ❌     | ❌       |
| **User Account Deletion**   | Users can delete their account with all information removed form database       | ❌     | ❌       |
| **Reset Password**          | Users can recevie an email to reset their password                              | ❌     | ❌       |
| **Change Password**         | Users can update their password if needed                                       | ❌     | ❌       |

### **User Account Management**

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **User View Profile**       | Authenticated Users can access their account page                               | ❌     | ❌       |
| **User Update Profile**     | Authenticated Users can update the account information                          | ❌     | ❌       |
| **User upload CV**          | Authenticated User can upload their CV                                          | ❌     | ❌       |


### **Lesson related Crud**

#### Subjects

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Subject List**            | **Any User** can access list of subjects                                        | ✅     | ❌       |
| **Subject Detail**          | **All Users** can access Detail of Subject                                      | ✅     | ❌       |
| **Subject Create**          | **Only Admins** can create a subject                                            | ✅     | ❌       |
| **Subject Update**          | **Only Admins** can update a subject                                            | ✅     | ❌       |
| **Subject Delete**          | **Only Admins** can delete a subject                                            | ✅     | ❌       |
| **Subject Publish**         | **Only Admins** can change the publish status of a subject                      | ✅     | ❌       |
| **Subject Protect**         | **Only Admins** can set a subject to not protected for delete                   | ✅     | ❌       |

#### Topics

| User Story                | Description                                                                       | Backend | Frontend |
| ------------------------- | --------------------------------------------------------------------------------- | ------- | -------- |
| **Topic List**            | **Any User** can access list of Topics                                            | ✅     | ❌       |
| **Topic Detail**          | **Only Admins** can access Detail of Topic                                        | ✅     | ❌       |
| **Topic Create**          | **Only Admins** can create a Topic                                                | ✅     | ❌       |
| **Topic Update**          | **Only Admins** can update a Topic                                                | ✅     | ❌       |
| **Topic Delete**          | **Only Admins** can delete a Topic                                                | ✅     | ❌       |
| **Topic Protect**         | **Only Admins** can set a Topic to not protected for delete                       | ✅     | ❌       |

#### Lesson Names

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Lesson Name List**        | **Only Admins** can access list of Lesson Names                                 | ✅     | ❌       |
| **Lesson Name Detail**      | **Only Admins** can access Detail of Lesson Name                                | ✅     | ❌       |
| **Lesson Name Create**      | **Only Admins** can create a Lesson Name                                        | ✅     | ❌       |
| **Lesson Name Update**      | **Only Admins** can update a Lesson Name                                        | ✅     | ❌       |
| **Lesson Name Delete**      | **Only Admins** can delete a Lesson Name                                        | ✅     | ❌       |
| **Lesson Name Protect**     | **Only Admins** can set a Lesson Name to not protected for delete               | ✅     | ❌       |

#### Variation

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Variation List**          | **Only Admins** can access list of Variations                                   | ✅     | ❌       |
| **Variation Detail**        | **Only Admins** can access Detail of Variation                                  | ✅     | ❌       |
| **Variation Create**        | **Only Admins** can create a Variation                                          | ✅     | ❌       |
| **Variation Update**        | **Only Admins** can update a Variation                                          | ✅     | ❌       |
| **Variation Delete**        | **Only Admins** can delete a Variation                                          | ✅     | ❌       |
| **Variation Protect**       | **Only Admins** can set a Variation to not protected for delete                 | ✅     | ❌       |

#### Teaching Style

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Teaching Style List**     | **Only Admins** can access list of Teaching Style                               | ✅     | ❌       |
| **Teaching Style Detail**   | **Only Admins** can access Detail of Teaching Style                             | ✅     | ❌       |
| **Teaching Style Create**   | **Only Admins** can create a Teaching Style                                     | ✅     | ❌       |
| **Teaching Style Update**   | **Only Admins** can update a Teaching Style                                     | ✅     | ❌       |
| **Teaching Style Delete**   | **Only Admins** can delete a Teaching Style                                     | ✅     | ❌       |
| **Teaching Style Protect**  | **Only Admins** can set a Teaching Style to not protected for delete            | ✅     | ❌       |

#### Resource

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Resource List**           | **All Users** can access list of Resource                                       | ✅     | ❌       |
| **Resource Detail**         | **All Users** can access Detail of Resource                                     | ✅     | ❌       |
| **Resource Create**         | **Only Admins** can create a Resource                                           | ✅     | ❌       |
| **Resource Update**         | **Only Admins** can update a Resource                                           | ✅     | ❌       |
| **Resource Delete**         | **Only Admins** can delete a Resource                                           | ✅     | ❌       |
| **Resource Protect**        | **Only Admins** can set a Resource to not protected for delete                  | ✅     | ❌       |

#### LessonVariant

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **LessonVariant List**      | **All Users** can access list of LessonVariant                                  | ✅     | ❌       |
| **LessonVariant Detail**    | **All Users** can access Detail of LessonVariant                                | ✅     | ❌       |
| **LessonVariant Create**    | **Only Admins** can create a LessonVariant                                      | ✅     | ❌       |
| **LessonVariant Update**    | **Only Admins** can update a LessonVariant                                      | ✅     | ❌       |
| **LessonVariant Delete**    | **Only Admins** can delete a LessonVariant                                      | ✅     | ❌       |
| **LessonVariant Publish**   | **Only Admins** can change the publish status of a LessonVariant                | ✅     | ❌       |
| **LessonVariant Protect**   | **Only Admins** can set a LessonVariant to not protected for delete             | ✅     | ❌       |

#### LessonVariantResource

| User Story                  | Description                                                                     | Backend | Frontend |
| --------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **LVR List**                | **Only Admins** can access list of LVR                                          | ✅     | ❌       |
| **LVR Detail**              | **All Users** can access Detail of LVR through nested LessonVariant             | ✅     | ❌       |
| **LVR Create**              | **Only Admins** can create a LVR                                                | ✅     | ❌       |
| **LVR Update**              | **Only Admins** can update a LVR                                                | ✅     | ❌       |
| **LVR Delete**              | **Only Admins** can delete a LVR                                                | ✅     | ❌       |

#### Filtering & Searching (Public)

| User Story                       | Description                                                                     | Backend | Frontend |
| -------------------------------- | ------------------------------------------------------------------------------- | ------- | -------- |
| **Subject**                      | SUbject filtering automatically applied through URL Kwargs                      | ✅     | ❌       |
| **Topic**                        | A dedicated endpoint for topics related to my subject                           | ✅     | ❌       |
| **Lesson Name**                  | A dedicated endpoint for Lesson Name related to my subject                      | ✅     | ❌       |
| **Teaching Style**               | A dedicated endpoint for Teaching Style related to my Subject                   | ✅     | ❌       |
| **Variation**                    | A dedicated endpoint for Variation related to my subject                        | ✅     | ❌       |
| **Lesson Variant List Filter**   | filter by: Topic, Lesson Name, Teaching Style,  Variation                       | ✅     | ❌       |
| **Lesson Variant Search Filter** | Search Filter: LessonName, Topic                                                | ✅     | ❌       |
