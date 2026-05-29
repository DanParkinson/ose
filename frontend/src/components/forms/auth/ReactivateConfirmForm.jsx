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

const ReactivateConfirmForm = () => {
  const { uid, token } = useParams();

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const handleReactivate = async () => {
    if (status === "loading") return;

    setStatus("loading");
    setErrors({});

    try {
      await axiosRequest.post("/api/account/reactivate/confirm/", {
        uid,
        token,
      });

      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrors(
        error.response?.data || {
          non_field_errors: [
            "This reactivation link is invalid or has expired.",
          ],
        }
      );
    }
  };

  return (
    <FormContainer title="Reactivate Account">
      {status === "idle" && (
        <>
          <Text color="text.light2">
            Click the button below to reactivate your account.
          </Text>

          <FormSubmitButton onClick={handleReactivate}>
            Reactivate Account
          </FormSubmitButton>
        </>
      )}

      {status === "loading" && (
        <>
          <Text color="text.light2">
            Reactivating account...
          </Text>

          <FormSubmitButton disabled>
            <HStack gap={2} justify="center">
              <ButtonSpinner />
              <span>Reactivating...</span>
            </HStack>
          </FormSubmitButton>
        </>
      )}

      {status === "success" && (
        <>
          <Text color="text.light2">
            Your account has been reactivated.
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
            {errors.non_field_errors?.[0] ||
              errors.detail ||
              "This reactivation link is invalid or has expired."}
          </FormError>

          <FormLink
            text="Need a new link?"
            to="/reactivate-account"
            linkText="Request one"
          />
        </>
      )}
    </FormContainer>
  );
};

export default ReactivateConfirmForm;