# Admin Dashboard Component Overview

## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents
- [Purpose](#purpose)
- [Design Philosophy](#design-philosophy)
- [Component Group Purpose](#component-group-purpose)
- [Component List](#component-list)
- [DashboardSection](#dashboardsection)
  - [Purpose](#purpose-1)
  - [Responsibilities](#responsibilities)
  - [What It Does Not Do](#what-it-does-not-do)
  - [Props](#props)
  - [Usage Example](#usage-example)
- [DashboardTable](#dashboardtable)
  - [Purpose](#purpose-2)
  - [Responsibilities](#responsibilities-1)
  - [What It Does Not Do](#what-it-does-not-do-1)
  - [Props](#props-1)
  - [Usage Example](#usage-example-1)
- [DashboardTableHeader](#dashboardtableheader)
  - [Purpose](#purpose-3)
  - [Responsibilities](#responsibilities-2)
  - [What It Does Not Do](#what-it-does-not-do-2)
  - [Props](#props-2)
  - [Usage Example](#usage-example-2)
- [DashboardTableRow](#dashboardtablerow)
  - [Purpose](#purpose-4)
  - [Responsibilities](#responsibilities-3)
  - [What It Does Not Do](#what-it-does-not-do-3)
  - [Props](#props-3)
  - [Usage Example](#usage-example-3)
- [DashboardTableTitleRow](#dashboardtabletitlerow)
  - [Purpose](#purpose-5)
  - [Responsibilities](#responsibilities-4)
  - [What It Does Not Do](#what-it-does-not-do-4)
  - [Props](#props-4)
  - [Usage Example](#usage-example-4)
- [DashboardPanelBox](#dashboardpanelbox)
  - [Purpose](#purpose-6)
  - [Responsibilities](#responsibilities-5)
  - [What It Does Not Do](#what-it-does-not-do-5)
  - [Props](#props-5)
  - [Usage Example](#usage-example-5)
- [DashboardFilterPanel](#dashboardfilterpanel)
  - [Purpose](#purpose-7)
  - [Responsibilities](#responsibilities-6)
  - [What It Does Not Do](#what-it-does-not-do-6)
  - [Props](#props-6)
  - [Usage Example](#usage-example-6)
- [Shared Architectural Principle](#shared-architectural-principle)

## Purpose

This document explains the reusable dashboard structure components used throughout the admin dashboard system.

These components are responsible for layout, spacing, table structure, panel structure, row rendering, and filter panel display.

They are intentionally presentation-focused and do not manage API requests, business logic, or model state.

## Design Philosophy

The dashboard component system is designed around:

- reusable UI structures
- configuration-driven rendering
- separation of concerns
- orchestration-driven workflows
- scalable admin interfaces

## Component Group Purpose

The admin dashboard structure components are designed to:

- create consistent dashboard panels
- render reusable tables
- keep table headers fixed while rows scroll
- display selectable rows
- support action areas inside rows
- provide reusable panel boxes
- display filter groups consistently

## Component List

| Component | Purpose |
|---|---|
| `DashboardSection` | Wraps dashboard content with consistent vertical spacing |
| `DashboardTable` | Renders a reusable table shell with fixed header and scrollable rows |
| `DashboardTableHeader` | Renders table header columns |
| `DashboardTableRow` | Renders one styled table row |
| `DashboardTableTitleRow` | Renders a row title with optional actions |
| `DashboardPanelBox` | Renders a non-table panel with a dashboard-style header |
| `DashboardFilterPanel` | Renders grouped filter controls |

# DashboardSection

## Purpose

`DashboardSection` is a lightweight structure wrapper used to contain dashboard content.

It provides consistent full-width, full-height layout behaviour and vertical spacing for child components.

## Responsibilities

`DashboardSection` is responsible for:

- wrapping dashboard content
- applying full-width and full-height behaviour
- spacing children consistently
- keeping section structure simple and reusable

## What It Does Not Do

`DashboardSection` does not:

- fetch data
- manage state
- render specific models
- know what children it contains

## Props

| Prop | Type | Purpose |
|---|---|---|
| `children` | node | Content rendered inside the section |

## Usage Example

```jsx
<DashboardSection>
  <DashboardTable />
</DashboardSection>
```

# DashboardTable

## Purpose

`DashboardTable` is a reusable table shell used to display dynamic row data.

It combines:

- a fixed table header
- a scrollable row body
- selectable row support
- custom row rendering

## Responsibilities

`DashboardTable` is responsible for:

- rendering the outer table container
- rendering the table header
- mapping rows into table rows
- keeping the header fixed while rows scroll
- passing row content into `DashboardTableRow`

## What It Does Not Do

`DashboardTable` does not:

- fetch data
- decide what each row should display
- format field values
- manage selected state itself
- manage click logic internally

## Props

| Prop | Type | Purpose |
|---|---|---|
| `columns` | array | Header column labels |
| `rows` | array | Data rows to render |
| `templateColumns` | string/object | CSS grid column layout |
| `getRowKey` | function | Returns a unique key for each row |
| `renderRow` | function | Defines how each row should render |
| `onRowClick` | function | Optional row click handler |
| `isSelected` | function | Optional selected row checker |

## Usage Example

```jsx
<DashboardTable
  columns={selectedModel.columns}
  rows={rows}
  templateColumns={selectedModel.templateColumns}
  getRowKey={(row) => row[selectedModel.keyField]}
  renderRow={(row) =>
    selectedModel.fields.map((field) => (
      <ModelFieldRenderer
        key={`${row[selectedModel.keyField]}-${field}`}
        value={row[field]}
      />
    ))
  }
/>
```

# DashboardTableHeader

## Purpose

`DashboardTableHeader` renders the header row for dashboard-style tables and panels.

It receives column labels and displays them using the same grid structure as the table rows.

## Responsibilities

`DashboardTableHeader` is responsible for:

- rendering column headings
- applying header background styling
- matching table grid layout
- keeping table headers visually consistent

## What It Does Not Do

`DashboardTableHeader` does not:

- render rows
- manage data
- handle scrolling
- control table behaviour

## Props

| Prop | Type | Purpose |
|---|---|---|
| `columns` | array | Header labels to display |
| `templateColumns` | string/object | CSS grid column layout |

## Usage Example

```jsx
<DashboardTableHeader
  columns={["Subject", "Level", "Language"]}
  templateColumns="1fr 1fr 1fr"
/>
```

# DashboardTableRow

## Purpose

`DashboardTableRow` renders one reusable dashboard table row.

It handles row layout, hover styling, selected styling, and optional row click behaviour.

## Responsibilities

`DashboardTableRow` is responsible for:

- rendering one row as a grid
- applying row spacing
- applying selected state styling
- applying hover styling when clickable
- triggering row click actions

## What It Does Not Do

`DashboardTableRow` does not:

- decide what content appears inside the row
- fetch data
- manage selected state
- format field values

## Props

| Prop | Type | Purpose |
|---|---|---|
| `row` | object | Row data passed back when clicked |
| `templateColumns` | string/object | CSS grid column layout |
| `isSelected` | boolean | Whether the row should appear active |
| `onClick` | function | Optional row click handler |
| `children` | node | Row content |

## Usage Example

```jsx
<DashboardTableRow
  row={row}
  templateColumns="1fr 1fr"
  isSelected={selected}
  onClick={handleRowClick}
>
  {children}
</DashboardTableRow>
```

# DashboardTableTitleRow

## Purpose

`DashboardTableTitleRow` is a reusable row content component for displaying a title with optional actions.

It is useful for table rows where the main content is a label and a button/action area.

## Responsibilities

`DashboardTableTitleRow` is responsible for:

- displaying a title on the left
- displaying optional actions on the right
- maintaining consistent horizontal row layout

## What It Does Not Do

`DashboardTableTitleRow` does not:

- manage click behaviour
- know what action buttons do
- fetch data
- manage selected state

## Props

| Prop | Type | Purpose |
|---|---|---|
| `title` | string | Main text displayed on the left |
| `actions` | node | Optional action component displayed on the right |

## Usage Example

```jsx
<DashboardTableTitleRow
  title={row.title}
  actions={
    <CreateButton
      onClick={(event) => {
        event.stopPropagation();
        openCreatePanel(row);
      }}
    />
  }
/>
```

# DashboardPanelBox

## Purpose

`DashboardPanelBox` is a reusable dashboard-style panel used when content should look like a dashboard table section but does not need rows.

It provides a shared bordered container and header style.

## Responsibilities

`DashboardPanelBox` is responsible for:

- rendering a panel container
- rendering a dashboard-style header
- wrapping custom child content
- keeping non-table panels visually consistent with tables

## What It Does Not Do

`DashboardPanelBox` does not:

- render data rows
- fetch data
- manage state
- handle actions itself

## Props

| Prop | Type | Purpose |
|---|---|---|
| `title` | string | Header title for the panel |
| `children` | node | Panel content |

## Usage Example

```jsx
<DashboardPanelBox title="Filters">
  <TextSearchFilter />
  <OpenFiltersButton />
  <ResetFiltersButton />
</DashboardPanelBox>
```

# DashboardFilterPanel

## Purpose

`DashboardFilterPanel` renders grouped filter controls.

It is used to display filter categories and their selectable filter options.

## Responsibilities

`DashboardFilterPanel` is responsible for:

- rendering filter group titles
- rendering filter option groups
- passing filter selections to `FilterOptions`
- keeping filter UI consistent

## What It Does Not Do

`DashboardFilterPanel` does not:

- store filter state
- apply filters directly
- fetch filtered data
- reset filters
- know about API behaviour

## Props

| Prop | Type | Purpose |
|---|---|---|
| `filters` | array | Filter groups to render |
| `activeFilters` | object | Current active filter values |
| `onFilterChange` | function | Handler triggered when a filter option is selected |

## Usage Example

```jsx
<DashboardFilterPanel
  filters={selectedModel.filters}
  activeFilters={activeFilters}
  onFilterChange={(filterKey, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
    setOffset(0);
  }}
/>
```

# Shared Architectural Principle

```text
Dashboard components render structure and UI.
Orchestration components manage state and workflows.
Hooks manage data loading.
API utilities manage requests.
```
