# Table Configuration

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Table Configuration Exists](#why-table-configuration-exists)
- [Table Configuration Properties](#table-configuration-properties)
- [Columns](#columns)
- [Fields](#fields)
- [Template Columns](#template-columns)
- [Key Field Relationship](#key-field-relationship)
- [Relationship With DashboardTable](#relationship-with-dashboardtable)
- [Relationship With ModelFieldRenderer](#relationship-with-modelfieldrenderer)
- [Example Configuration](#example-configuration)
- [Table Rendering Workflow](#table-rendering-workflow)

## Purpose

Table configuration defines how a model's data should be displayed inside dashboard tables.

The dashboard table component is completely generic.

It does not know:

```text
Which fields exist
Which columns should appear
How many columns are required
How wide each column should be
```

Instead, these decisions are supplied through the model configuration.

## Why Table Configuration Exists

Without table configuration, every resource would require its own custom table.

Example:

```text
Subject Table
Topic Table
Lesson Table
Resource Table
```

would all require separate implementations.

Table configuration allows a single dashboard table system to support multiple resources.

## Table Configuration Properties

The dashboard currently uses:

```js
columns
fields
templateColumns
keyField
```

Together these define how rows and columns are rendered.

## Columns

`columns` defines the visible table headings.

Example:

```js
columns: [
  "Subject",
  "Level",
  "Published",
  "Protected",
]
```

These values are displayed inside:

```text
DashboardTableHeader
```

The number of columns should match the number of rendered fields.

## Fields

`fields` defines which properties should be displayed for each record.

Example:

```js
fields: [
  "title",
  "level",
  "is_published",
  "is_protected",
]
```

The dashboard uses these values when building table rows.

Example:

```js
fields.map((field) => (
  <ModelFieldRenderer
    value={row[field]}
  />
))
```

The fields array determines:

```text
What data appears in each row
The order values appear
```

## Template Columns

`templateColumns` controls the grid layout used by the table.

Example:

```js
templateColumns: "2fr 1fr 1fr 1fr"
```

This value is passed directly into:

```text
DashboardTableHeader
DashboardTableRow
```

It controls:

```text
Column widths
Column proportions
Table layout consistency
```

Example:

```js
"2fr 1fr 1fr 1fr"
```

means:

```text
Subject column receives twice as much space
Remaining columns receive equal space
```

## Key Field Relationship

The table configuration also relies on:

```js
keyField
```

Example:

```js
keyField: "subject_id"
```

This field is used for:

```text
React row keys
Row selection
Update workflows
Delete workflows
```

Although not directly displayed in the table, it is required for table functionality.

## Relationship With DashboardTable

`DashboardTable` receives table configuration from the active model.

Example:

```jsx
<DashboardTable
  columns={selectedModel.columns}
  templateColumns={
    selectedModel.templateColumns
  }
  rows={rows}
  ...
/>
```

The table component remains completely generic.

It does not know anything about subjects, topics, lessons, or resources.

## Relationship With ModelFieldRenderer

Table rows are rendered dynamically using:

```text
ModelFieldRenderer
```

The table configuration determines:

```text
Which fields to render
```

while `ModelFieldRenderer` determines:

```text
How values are displayed
```

Example:

```text
Table Configuration
        ↓
Selects field
        ↓
ModelFieldRenderer
        ↓
Displays value
```

## Example Configuration

```js
columns: [
  "Subject",
  "Level",
  "Published",
  "Protected",
],

templateColumns:
  "2fr 1fr 1fr 1fr",

fields: [
  "title",
  "level",
  "is_published",
  "is_protected",
],

keyField: "subject_id",
```

## Table Rendering Workflow

```text
Dashboard loads selected model
        ↓
Model configuration loaded
        ↓
Columns passed to DashboardTableHeader
        ↓
Fields used to build row content
        ↓
templateColumns applied
        ↓
Rows rendered
        ↓
ModelFieldRenderer formats values
        ↓
Table displayed to user
```

The table configuration acts as the bridge between backend data and the reusable dashboard table system.