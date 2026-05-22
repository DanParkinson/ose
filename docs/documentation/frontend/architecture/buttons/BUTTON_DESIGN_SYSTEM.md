# Button Design System

## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents
- [Purpose](#purpose)
- [Consistency](#consistency)
- [Separation of Concerns](#separation-of-concerns)
- [Theme Driven Styling](#theme-driven-styling)
- [Standard Button Structure](#standard-button-structure)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Reusability Guidelines](#reusability-guidelines)
- [Recommended Architecture](#recommended-architecture)
- [Example Workflow](#example-workflow)

### Purpose

The button system provides a consistent interaction and visual language throughout the application.

Buttons are designed to:
- communicate actions clearly
- maintain visual consistency
- provide accessible interaction feedback
- support reusable workflows across the application

All reusable buttons should follow this design structure unless a specific exception is required.

## Consistency

Buttons should:
- follow shared spacing patterns
- use shared theme tokens
- maintain predictable hover and active states
- use consistent icon sizing and alignment

## Separation of Concerns

Buttons should remain presentation-focused.

Buttons should not:
- contain business logic
- manage state
- directly manipulate application workflows

Buttons should instead:
- trigger orchestration handlers through props
- expose interaction events via `onClick`

## Theme Driven Styling

All button styling should use semantic theme tokens.

Avoid:
- hardcoded colors
- inline arbitrary values
- inconsistent border styles

# Standard Button Structure

Most buttons should follow this structure:

```jsx
<Button
  onClick={onClick}
  bg="bg.dark2"
  color="text.light1"
  border="1px solid"
  borderColor="border.dark2"
  borderRadius="md"
  transition="all 0.2s ease"
  _hover={{
    bg: "bg.dark3",
    borderColor: "text.primarylight",
    color: "text.primarylight",
  }}
  _active={{
    bg: "bg.dark4",
  }}
>
  {children}
</Button>
```

## Accessibility Guidelines

Buttons should:
- always include accessible labels
- maintain sufficient contrast
- have clear hover/focus states
- remain keyboard accessible

Icon-only buttons should include:
```jsx
aria-label=""
```

## Reusability Guidelines

Before creating a new button component:

Check whether:
- an existing reusable button already fits the use case
- only text/icons differ
- styling can be shared

Avoid:
- duplicate button styles
- inline repeated button configurations
- action-specific logic inside reusable UI buttons

---

# Recommended Architecture

```text
Reusable Button Component
    ↓
Page/Feature Orchestration Logic
    ↓
Application Workflow
```

Buttons should trigger workflows, not control them.

# Example Workflow

```text
User clicks button
    ↓
onClick handler executes
    ↓
orchestration component updates state
    ↓
workflow/action executes
```
