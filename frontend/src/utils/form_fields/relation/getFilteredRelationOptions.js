const getFilteredRelationOptions = ({
  options,
  searchValue,
  field,
  formatOption,
}) => {
  if (!searchValue.trim()) return [];

  return options.filter((option) =>
    formatOption(option, field)
      .toLowerCase()
      .includes(searchValue.toLowerCase())
  );
};

export default getFilteredRelationOptions;
