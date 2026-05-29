import { Button } from "@chakra-ui/react";

const FormSubmitButton = ({
  children,
  onClick,
  type = "submit",
  disabled = false,
}) => {
  return (
    <Button
      type={type}
      onClick={onClick}
      variant="primary"
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default FormSubmitButton;
