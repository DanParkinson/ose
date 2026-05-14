import { useState } from "react";
import useAuth from "../../../hooks/UseAuth";

import FormSubmitButton from "../base/FormSubmitButton";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";
import AccountFormContainer from "../base/AccountFormContainer";
import FormSuccess from "../base/FormSuccess";

const ChangePasswordForm = () => {
  const { changePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChangePassword = async () => {
    setErrors({});
    setSuccessMessage("");

    const response = await changePassword(
      oldPassword,
      newPassword1,
      newPassword2
    );

    if (response.success) {
      setOldPassword("");
      setNewPassword1("");
      setNewPassword2("");
      setSuccessMessage("Password updated successfully.");
    } else {
      setErrors(response.errors);
    }
  };

  return (
    <AccountFormContainer>
      <FormTextInput
        type="password"
        placeholder="Current password"
        value={oldPassword}
        onChange={(e) => {
          setOldPassword(e.target.value);
          setErrors((prev) => ({ ...prev, old_password: undefined }));
        }}
      />
      <FormError>{errors.old_password?.[0]}</FormError>

      <FormTextInput
        type="password"
        placeholder="New password"
        value={newPassword1}
        onChange={(e) => {
          setNewPassword1(e.target.value);
          setErrors((prev) => ({ ...prev, new_password1: undefined }));
        }}
      />
      <FormError>{errors.new_password1?.[0]}</FormError>

      <FormTextInput
        type="password"
        placeholder="Confirm new password"
        value={newPassword2}
        onChange={(e) => {
          setNewPassword2(e.target.value);
          setErrors((prev) => ({ ...prev, new_password2: undefined }));
        }}
      />
      <FormError>{errors.new_password2?.[0]}</FormError>

      <FormError>{errors.non_field_errors?.[0]}</FormError>

      {successMessage && (
        <FormSuccess>{successMessage}</FormSuccess>
      )}

      <FormSubmitButton onClick={handleChangePassword}>
        Update Password
      </FormSubmitButton>
    </AccountFormContainer>
  );
};

export default ChangePasswordForm;
