import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Hooks
import useAuth from "../../../hooks/useAuth";

// Form Fields
import WideFormContainer from "../base/containers/WideFormContainer";
import FormSubmitButton from "../base/buttons/FormSubmitButton";

// Feedback
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const LogoutForm = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    try {
      await logout();
      navigate("/");
    } catch (error) {
      setErrors(
        error.response?.data || {
          non_field_errors: ["Logout failed."],
        }
      );

      setLoading(false);
    }
  };

  return (
    <WideFormContainer>
      <FormError>{errors.non_field_errors?.[0]}</FormError>

      <FormSubmitButton
        onClick={handleSubmit}
        disabled={loading}
      >
        <HStack gap={2} justify="center">
          {loading && <ButtonSpinner />}
          <span>
            {loading ? "Logging out..." : "Logout"}
          </span>
        </HStack>
      </FormSubmitButton>
    </WideFormContainer>
  );
};

export default LogoutForm;