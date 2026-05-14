const getSelectedRelationOptions = ({
  options,
  selectedValues,
  optionValue,
  multiple = false,
}) => {
  if (multiple) {
    return options.filter((option) =>
      selectedValues.includes(option[optionValue])
    );
  }

  return options.filter(
    (option) => option[optionValue] === selectedValues
  );
};

export default getSelectedRelationOptions;
