import { Box, Text } from "@chakra-ui/react";

function Footer() {
  return (
    <Box
      as="footer"
      bg="bg.dark1"
      color="text.light2"
      textAlign="center"
      py={6}
      boxShadow="topSm"
    >
      <Text fontSize="md">
        © {new Date().getFullYear()} Open Source Education. All rights reserved.
      </Text>
    </Box>
  );
}

export default Footer;
