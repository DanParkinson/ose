import { IconButton } from "@chakra-ui/react";
import { HiTrash } from "react-icons/hi";

const DeleteIconButton = ({
  onClick,
  ariaLabel = "Delete",
}) => {
  return (
    <IconButton
      aria-label={ariaLabel}
      size="xs"
      bg="red.500"
      color="white"
      _hover={{
        bg: "red.600",
      }}
      onClick={onClick}
    >
      <HiTrash />
    </IconButton>
  );
};

export default DeleteIconButton;
