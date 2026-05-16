import { Box, Center, Text } from "@chakra-ui/react";

import DashboardTableHeader from "./DashboardTableHeader";
import DashboardTableRow from "./DashboardTableRow";

import LoadingSpinner from "../../feedback/LoadingSpinner";

const DashboardTable = ({
  columns,
  rows,
  loading,
  templateColumns,
  getRowKey,
  renderRow,
  onRowClick,
  isSelected,
}) => {
  return (
    <Box
      h="100%"
      border="1px solid"
      borderColor="border.dark2"
      borderRadius="md"
      bg="transparent"
      overflow="hidden"
      display="flex"
      flexDirection="column"
      minH={0}
    >
      <DashboardTableHeader
        columns={columns}
        templateColumns={templateColumns}
      />

      <Box
        flex="1"
        minH={0}
        overflowY="auto"
      >
        {loading ? (
          <LoadingSpinner />
        ) : rows.length === 0 ? (
          <Center h="100%" minH="120px">
            <Text color="text.light4">
              No results found.
            </Text>
          </Center>
        ) : (
          rows.map((row, index) => {
            const rowKey = getRowKey?.(row) ?? index;
            const selected = isSelected?.(row);

            return (
              <DashboardTableRow
                key={rowKey}
                row={row}
                templateColumns={templateColumns}
                isSelected={selected}
                onClick={onRowClick}
              >
                {renderRow(row)}
              </DashboardTableRow>
            );
          })
        )}
      </Box>
    </Box>
  );
};

export default DashboardTable;
