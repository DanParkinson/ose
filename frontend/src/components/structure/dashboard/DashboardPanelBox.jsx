import { Box } from "@chakra-ui/react";

import DashboardTableHeader from "./DashboardTableHeader";

const DashboardPanelBox = ({
  title,
  children,
}) => {
  return (
    <Box
      h="100%"
      border="1px solid"
      borderColor="border.dark2"
      borderRadius="md"
      bg="transparent"
    >
      <DashboardTableHeader
        columns={[title]}
        templateColumns="1fr"
      />

      <Box p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default DashboardPanelBox;
