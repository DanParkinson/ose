export const buildResetFilters = (filters = []) => {
  const resetFilters = {};

  filters.forEach((filter) => {
    resetFilters[filter.key] = "all";
  });

  return resetFilters;
};
