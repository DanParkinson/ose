import {
  Box,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";

import ChangePasswordForm from "../../components/forms/auth/ChangePasswordForm";
import TabButton from "../../components/buttons/TabButton"; 
import SectionDividerHeading from "../../components/structure/SectionDividerHeading";

const AccountSettingsSection = () => {
  const [activeForm, setActiveForm] = useState("password");

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
              Account Settings
            </Text>

            <Text
              color="text.light4"
              mt={2}
            >
              Manage your account security and preferences.
            </Text>
          </Box>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            gap={4}
          >
            <TabButton
              active={activeForm === "password"}
              onClick={() =>
                setActiveForm("password")
              }
            >
              Change Password
            </TabButton>

            <TabButton
              active={activeForm === "email"}
              onClick={() =>
                setActiveForm("email")
              }
            >
              Change Email
            </TabButton>

            <TabButton
              active={activeForm === "deactivate"}
              onClick={() =>
                setActiveForm("deactivate")
              }
            >
              Deactivate Account
            </TabButton>
          </SimpleGrid>

          <Box>
            {activeForm === "password" && (
                <SectionDividerHeading title="Change Password" />
            )}

            {activeForm === "email" && (
                <SectionDividerHeading title="Change Email" />
            )}

            {activeForm === "deactivate" && (
                <SectionDividerHeading title="Deactivate Account" />
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default AccountSettingsSection;