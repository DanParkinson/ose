import { Box, Center, Heading, VStack } from "@chakra-ui/react";

const WideFormContainer = ({ children }) => {
  return (
    <Box
      mx="auto"
      bg="bg.surface"
    >
      <VStack align="stretch" gap={4}>
        {children}
      </VStack>
    </Box>
  );
};

export default WideFormContainer;
