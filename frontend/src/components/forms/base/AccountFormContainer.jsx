import { Box, Center, Heading, VStack } from "@chakra-ui/react";

const AccountFormContainer = ({ children }) => {
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

export default AccountFormContainer;
