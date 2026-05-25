import { useState } from "react";
import { HStack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Hooks
import useAuth from "../../../hooks/useAuth";

// API
import { axiosRequest } from "../../../api/axiosDefaults";

// Form Fields
import WideFormContainer from "../base/containers/WideFormContainer";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormSubmitButtonDanger from "../base/buttons/FormSubmitButtonDanger";

// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const DeactivateAccountForm = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeactivateAccount = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    try {
      await axiosRequest.post("/api/account/deactivate/");
      await logout();
      navigate("/");
    } catch (error) {
      setErrors(
        error.response?.data || {
          non_field_errors: ["Account deactivation failed."],
        }
      );

      setLoading(false);
    }
  };

  return (
    <WideFormContainer>
      <FormError>{errors.non_field_errors?.[0]}</FormError>

      {!confirming ? (
        <FormSubmitButtonDanger onClick={() => setConfirming(true)}>
          Deactivate Account
        </FormSubmitButtonDanger>
      ) : (
        <Box display="flex" flexDirection="column" gap={3}>
          <Text color="text.light2">
            Are you sure you want to deactivate your account?
          </Text>

          <FormSubmitButtonDanger
            onClick={handleDeactivateAccount}
            disabled={loading}
          >
            <HStack gap={2} justify="center">
              {loading && <ButtonSpinner />}
              <span>
                {loading ? "Deactivating..." : "Confirm Deactivation"}
              </span>
            </HStack>
          </FormSubmitButtonDanger>

          <FormSubmitButton
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            Cancel
          </FormSubmitButton>
        </Box>
      )}

      <Text mt={4} color="text.light2">
        Deactivating your account will hide your profile and content, but your
        data will be retained. You can reactivate your account via the login
        page.
      </Text>
    </WideFormContainer>
  );
};

export default DeactivateAccountForm;