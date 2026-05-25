import {
  Avatar,
  Box,
  Button,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  HiChevronDown,
  HiCog,
  HiUser,
  HiLogout,
} from "react-icons/hi";

const accountSections = [
  {
    id: "profile",
    title: "Profile",
    icon: HiUser,
  },
  {
    id: "settings",
    title: "Settings",
    icon: HiCog,
  },
  {
    id: "logout",
    title: "Logout",
    icon: HiLogout,
  },
];

const AccountSidebar = ({
  user,
  selectedSection,
  onSelectSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeSection = accountSections.find(
    (section) => section.id === selectedSection
  );

  const ActiveIcon = activeSection?.icon;

  const handleSelect = (sectionId) => {
    onSelectSection(sectionId);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
      <Box display={{ base: "block", lg: "none" }}>
        <Box position="relative" ref={dropdownRef}>
          <Button
            width="100%"
            justifyContent="space-between"
            bg="bg.dark5"
            color="text.light4"
            borderRadius="md"
            fontWeight="semibold"
            border="1px solid"
            borderColor="border.dark2"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <HStack>
              {ActiveIcon && <ActiveIcon />}
              <Text>{activeSection?.title}</Text>
            </HStack>

            <HiChevronDown />
          </Button>

          {isOpen && (
            <Box
              position="absolute"
              top="calc(100% + 8px)"
              left="0"
              right="0"
              zIndex="dropdown"
              border="1px solid"
              borderColor="border.dark1"
              borderRadius="lg"
              bg="bg.dark4"
              boxShadow="lg"
              overflow="hidden"
            >
              <Stack gap={0} p={2}>
                {accountSections.map((section) => {
                  const isActive =
                    selectedSection === section.id;
                  const SectionIcon = section.icon;

                  return (
                    <Button
                      key={section.id}
                      width="100%"
                      justifyContent="flex-start"
                      variant="ghost"
                      borderRadius="0"
                      px={5}
                      py={5}
                      borderLeft="4px solid"
                      borderLeftColor={
                        isActive
                          ? "bg.primarylight"
                          : "transparent"
                      }
                      bg={
                        isActive
                          ? "bg.dark3"
                          : "transparent"
                      }
                      color={
                        isActive
                          ? "text.light1"
                          : "text.light4"
                      }
                      onClick={() =>
                        handleSelect(section.id)
                      }
                    >
                      <HStack>
                        <SectionIcon />
                        <Text>{section.title}</Text>
                      </HStack>
                    </Button>
                  );
                })}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>

      <Box
        display={{ base: "none", lg: "block" }}
        border="1px solid"
        borderColor="border.dark1"
        borderRadius="lg"
        overflow="hidden"
        bg="bg.transparentdark"
      >
        <Box
          px={6}
          py={6}
          borderBottom="1px solid"
          borderColor="border.dark1"
        >
          <VStack gap={3}>
            <Avatar.Root size="xl">
              <Avatar.Fallback
                name={user?.email}
              />
            </Avatar.Root>

            <Text
              color="text.light4"
              fontSize="sm"
              textAlign="center"
            >
              {user?.email || "Loading..."}
            </Text>
          </VStack>
        </Box>

        <Stack gap={0}>
          {accountSections.map((section) => {
            const isActive =
              selectedSection === section.id;
            const SectionIcon = section.icon;

            return (
              <Box
                key={section.id}
                px={3}
                py={2}
                borderLeft="4px solid"
                borderLeftColor={
                  isActive
                    ? "bg.primarylight"
                    : "transparent"
                }
                bg={
                  isActive
                    ? "bg.dark2"
                    : "transparent"
                }
              >
                <Button
                  variant="dashboardTitleRow"
                  width="100%"
                  borderRadius="md"
                  px={3}
                  py={3}
                  justifyContent="flex-start"
                  color={
                    isActive
                      ? "text.light1"
                      : "text.light4"
                  }
                  onClick={() =>
                    onSelectSection(section.id)
                  }
                >
                  <HStack>
                    <SectionIcon />
                    <Text>{section.title}</Text>
                  </HStack>
                </Button>
              </Box>
            );
          })}
        </Stack>
      </Box>
    </>
  );
};

export default AccountSidebar;