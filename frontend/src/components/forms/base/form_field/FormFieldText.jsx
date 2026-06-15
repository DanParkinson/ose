import { useState } from "react";
import { Button, InputGroup } from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";

import AppInput from "../../../ui/AppInput";
import FormFieldWrapper from "./FormFieldWrapper";

const FormFieldText = ({
  field,
  value,
  error,
  onChange,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = field.type === "password";

  return (
    <FormFieldWrapper
      label={field.label}
      error={error}
    >
      <InputGroup
        endElement={
          isPasswordField ? (
            <Button
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
                }
              type="button"
              variant="ghost"
              bg="transparent"
              color="text.light1"
              minW="auto"
              px={2}
              _hover={{
                bg: "transparent",
                color: "text.light1",
              }}
              _active={{
                bg: "transparent",
              }}
              _focusVisible={{
                outline: "2px solid",
                outlineColor: "text.light1",
                outlineOffset: "2px",
              }}
              onClick={() =>
                setShowPassword((prev) => !prev)
              }
            >
              {showPassword ? (
                <HiEyeOff size={20} />
              ) : (
                <HiEye size={20} />
              )}
            </Button>
          ) : null
        }
      >
        <AppInput
          variant="primary"
          type={
            isPasswordField
              ? showPassword
                ? "text"
                : "password"
              : field.type || "text"
          }
          placeholder={field.placeholder}
          value={value || ""}
          disabled={disabled}
          onChange={(event) =>
            onChange(field.name, event.target.value)
          }
        />
      </InputGroup>
    </FormFieldWrapper>
  );
};

export default FormFieldText;
