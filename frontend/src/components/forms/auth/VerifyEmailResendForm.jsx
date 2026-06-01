import { useState } from "react";
import { HStack, Text } from "@chakra-ui/react";

// api
import { axiosRequest } from "../../../api/axiosDefaults";

// Form Fields
import FormContainer from "../base/containers/FormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormLink from "../base/navigation/FormLink";

// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const VerifyEmailResendForm = () => {
  const [email, setEmail] = useState("");

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "email") {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    try {
      await axiosRequest.post("/api/auth/registration/resend-email/", {
        email,
      });

      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrors(
        error.response?.data || {
          non_field_errors: [
            "Unable to resend verification email. Please check the email address and try again.",
          ],
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Resend Verification Email">
      {status !== "success" && (
        <>
          <Text color="text.light2">
            Enter your email address and we will send you a new verification link.
          </Text>

          <FormFieldText
            field={{
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "me@example.com",
            }}
            value={email}
            error={errors.email?.[0]}
            onChange={handleFieldChange}
          />

          <FormError>
            {errors.non_field_errors?.[0] || errors.detail}
          </FormError>

          <FormSubmitButton
            onClick={handleSubmit}
            disabled={loading}
          >
            <HStack gap={2} justify="center">
              {loading && <ButtonSpinner />}
              <span>
                {loading ? "Sending..." : "Resend Verification Email"}
              </span>
            </HStack>
          </FormSubmitButton>

          <FormLink
            text="Already verified?"
            to="/login"
            linkText="Login"
          />
        </>
      )}

      {status === "success" && (
        <>
        <Text color="text.light2">
            If the email address belongs to an unverified account, a new verification email has been sent.
        </Text>

          <Text color="text.light2">
            Please check your inbox and follow the verification link.
          </Text>

          <FormLink
            text="Return to"
            to="/login"
            linkText="Login"
          />
        </>
      )}
    </FormContainer>
  );
};

export default VerifyEmailResendForm;