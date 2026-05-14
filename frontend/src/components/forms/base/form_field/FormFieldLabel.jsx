import { Text } from "@chakra-ui/react";

const FormFieldLabel = ({ children }) => {
  if (!children) return null;

  return (
    <Text fontSize="sm" color="text.light1" fontWeight="medium">
      {children}
    </Text>
  );
};

export default FormFieldLabel;
