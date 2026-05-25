# coreModels

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [File](#file)
- [Purpose](#purpose)
- [Model Structure](#model-structure)
- [Table Configuration](#table-configuration)
- [Filter Configuration](#filter-configuration)
  - [Special `"all"` Value](#special-all-value)
- [Create Field Configuration](#create-field-configuration)
  - [Supported Field Types](#supported-field-types)
  - [Choice Fields](#choice-fields)
  - [Relation Fields](#relation-fields)
    - [Relation Display Formatting](#relation-display-formatting)
- [Included Models](#included-models)
- [Design Goals](#design-goals)
- [Usage Rules](#usage-rules)

## Purpose

`coreModels` is a shared frontend configuration file used to define reusable model behaviour across the application.

It centralises model metadata so that reusable systems can dynamically work with different backend models without hardcoding model-specific logic.

The configuration supports:

- API integration
- Table rendering
- Filtering
- Search
- Dynamic forms
- Relation handling
- Reusable CRUD systems

## File

| File | Description |
|---|---|
| `coreModels.js` | Shared model configuration definitions |

## Purpose

Each model configuration object describes how a backend model should behave inside reusable frontend systems.

Instead of creating separate logic for every model, reusable components can read the configuration and dynamically adapt their behaviour.

## Model Structure

Each model object contains:

| Property | Description |
|---|---|
| `id` | Unique frontend identifier |
| `title` | Human-readable model name |
| `endpoint` | Backend API endpoint |
| `columns` | Display column labels |
| `templateColumns` | Grid layout definition |
| `keyField` | Unique backend identifier field |
| `fields` | Fields used for display rendering |
| `filters` | Available filter configuration |
| `createFields` | Dynamic create form configuration |

## Table Configuration

The following properties define how reusable table systems should render model data.

```js
columns
templateColumns
keyField
fields
```

Example:

```js
columns: ["Subject", "Level", "Language", "Published", "Protected"],
templateColumns: "1fr 1fr 1fr 1fr 1fr",
keyField: "subject_id",
fields: ["title", "level", "language", "is_published", "is_protected"],
```

| Property          | Purpose                               |
|-------------------|---------------------------------------|
| `columns`         | Visible column headings               |
| `templateColumns` | CSS grid layout structure             |
| `keyField`        | Unique identifier used for rendering  |
| `fields`          | Values extracted from backend records |

## Filter Configuration

`filters` defines reusable filter metadata.

Example:

```js
{
  key: "is_protected",
  title: "By protected",
  options: [
    { label: "All", value: "all" },
    { label: "Yes", value: true },
    { label: "No", value: false },
  ],
}
```

| Property  | Description                 |
|-----------|-----------------------------|
| `key`     | Backend query parameter     |
| `title`   | UI label                    |
| `options` | Available selectable values |

## Special `"all"` Value

The value `"all"` is intentionally used as a frontend-only reset state.

Reusable API utilities automatically exclude `"all"` values from requests.

Example:

```js
{
  label: "All",
  value: "all"
}
```

This prevents unnecessary query parameters from being sent to the backend.

## Create Field Configuration

`createFields` defines how reusable create form systems should render fields.

Example:

```js
createFields: [
  { name: "title", label: "Title", type: "text" },
  { name: "is_protected", label: "Protected", type: "boolean" },
]
```

| Property | Description                   |
|----------|-------------------------------|
| `name`   | Backend serializer field name |
| `label`  | Display label                 |
| `type`   | Field rendering type          |

### Supported Field Types

| Type       | Description                 |
|------------|-----------------------------|
| `text`     | Standard text input         |
| `choice`   | Backend-driven choice field |
| `boolean`  | Switch/toggle field         |
| `relation` | Related model selector      |

## Choice Fields

Choice fields use backend serializer metadata retrieved through HTTP `OPTIONS` requests.

Example:

```js
{ name: "level", label: "Level", type: "choice" }
```

This allows frontend forms to stay synchronised with backend serializer choices.

---

## Relation Fields

Relation fields are used for foreign key and many-to-many relationships.

Example:

```js
{
  name: "subjects",
  label: "Subjects",
  type: "relation",
  endpoint: "/core/subjects/",
  optionLabel: "title",
  optionValue: "subject_id",
  displayFields: ["title", "level", "language"],
  multiple: true,
}
```

| Property        | Description                                   |
|-----------------|-----------------------------------------------|
| `endpoint`      | Endpoint used to load related records         |
| `optionLabel`   | Primary display field                         |
| `optionValue`   | Backend submission value                      |
| `displayFields` | Additional fields used for display formatting |
| `multiple`      | Allows multi-selection                        |

### Relation Display Formatting

`displayFields` provides richer relation labels when multiple records may share the same title.

Example:

```js
displayFields: ["title", "level", "language"]
```

Result:

```text
Mathematics - primary - en
Mathematics - secondary - en
```

instead of:

```text
Mathematics
Mathematics
```

---

## Included Models

| Model           | Endpoint                  | Key Field           |
|-----------------|---------------------------|---------------------|
| Subjects        | `/core/subjects/`         | `subject_id`        |
| Topics          | `/core/topics/`           | `topic_id`          |
| Lesson Names    | `/core/lesson_names/`     | `lesson_name_id`    |
| Variations      | `/core/variations/`       | `variation_id`      |
| Teaching Styles | `/core/teaching_styles/`  | `teaching_style_id` |

## Design Goals

| Goal | Description |
|---|---|
| Reusability | Shared configuration across multiple systems |
| Scalability | New models can be added with minimal frontend changes |
| Backend alignment | Frontend fields map directly to serializer fields |
| Dynamic behaviour | Reusable systems adapt using configuration |
| Reduced duplication | Prevents repeated model-specific logic |
| Flexible relations | Supports searchable relation selection |

---

# Usage Rules

- Keep backend field names accurate.
- Use `fields` for display rendering.
- Use `createFields` for dynamic form generation.
- Use `filters` only for supported backend query fields.
- Use `choice` for backend-defined serializer choices.
- Use `relation` for related model fields.
- Add `displayFields` when relation records require additional context.
- Keep reusable behaviour configuration-driven where possible.
