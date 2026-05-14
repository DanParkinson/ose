import { Button } from "@chakra-ui/react";

const FormSubmitButtonDanger = ({ children, onClick }) => {
  return (
    <Button
      onClick={onClick}
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
