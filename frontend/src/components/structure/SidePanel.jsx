import { Box, Button, HStack, Text } from "@chakra-ui/react";

const SidePanel = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      inset={0}
      bg="blackAlpha.600"
      zIndex={10000}
      onClick={onClose}
    >
      <Box
        position="fixed"
        top={0}
        right={0}
        h="100vh"
        w={{ base: "100%", md: "60%" }}
        bg="bg.dark2"
        borderLeft="1px solid"
        borderColor="border.dark2"
        p={6}
        onClick={(event) => event.stopPropagation()}
      >
        <HStack justify="space-between" mb={6}>
          <Text fontSize="lg" fontWeight="bold" color="text.light1">
            {title}
          </Text>

          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </HStack>

        {children}
      </Box>
    </Box>
  );
};

export default SidePanel;
