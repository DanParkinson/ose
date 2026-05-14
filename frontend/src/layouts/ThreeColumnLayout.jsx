import { Box, Grid, GridItem } from "@chakra-ui/react";

const ThreeColumnLayout = ({ children, rightSidebar }) => {
  return (
    <Box py={{ base: 2, md: 4 }}>
      <Grid
        maxW="100%"
        minH="70vh"
        mx="auto"
        px={{ base: 4, md: 8 }}
        templateColumns={{
          base: "1fr",
          lg: "1fr minmax(0, 760px) 1fr",
        }}
        gap={8}
      >
        <GridItem display={{ base: "none", lg: "block" }}>

        </GridItem>

        <GridItem
          maxW="760px" mx="auto" w="100%"
        >
          {children}
        </GridItem>

        <GridItem>
          {rightSidebar}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default ThreeColumnLayout;
