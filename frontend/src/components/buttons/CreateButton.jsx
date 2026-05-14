import { IconButton } from "@chakra-ui/react";
import { HiPlus } from "react-icons/hi";

const CreateButton = ({
  onClick,
  size = "xs",
}) => {
  return (
    <IconButton
      aria-label="Create"
      size={size}
      onClick={onClick}
      bg="transparent"
      color="bg.primarylight"
      borderRadius="md"
      fontWeight="black"
      fontSize="lg"
      _hover={{
        bg: "bg.primarylight",
        color: "text.dark1",
      }}
    >
      <HiPlus strokeWidth={2.5} />
    </IconButton>
  );
};

export default CreateButton;
