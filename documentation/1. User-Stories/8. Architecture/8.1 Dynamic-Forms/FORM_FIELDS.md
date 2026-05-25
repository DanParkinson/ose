# Form Field Components Overview

## Navigation
[← Back to README.md](/README.md)

[← Back to FRONTEND.md](/docs/documentation/frontend/FRONTEND.md)

## Table of Contents

- [Purpose](#purpose)
- [Design Philosophy](#design-philosophy)
- [Component Group Purpose](#component-group-purpose)
- [Component Groups](#component-groups)
- [Form Field Structure Group](#form-field-structure-group)
  - [Purpose](#purpose-1)
  - [Components Included](#components-included)
  - [Usage Example](#usage-example)
- [Text Field Group](#text-field-group)
  - [Purpose](#purpose-2)
  - [Components Included](#components-included-1)
  - [Supporting Hooks](#supporting-hooks)
  - [Supporting Utilities](#supporting-utilities)
  - [Usage Example](#usage-example-1)
- [Choice Field Group](#choice-field-group)
  - [Purpose](#purpose-3)
  - [Components Included](#components-included-2)
  - [Supporting Hooks](#supporting-hooks-1)
  - [Supporting Utilities](#supporting-utilities-1)
  - [Usage Example](#usage-example-2)
- [Boolean Field Group](#boolean-field-group)
  - [Purpose](#purpose-4)
  - [Components Included](#components-included-3)
  - [Supporting Hooks](#supporting-hooks-2)
  - [Supporting Utilities](#supporting-utilities-2)
  - [Usage Example](#usage-example-3)
- [Relation Field Group](#relation-field-group)
  - [Purpose](#purpose-5)
  - [Components Included](#components-included-4)
  - [Supporting Hooks](#supporting-hooks-3)
  - [Supporting Utilities](#supporting-utilities-3)
  - [Usage Example](#usage-example-4)
- [Shared Architectural Principle](#shared-architectural-principle)

## Purpose

This document explains the reusable form field components used throughout the admin create form system.

These components are responsible for:

- rendering reusable field structures
- rendering reusable field types
- displaying field labels
- displaying field errors
- displaying selectable options
- displaying selected relation items

The field components are intentionally presentation-focused and do not manage backend requests or overall form orchestration.

## Design Philosophy

The form field system is designed around:

- reusable field structures
- configuration-driven rendering
- separation of concerns
- scalable form architecture
- reusable relation selection workflows

## Component Group Purpose

The form field component groups are designed to:

- provide shared form field structure
- render reusable field types
- separate field rendering from form orchestration
- support reusable searchable relation fields
- keep field styling consistent across forms
- prepare the architecture for future update forms

## Component Groups

```txt
Form field structure
├── FormFieldWrapper
├── FormFieldLabel
└── FormFieldError

Text field group
├── FormFieldText
└── FormTextInput

Choice field group
├── FormFieldChoice
└── AppSelect

Boolean field group
├── FormFieldBoolean
└── AppSwitch

Relation field group
├── FormFieldRelation
├── FormTextInput
├── SelectableOptionList
├── SelectedOptionList
└── DeleteIconButton
```

## Form Field Structure Group

### Purpose

The form field structure group provides the shared layout structure used by all field types.

It standardises:

- field spacing
- label positioning
- error positioning
- reusable field wrappers

### Components Included

| Component | Purpose |
|---|---|
| `FormFieldWrapper` | Provides shared field layout and spacing |
| `FormFieldLabel`   | Displays reusable field labels |
| `FormFieldError`   | Displays reusable field validation errors |

### Usage Example

The structure group is typically used by field-specific components.

Example:

```jsx
<FormFieldWrapper
  label={field.label}
  error={error}
>
  {children}
</FormFieldWrapper>
```

The wrapper handles:

- rendering the field label
- rendering the field error
- rendering consistent spacing
- rendering the child field component

## Text Field Group

### Purpose

The text field group handles standard text-based form inputs.

It provides reusable text field rendering while keeping styling and field structure consistent.

### Components Included

| Component | Purpose |
|---|---|
| `FormFieldText` | Renders reusable text fields |
| `FormTextInput` | Reusable styled text input component |

### Supporting Hooks

No dedicated hooks are required for the text field group.

### Supporting Utilities

| Utility | Purpose |
|---|---|
| `getFieldError` | Extracts and formats field validation errors |

### Usage Example

`FormFieldText` combines the shared form field structure with a reusable text input component.

Example:

```jsx
<FormFieldText
  field={field}
  value={formData[field.name]}
  error={fieldError}
  onChange={handleChange}
/>
```

Internally this renders:

```jsx
<FormFieldWrapper
  label={field.label}
  error={error}
>
  <FormTextInput
    placeholder={field.label}
    value={value || ""}
    onChange={(event) =>
      onChange(field.name, event.target.value)
    }
  />
</FormFieldWrapper>
```

This allows text fields to share:

- consistent layout structure
- consistent label rendering
- consistent validation error rendering
- consistent input styling

## Choice Field Group

### Purpose

The choice field group handles backend-driven dropdown field rendering.

It is designed to work with backend field metadata returned from OPTIONS requests.

### Components Included

| Component | Purpose |
|---|---|
| `FormFieldChoice` | Renders reusable choice fields |
| `AppSelect` | Styled reusable select component |

### Supporting Hooks

| Hook | Purpose |
|---|---|
| `useCoreFieldOptions` | Loads backend OPTIONS metadata used to generate field choices |

### Supporting Utilities

| Utility | Purpose |
|---|---|
| `getFieldError` | Extracts and formats field validation errors |

### Usage Example

`FormFieldChoice` combines the shared form field structure with a reusable select component.

Example:

```jsx
<FormFieldChoice
  field={field}
  value={formData[field.name]}
  error={fieldError}
  choices={choices}
  onChange={handleChange}
/>
```

Internally this renders:

```jsx
<FormFieldWrapper
  label={field.label}
  error={error}
>
  <AppSelect
    value={value || ""}
    onChange={(event) =>
      onChange(field.name, event.target.value)
    }
  >
    <option value="">
      Select {field.label}
    </option>

    {choices.map((choice) => (
      <option
        key={choice.value}
        value={choice.value}
      >
        {choice.display_name}
      </option>
    ))}
  </AppSelect>
</FormFieldWrapper>
```

This allows choice fields to share:

- consistent layout structure
- consistent label rendering
- consistent validation error rendering
- reusable dropdown styling
- backend-driven dropdown options

## Boolean Field Group

### Purpose

The boolean field group handles true/false field rendering using reusable switch components.

It keeps boolean field behaviour and styling consistent across forms.

### Components Included

| Component | Purpose |
|---|---|
| `FormFieldBoolean` | Renders reusable boolean fields |
| `AppSwitch` | Styled reusable switch component |

### Supporting Hooks

No dedicated hooks are required for the text field group.

### Supporting Utilities

| Utility | Purpose |
|---|---|
| `getFieldError` | Extracts and formats field validation errors |

### Usage Example

`FormFieldBoolean` combines the shared form field structure with a reusable switch component.

Example:

```jsx
<FormFieldBoolean
  field={field}
  value={formData[field.name]}
  error={fieldError}
  onChange={handleChange}
/>
```

Internally this renders:

```jsx
<FormFieldWrapper
  label={field.label}
  error={error}
>
  <AppSwitch
    checked={value}
    onCheckedChange={(details) =>
      onChange(field.name, details.checked)
    }
  />
</FormFieldWrapper>
```

This allows boolean fields to share:

- consistent layout structure
- consistent label rendering
- consistent validation error rendering
- reusable switch styling
- reusable true/false behaviour

## Relation Field Group

### Purpose

The relation field group handles searchable relation selection workflows.

It supports:

- searchable relation filtering
- multi-select relation fields
- displaying selected relation items
- removing selected relation items

### Components Included

| Component | Purpose |
|---|---|
| `FormFieldRelation` | Main reusable relation field renderer |
| `FormTextInput` | Search input for relation searching |
| `SelectableOptionList` | Displays searchable selectable relation options |
| `SelectedOptionList` | Displays selected relation items |
| `DeleteIconButton` | Removes selected relation items |

### Supporting Hooks

| Hook | Purpose |
|---|---|
| `useDebouncedValue` | Debounces relation search values |
| `useCoreRelationOptions` | Loads relation options from backend endpoints |

### Supporting Utilities

| Utility | Purpose |
|---|---|
| `formatRelationOptions` | Formats relation option display labels |
| `getFieldError` | Extracts and formats field validation errors |
| `getFilteredRelationOptions` | Filters searchable relation options |
| `getSelectedRelationOptions` | Returns selected relation option objects |
| `getUpdatedRelationValues` | Updates selected relation values during toggle actions |

### Usage Example

`FormFieldRelation` combines the shared form field structure with reusable searchable relation selection components.

Example:

```jsx
<FormFieldRelation
  field={field}
  error={fieldError}
  searchValue={searchValue}
  filteredOptions={filteredOptions}
  selectedValues={selectedValues}
  selectedOptions={selectedOptions}
  onSearchChange={handleRelationSearchChange}
  onRelationToggle={handleRelationToggle}
  formatRelationOption={formatRelationOption}
/>
```

Internally this renders:

```jsx
<FormFieldWrapper
  label={field.label}
  error={error}
>
  <FormTextInput
    placeholder={`Search ${field.label.toLowerCase()}...`}
    value={searchValue}
    onChange={(event) =>
      onSearchChange(field.name, event.target.value)
    }
  />

  <SelectableOptionList
    options={filteredOptions}
    field={field}
    selectedValues={selectedValues}
    onSelect={(option) =>
      onRelationToggle(field, option)
    }
    formatOption={(option) =>
      formatRelationOption(option, field)
    }
  />

  <SelectedOptionList
    title={`Selected ${field.label}`}
    options={selectedOptions}
    optionValue={field.optionValue}
    onRemove={(option) =>
      onRelationToggle(field, option)
    }
    formatOption={(option) =>
      formatRelationOption(option, field)
    }
  />
</FormFieldWrapper>
```

This allows relation fields to share:

- consistent layout structure
- consistent label rendering
- consistent validation error rendering
- reusable searchable option lists
- reusable selected item display
- reusable relation selection workflows
- reusable relation removal workflows

## Shared Architectural Principle

```text
Field components render reusable UI.
Renderers decide which field type to display.
Forms orchestrate state and submission behaviour.
Hooks manage backend field data.
Utilities manage pure data transformations.
```

## Supporting Hooks

### Purpose

The form system uses reusable hooks to separate backend field loading and utility behaviour from field rendering.

These hooks are responsible for:

- loading backend field metadata
- loading relation options
- debouncing search values

The hooks do not render UI directly.

### Hooks Included

| Hook | Purpose |
|---|---|
| `useCoreFieldOptions` | Loads backend OPTIONS metadata for create fields |
| `useCoreRelationOptions` | Loads relation field options from backend endpoints |
| `useDebouncedValue` | Debounces relation search input values |

## Supporting Utilities

### Purpose

The form system uses reusable utility functions to separate pure data transformation logic from form rendering and orchestration logic.

These utilities are responsible for:

- generating initial form state
- formatting relation display values
- filtering searchable relation options
- managing selected relation values
- extracting backend validation errors

The utilities do not:

- render UI
- manage React state
- perform API requests
- manage component orchestration

## Utilities Included

| Utility | Purpose |
|---|---|
| `formatRelationOptions` | Formats relation option display labels |
| `getFieldError` | Extracts and formats field validation errors |
| `getFilteredRelationOptions` | Filters searchable relation options |
| `getInitialFormData` | Generates initial form state from configured fields |
| `getSelectedRelationOptions` | Returns selected relation option objects |
| `getUpdatedRelationValues` | Updates selected relation values during toggle actions |
| `parseBackendErrors` | Extracts field and general errors from backend responses |
| `resetModelFilters` | Generates reset filter values for dashboard filters |
