import { Grid, Box, Text, VStack } from "@chakra-ui/react";

import FilterOptions from "../../filters/FilterOptions";

const DashboardFilterPanel = ({
  filters,
  activeFilters,
  onFilterChange,
}) => {
  return (
    <VStack align="stretch" gap={5}>
      <Text
        fontSize="sm"
        color="text.light1"
        fontWeight="bold"
      >
        FILTER
      </Text>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "1fr",
        }}
        gap={6}
      >
        {filters.map((filter) => (
          <Box
            key={filter.key}
            pb={4}
            borderBottom="1px solid"
            borderColor="border.dark2"
          >
            <Text
              fontSize="sm"
              color="text.light1"
              fontWeight="medium"
              mb={3}
            >
              {filter.title}
            </Text>

            <FilterOptions
              filterKey={filter.key}
              options={filter.options}
              activeFilters={activeFilters}
              onFilterChange={onFilterChange}
            />
          </Box>
        ))}
      </Grid>
    </VStack>
  );
};

export default DashboardFilterPanel;
