import { Box, Grid, GridItem, Heading, Text } from "@chakra-ui/react";
import AppLink from "../components/ui/AppLink";

const AuthSplitLayout = ({ children }) => {
  return (
    <Grid
      minH="100vh"
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
    >
      {/* LEFT SIDE */}
      <GridItem
        position="relative"
        bg="bg.dark3"
      >

        {/* LOGO SECTION */}
        <Box
          position="absolute"
          px={10}
          py={10}
          display="flex"
          alignItems="center"
        >
            <AppLink to="/" Variant="brand">
                <Heading fontSize="2xl">
                    Open-Source Education
                </Heading>
            </AppLink>
        </Box>

        <Box
          h="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          px={6}
        >
          {children}
        </Box>
      </GridItem>

      <GridItem
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bg="bg.primarydark"
        px={12}
        py={12}
        textAlign="center"
        color="text.light1"
      >
        <Heading fontSize="3xl" mb={4}>
          Save time. Teach better.
        </Heading>

        <Text fontSize="lg">
          Providing structured lessons, personalised to you.
        </Text>

        <Text fontSize="md" color="text.light3">
          Built by educators, for educators. Open-source and free to use.
        </Text>
      </GridItem>
    </Grid>
  );
};

export default AuthSplitLayout;
