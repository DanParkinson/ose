import { VStack } from "@chakra-ui/react";

import FormFieldLabel from "./FormFieldLabel";
import FormFieldError from "./FormFieldError";

const FormFieldWrapper = ({ label, error, children }) => {
  return (
    <VStack align="stretch" gap={2}>
      <FormFieldLabel>{label}</FormFieldLabel>

      {children}

      <FormFieldError>{error}</FormFieldError>
    </VStack>
  );
};

export default FormFieldWrapper;
