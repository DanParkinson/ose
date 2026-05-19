const getInitialFormData = (fields, existingData = null) => {
  const initialData = {};

  fields.forEach((field) => {
    if (existingData && existingData[field.name] !== undefined) {
      initialData[field.name] = existingData[field.name];
    } else if (field.type === "boolean") {
      initialData[field.name] = false;
    } else if (field.type === "relation") {
      initialData[field.name] = field.multiple ? [] : "";
    } else {
      initialData[field.name] = "";
    }
  });

  return initialData;
};

export default getInitialFormData;
