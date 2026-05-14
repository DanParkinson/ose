import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosRequest } from "../../../api/axiosDefaults";

import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";
import { Text } from "@chakra-ui/react";

const ResetPasswordForm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setErrors({});

    if (password1 !== password2) {
      setErrors({
        new_password2: ["Passwords do not match"],
      });
      return;
    }

    try {
      await axiosRequest.post("/api/auth/password/reset/confirm/", {
        uid,
        token,
        new_password1: password1,
        new_password2: password2,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      const data = error.response?.data;

      setErrors(
        data || {
          non_field_errors: ["Invalid or expired reset link"],
        }
      );
    }
  };

  return (
    <FormContainer title="Reset Password">
      {success ? (
        <>
          <Text color="text.light2">Password updated. Redirecting...</Text>

          <FormLink
            text="Go to login"
            to="/login"
            linkText="Login"
          />
        </>
      ) : (
        <>
          <FormTextInput
            type="password"
            placeholder="New password"
            value={password1}
            onChange={(e) => {
              setPassword1(e.target.value);
              setErrors((prev) => ({ ...prev, new_password1: undefined }));
            }}
          />
          <FormError>{errors.new_password1?.[0]}</FormError>

          <FormTextInput
            type="password"
            placeholder="Confirm password"
            value={password2}
            onChange={(e) => {
              setPassword2(e.target.value);
              setErrors((prev) => ({ ...prev, new_password1: undefined }));
            }}
          />
          <FormError>{errors.new_password2?.[0]}</FormError>

          <FormError>{errors.non_field_errors?.[0]}</FormError>

          <FormSubmitButton onClick={handleSubmit}>
            Reset Password
          </FormSubmitButton>

          <FormLink
            text="Remembered your password?"
            to="/login"
            linkText="Login"
          />
        </>
      )}
    </FormContainer>
  );
};

export default ResetPasswordForm;
