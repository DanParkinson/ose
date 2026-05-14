import { Box, Heading, Text } from "@chakra-ui/react";

const PageHeading = ({ title, description }) => {
  return (
    <Box
      as="section"
      display="flex"
      flexDirection="column"
      alignItems="center"
      px={4}
      pt={{ base: 24, md: 24, lg: 24 }}
      gap={8}
    >
      <Box
        maxW="760px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        textAlign="center"
      >
        <Heading
          fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
          lineHeight="1.05"
          color="text.light1"
          py={2}
        >
          {title}
        </Heading>

        {description && (
          <Text
            maxW="540px"
            color="text.primarylight"
            fontSize={{ base: "sm", md: "md" }}
            fontStyle="italic"
            mt={2}
          >
            {description}
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default PageHeading;
