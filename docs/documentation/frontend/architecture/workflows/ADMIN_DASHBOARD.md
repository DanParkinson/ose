# Admin Dashboard Workflow

## Navigation

[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [High-Level Flow](#high-level-flow)
- [Main State](#main-state)
- [Data Loading](#data-loading)
- [Model Selection Flow](#model-selection-flow)
- [Main Table Flow](#main-table-flow)
- [Search Flow](#search-flow)
- [Filter Flow](#filter-flow)
- [Reset Filters Flow](#reset-filters-flow)
- [Pagination Flow](#pagination-flow)
- [Create Flow](#create-flow)
- [Layout Regions](#layout-regions)
- [Core Dependency Chain](#core-dependency-chain)
- [State Change Triggers](#state-change-triggers)
- [Key Principle](#key-principle)

## Purpose

This document explains how the admin dashboard orchestration works.

The dashboard brings together:

- model configuration
- API data loading
- search
- filters
- pagination
- create forms
- side panels
- reusable table rendering

Individual component details are documented separately.

This file focuses on how the pieces work together.

## High-Level Flow

```text
coreModels defines available models
    ↓
AdminDashboard stores selected model state
    ↓
useCoreModelData loads rows for selected model
    ↓
DashboardLayout displays the page regions
    ↓
DashboardTable renders model list and main data table
    ↓
Search / filters / pagination update state
    ↓
state changes trigger useCoreModelData refetch
    ↓
create form submits data
    ↓
refetch reloads latest rows
```

## Main State

`AdminDashboard` owns the orchestration state.

```js
const [selectedModel, setSelectedModel] = useState(coreModels[0]);
const [activeFilters, setActiveFilters] = useState({});
const [searchQuery, setSearchQuery] = useState("");
const [offset, setOffset] = useState(0);
const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
const [createModel, setCreateModel] = useState(null);
```

| State | Purpose |
|---|---|
| `selectedModel` | Tracks the active model configuration |
| `activeFilters` | Stores selected filter values |
| `searchQuery` | Stores current search text |
| `offset` | Tracks current pagination position |
| `isCreatePanelOpen` | Controls create side panel visibility |
| `isFilterPanelOpen` | Controls filter side panel visibility |
| `createModel` | Stores which model the create form should use |

## Data Loading

Data is loaded through `useCoreModelData`.

```js
const {
  rows,
  next,
  previous,
  count,
  refetch,
} = useCoreModelData(
  selectedModel.endpoint,
  offset,
  searchQuery,
  activeFilters
);
```

The hook receives:

```text
selectedModel.endpoint
offset
searchQuery
activeFilters
```

When any of these values change, the hook reloads data.

## Model Selection Flow

The left model list is built from `coreModels`.

```jsx
<DashboardTable
  columns={["Resource"]}
  rows={coreModels}
  getRowKey={(row) => row.id}
  isSelected={(row) => row.id === selectedModel.id}
  onRowClick={handleModelChange}
/>
```

When a model is clicked:

```js
const handleModelChange = (row) => {
  setSelectedModel(row);
  setSearchQuery("");
  setOffset(0);

  const resetFilters = {};

  row.filters.forEach((filter) => {
    resetFilters[filter.key] = "all";
  });

  setActiveFilters(resetFilters);
};
```

This:

```text
changes selected model
clears search
resets pagination
resets filters
triggers useCoreModelData
```

## Main Table Flow

The main table uses the active model configuration.

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

The model config decides:

```text
which columns render
which fields render
which key field identifies rows
how the table grid is shaped
```

`ModelFieldRenderer` handles how each value is displayed.

## Search Flow

Search is controlled by `searchQuery`.

```jsx
<TextSearchFilter
  value={searchQuery}
  onChange={setSearchQuery}
  onSearch={(value) => {
    setSearchQuery(value);
    setOffset(0);
  }}
/>
```

Flow:

```text
user types search
    ↓
searchQuery updates
    ↓
offset resets to 0
    ↓
useCoreModelData refetches
    ↓
rows update
```

## Filter Flow

The visible dashboard panel only contains the button to open filters.

```jsx
<OpenFiltersButton
  onClick={() => setIsFilterPanelOpen(true)}
/>
```

The actual filter controls live inside a side panel.

```jsx
<SidePanel
  isOpen={isFilterPanelOpen}
  onClose={() => setIsFilterPanelOpen(false)}
  title={`Filter ${selectedModel.title}`}
>
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
</SidePanel>
```

When a filter changes:

```text
activeFilters updates
offset resets to 0
useCoreModelData refetches
filtered rows render
```

## Reset Filters Flow

Resetting uses `buildResetFilters`.

```js
const resetActiveFilters = () => {
  setActiveFilters(buildResetFilters(selectedModel.filters));
  setSearchQuery("");
  setOffset(0);
};
```

This resets:

```text
filters
search query
pagination
```

The reset button triggers this function.

```jsx
<ResetFiltersButton
  onClick={resetActiveFilters}
/>
```

## Pagination Flow

Pagination receives API metadata from `useCoreModelData`.

```jsx
<Pagination
  previous={previous}
  next={next}
  offset={offset}
  limit={limit}
  count={count}
  onPrevious={() => {
    if (!previous || offset === 0) return;

    setOffset((prev) =>
      Math.max(prev - limit, 0)
    );
  }}
  onNext={() => {
    if (!next) return;

    setOffset((prev) => prev + limit);
  }}
/>
```

Flow:

```text
user clicks next/previous
    ↓
offset updates
    ↓
useCoreModelData refetches
    ↓
new page rows render
```

## Create Flow

Each model row has a create button.

```jsx
<CreateButton
  onClick={(event) => {
    event.stopPropagation();
    openCreatePanel(row);
  }}
/>
```

`event.stopPropagation()` prevents the row click from also changing the selected model.

The create panel opens using:

```js
const openCreatePanel = (model) => {
  setCreateModel(model);
  setIsCreatePanelOpen(true);
};
```

The side panel renders the create form:

```jsx
<SidePanel
  isOpen={isCreatePanelOpen}
  onClose={() => setIsCreatePanelOpen(false)}
  title={`Create ${createModel?.title || ""}`}
>
  {createModel && (
    <CoreModelCreateForm
      model={createModel}
      onCreated={() => {
        setIsCreatePanelOpen(false);
        refetch();
      }}
    />
  )}
</SidePanel>
```

Flow:

```text
user clicks create
    ↓
createModel is stored
    ↓
create side panel opens
    ↓
CoreModelCreateForm receives model config
    ↓
form submits data
    ↓
onCreated runs
    ↓
side panel closes
    ↓
refetch reloads rows
```

## Layout Regions

`DashboardLayout` receives four orchestration regions.

```jsx
<DashboardLayout
  orchestrator={...}
  filters={...}
  main={...}
  pagination={...}
/>
```

| Region | Purpose |
|---|---|
| `orchestrator` | Model selection and create actions |
| `filters` | Search input and filter controls launcher |
| `main` | Main selected model data table |
| `pagination` | Pagination controls |

## Core Dependency Chain

```text
coreModels
    ↓
selectedModel
    ↓
useCoreModelData
    ↓
rows / count / next / previous
    ↓
DashboardTable / Pagination
```

## State Change Triggers

The data refetches when these change:

| State | Cause |
|---|---|
| `selectedModel.endpoint` | User selects a different model |
| `offset` | User changes page |
| `searchQuery` | User searches |
| `activeFilters` | User applies filters |

## Key Principle

```text
AdminDashboard orchestrates.
Components display.
Hooks fetch.
Config describes.
API returns data.
```

The dashboard page should know how things connect, but reusable components should stay focused on display and interaction only.
