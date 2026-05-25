import { Box, Center, Heading, VStack } from "@chakra-ui/react";

const FormContainer = ({ title, children }) => {
  return (
    <Box
      maxW="400px"
      mx="auto"
      py={10}
      px={6}
      borderRadius="lg"
    >
      <VStack align="stretch" gap={4}>
        {title && (
          <Heading size="2xl" color="text.light1" textAlign="center">
            {title}
          </Heading>
        )}

        {children}
      </VStack>
    </Box>
  );
};

export default FormContainer;
