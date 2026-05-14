import { Text } from "@chakra-ui/react";

const FormFieldError = ({ children }) => {
  if (!children) return null;

  return (
    <Text fontSize="xs" color="error">
      {children}
    </Text>
  );
};

export default FormFieldError;
