const formatRelationOption = (option, field) => {
  if (field.displayFields) {
    return field.displayFields
      .map((displayField) => option[displayField])
      .filter(Boolean)
      .join(" - ");
  }

  if (option.title && option.level && option.language) {
    return `${option.title} - ${option.level} - ${option.language}`;
  }

  return option[field.optionLabel];
};

export default formatRelationOption;
