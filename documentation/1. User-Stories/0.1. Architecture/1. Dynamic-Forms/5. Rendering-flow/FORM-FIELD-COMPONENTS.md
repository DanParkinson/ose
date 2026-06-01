# Field Components

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Component Role](#component-role)
- [Shared Field Structure](#shared-field-structure)
- [Field Wrapper](#field-wrapper)
- [Field Label](#field-label)
- [Field Error](#field-error)
- [Field Type Components](#field-type-components)
- [Text Field](#text-field)
- [Choice Field](#choice-field)
- [Boolean Field](#boolean-field)
- [Relation Field](#relation-field)
- [Relation List Components](#relation-list-components)
- [Component Responsibility Boundary](#component-responsibility-boundary)

## Purpose

Field components are the reusable presentation layer of the dynamic form system.

They are responsible for rendering consistent form UI once `FormFieldRenderer` has selected which field type should be displayed.

Field components do not decide which fields exist.

They receive prepared props and render the correct UI.

## Component Role

The field component layer sits below `FormFieldRenderer`.

```text
FormFieldRenderer
        ↓
Field-specific component
        ↓
Shared field structure
        ↓
Input / selector / switch / relation UI
```

This keeps field rendering consistent across create, update, and future dynamic forms.

## Shared Field Structure

Most field components use the same shared structure:

```text
Label
Input / field content
Error
```

This is handled through:

```text
FormFieldWrapper
FormFieldLabel
FormFieldError
```

The shared structure keeps spacing, labels, and validation display consistent across all field types.

## Field Wrapper

`FormFieldWrapper` provides the shared layout structure for field components.

```jsx
<FormFieldWrapper label={field.label} error={error}>
  {children}
</FormFieldWrapper>
```

It renders:

```text
FormFieldLabel
Field content
FormFieldError
```

This means individual field components do not need to repeat label and error layout logic.

## Field Label

`FormFieldLabel` renders the user-facing field label.

If no label is provided, it returns nothing.

```jsx
if (!children) return null;
```

This keeps label rendering optional and reusable.

## Field Error

`FormFieldError` renders field-level validation errors.

If no error exists, it returns nothing.

```jsx
if (!children) return null;
```

This allows every field component to support validation display without duplicating error rendering logic.

## Field Type Components

The current field type components are:

| Component | Purpose |
|---|---|
| `FormFieldText` | Renders text-based input fields |
| `FormFieldChoice` | Renders backend-driven choice fields |
| `FormFieldBoolean` | Renders true/false switch fields |
| `FormFieldRelation` | Renders searchable relation selection fields |

These components are selected by `FormFieldRenderer`.

## Text Field

`FormFieldText` is used for standard text-based fields.

It is used when:

```text
A field is a standard text input
No specialised field type is required
The renderer falls back to text rendering
```

Text fields still follow the shared field structure.

## Choice Field

`FormFieldChoice` renders dropdown/select fields.

It receives:

```text
field
value
error
choices
onChange
```

Choice values come from backend OPTIONS metadata.

The component maps over the provided `choices` and renders one option per backend choice.

The field component does not fetch choice data itself.

## Boolean Field

`FormFieldBoolean` renders true/false fields using `AppSwitch`.

It receives:

```text
field
value
error
onChange
```

When the switch changes, it passes the updated boolean value back to the parent form.

```js
onChange(field.name, details.checked)
```

The field component does not manage the full form state itself.

## Relation Field

`FormFieldRelation` renders searchable relation fields.

It receives already-prepared relation data from `FormFieldRenderer`.

This includes:

```text
search value
filtered options
selected values
selected options
relation toggle handler
relation search handler
formatting function
```

The component renders:

```text
Search input
Selectable option list
Selected option list
```

Relation field logic is split across supporting utilities so the component can focus on rendering.

## Relation List Components

Relation fields use two supporting list components.

| Component | Purpose |
|---|---|
| `SelectableOptionList` | Displays filtered relation options that can be selected |
| `SelectedOptionList` | Displays currently selected relation options |

### SelectableOptionList

`SelectableOptionList` renders selectable relation results.

It highlights options that are already selected.

It supports both:

```text
single selection
multiple selection
```

based on the field configuration.

### SelectedOptionList

`SelectedOptionList` renders selected relation records.

It allows selected values to be removed through a delete button.

This keeps selected relation display separate from the main relation field wrapper.

## Component Responsibility Boundary

Field components are responsible for:

```text
Rendering UI
Displaying labels
Displaying field errors
Displaying field values
Calling provided handlers
```

Field components are not responsible for:

```text
Fetching backend data
Submitting forms
Parsing backend errors
Choosing which fields exist
Managing parent workflow
```

This keeps the field component layer reusable and presentation-focused.