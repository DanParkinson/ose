import {
  Box,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";

import SectionDividerHeading from "../../components/structure/SectionDividerHeading";

const AccountProfileSection = ({ user }) => {
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
              Account Profile
            </Text>

            <Text
              color="text.light4"
              mt={2}
            >
              View your account information and profile details.
            </Text>
          </Box>

          <Box>
            <Text
              mb={2}
              color="text.light3"
              fontWeight="medium"
            >
              Email
            </Text>

            <Input
              value={user?.email || ""}
              bg="bg.dark2"
              color="text.light1"
              borderColor="border.dark1"
              disabled
            />

            <Text
              mt={2}
              color="text.light4"
              fontSize="sm"
            >
              Visit the Settings section to change your email address.
            </Text>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountProfileSection;