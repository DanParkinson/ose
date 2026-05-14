import FormFieldWrapper from "./FormFieldWrapper";
import FormTextInput from "../FormTextInput";
import SelectableOptionList from "./SelectableOptionList";
import SelectedOptionList from "./SelectedOptionList";

const FormFieldRelation = ({
  field,
  error,
  searchValue,
  filteredOptions,
  selectedValues,
  selectedOptions,
  onSearchChange,
  onRelationToggle,
  formatRelationOption,
}) => {
  return (
    <FormFieldWrapper label={field.label} error={error}>
      <FormTextInput
        placeholder={`Search ${field.label.toLowerCase()}...`}
        value={searchValue}
        onChange={(event) => onSearchChange(field.name, event.target.value)}
      />

      <SelectableOptionList
        options={filteredOptions}
        field={field}
        selectedValues={selectedValues}
        onSelect={(option) => onRelationToggle(field, option)}
        formatOption={(option) => formatRelationOption(option, field)}
      />

      <SelectedOptionList
        title={`Selected ${field.label}`}
        options={selectedOptions}
        optionValue={field.optionValue}
        onRemove={(option) => onRelationToggle(field, option)}
        formatOption={(option) => formatRelationOption(option, field)}
      />
    </FormFieldWrapper>
  );
};

export default FormFieldRelation;
