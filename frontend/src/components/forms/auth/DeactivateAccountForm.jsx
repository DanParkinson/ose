import { useState } from "react";
import { HStack, Text, Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import { axiosRequest } from "../../../api/axiosDefaults";

import FormSubmitButtonDanger from "../base/FormSubmitButtonDanger";
import FormError from "../base/FormError";
import AccountFormContainer from "../base/AccountFormContainer";
import FormSubmitButton from "../base/FormSubmitButton";

import ButtonSpinner from "../../feedback/ButtonSpinner";

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
    <AccountFormContainer>
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
            variant="outline"
            disabled={loading}
          >
            Cancel
          </FormSubmitButton>
        </Box>
      )}

      <Text mt={4} color="text.light2">
        Deactivating your account will hide your profile and content,
        but your data will be retained. You can reactivate your account
        via the Login Page.
      </Text>
    </AccountFormContainer>
  );
};

export default DeactivateAccountForm;
