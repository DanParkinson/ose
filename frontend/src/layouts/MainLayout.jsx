import { Box } from "@chakra-ui/react";

const MainLayout = ({ children }) => {
    return (
        <Box
            display="flex"
        >
            <Box
                w="100%"
                display="flex"
                flexDirection="column"
                gap={8}
                mx="auto"
                bgGradient="
                    radial-gradient(
                    circle at center,
                    rgba(80, 80, 80, 0.35) 0%,
                    rgba(30, 30, 30, 0.6) 40%,
                    rgba(20, 20, 20, 1) 100%
                    )
                "
            >
                {children}
            </Box>
        </Box>
    )
};

export default MainLayout;
