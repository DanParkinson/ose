# Relation Field Rendering

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Relation Rendering Is Separate](#why-relation-rendering-is-separate)
- [Renderer Preparation](#renderer-preparation)
- [FormFieldRelation](#formfieldrelation)
- [Search Input](#search-input)
- [Selectable Options](#selectable-options)
- [Selected Options](#selected-options)
- [Single and Multiple Selection](#single-and-multiple-selection)
- [Rendering Workflow](#rendering-workflow)

## Purpose

Relation field rendering controls how searchable relation fields are displayed inside dynamic forms.

Relation fields are more complex than standard text, choice, or boolean fields because they need to display:

```text
Search input
Filtered selectable options
Current selected values
Remove selected option actions
```

## Why Relation Rendering Is Separate

Relation fields rely on several prepared values before they can render.

They need:

```text
Loaded relation options
Formatted option labels
Filtered search results
Current selected values
Selected option objects
Relation toggle handlers
Search handlers
```

Because of this, relation rendering is separated from the simpler field types.

## Renderer Preparation

`FormFieldRenderer` prepares relation-specific data before rendering `FormFieldRelation`.

It prepares:

```text
options
selectedValues
selectedOptions
searchValue
debouncedValue
filteredOptions
```

Example:

```js
const options = relationOptions[field.name] || [];
const selectedValues = formData[field.name] || [];

const selectedOptions = getSelectedRelationOptions({
  options,
  selectedValues,
  optionValue: field.optionValue,
  multiple: field.multiple,
});

const searchValue = relationSearch[field.name] || "";
const debouncedValue = debouncedSearch[field.name] || "";

const filteredOptions = getFilteredRelationOptions({
  options,
  searchValue: debouncedValue,
  field,
  formatOption: formatRelationOption,
});
```

This keeps preparation logic outside the visual field component.

## FormFieldRelation

`FormFieldRelation` receives prepared relation data and renders the relation UI.

```jsx
<FormFieldRelation
  field={field}
  error={fieldError}
  searchValue={searchValue}
  filteredOptions={filteredOptions}
  selectedValues={selectedValues}
  selectedOptions={selectedOptions}
  onSearchChange={onRelationSearchChange}
  onRelationToggle={onRelationToggle}
  formatRelationOption={formatRelationOption}
/>
```

The component renders inside the shared field wrapper.

```text
FormFieldWrapper
    ↓
Search input
    ↓
Selectable option list
    ↓
Selected option list
```

## Search Input

Relation fields include a search input.

```jsx
<FormFieldText
  placeholder={`Search ${field.label.toLowerCase()}...`}
  value={searchValue}
  onChange={(event) =>
    onSearchChange(field.name, event.target.value)
  }
/>
```

The search input updates relation search state in the parent form.

The field component does not store search state itself.

## Selectable Options

Filtered relation options are displayed using:

```text
SelectableOptionList
```

This component displays options that match the current search value.

Each option can be clicked to update the selected relation values.

```jsx
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
```

## Selected Options

Currently selected options are displayed using:

```text
SelectedOptionList
```

This component displays the full selected option objects instead of only stored IDs.

```jsx
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
```

Removing an option uses the same relation toggle handler as selecting an option.

## Single and Multiple Selection

Relation rendering supports both single and multiple selection through field configuration.

```js
multiple: true
```

For multiple selections:

```text
selectedValues is an array
```

For single selections:

```text
selectedValues is a single value
```

The list components rely on the field configuration to determine whether an option is already selected.

## Rendering Workflow

```text
Relation field detected
        ↓
Loaded options retrieved
        ↓
Selected values retrieved from formData
        ↓
Selected option objects calculated
        ↓
Search value retrieved
        ↓
Options filtered using debounced search
        ↓
FormFieldRelation renders
        ↓
Selectable options display
        ↓
Selected options display
```

This keeps relation rendering predictable while allowing relation fields to remain reusable across different forms and resources.