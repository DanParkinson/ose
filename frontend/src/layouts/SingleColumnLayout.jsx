import { Box } from "@chakra-ui/react";

const SingleColumnLayout = ({ children }) => {
  return (
    <Box py={{ base: 2, md: 4 }}>
      <Box
        w="100%"
        minH="70vh"
        mx="auto"
        px={{ base: 4, md: 8, lg: 12 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SingleColumnLayout;
