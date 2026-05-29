import { Center, Text } from "@chakra-ui/react";

import FormFieldWrapper from "./FormFieldWrapper";
import FormFieldText from "./FormFieldText";
import SelectableOptionList from "./SelectableOptionList";
import SelectedOptionList from "./SelectedOptionList";
import ButtonSpinner from "../../../feedback/ButtonSpinner";

const FormFieldRelation = ({
  field,
  error,
  searchValue,
  filteredOptions,
  selectedValues,
  selectedOptions,
  isSearching,
  hasNoResults,
  onSearchChange,
  onRelationToggle,
  formatRelationOption,
}) => {
  return (
    <FormFieldWrapper label={field.label} error={error}>
      <FormFieldText
        placeholder={`Search ${field.label.toLowerCase()}...`}
        value={searchValue}
        onChange={(event) => onSearchChange(field.name, event.target.value)}
      />

      {isSearching ? (
        <Center py={3}>
          <ButtonSpinner />
        </Center>
      ) : hasNoResults ? (
        <Center py={3}>
          <Text color="text.light4" fontSize="sm">
            No matching {field.label.toLowerCase()} found.
          </Text>
        </Center>
      ) : (
        <SelectableOptionList
          options={filteredOptions}
          field={field}
          selectedValues={selectedValues}
          onSelect={(option) => onRelationToggle(field, option)}
          formatOption={(option) => formatRelationOption(option, field)}
        />
      )}

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
