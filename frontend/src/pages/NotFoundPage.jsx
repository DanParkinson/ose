import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

const NotFoundPage = () => {
  return (
    <MainLayout>
      <Box
        minH="90vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={6}
      >
        <VStack gap={8} textAlign="center" maxW="600px">
          <Text
            fontSize={{ base: "6xl", md: "8xl" }}
            fontWeight="bold"
            color="text.primarylight"
            lineHeight="1"
          >
            404
          </Text>

          <VStack gap={3}>
            <Heading
              size={{ base: "lg", md: "xl" }}
              color="text.light1"
            >
              Page not found
            </Heading>

            <Text
              color="text.light3"
              fontSize={{ base: "md", md: "lg" }}
            >
              The page you're looking for doesn't exist,
              may have been moved, or the link is incorrect.
            </Text>
          </VStack>

          <HStack gap={4} flexWrap="wrap" justify="center">
            <Button
              as={RouterLink}
              to="/"
              variant="primary"
            >
              Go Home
            </Button>
          </HStack>
        </VStack>
      </Box>
    </MainLayout>
  );
};

export default NotFoundPage;