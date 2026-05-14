import { Button } from "@chakra-ui/react";
import { HiArrowPath } from "react-icons/hi2";

const ResetFiltersButton = ({
  onClick,
  children = "Reset Filters",
}) => {
  return (
    <Button
      w="100%"
      mt={3}
      onClick={onClick}
      bg="transparent"
      color="text.light4"
      border="1px solid"
      borderColor="border.dark2"
      borderRadius="md"
      justifyContent="center"
      gap={2}
      _hover={{
        bg: "bg.dark3",
        color: "text.primarylight",
        borderColor: "text.primarylight",
      }}
      _active={{
        bg: "bg.dark4",
      }}
    >
      <HiArrowPath />
      {children}
    </Button>
  );
};

export default ResetFiltersButton;
