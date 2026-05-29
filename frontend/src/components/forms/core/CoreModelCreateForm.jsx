import { useState } from "react";
import { HStack, VStack } from "@chakra-ui/react";

// api
import {
  createCoreModelItem,
} from "../../../api/coreApi";

// Form Fields
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormFieldRenderer from "../../renderers/FormFieldRenderer";

// Feedback
import FormError from "../base/feedback/FormError";
import FormSuccess from "../base/feedback/FormSuccess";
import ButtonSpinner from "../../feedback/ButtonSpinner";

// utils
import getInitialFormData from "../../../utils/form_fields/getInitialFormData";
import getUpdatedRelationValues from "../../../utils/form_fields/relation/getUpdatedRelationValues";
import parseBackendErrors from "../../../utils/form_fields/errors/parseBackendErrors";

// hooks
import useCoreFieldOptions from "../../../hooks/useCoreFieldOptions";
import useCoreRelationOptions from "../../../hooks/useCoreRelationOptions";
import useDebouncedValue from "../../../hooks/useDebouncedValue";



const CoreModelCreateForm = ({ model, onCreated }) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(model.createFields)
  );

  const [relationSearch, setRelationSearch] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const fieldOptions = useCoreFieldOptions(model.endpoint);
  const relationOptions = useCoreRelationOptions(model.createFields);
  const debouncedSearch = useDebouncedValue(relationSearch, 500);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: null,
    }));
  };

  const handleRelationToggle = (field, option) => {
    const updatedValues = getUpdatedRelationValues({
      field,
      option,
      currentValues: formData[field.name] || [],
    });

    handleChange(field.name, updatedValues);
  };

  const handleRelationSearchChange = (name, value) => {
    setRelationSearch((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);
    setFieldErrors({});
    setGeneralError("");
    setSuccess("");

    try {
      await createCoreModelItem({
        endpoint: model.endpoint,
        data: formData,
      });

      setSuccess(`${model.title} created successfully.`);

      onCreated?.();
    } catch (error) {
      console.error(error.response?.data || error);

      const parsedErrors = parseBackendErrors(error);

      setFieldErrors(parsedErrors.fieldErrors);
      setGeneralError(parsedErrors.generalError);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack align="stretch" gap={4}>
        <FormError>{generalError}</FormError>

        <FormSuccess>{success}</FormSuccess>

        {model.createFields.map((field) => (
          <FormFieldRenderer
            key={field.name}
            field={field}
            formData={formData}
            fieldOptions={fieldOptions}
            fieldErrors={fieldErrors}
            relationOptions={relationOptions}
            relationSearch={relationSearch}
            debouncedSearch={debouncedSearch}
            onChange={handleChange}
            onRelationToggle={handleRelationToggle}
            onRelationSearchChange={handleRelationSearchChange}
          />
        ))}

        <FormSubmitButton disabled={loading}>
          <HStack gap={2} justify="center">
            {loading && <ButtonSpinner />}
            <span>{loading ? "Creating..." : "Create"}</span>
          </HStack>
        </FormSubmitButton>
      </VStack>
    </form>
  );
};

export default CoreModelCreateForm;
