import FormFieldWrapper from "./FormFieldWrapper";
import AppSelect from "../../../ui/AppSelect";

const FormFieldChoice = ({
  field,
  value,
  error,
  choices,
  onChange,
}) => {
  return (
    <FormFieldWrapper
      label={field.label}
      error={error}
    >
      <AppSelect
        value={value || ""}
        onChange={(event) =>
          onChange(field.name, event.target.value)
        }
      >
        <option value="">Select {field.label}</option>

        {choices.map((choice) => (
          <option
            key={choice.value}
            value={choice.value}
          >
            {choice.display_name}
          </option>
        ))}
      </AppSelect>
    </FormFieldWrapper>
  );
};

export default FormFieldChoice;
