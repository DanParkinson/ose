import FormFieldBoolean from "../forms/base/form_field/FormFieldBoolean";
import FormFieldChoice from "../forms/base/form_field/FormFieldChoice";
import FormFieldRelation from "../forms/base/form_field/FormFieldRelation";
import FormFieldText from "../forms/base/form_field/FormFieldText";

import getFieldError from "../../utils/form_fields/errors/getFieldError";
import formatRelationOption from "../../utils/form_fields/relation/formatRelationOptions";
import getSelectedRelationOptions from "../../utils/form_fields/relation/getSelectedRelationOptions";
import getFilteredRelationOptions from "../../utils/form_fields/relation/getFilteredRelationOptions";

const FormFieldRenderer = ({
  field,
  formData,
  fieldOptions,
  fieldErrors,
  relationOptions,
  relationSearch,
  debouncedSearch,
  onChange,
  onRelationToggle,
  onRelationSearchChange,
}) => {
  const backendField = fieldOptions[field.name];
  const choices = backendField?.choices || [];
  const fieldError = getFieldError(fieldErrors, field.name);

  if (field.type === "boolean") {
    return (
      <FormFieldBoolean
        field={field}
        value={formData[field.name]}
        error={fieldError}
        onChange={onChange}
      />
    );
  }

  if (field.type === "relation") {
    const options = relationOptions[field.name] || [];
    const selectedValues = formData[field.name] || [];

    const selectedOptions = getSelectedRelationOptions({
      options,
      selectedValues,
      optionValue: field.optionValue,
      multiple: field.multiple,
    });

    const searchValue = relationSearch[field.name] || "";
    const debouncedValue = debouncedSearch[field.name] || "";

    const filteredOptions = getFilteredRelationOptions({
      options,
      searchValue: debouncedValue,
      field,
      formatOption: formatRelationOption,
    });

    return (
      <FormFieldRelation
        field={field}
        error={fieldError}
        searchValue={searchValue}
        filteredOptions={filteredOptions}
        selectedValues={selectedValues}
        selectedOptions={selectedOptions}
        onSearchChange={onRelationSearchChange}
        onRelationToggle={onRelationToggle}
        formatRelationOption={formatRelationOption}
      />
    );
  }

  if (choices.length > 0) {
    return (
      <FormFieldChoice
        field={field}
        value={formData[field.name]}
        error={fieldError}
        choices={choices}
        onChange={onChange}
      />
    );
  }

  return (
    <FormFieldText
      field={field}
      value={formData[field.name]}
      error={fieldError}
      onChange={onChange}
    />
  );
};

export default FormFieldRenderer;
