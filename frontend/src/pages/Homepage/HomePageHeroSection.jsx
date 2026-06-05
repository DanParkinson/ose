import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import logo from "../../assets/images/OSE_logo.png";

const HomePageHeroSection = () => {
  return (
    <Box
      as="section"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      px={4}
      bgGradient="
        radial-gradient(
        circle at center,
        rgba(80, 80, 80, 0.35) 0%,
        rgba(30, 30, 30, 0.6) 40%,
        rgba(20, 20, 20, 1) 100%
        )
      "
    >
      <Box
        maxW="760px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={5}

      >
        <Box
          as="img"
          src={logo}
          alt="Open-Source Education logo"
          w={{ base: "52px", md: "80px" }}
          h="auto"
        />

        <Heading
          fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }}
          lineHeight="1.05"
          fontWeight="bold"
          color="text.light1"
        >
          <Box as="span" color="text.primarylight">
            Open-Source Education.
          </Box>{" "}
          A curriculum for everyone.
        </Heading>

        <Text
          maxW="600px"
          fontSize={{ base: "md", md: "lg", lg: "xl" }}
          lineHeight="1.4"
          fontWeight="medium"
          color="text.light4"
        >
          Free and driven by the teaching community. A modular outlook to speed
          up resource creation.
        </Text>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          color="text.light1"
        >
          Save time. Teach better.
        </Text>

        {/* <Button as={RouterLink} to="/subjects" variant="cta" mt={3}>
          The lesson bank
        </Button> */}
      </Box>
    </Box>
  );
};

export default HomePageHeroSection;
