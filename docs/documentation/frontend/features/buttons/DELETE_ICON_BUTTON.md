## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents
- [Purpose](#purpose)
- [Responsibilities](#responsibilities)
- [What It Does Not Do](#what-it-does-not-do)
- [Props](#props)
- [Usage Example](#usage-example)
- [Example Workflow](#example-workflow)
- [Key Principle](#key-principle)

# DeleteIconButton

## Purpose

`DeleteIconButton` is a reusable icon-based action button used throughout the application for removal workflows.

It provides a consistent visual style for:

- removing selected items
- removing relation selections
- triggering delete-style actions
- displaying destructive actions using icon-only UI

The component is intentionally presentation-focused and does not contain business logic.

## Responsibilities

`DeleteIconButton` is responsible for:

- displaying a reusable delete icon button
- handling click interactions
- applying consistent destructive action styling
- providing reusable remove action UI

## What It Does Not Do

`DeleteIconButton` does not:

- delete data itself
- manage state
- know what item is being removed
- perform API requests
- manage orchestration logic

Those responsibilities belong to orchestration components/pages.

## Props

| Prop | Type | Purpose |
|---|---|---|
| `onClick` | function | Function triggered when the button is clicked |

## Usage Example

```jsx
<DeleteIconButton
  onClick={() => onRemove(option)}
/>
```

## Example Workflow

```text
User clicks DeleteIconButton
    ↓
onClick handler executes
    ↓
parent component removes selected item
    ↓
UI updates
```

## Key Principle

```text
DeleteIconButton triggers remove actions.
Parent orchestration controls state changes.
```
