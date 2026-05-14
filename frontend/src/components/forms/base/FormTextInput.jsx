import { Input } from "@chakra-ui/react";
import AppInput from "../../ui/AppInput";

const FormTextInput = ({
  type = "text",
  placeholder,
  value,
  onChange,
}) => {
  return (
    <AppInput variant="primary"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default FormTextInput;
