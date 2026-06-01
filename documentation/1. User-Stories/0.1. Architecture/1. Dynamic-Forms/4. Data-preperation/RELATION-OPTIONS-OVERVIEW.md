# Relation Options

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Relation Options Exist](#why-relation-options-exist)
- [Relation Field Configuration](#relation-field-configuration)
- [High-Level Workflow](#high-level-workflow)
- [Relation Option Loading](#relation-option-loading)
- [Relation Option Formatting](#relation-option-formatting)
- [Selected Relation Options](#selected-relation-options)
- [Relation Search](#relation-search)
- [Relation Value Updates](#relation-value-updates)
- [Dynamic Form Relationship](#dynamic-form-relationship)

## Purpose

Relation options allow dynamic forms to connect one backend resource to another.

Instead of hardcoding selectable values, relation fields load records dynamically from configured API endpoints.

This allows reusable forms to support workflows such as:

```text
Selecting related Subjects
Selecting related Topics
Selecting related Resources
Selecting related Users
```

The relation system is designed around reusable utilities and hooks rather than model-specific logic.

## Why Relation Options Exist

Standard choice fields use backend OPTIONS metadata because the available values are static serializer choices.

Relation fields are different.

Relation values come from real backend records.

Example:

```text
A Subject record
A Topic record
A User record
```

Because of this, relation fields require:

```text
API requests
Search workflows
Selection workflows
Value update workflows
```

instead of static backend metadata.

## Relation Field Configuration

Relation fields require additional configuration.

Example:

```js
{
  name: "subjects",
  label: "Subjects",
  type: "relation",
  endpoint: "/core/subjects/",
  optionLabel: "title",
  optionValue: "subject_id",
  multiple: true,
}
```

| Property | Purpose |
|---|---|
| `name` | Backend field name |
| `label` | User-facing field label |
| `type` | Must be `"relation"` |
| `endpoint` | Endpoint used to load records |
| `optionLabel` | Main display field |
| `optionValue` | Submitted value field |
| `multiple` | Enables multi-selection |

## High-Level Workflow

```text
Relation field configuration provided
        ↓
Relation records loaded from endpoint
        ↓
Records formatted into display labels
        ↓
Search filters relation options
        ↓
Selected options calculated
        ↓
Selected values updated
        ↓
Values stored inside formData
```

The relation system separates:

```text
Loading
Formatting
Filtering
Selection
State updates
```

into reusable utilities.

## Relation Option Loading

Relation option loading is responsible for requesting selectable records from configured endpoints.

The current system uses:

```text
useCoreRelationOptions
```

to:

```text
Detect relation fields
Request relation data
Store loaded options
```

The hook loads relation data separately from form rendering.

## Relation Option Formatting

Loaded relation records must be converted into display-safe labels before rendering.

The current system uses:

```text
formatRelationOption
```

to generate consistent relation labels.

Formatting can support:

```text
Single display fields
Combined display fields
Custom formatted labels
```

This keeps display formatting separated from rendering components.

## Selected Relation Options

The frontend needs to determine which loaded options are currently selected.

The current system uses:

```text
getSelectedRelationOptions
```

to:

```text
Match selected values
Return selected option objects
Support single and multiple relations
```

This allows relation fields to display active selections correctly.

## Relation Search

Relation fields support searchable option filtering.

The current system uses:

```text
getFilteredRelationOptions
```

to:

```text
Filter options from search input
Reduce visible relation results
Support dynamic relation searching
```

Search filtering occurs after relation options are loaded.

## Relation Value Updates

Relation selection updates must modify stored form values safely.

The current system uses:

```text
getUpdatedRelationValues
```

to:

```text
Toggle selected values
Add relation selections
Remove relation selections
Handle single and multiple selection
```

The utility updates the relation values stored inside `formData`.

## Dynamic Form Relationship

The relation system integrates directly with dynamic forms.

The form is responsible for:

```text
Passing field configuration
Passing current form values
Passing search state
Passing loaded relation options
```

The relation utilities are responsible for:

```text
Preparing relation data
Managing selection workflows
Managing relation state updates
```

This separation keeps relation logic reusable while reducing repeated component logic.