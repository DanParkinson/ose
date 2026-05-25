# Open-Source Education DRF API

## Navigation

[← Back to README.md](/README.md)

[← Back to BACKEND.md](/docs/documentation/backend/BACKEND.md)

## Table of Contents

- [API Documentation](#api-documentation)
  - [Subject Endpoints](#subject-endpoints)
    - [Example Subject Response](#example-subject-response)
  - [Topic Endpoints](#topic-endpoints)
    - [Example Topic List Response](#example-topic-list-response)
  - [Lesson Name Endpoints](#lesson-name-endpoints)
    - [Example Lesson Name List Response](#example-lesson-name-list-response)


## Introduction

**Open-Source Education** DRF API is built using Django REST Framework (DRF), designed to support educational staff to find and download lessons. It provides a structured and efficient way for Admins to perform CRUD related tasks, and all other users to find and download the resources provided

Providing:

This API intergrates with a frontend built in **React**. It Enables users to **authenticate, search and filter through lessons, Download resources.**

## API Documentation

### Subject Endpoints

Users can retrieve available **subjects**. Admins can perform CRUD.
Each subject includes a title, level, language, publication status, and protection status.

| Method | Endpoint                                              | Description                      | Authentication Required? | Implemented |
| ------ | ----------------------------------------------------- | -------------------------------- | ------------------------ | ----------- |
| GET    | `/subjects/`                                          | List all subjects.               | ❌  **(All Users)**     | ✅          |
| POST   | `/subjects/`                                          | Create a new subject.            | ✅  **(Admin)**         | ✅          |
| GET    | `/subjects/{subject_id}/`                             | Retrieve subject details.        | ✅  **(Admin)**         | ❌          |
| PUT    | `/subjects/{subject_id}/`                             | Update subject details.          | ✅  **(Admin)**         | ❌          |
| DELETE | `/subjects/{subject_id}/`                             | Delete a subject.                | ✅  **(Admin)**         | ❌          |

### Example Subject Response

```json
{
  "count": 45,
  "next": "http://api.example.com/subjects/?page=2",
  "previous": null,
  "results": [
    {
      "subject_id": "a1b2c3d4-e5f6-7890-abcd-1234567890ef",
      "title": "Mathematics",
      "slug": "mathematics-gcse-en",
      "level": "gcse",
      "language": "en",
      "is_published": true,
      "is_protected": false
    }
  ]
}
```
