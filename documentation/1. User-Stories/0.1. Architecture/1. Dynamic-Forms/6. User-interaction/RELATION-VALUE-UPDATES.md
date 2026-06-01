# Relation Value Updates

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [Why Value Updates Are Separate](#why-value-updates-are-separate)
- [getUpdatedRelationValues](#getupdatedrelationvalues)
- [Option Identifier](#option-identifier)
- [Single Relation Updates](#single-relation-updates)
- [Multiple Relation Updates](#multiple-relation-updates)
- [Form State Relationship](#form-state-relationship)
- [Example Utility](#example-utility)

## Purpose

Relation value updates control how selected relation values are added, removed, or replaced inside form state.

The update logic is separated into a utility so relation selection behaviour remains reusable across create and update forms.

## Why Value Updates Are Separate

Relation fields need different update behaviour depending on whether the field supports:

```text
Single selection
Multiple selection
```

Instead of placing this logic inside the component, the form uses a dedicated utility.

This keeps relation components focused on rendering and interaction, while the utility handles value transformation.

## getUpdatedRelationValues

The current system uses:

```js
getUpdatedRelationValues()
```

Example usage:

```js
const updatedValues = getUpdatedRelationValues({
  field,
  option,
  currentValues: formData[field.name] || [],
});
```

The utility receives:

| Parameter | Purpose |
|---|---|
| `field` | Relation field configuration |
| `option` | Selected relation option |
| `currentValues` | Current stored relation values |

## Option Identifier

The utility extracts the selected option identifier using:

```js
const optionId = option[field.optionValue];
```

The `optionValue` property comes from the relation field configuration.

Example:

```js
optionValue: "subject_id"
```

This keeps the utility reusable across different relation types.

## Single Relation Updates

If the relation field does not support multiple selection:

```js
if (!field.multiple) {
  return optionId;
}
```

The selected option replaces the previous value.

Example result:

```js
{
  subject: "subject-id-1"
}
```

Single relation fields store one selected identifier.

## Multiple Relation Updates

If the relation field supports multiple selection, the utility checks whether the selected option is already stored.

```js
const isSelected = currentValues.includes(optionId);
```

If the option is already selected, it is removed.

```js
currentValues.filter((value) => value !== optionId)
```

If the option is not selected, it is added.

```js
[...currentValues, optionId]
```

This creates toggle-style relation selection.

## Form State Relationship

After the utility calculates the updated values, the form updates `formData` through `handleChange`.

```js
handleChange(field.name, updatedValues);
```

This keeps relation updates consistent with standard field changes.

The same update path also clears field-level validation errors.

## Example Utility

```js
const getUpdatedRelationValues = ({
  field,
  option,
  currentValues,
}) => {
  const optionId = option[field.optionValue];

  if (!field.multiple) {
    return optionId;
  }

  const isSelected =
    currentValues.includes(optionId);

  return isSelected
    ? currentValues.filter(
        (value) => value !== optionId
      )
    : [...currentValues, optionId];
};

export default getUpdatedRelationValues;
```

The utility keeps relation value transformation separate from rendering and form submission.