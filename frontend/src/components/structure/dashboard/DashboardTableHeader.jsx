import { Grid, Text } from "@chakra-ui/react";

const DashboardTableHeader = ({
  columns,
  templateColumns,
}) => {
  return (
    <Grid
      templateColumns={templateColumns}
      gap={4}
      px={4}
      py={3}
      bg="bg.dark5"
      borderBottom="1px solid"
      borderColor="border.dark2"
    >
      {columns.map((column) => (
        <Text
          key={column}
          fontSize="xs"
          color="text.light4"
          fontWeight="bold"
        >
          {column}
        </Text>
      ))}
    </Grid>
  );
};

export default DashboardTableHeader;
