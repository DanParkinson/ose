import { Box, Text } from "@chakra-ui/react";

const SectionDividerHeading = ({ title }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      gap={4}
      mb={6}
      w="100%"
    >
      <Box flex="1" h="1px" bg="border.dark3" />

      <Text
        px={4}
        py={2}
        border="1px solid"
        borderColor="border.dark1"
        borderRadius="lg"
        color="text.light1"
        bg="bg.dark2"
        fontSize="lg"
        textTransform="capitalize"
      >
        {title}
      </Text>

      <Box flex="1" h="1px" bg="border.dark3" />
    </Box>
  );
};

export default SectionDividerHeading;
