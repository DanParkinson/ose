import {useState } from "react";
import { VStack, HStack } from "@chakra-ui/react";

// utils
import getInitialFormData from "../../../utils/form_fields/getInitialFormData";
import getUpdatedRelationValues from "../../../utils/form_fields/relation/getUpdatedRelationValues";
import parseBackendErrors from "../../../utils/form_fields/errors/parseBackendErrors";

// hooks
import useCoreFieldOptions from "../../../hooks/useCoreFieldOptions";
import useCoreRelationOptions from "../../../hooks/useCoreRelationOptions";
import useDebouncedValue from "../../../hooks/useDebouncedValue";

// form fields
import FormFieldRenderer from "../../renderers/FormFieldRenderer";
import FormError from "../base/FormError";
import FormSuccess from "../base/FormSuccess";
import FormSubmitButton from "../base/FormSubmitButton";
import FormSubmitButtonDanger from "../base/FormSubmitButtonDanger";
import ButtonSpinner from "../../feedback/ButtonSpinner";

// componenets
import AppSwitch from "../../ui/AppSwitch";

// api
import { updateCoreModelItem, deleteCoreModelItem } from "../../../api/coreApi";


const CoreModelUpdateDeleteForm = ({ model, row, onUpdated }) => {
    const editableFields = model.updateFields || model.createFields;

    const [deleteConfirmed, setDeleteConfirmed] = useState(false);

    const [formData, setFormData] = useState(() => {
        return getInitialFormData(editableFields, row);
    });

    const [relationSearch, setRelationSearch] = useState({});
    const [fieldErrors, setFieldErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const fieldOptions = useCoreFieldOptions(model.endpoint);
    const relationOptions = useCoreRelationOptions(editableFields);
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
            await updateCoreModelItem({
            detailEndpoint: model.detailEndpoint,
            id: row[model.keyField],
            data: formData,
            });

            setSuccess(`${model.title} updated successfully.`);

            onUpdated?.();
        } catch (error) {
            console.error(error.response?.data || error);

            const parsedErrors = parseBackendErrors(error);

            setFieldErrors(parsedErrors.fieldErrors);
            setGeneralError(parsedErrors.generalError);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (loading) return;

        setLoading(true);
        setFieldErrors({});
        setGeneralError("");
        setSuccess("");

        try {
            await deleteCoreModelItem({
            detailEndpoint: model.detailEndpoint,
            id: row[model.keyField],
            });

            setSuccess(`${model.title} deleted successfully.`);

            onUpdated?.();
        } catch (error) {
            console.error(error.response?.data || error);

            const parsedErrors = parseBackendErrors(error);

            setGeneralError(parsedErrors.generalError);

            setLoading(false);
        }
    };

  return (
    <form onSubmit={handleSubmit}>
        <VStack align="stretch" gap={4}>
        <FormError>{generalError}</FormError>

        <FormSuccess>{success}</FormSuccess>

        {editableFields.map((field) => (
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

            <VStack align="stretch" gap={4}>

                <FormSubmitButton disabled={loading}>
                    Update
                </FormSubmitButton>
                <AppSwitch
                    checked={deleteConfirmed}
                    onCheckedChange={(details) =>
                        setDeleteConfirmed(details.checked)
                    }
                    >
                    I understand this will permanently delete this item.
                </AppSwitch>

                <FormSubmitButtonDanger onClick={handleDelete} disabled={!deleteConfirmed || loading}>
                    Delete
                </FormSubmitButtonDanger>
            </VStack>

        </VStack>
    </form>
    );
};

export default CoreModelUpdateDeleteForm;
