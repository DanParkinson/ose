import AppInput from "../../../ui/AppInput";
import FormFieldWrapper from "./FormFieldWrapper";

const FormFieldText = ({
  field,
  value,
  error,
  onChange,
}) => {
  return (
    <FormFieldWrapper
      label={field.label}
      error={error}
    >
      <AppInput
        variant="primary"
        type={field.type || "text"}
        placeholder={field.placeholder}
        value={value || ""}
        onChange={(event) =>
          onChange(field.name, event.target.value)
        }
      />
    </FormFieldWrapper>
  );
};

export default FormFieldText;