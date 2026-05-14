import { Box, Heading, Separator } from "@chakra-ui/react";
import DeactivateAccountForm from "../../components/forms/auth/DeactivateAccountForm";

const AccountDeactivateSection = () => {
    return (
        <Box as="section" bg="bg.surface" p={6}>
            <Heading fontSize="xl" mb={4}>
                Deactivate Account
            </Heading>

            <Separator mb={4} borderColor="border.muted" />
            <DeactivateAccountForm />
        </Box>
    );
};

export default AccountDeactivateSection;
