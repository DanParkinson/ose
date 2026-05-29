import {
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";

import LogoutForm from "../../components/forms/auth/LogoutForm";

const AccountLogoutSection = () => {
  return (
    <Box>
      <Box
        border="1px solid"
        borderColor="border.dark1"
        borderRadius="lg"
        bg="bg.transparentdark"
        p={6}
      >
        <Stack gap={6}>
          <Box>
            <Text
              color="text.light1"
              fontSize="2xl"
              fontWeight="bold"
            >
              Logout
            </Text>

            <Text
              color="text.light4"
              mt={2}
            >
              End your current session and return to the homepage.
            </Text>
          </Box>

          <Box>
            <LogoutForm />

            <Text
              mt={2}
              color="text.light4"
              fontSize="sm"
            >
              You can log back in at any time using your email address and password.
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountLogoutSection;