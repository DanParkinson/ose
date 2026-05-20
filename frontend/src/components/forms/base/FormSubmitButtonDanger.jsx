import { Button } from "@chakra-ui/react";

const FormSubmitButtonDanger = ({ children, onClick, disabled }) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      disabled={disabled}
      bg="error.contrast"
      color="warning.Contrast"
      _hover={{ bg: "error" }}
      _active={{ bg: "error" }}
    >
      {children}
    </Button>
  );
};

export default FormSubmitButtonDanger;
