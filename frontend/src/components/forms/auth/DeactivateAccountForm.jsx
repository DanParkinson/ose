import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import { axiosRequest } from "../../../api/axiosDefaults";

import { Text, Box } from "@chakra-ui/react";

import FormSubmitButtonDanger from "../base/FormSubmitButtonDanger";
import FormError from "../base/FormError";
import AccountFormContainer from "../base/AccountFormContainer";
import FormSubmitButton from "../base/FormSubmitButton";

const DeactivateAccountForm = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);

  const handleDeactivateAccount = async () => {
    try {
      setErrors({});
      await axiosRequest.post("/api/account/deactivate/");
      await logout();
      navigate("/");
    } catch (error) {
      setErrors(
        error.response?.data || {
          non_field_errors: ["Account deactivation failed."],
        }
      );
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

          <FormSubmitButtonDanger onClick={handleDeactivateAccount}>
            Confirm Deactivation
          </FormSubmitButtonDanger>

          <FormSubmitButton
            onClick={() => setConfirming(false)}
            variant="outline"
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
