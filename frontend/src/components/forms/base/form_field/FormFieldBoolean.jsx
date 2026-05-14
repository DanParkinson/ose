import FormFieldWrapper from "./FormFieldWrapper";
import AppSwitch from "../../../ui/AppSwitch";

const FormFieldBoolean = ({
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
      <AppSwitch
        checked={value}
        onCheckedChange={(details) =>
          onChange(field.name, details.checked)
        }
      />
    </FormFieldWrapper>
  );
};

export default FormFieldBoolean;
