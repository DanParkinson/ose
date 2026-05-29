import { Box, Button } from "@chakra-ui/react";

const TabButton = ({
  active = false,
  children,
  ...props
}) => {
  return (
    <Box
      borderLeft="4px solid"
      borderLeftColor={
        active
          ? "bg.primarylight"
          : "transparent"
      }
    >
      <Button
        w="100%"
        justifyContent="flex-start"
        bg={
          active
            ? "bg.dark2"
            : "bg.dark4"
        }
        color={
          active
            ? "text.light1"
            : "text.light4"
        }
        border="1px solid"
        borderColor="border.dark1"
        borderRadius="md"
        _hover={{
          bg: active
            ? "bg.dark2"
            : "bg.dark3",
          color: "text.light1",
        }}
        _focusVisible={{
          outline: "2px solid",
          outlineColor: "focusRing",
          outlineOffset: "2px",
        }}
        {...props}
      >
        {children}
      </Button>
    </Box>
  );
};

export default TabButton;