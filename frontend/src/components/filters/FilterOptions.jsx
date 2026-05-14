import { HStack, Text } from "@chakra-ui/react";

import AppRadioIndicator from "../ui/AppRadioIndicator";

const FilterOptions = ({
  filterKey,
  options,
  activeFilters,
  onFilterChange,
}) => {
  const activeValue = activeFilters[filterKey] ?? "all";

  return (
    <HStack
      align="center"
      gap={4}
      mt={2}
      wrap="wrap"
    >
      {options.map((option) => {
        const isActive = activeValue === option.value;

        return (
          <HStack
            key={String(option.value)}
            as="button"
            type="button"
            gap={2}
            cursor="pointer"
            onClick={() =>
              onFilterChange(filterKey, option.value)
            }
          >
            <AppRadioIndicator
              borderColor={
                isActive
                  ? "text.primarylight"
                  : "text.light4"
              }
              bg={
                isActive
                  ? "text.primarylight"
                  : "transparent"
              }
            />

            <Text
              fontSize="sm"
              color={
                isActive
                  ? "text.primarylight"
                  : "text.light4"
              }
            >
              {option.label}
            </Text>
          </HStack>
        );
      })}
    </HStack>
  );
};

export default FilterOptions;
