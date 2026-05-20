import { useState } from "react";
import { HStack, Text } from "@chakra-ui/react";

import { axiosRequest } from "../../../api/axiosDefaults";

import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";

import ButtonSpinner from "../../feedback/ButtonSpinner";

const ReactivateRequestForm = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

          <FormTextInput
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: undefined }));
            }}
          />

          <FormError>{errors.email?.[0]}</FormError>
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
