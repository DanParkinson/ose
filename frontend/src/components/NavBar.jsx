import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import useAuth from "../hooks/useAuth";
import AppLink from "./ui/AppLink";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const isAdmin =
    user?.is_staff === true ||
    user?.is_superuser === true ||
    user?.is_admin === true ||
    user?.admin === true;

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Box
      as="nav"
      position="fixed"
      top="20px"
      insetX="0"
      display="flex"
      justifyContent="center"
      zIndex="sticky"
    >
      <Box
        width="80vw"
        bg="bg.transparentdark"
        backdropFilter="blur(12px)"
        border="1px solid"
        borderColor="border.dark1"
        borderRadius="2xl"
        boxShadow="lg"
        px={{ base: 6, md: 8 }}
        py={2}
      >
        <Flex justify="space-between" align="center" gap={8}>
          <HStack gap={8}>
            <AppLink to="/" variant="brand">
              <Heading fontSize={{ base: "lg", md: "xl" }}>
                OSE
              </Heading>
            </AppLink>
          </HStack>

          <HStack gap={4} display={{ base: "none", lg: "flex" }}>
            {isAdmin && (
              <AppLink to="/dashboard" variant="navbar">
                Dashboard
              </AppLink>
            )}

            <AppLink to="/subjects" variant="navbar">
              Lesson Bank
            </AppLink>

            <AppLink to="/about" variant="navbar">
              About Us
            </AppLink>

            {user ? (
              <AppLink to="/" variant="dangerGhost" onClick={logout}>
                Logout
              </AppLink>
            ) : (
              <AppLink to="/login" variant="navbar">
                Login/Register
              </AppLink>
            )}
          </HStack>

          <IconButton
            display={{ base: "inline-flex", lg: "none" }}
            onClick={toggleMenu}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            variant="ghost"
            color="text.light1"
          >
            {isOpen ? <HiX /> : <HiMenu />}
          </IconButton>
        </Flex>

        {isOpen && (
          <VStack
            align="stretch"
            gap={4}
            mt={4}
            pt={4}
            borderTop="1px solid"
            borderColor="border.dark1"
            display={{ base: "flex", lg: "none" }}
          >

            {isAdmin && (
              <AppLink to="/dashboard" variant="navbar">
                Dashboard
              </AppLink>
            )}
            <AppLink to="/subjects" variant="navbar">
              Lesson Bank
            </AppLink>
            <AppLink to="/about" variant="navbar">
              About Us
            </AppLink>

            {user ? (
              <>
                <AppLink to="/" variant="dangerGhost" onClick={logout}>
                  Logout
                </AppLink>
              </>
            ) : (
              <>
                <AppLink to="/login" variant="navbar">
                  Login
                </AppLink>

                <AppLink to="/register" variant="navbar">
                  Register
                </AppLink>
              </>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
}

export default NavBar;
