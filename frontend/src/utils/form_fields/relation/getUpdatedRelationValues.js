const getUpdatedRelationValues = ({
  field,
  option,
  currentValues,
}) => {
  const optionId = option[field.optionValue];

  if (!field.multiple) {
    return optionId;
  }

  const isSelected = currentValues.includes(optionId);

  return isSelected
    ? currentValues.filter((value) => value !== optionId)
    : [...currentValues, optionId];
};

export default getUpdatedRelationValues;
