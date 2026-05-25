import { useState } from "react";
import { HStack, Text } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

// API
import { axiosRequest } from "../../../api/axiosDefaults";

// Form Fields
import FormContainer from "../base/containers/FormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormLink from "../base/navigation/FormLink";

// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const ResetPasswordForm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (fieldName, value) => {
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

    if (newPassword1 !== newPassword2) {
      setErrors({
        new_password2: ["Passwords do not match."],
      });
      setLoading(false);
      return;
    }

    try {
      await axiosRequest.post("/api/auth/password/reset/confirm/", {
        uid,
        token,
        new_password1: newPassword1,
        new_password2: newPassword2,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setErrors(
        error.response?.data || {
          non_field_errors: ["Invalid or expired reset link."],
        }
      );

      setLoading(false);
    }
  };

  return (
    <FormContainer title="Reset Password">
      {success ? (
        <>
          <Text color="text.light2">
            Password updated. Redirecting...
          </Text>

          <FormLink
            text="Go to login"
            to="/login"
            linkText="Login"
          />
        </>
      ) : (
        <>
          <FormFieldText
            field={{
              name: "new_password1",
              label: "New Password",
              type: "password",
              placeholder: "New password",
            }}
            value={newPassword1}
            error={errors.new_password1?.[0]}
            onChange={handleFieldChange}
          />

          <FormFieldText
            field={{
              name: "new_password2",
              label: "Confirm Password",
              type: "password",
              placeholder: "Confirm password",
            }}
            value={newPassword2}
            error={errors.new_password2?.[0]}
            onChange={handleFieldChange}
          />

          <FormError>{errors.non_field_errors?.[0]}</FormError>

          <FormSubmitButton
            onClick={handleSubmit}
            disabled={loading}
          >
            <HStack gap={2} justify="center">
              {loading && <ButtonSpinner />}
              <span>
                {loading ? "Resetting..." : "Reset Password"}
              </span>
            </HStack>
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