# Dashboard Tables

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why DashboardTable Exists](#why-dashboardtable-exists)
- [Responsibilities](#responsibilities)
- [What DashboardTable Does Not Do](#what-dashboardtable-does-not-do)
- [Props](#props)
- [Table Structure](#table-structure)
- [Header Rendering](#header-rendering)
- [Row Rendering](#row-rendering)
- [Loading State](#loading-state)
- [Empty State](#empty-state)
- [Row Selection](#row-selection)
- [Relationship With Model Configuration](#relationship-with-model-configuration)
- [Relationship With ModelFieldRenderer](#relationship-with-modelfieldrenderer)
- [Dashboard Table Workflow](#dashboard-table-workflow)

## Purpose

`DashboardTable` is the reusable table component used throughout the dashboard system.

It provides a consistent way to display model records while remaining completely independent of any specific resource.

The table does not know whether it is displaying:

```text
Subjects
Topics
Lessons
Resources
Users
```

It only knows how to render rows and columns using the configuration and data it receives.

## Why DashboardTable Exists

Without a reusable table component, every dashboard resource would require its own custom table implementation.

Example:

```text
Subject Table
Topic Table
Lesson Table
Resource Table
```

would all require separate components.

`DashboardTable` allows a single table implementation to support multiple resources.

## Responsibilities

`DashboardTable` is responsible for:

```text
Rendering table headers
Rendering rows
Displaying loading states
Displaying empty states
Handling row clicks
Displaying selected rows
Providing a scrollable table body
```

## What DashboardTable Does Not Do

`DashboardTable` does not:

```text
Fetch data
Manage state
Perform searching
Perform filtering
Perform pagination
Determine which fields exist
Format field values
```

Those responsibilities belong to:

```text
Dashboard orchestration
useCoreModelData
coreModels
ModelFieldRenderer
```

## Props

| Prop | Purpose |
|---|---|
| `columns` | Table column headings |
| `rows` | Records to display |
| `loading` | Loading state |
| `templateColumns` | Grid column layout |
| `getRowKey` | Row key generator |
| `renderRow` | Row rendering callback |
| `onRowClick` | Row click handler |
| `isSelected` | Selected row checker |

## Table Structure

The table is divided into two major sections:

```text
DashboardTable
        ↓
Header
        ↓
Scrollable Body
```

The header remains fixed while the body scrolls independently.

## Header Rendering

Headers are rendered using:

```text
DashboardTableHeader
```

Example:

```jsx
<DashboardTableHeader
  columns={columns}
  templateColumns={templateColumns}
/>
```

The header component receives:

```text
Column titles
Grid layout configuration
```

from the active model configuration.

## Row Rendering

Rows are rendered dynamically.

```jsx
rows.map((row) => (
  <DashboardTableRow>
    {renderRow(row)}
  </DashboardTableRow>
))
```

The table does not know how row content should appear.

Instead it delegates row rendering to:

```js
renderRow(row)
```

This allows the dashboard to render different resources using the same table component.

## Loading State

While data is loading:

```jsx
loading === true
```

the table displays:

```text
LoadingSpinner
```

instead of rows.

```jsx
{loading ? (
  <LoadingSpinner />
)
```

This keeps loading behaviour consistent across all dashboard resources.

## Empty State

When no rows exist:

```js
rows.length === 0
```

the table displays:

```text
No results found.
```

Example:

```jsx
<Center h="100%">
  <Text>
    No results found.
  </Text>
</Center>
```

This provides a consistent empty state for all resources.

## Row Selection

The table supports row selection.

Selection state is supplied externally.

```jsx
const selected =
  isSelected?.(row);
```

The table itself does not store selected rows.

Instead, selection state belongs to the dashboard orchestration layer.

This allows row selection to support workflows such as:

```text
Update forms
Delete forms
Detail views
Side panels
```

## Relationship With Model Configuration

The active model configuration provides:

```text
columns
templateColumns
fields
keyField
```

The dashboard passes these values into the table.

Example:

```jsx
<DashboardTable
  columns={selectedModel.columns}
  templateColumns={
    selectedModel.templateColumns
  }
  rows={rows}
/>
```

The table remains completely resource-independent.

## Relationship With ModelFieldRenderer

The table is responsible for:

```text
Displaying rows
```

while:

```text
ModelFieldRenderer
```

is responsible for:

```text
Formatting values
```

Example:

```text
DashboardTable
        ↓
renderRow
        ↓
ModelFieldRenderer
        ↓
Formatted output
```

This separation keeps table structure independent from value formatting.

## Dashboard Table Workflow

```text
Dashboard loads rows
        ↓
DashboardTable receives rows
        ↓
DashboardTableHeader renders
        ↓
Rows loop executes
        ↓
DashboardTableRow renders
        ↓
renderRow executes
        ↓
ModelFieldRenderer formats values
        ↓
Table displayed
        ↓
User clicks row
        ↓
Dashboard callback executes
```

## Key Architectural Principle

```text
DashboardTable decides WHERE data is displayed.

ModelFieldRenderer decides HOW values are displayed.
```

This separation allows the dashboard table system to remain reusable across different resources and workflows.