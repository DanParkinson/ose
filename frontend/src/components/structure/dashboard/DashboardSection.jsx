import { Box, VStack } from "@chakra-ui/react";

const DashboardSection = ({ children }) => {
  return (
    <Box w="100%" h="100%">
      <VStack
        align="stretch"
        gap={5}
        h="100%"
      >
        {children}
      </VStack>
    </Box>
  );
};

export default DashboardSection;
