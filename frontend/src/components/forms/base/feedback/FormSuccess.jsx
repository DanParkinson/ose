import { Box, Text } from "@chakra-ui/react";

const FormSuccess = ({ children }) => {
    if (!children) return null;

    return (
        <Box
            bg="success.subtle"
            color="text.dark2"
            border="1px solid"
            borderColor="success"
            borderRadius="md"
            px={3}
            py={2}
        >
            <Text fontSize="sm">{ children }</Text>
        </Box>
    );
};

export default FormSuccess
