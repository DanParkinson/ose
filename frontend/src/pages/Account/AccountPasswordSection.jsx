import { Box, Heading, Separator } from "@chakra-ui/react";
import ChangePasswordForm from "../../components/forms/auth/ChangePasswordForm";

const AccountPasswordSection = () => {
    return (
        <Box as="section" bg="bg.surface" p={6}>
            <Heading fontSize="xl" mb={4}>
                Change Password
            </Heading>

            <Separator mb={4} borderColor="border.muted" />
            <ChangePasswordForm />
        </Box>
    );
};

export default AccountPasswordSection;
