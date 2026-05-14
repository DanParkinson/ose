import { Button } from "@chakra-ui/react";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

const OpenFiltersButton = ({
  onClick,
  children = "Open Filters",
}) => {
  return (
    <Button
      w="100%"
      mt={4}
      onClick={onClick}
      bg="bg.dark2"
      color="text.light1"
      border="1px solid"
      borderColor="border.dark2"
      borderRadius="md"
      justifyContent="center"
      gap={2}
      transition="all 0.2s ease"
      _hover={{
        bg: "bg.dark3",
        borderColor: "text.primarylight",
        color: "text.primarylight",
      }}
      _active={{
        bg: "bg.dark4",
      }}
    >
      <HiAdjustmentsHorizontal />
      {children}
    </Button>
  );
};

export default OpenFiltersButton;
