import { Box, Grid, GridItem } from "@chakra-ui/react";

const AccountLayout = ({ sidebar, children }) => {
  return (
    <Box px={{ base: 4, md: 8 }} py={8}>
      <Grid
        templateColumns={{ base: "1fr", lg: "400px 1fr" }}
        gap={6}
        maxW="1500px"
        mx="auto"
      >
        <GridItem>{sidebar}</GridItem>

        <GridItem>{children}</GridItem>
      </Grid>
    </Box>
  );
};

export default AccountLayout;