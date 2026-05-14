import { Box } from "@chakra-ui/react";

import DashboardTableHeader from "./DashboardTableHeader";
import DashboardTableRow from "./DashboardTableRow";

const DashboardTable = ({
  columns,
  rows,
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
        {rows.map((row, index) => {
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
        })}
      </Box>
    </Box>
  );
};

export default DashboardTable;
