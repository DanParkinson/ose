import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import FormSubmitButton from "../components/forms/base/FormSubmitButton";
import MainLayout from "../layouts/MainLayout";
import PageHeading from "../components/structure/PageHeading";

const NotFoundPage = () => {
  return (
    <MainLayout>
      <PageHeading
        title="404"
        description="The page you’re looking for doesn’t exist or may have been moved."
      />
    <Box
      display="flex"
      justifyContent="center"
      bg="bg.canvas"
      px={6}
      py={12}
      h="55vh"

    >
        <Button as={RouterLink} to="/" variant="primary">
          Go Home
        </Button>
      </Box>
    </MainLayout>
  );
};

export default NotFoundPage;
