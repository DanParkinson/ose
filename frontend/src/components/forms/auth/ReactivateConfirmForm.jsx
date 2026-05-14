import { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosRequest } from "../../../api/axiosDefaults";
import { Text } from "@chakra-ui/react";
import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";

const ReactivateConfirmForm = () => {
  const { uid, token } = useParams();

  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const handleReactivate = async () => {
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
          non_field_errors: ["This reactivation link is invalid or has expired."],
        }
      );
    }
  };

  return (
    <FormContainer title="Reactivate Account">
      {status === "idle" && (
        <>
          <Text color="text.light2" >Click the button below to reactivate your account.</Text>

          <FormSubmitButton onClick={handleReactivate}>
            Reactivate Account
          </FormSubmitButton>
        </>
      )}

      {status === "loading" && (
        <Text color="text.light2">Reactivating account...</Text>
      )}

      {status === "success" && (
        <>
          <Text color="text.light2" >Your account has been reactivated.</Text>

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
