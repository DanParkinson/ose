# OpenFiltersButton

## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents
- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Default Props](#default-props)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)

## Purpose

`OpenFiltersButton` is a reusable button component used to open filter selection interfaces throughout the application.

It provides a consistent visual style for:
- opening filter side panels
- exposing advanced filter controls
- triggering filter workflows

The component is intentionally presentation-focused and does not contain business logic.

## Responsibilities

`OpenFiltersButton` is responsible for:

- displaying a themed filter button
- handling click interactions
- maintaining consistent filter action styling across the application

## What It Does Not Do

`OpenFiltersButton` does not:
- manage filter state
- apply filters
- reset filters
- open side panels itself
- know anything about models or filtering logic

Those responsibilities belong to orchestration components/pages.

## Props

| Prop       | Type      | Purpose                                       |
|------------|-----------|-----------------------------------------------|
| `onClick`  | function  | Function triggered when the button is clicked |
| `children` | node      | Custom button label/content                   |

## Default Props

| Prop       | Default          |
|------------|------------------|
| `children` | `"Open Filters"` |

## Usage Example

```jsx
<OpenFiltersButton
  onClick={() => setIsFilterPanelOpen(true)}
/>
```

## Example Workflow

```text
User clicks OpenFiltersButton
    ↓
onClick handler executes
    ↓
page/component updates state
    ↓
filter side panel opens
    ↓
filter controls become visible
```
