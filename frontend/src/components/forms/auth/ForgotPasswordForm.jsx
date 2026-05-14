import { useState } from "react";
import { axiosRequest } from "../../../api/axiosDefaults";
import { Text } from "@chakra-ui/react";

import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    setErrors({});

    try {
      await axiosRequest.post("/api/auth/password/reset/", { email });
      setSubmitted(true);
    } catch (error) {
      setErrors(
        error.response?.data || {
          non_field_errors: ["Password reset failed. Please try again."],
        }
      );
    }
  };

  return (
    <FormContainer title="Forgot Password">
      {submitted ? (
        <>
          <Text color="text.light2">
            If an account exists with that email, a reset link has been sent.
          </Text>

          <FormLink
            text="Remembered your password?"
            to="/login"
            linkText="Login"
          />
        </>
      ) : (
        <>
          <Text color="text.light2">Enter your email to receive a reset link.</Text>

          <FormTextInput
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormError>{errors.email?.[0]}</FormError>
          <FormError>{errors.non_field_errors?.[0]}</FormError>

          <FormSubmitButton onClick={handleSubmit}>
            Send Reset Email
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

export default ForgotPasswordForm;
