import FormFieldWrapper from "./FormFieldWrapper";
import FormTextInput from "../FormTextInput";

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
      <FormTextInput
        placeholder={field.label}
        value={value || ""}
        onChange={(event) =>
          onChange(field.name, event.target.value)
        }
      />
    </FormFieldWrapper>
  );
};

export default FormFieldText;
