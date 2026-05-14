import { Box, Heading, Text, Separator } from "@chakra-ui/react";
import useAuth from "../../hooks/UseAuth";

const AccountProfileSection = () => {
  const { user } = useAuth();

  return (
    <Box as="section" bg="bg.surface" p={6}>
      <Heading fontSize="xl" mb={3}>
        Profile Details
      </Heading>

      <Separator mb={4} borderColor="border.muted" />

      <Text fontSize="md">
        <strong>Email:</strong> {user?.email}
      </Text>
    </Box>
  );
};

export default AccountProfileSection;
