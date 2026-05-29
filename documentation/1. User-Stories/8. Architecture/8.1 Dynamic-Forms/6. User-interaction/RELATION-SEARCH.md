# Relation Search

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Relation Search Is Needed](#why-relation-search-is-needed)
- [Search State](#search-state)
- [Search Input](#search-input)
- [Debounced Search](#debounced-search)
- [Filtering Options](#filtering-options)
- [Search Workflow](#search-workflow)

## Purpose

Relation search allows users to search through loaded relation options before selecting a related record.

This is useful when a relation field has many possible options.

The search workflow keeps relation fields usable without displaying every available option at once.

## Why Relation Search Is Needed

Relation fields load real backend records.

As the number of records grows, displaying every option immediately becomes difficult to use.

Relation search allows the user to:

```text
Type a search value
Filter matching relation options
Select the correct related record
```

This keeps relation fields scalable and easier to navigate.

## Search State

Relation search values are stored separately from normal form data.

```js
const [relationSearch, setRelationSearch] =
  useState({});
```

This is because search input values are only used for filtering visible options.

They are not submitted to the backend as part of the form payload.

## Search Input

`FormFieldRelation` renders a search input.

```jsx
<FormFieldText
  placeholder={`Search ${field.label.toLowerCase()}...`}
  value={searchValue}
  onChange={(event) =>
    onSearchChange(field.name, event.target.value)
  }
/>
```

When the user types, the relation search value updates for that field.

```js
const handleRelationSearchChange = (name, value) => {
  setRelationSearch((prev) => ({
    ...prev,
    [name]: value,
  }));
};
```

Search values are stored by field name so multiple relation fields can manage their own search state.

## Debounced Search

Relation search uses debounced values.

```js
const debouncedSearch =
  useDebouncedValue(relationSearch, 500);
```

The visible input updates immediately, but filtering uses the delayed value.

This separates:

```text
Immediate typing state
Delayed filtering state
```

and prevents unnecessary filtering on every keystroke.

## Filtering Options

Filtered options are calculated using:

```js
getFilteredRelationOptions()
```

Example:

```js
const filteredOptions =
  getFilteredRelationOptions({
    options,
    searchValue: debouncedValue,
    field,
    formatOption: formatRelationOption,
  });
```

The utility filters loaded relation options by comparing the formatted relation label with the search value.

If no search value exists, no options are returned.

This prevents the relation field from displaying every available record by default.

## Search Workflow

```text
User types into relation search input
        ↓
relationSearch updates immediately
        ↓
useDebouncedValue delays the search value
        ↓
FormFieldRenderer reads debounced value
        ↓
getFilteredRelationOptions filters loaded options
        ↓
FormFieldRelation receives filtered options
        ↓
SelectableOptionList renders matching results
```

The relation search system keeps search state, filtering logic, and rendering separate.