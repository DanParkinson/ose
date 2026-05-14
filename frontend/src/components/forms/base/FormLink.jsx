import { Text } from "@chakra-ui/react";

import AppLink
 from "../../ui/AppLink";
const FormLink = ({ text, to, linkText }) => {
  return (
    <Text fontSize="sm" color="text.light2">
      {text}{" "}
      <AppLink to={to} variant="primary">
        {linkText}
      </AppLink>
    </Text>
  );
};

export default FormLink;
