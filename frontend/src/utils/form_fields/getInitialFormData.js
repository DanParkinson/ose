const getInitialFormData = (fields) => {
  const initialData = {};

  fields.forEach((field) => {
    if (field.type === "boolean") {
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
