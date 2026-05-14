import { Box, Grid, VStack } from "@chakra-ui/react";

const DashboardLayout = ({
  orchestrator,
  filters,
  main,
  pagination,
}) => {
  return (
    <Box
      w="100%"
      px={{ base: 4, md: 8 }}
      py={4}
    >
      <Grid
        templateColumns={{
          base: "1fr",
          lg: "320px 1fr",
        }}
        gap={4}
        alignItems="start"
      >
        <VStack align="stretch" gap={4}>
          <Box h="320px">
            {orchestrator}
          </Box>

          <Box h="240px">
            {filters}
          </Box>

          <Box h="180px">
            {pagination}
          </Box>
        </VStack>

        <Box minH={0} overflow="hidden">
          {main}
        </Box>
      </Grid>
    </Box>
  );
};

export default DashboardLayout;
