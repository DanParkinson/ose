import { Box, Text } from "@chakra-ui/react";

const FormError = ({ children }) => {
    if (!children) return null;

    return (
        <Box
            bg="error.subtle"
            color="text.dark1"
            border="1px solid"
            borderColor="error"
            borderRadius="md"
            px={3}
            py={2}
        >
            <Text fontSize="sm">{ children }</Text>
        </Box>
    );
};

export default FormError
