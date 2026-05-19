import { Button } from "@chakra-ui/react";

const DashboardTableButtonRow = ({
  children,
  templateColumns,
  onClick,
}) => {
  return (
    <Button
      variant="dashboardTitleRow"
      gridColumn="1 / -1"
      display="grid"
      gridTemplateColumns={templateColumns}
      alignItems="center"
      gap={4}
      w="100%"
      h="auto"
      py={4}
      px={4}
      bg="transparent"
      justifyContent="stretch"
      textAlign="left"
      fontWeight="normal"
      borderRadius="0"
      _hover={{
        bg: "transparent",
      }}
      _active={{
        bg: "transparent",
      }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default DashboardTableButtonRow;
