import { Button } from "@chakra-ui/react";

const PaginationButton = ({
  children,
  onClick,
  disabled,
}) => {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default PaginationButton;
