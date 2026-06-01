# Relation Option Loading

## Navigation

[← Back to README.md](/README.md)

## Table of Contents

- [Purpose](#purpose)
- [useCoreRelationOptions](#usecorerelationoptions)
- [Field Detection](#field-detection)
- [Endpoint Requests](#endpoint-requests)
- [Stored Options](#stored-options)
- [Error Handling](#error-handling)
- [Dynamic Form Relationship](#dynamic-form-relationship)
- [Example Hook](#example-hook)

## Purpose

Relation option loading is responsible for fetching selectable relation records for dynamic relation fields.

Relation fields do not use static choices.

Instead, they load real backend records from the endpoint defined in the field configuration.

## useCoreRelationOptions

The current system uses:

```js
useCoreRelationOptions(fields)
```

The hook receives the form field configuration and returns loaded relation options.

Example usage:

```js
const relationOptions =
  useCoreRelationOptions(model.createFields);
```

## Field Detection

The hook detects relation fields by filtering for:

```js
field.type === "relation"
```

Only relation fields need option loading.

Text, choice, and boolean fields are ignored by this hook.

## Endpoint Requests

Each relation field must define its own endpoint.

Example:

```js
{
  name: "subjects",
  type: "relation",
  endpoint: "/core/subjects/",
}
```

The hook uses this endpoint to request selectable records.

```js
const data = await fetchCoreModelList({
  endpoint: field.endpoint,
  limit: 100,
  offset: 0,
});
```

## Stored Options

Loaded relation options are stored by field name.

Example:

```js
loadedRelations[field.name] = data.results || data;
```

This produces a structure like:

```js
{
  subjects: [
    {
      subject_id: "uuid",
      title: "Mathematics",
    },
  ],
}
```

The field name is used later to retrieve the correct option list.

## Error Handling

If relation option loading fails, the hook stores an empty array for that field.

```js
loadedRelations[field.name] = [];
```

This prevents the form from crashing if a relation endpoint fails.

The error is also logged for debugging.

## Dynamic Form Relationship

Dynamic forms pass relation options into the renderer.

```jsx
<FormFieldRenderer
  relationOptions={relationOptions}
/>
```

The renderer can then access relation options using:

```js
relationOptions[field.name]
```

This keeps relation loading separate from rendering and interaction logic.

## Example Hook

```js
const useCoreRelationOptions = (fields) => {
  const [relationOptions, setRelationOptions] =
    useState({});

  useEffect(() => {
    const fetchRelations = async () => {
      const relationFields = fields.filter(
        (field) => field.type === "relation"
      );

      const loadedRelations = {};

      for (const field of relationFields) {
        try {
          const data = await fetchCoreModelList({
            endpoint: field.endpoint,
            limit: 100,
            offset: 0,
          });

          loadedRelations[field.name] =
            data.results || data;
        } catch (error) {
          console.error(error);
          loadedRelations[field.name] = [];
        }
      }

      setRelationOptions(loadedRelations);
    };

    fetchRelations();
  }, [fields]);

  return relationOptions;
};
```