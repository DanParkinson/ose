# CreateButton

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

`CreateButton` is a reusable icon button used to trigger creation workflows throughout the application.

It provides a consistent visual style for:
- opening create side panels
- opening create forms
- triggering creation actions

The component is intentionally presentation-focused and does not contain business logic.

## Responsibilities

`CreateButton` is responsible for:

- displaying a themed create icon button
- handling click interactions
- maintaining consistent styling across the application

## What It Does Not Do

`CreateButton` does not:
- open panels itself
- manage state
- create resources
- know anything about models or forms

Those responsibilities belong to orchestration components/pages.

## Props

| Prop      | Type     | Purpose                                       |
|-----------|----------|-----------------------------------------------|
| `onClick` | function | Function triggered when the button is clicked |
| `size`    | string   | Chakra button size variant                    |

## Default Props

| Prop   | Default |
|--------|---------|
| `size` | `"xs"`  |

## Usage Example

```jsx
<CreateButton
  onClick={() => openCreatePanel(model)}
/>
```

## Example Workflow

```text
User clicks CreateButton
    ↓
onClick handler executes
    ↓
page/component updates state
    ↓
create side panel opens
    ↓
form is loaded dynamically
```
