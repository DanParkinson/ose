import { Grid } from "@chakra-ui/react";

const DashboardTableRow = ({
  row,
  templateColumns,
  isSelected,
  onClick,
  children,
}) => {
  return (
    <Grid
      templateColumns={templateColumns}
      gap={4}
      px={4}
      py={3}
      cursor={onClick ? "pointer" : "default"}
      bg={isSelected ? "bg.dark3" : "bg.dark2"}
      borderBottom="1px solid"
      borderColor="border.dark2"
      borderLeft="3px solid"
      borderLeftColor={isSelected ? "text.primarylight" : "transparent"}
      transition="all 0.2s ease"
      _hover={
        onClick
          ? {
              bg: "bg.dark3",
              borderLeftColor: "text.primarylight",
            }
          : undefined
      }
      onClick={() => onClick?.(row)}
    >
      {children}
    </Grid>
  );
};

export default DashboardTableRow;
