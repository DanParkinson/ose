import { useState } from "react";
import { HStack } from "@chakra-ui/react";

// Hooks
import useAuth from "../../../hooks/useAuth";

// Form Fields
import WideFormContainer from "../base/containers/WideFormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import FormSubmitButton from "../base/buttons/FormSubmitButton";


// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";
import FormSuccess from "../base/feedback/FormSuccess";

const ChangePasswordForm = () => {
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "old_password") {
      setCurrentPassword(value);
      setErrors((prev) => ({ ...prev, old_password: undefined }));
    }

    if (fieldName === "new_password1") {
      setNewPassword1(value);
      setErrors((prev) => ({ ...prev, new_password1: undefined }));
    }

    if (fieldName === "new_password2") {
      setNewPassword2(value);
      setErrors((prev) => ({ ...prev, new_password2: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    const response = await changePassword(
      currentPassword,
      newPassword1,
      newPassword2
    );

    if (response.success) {
      setCurrentPassword("");
      setNewPassword1("");
      setNewPassword2("");
      setSuccessMessage("Password updated successfully.");
    } else {
      setErrors(response.errors);
    }

    setLoading(false);
  };

  return (
    <WideFormContainer>
      <FormFieldText
        field={{
          name: "old_password",
          label: "Current Password",
          type: "password",
          placeholder: "Current Password",
        }}
        value={currentPassword}
        error={errors.old_password?.[0]}
        onChange={handleFieldChange}
      />

      <FormFieldText
        field={{
          name: "new_password1",
          label: "New Password",
          type: "password",
          placeholder: "New Password",
        }}
        value={newPassword1}
        error={errors.new_password1?.[0]}
        onChange={handleFieldChange}
      />

      <FormFieldText
        field={{
          name: "new_password2",
          label: "Confirm New Password",
          type: "password",
          placeholder: "Confirm New Password",
        }}
        value={newPassword2}
        error={errors.new_password2?.[0]}
        onChange={handleFieldChange}
      />

      <FormError>{errors.non_field_errors?.[0]}</FormError>

      {successMessage && (
        <FormSuccess>{successMessage}</FormSuccess>
      )}

      <FormSubmitButton
        onClick={handleSubmit}
        disabled={loading}
      >
        <HStack gap={2} justify="center">
          {loading && <ButtonSpinner />}
          <span>{loading ? "Updating..." : "Update Password"}</span>
        </HStack>
      </FormSubmitButton>
    </WideFormContainer>
  );
};

export default ChangePasswordForm;