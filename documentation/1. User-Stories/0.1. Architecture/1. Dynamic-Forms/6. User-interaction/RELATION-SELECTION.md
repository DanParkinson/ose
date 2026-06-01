# Relation Selection

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Selection State](#selection-state)
- [Selectable Options](#selectable-options)
- [Selected Options](#selected-options)
- [Selection Handler](#selection-handler)
- [Single Selection](#single-selection)
- [Multiple Selection](#multiple-selection)
- [Selection Workflow](#selection-workflow)

## Purpose

Relation selection controls how users select and remove related records inside a dynamic relation field.

The relation field displays selectable options and selected options separately.

This allows users to clearly see:

```text
available matching records
currently selected records
```

## Selection State

Selected relation values are stored inside `formData`.

Example:

```js
{
  subjects: [
    "subject-id-1",
    "subject-id-2"
  ]
}
```

The form stores relation identifiers, not full relation objects.

Full selected objects are calculated separately for rendering.

## Selectable Options

Search results are rendered through:

```text
SelectableOptionList
```

Each selectable option calls:

```js
onSelect(option)
```

which then runs:

```js
onRelationToggle(field, option)
```

Example:

```jsx
<SelectableOptionList
  options={filteredOptions}
  field={field}
  selectedValues={selectedValues}
  onSelect={(option) =>
    onRelationToggle(field, option)
  }
/>
```

## Selected Options

Currently selected records are rendered through:

```text
SelectedOptionList
```

Selected options can be removed using the same toggle handler.

```jsx
<SelectedOptionList
  options={selectedOptions}
  optionValue={field.optionValue}
  onRemove={(option) =>
    onRelationToggle(field, option)
  }
/>
```

Using the same handler for select and remove keeps relation selection behaviour consistent.

## Selection Handler

Relation selection is handled by:

```js
handleRelationToggle
```

Example:

```js
const handleRelationToggle = (field, option) => {
  const updatedValues = getUpdatedRelationValues({
    field,
    option,
    currentValues: formData[field.name] || [],
  });

  handleChange(field.name, updatedValues);
};
```

This handler:

```text
receives the selected option
calculates the next relation value
updates formData through handleChange
clears field-level errors
```

## Single Selection

Single relation fields store one selected value.

Example:

```js
{
  subject: "subject-id-1"
}
```

When a new option is selected, it replaces the previous value.

This behaviour is controlled by:

```js
multiple: false
```

or by omitting `multiple`.

## Multiple Selection

Multiple relation fields store an array of selected values.

Example:

```js
{
  subjects: [
    "subject-id-1",
    "subject-id-2"
  ]
}
```

When an option is selected:

```text
If it is not selected, it is added
If it is already selected, it is removed
```

This creates toggle-style multi-select behaviour.

## Selection Workflow

```text
User clicks relation option
        ↓
SelectableOptionList calls onSelect
        ↓
FormFieldRelation calls onRelationToggle
        ↓
handleRelationToggle runs
        ↓
getUpdatedRelationValues calculates next value
        ↓
handleChange updates formData
        ↓
Selected options are recalculated
        ↓
Relation field rerenders
```

Relation selection keeps stored form values simple while still allowing the UI to display full selected option details.