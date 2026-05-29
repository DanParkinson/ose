import { useState } from "react";
import { HStack, Text } from "@chakra-ui/react";

// api
import { axiosRequest } from "../../../api/axiosDefaults";

// Form Fields
import FormContainer from "../base/containers/FormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormFieldError from "../base/form_field/FormFieldError";
import FormLink from "../base/navigation/FormLink";

// Feedback 
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const ReactivateRequestForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
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
      await axiosRequest.post("/api/account/reactivate/request/", {
        email,
      });

      setSubmitted(true);
    } catch (error) {
      setErrors(
        error.response?.data || {
          non_field_errors: ["Reactivation request failed. Please try again."],
        }
      );

      setLoading(false);
    }
  };

  return (
    <FormContainer title="Reactivate Account">
      {submitted ? (
        <>
          <Text color="text.light2">
            If a deactivated account exists with that email, a reactivation link
            has been sent.
          </Text>

          <FormLink
            text="Back to login?"
            to="/login"
            linkText="Login"
          />
        </>
      ) : (
        <>
          <Text color="text.light2">
            Enter your email to receive a reactivation link.
          </Text>

          <FormFieldText
            field={{
              name: "email",
              type: "email",
              placeholder: "Email",
            }}
            value={email}
            error={errors.email?.[0]}
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
                {loading ? "Sending..." : "Send Reactivation Email"}
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

export default ReactivateRequestForm;
