# Dashboard Layout

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why DashboardLayout Exists](#why-dashboardlayout-exists)
- [Layout Regions](#layout-regions)
- [Props](#props)
- [Responsive Structure](#responsive-structure)
- [Left Column](#left-column)
- [Main Region](#main-region)
- [Example Usage](#example-usage)
- [Layout Workflow](#layout-workflow)

## Purpose

`DashboardLayout` provides the reusable page structure for dashboard-style interfaces.

It defines where the main dashboard regions should appear, but it does not decide what those regions contain.

## Why DashboardLayout Exists

The dashboard system needs a consistent structure for:

```text
Model/resource selection
Search and filter controls
Main data display
Pagination controls
```

`DashboardLayout` keeps this structure reusable by accepting these regions as props.

The layout component does not manage dashboard state or data loading.

## Layout Regions

`DashboardLayout` receives four regions:

```js
orchestrator
filters
main
pagination
```

| Region | Purpose |
|---|---|
| `orchestrator` | Model/resource selection and related actions |
| `filters` | Search, reset, and filter controls |
| `main` | Main data display area |
| `pagination` | Pagination controls |

The parent dashboard decides what content is passed into each region.

## Props

```jsx
const DashboardLayout = ({
  orchestrator,
  filters,
  main,
  pagination,
}) => {
```

| Prop | Purpose |
|---|---|
| `orchestrator` | Content rendered in the top-left control region |
| `filters` | Content rendered below the orchestrator region |
| `main` | Main dashboard content |
| `pagination` | Pagination/control region |

## Responsive Structure

The layout uses a responsive grid.

```jsx
<Grid
  templateColumns={{
    base: "1fr",
    lg: "320px 1fr",
  }}
>
```

On smaller screens:

```text
All regions stack in one column
```

On large screens:

```text
Left control column
Main content column
```

This allows the same layout to work across different screen sizes.

## Left Column

The left column contains:

```text
orchestrator
filters
pagination
```

These are stacked vertically.

```jsx
<VStack align="stretch" gap={4}>
  <Box h="320px">
    {orchestrator}
  </Box>

  <Box h="240px">
    {filters}
  </Box>

  <Box h="180px">
    {pagination}
  </Box>
</VStack>
```

Each region has a fixed height to keep the dashboard layout predictable.

## Main Region

The main region renders the primary dashboard content.

```jsx
<Box minH={0} overflow="hidden">
  {main}
</Box>
```

This is usually where the main dashboard table is displayed.

The layout does not know what the main content is.

It only provides the space for it.

## Example Usage

```jsx
<DashboardLayout
  orchestrator={
    <DashboardSection>
      {/* model selection */}
    </DashboardSection>
  }
  filters={
    <DashboardSection>
      {/* search and filters */}
    </DashboardSection>
  }
  main={
    <DashboardSection>
      {/* dashboard table */}
    </DashboardSection>
  }
  pagination={
    <DashboardSection>
      {/* pagination controls */}
    </DashboardSection>
  }
/>
```

## Layout Workflow

```text
Dashboard orchestrator prepares regions
        ↓
DashboardLayout receives region props
        ↓
Layout places controls in left column
        ↓
Layout places main content in main region
        ↓
Dashboard components render inside each region
```

`DashboardLayout` controls structure only.

The dashboard page controls workflow, state, and content.