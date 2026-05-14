import { Box } from "@chakra-ui/react";

const AccountLayout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="bg.canvas"
      px={6}
      py={10}
      display="flex"
      justifyContent="center"
    >
      {/* MAIN */}
      <Box
        w="100%"
        maxW="700px"
        display="flex"
        flexDirection="column"
        gap={8}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AccountLayout;
