import {
  Avatar,
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
  const { user } = useAuth();

  const isAdmin =
    user?.is_staff === true ||
    user?.is_superuser === true ||
    user?.is_admin === true ||
    user?.admin === true;

  const closeMenu = () => {
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const renderPublicLinks = (handleClick) => (
    <>
      <AppLink to="/subjects" variant="navbar" onClick={handleClick}>
        Lesson Bank
      </AppLink>

      <AppLink to="/about" variant="navbar" onClick={handleClick}>
        About Us
      </AppLink>
    </>
  );

  const renderAdminLinks = (handleClick) =>
    isAdmin ? (
      <AppLink to="/dashboard" variant="navbar" onClick={handleClick}>
        Dashboard
      </AppLink>
    ) : null;

  const renderGuestLinks = (handleClick) =>
    !user ? (
      <>
        <AppLink to="/login" variant="navbar" onClick={handleClick}>
          Login
        </AppLink>

        <AppLink to="/register" variant="navbar" onClick={handleClick}>
          Register
        </AppLink>
      </>
    ) : null;

  const renderAccountLink = (handleClick) =>
    user ? (
      <AppLink to="/account" variant="navbar" onClick={handleClick}>
        My Account
      </AppLink>
    ) : null;

  return (
    <>
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
              {renderAdminLinks()}
              {renderPublicLinks()}

              {user ? (
                <AppLink to="/account">
                  <Avatar.Root size="sm">
                    <Avatar.Fallback />
                  </Avatar.Root>
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
        </Box>
      </Box>

      {isOpen && (
        <Box
          position="fixed"
          inset="0"
          minH="100vh"
          bg="bg.dark1"
          zIndex="modal"
          display={{ base: "flex", lg: "none" }}
          flexDirection="column"
          px={8}
          py={8}
        >
          <Flex justify="space-between" align="center">
            <AppLink to="/" variant="brand" onClick={closeMenu}>
              <Heading fontSize="xl">OSE</Heading>
            </AppLink>

            <IconButton
              onClick={closeMenu}
              aria-label="Close menu"
              variant="ghost"
              color="text.light1"
            >
              <HiX />
            </IconButton>
          </Flex>

          <VStack align="stretch" gap={6} mt={12}>
            {renderAdminLinks(closeMenu)}
            {renderPublicLinks(closeMenu)}

            {user
              ? renderAccountLink(closeMenu)
              : renderGuestLinks(closeMenu)}
          </VStack>
        </Box>
      )}
    </>
  );
}

export default NavBar;
