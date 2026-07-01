import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

const RateLimitBanner = () => {
  const [message, setMessage] = useState(null);

    useEffect(() => {
        const handleRateLimit = (event) => {
        setMessage(event.detail?.message || "Too many requests.");
        };

        window.addEventListener("api-rate-limit", handleRateLimit);

        return () => {
        window.removeEventListener("api-rate-limit", handleRateLimit);
        };
    }, []);

    const getRateLimitMessage = () => {
        if (!message) {
            return null;
        }

        const timeRemaining = message.match(/(\d+)\s*seconds?/i);

        if (!timeRemaining) {
            return "To keep our website free, we limit the number of requests that can be made in a short period. Please try again later.";
        }
        const retryAfterMinutes = Math.ceil(Number(timeRemaining[1]) / 60);

        return `To keep our website free, we limit the number of requests that can be made in a short period. Please try again in ${retryAfterMinutes} ${
                retryAfterMinutes === 1 ? "minute" : "minutes"
        }.`;
    };

    if (!message) {
        return null;
    }

    return (
        <Box
        position="fixed"
        top={{ base: "88px", md: "92px" }}
        insetX="0"
        display="flex"
        justifyContent="center"
        zIndex="banner"
        px={4}
        pointerEvents="none"
        >
        <Box
            data-testid="rate-limit-banner"
            width={{ base: "calc(100vw - 2rem)", md: "80vw" }}
            maxW="900px"
            bg="warning.subtle"
            color="warning.contrast"
            border="1px solid"
            borderColor="warning"
            borderRadius="xl"
            boxShadow="lg"
            px={{ base: 4, md: 6 }}
            py={3}
            pointerEvents="auto"
        >
            <Text fontWeight="bold">
            Request limit reached
            </Text>

            <Text fontSize="sm">
                {getRateLimitMessage()}
            </Text>
        </Box>
        </Box>
    );
};

export default RateLimitBanner;
