# Endpoint Requirements

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Endpoints Are Required](#why-endpoints-are-required)
- [endpoint](#endpoint)
- [detailEndpoint](#detailendpoint)
- [Create Form Relationship](#create-form-relationship)
- [Update/Delete Form Relationship](#updatedelete-form-relationship)
- [API Utility Relationship](#api-utility-relationship)
- [Example Configuration](#example-configuration)

## Purpose

Dynamic forms require API endpoint configuration so they know where backend requests should be sent.

The form system does not hardcode API URLs.

Instead, endpoints are provided through the form configuration object.

This allows the same reusable form system to work with multiple backend resources.

## Why Endpoints Are Required

Dynamic forms are responsible for:

```text
Creating records
Updating records
Deleting records
Loading backend metadata
```

To perform these actions, the forms need to know:

```text
Which list endpoint should receive create requests
Which detail endpoint should receive update/delete requests
```

The endpoint configuration acts as the connection between the frontend form system and the backend API.

## endpoint

`endpoint` defines the list endpoint for a resource.

Example:

```js
endpoint: "/core/subjects/"
```

This endpoint is primarily used for:

```text
Create requests
OPTIONS metadata requests
List-based API workflows
```

The create form submits data to this endpoint.

Example request:

```text
POST /core/subjects/
```

## detailEndpoint

`detailEndpoint` defines the detail endpoint for a resource.

Example:

```js
detailEndpoint: "/core/subjects/"
```

The update/delete form combines this value with the model identifier.

Example:

```text
PATCH /core/subjects/{id}/
DELETE /core/subjects/{id}/
```

This endpoint is primarily used for:

```text
Update requests
Delete requests
Single-record workflows
```

## Create Form Relationship

`CoreModelCreateForm` uses:

```js
model.endpoint
```

during submission.

Example:

```js
await createCoreModelItem({
  endpoint: model.endpoint,
  data: formData,
});
```

The create form does not know which backend resource it is creating.

It only knows the configured endpoint.

## Update/Delete Form Relationship

`CoreModelUpdateDeleteForm` uses:

```js
model.detailEndpoint
```

together with the selected record identifier.

Example:

```js
await updateCoreModelItem({
  detailEndpoint: model.detailEndpoint,
  id,
  data,
});
```

The update/delete form dynamically builds the detail request URL using the configured endpoint.

## API Utility Relationship

Endpoint configuration is consumed by reusable API utilities.

Current utilities include:

```text
createCoreModelItem
updateCoreModelItem
deleteCoreModelItem
fetchCoreModelOptions
fetchCoreModelList
```

The forms pass endpoint values into these utilities instead of making direct Axios requests themselves.

This keeps API request logic separated from form orchestration.

## Example Configuration

```js
const model = {
  title: "Subjects",

  endpoint: "/core/subjects/",

  detailEndpoint: "/core/subjects/",
};
```

This configuration allows the dynamic form system to:

```text
Create Subjects
Update Subjects
Delete Subjects
Load Subject metadata
```

without hardcoding any Subject-specific request logic inside the form components.