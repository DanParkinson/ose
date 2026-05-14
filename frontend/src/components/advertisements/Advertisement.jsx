import { Box, Text } from "@chakra-ui/react";

const Advertisement = () => {
  return (
    <Box
        minH={{ base: "120px", md: "160px", lg: "450px" }}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      bg="white"
      p={4}
    >
      <Text fontSize="sm" color="gray.500" textAlign="center">
        Advertisement
      </Text>
    </Box>
  );
};

export default Advertisement;
