import { useState } from "react";
import { HStack, Text } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

// api
import { axiosRequest } from "../../../api/axiosDefaults";

// Form Fields
import FormContainer from "../base/containers/FormContainer";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormLink from "../base/navigation/FormLink";

// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const VerifyEmailForm = () => {
  const { key } = useParams();

  const [status, setStatus] = useState("idle");

  const handleVerifyEmail = async () => {
    if (status === "loading") return;

    setStatus("loading");

    try {
      await axiosRequest.post("/api/auth/registration/verify-email/", {
        key,
      });

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <FormContainer title="Verify Email">
      {status === "idle" && (
        <>
          <Text color="text.light2">
            Click the button below to verify your email address.
          </Text>

          <FormSubmitButton onClick={handleVerifyEmail}>
            Verify Email
          </FormSubmitButton>
        </>
      )}

      {status === "loading" && (
        <>
          <Text color="text.light2">
            Verifying email address...
          </Text>

          <FormSubmitButton disabled>
            <HStack gap={2} justify="center">
              <ButtonSpinner />
              <span>Verifying...</span>
            </HStack>
          </FormSubmitButton>
        </>
      )}

      {status === "success" && (
        <>
          <Text color="text.light2">
            Your email address has been verified.
          </Text>

          <FormLink
            text="You can now"
            to="/login"
            linkText="login"
          />
        </>
      )}

      {status === "error" && (
        <>
          <FormError>
            This verification link is no longer valid. Your email may already be
            verified, or the link may have expired.
          </FormError>

          <FormLink
            text="Need a new verification email?"
            to="/resend-verification-email"
            linkText="Resend it"
          />
          <FormLink
            text="Want to"
            to="/login"
            linkText="login?"
          />
        </>
      )}
    </FormContainer>
  );
};

export default VerifyEmailForm;
