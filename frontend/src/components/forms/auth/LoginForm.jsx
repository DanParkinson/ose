import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

// Hooks
import useAuth from "../../../hooks/useAuth";

// Form Fields
import FormContainer from "../base/containers/FormContainer";
import FormFieldText from "../base/form_field/FormFieldText";
import FormSubmitButton from "../base/buttons/FormSubmitButton";
import FormFieldError from "../base/form_field/FormFieldError";
import FormLink from "../base/navigation/FormLink";

// Feedback 
import ButtonSpinner from "../../feedback/ButtonSpinner";
import FormError from "../base/feedback/FormError";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const emailNotVerified =
    errors.non_field_errors?.[0]?.toLowerCase().includes("verified") ||
    errors.detail?.toLowerCase().includes("verified");
  
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "email") {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: undefined }));
    }

    if (fieldName === "password") {
      setPassword(value);
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    const response = await login(email, password);

    if (response.success) {
      navigate("/");
    } else {
      setErrors(response.errors)
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Login">
      <FormFieldText
        field={{
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "me@example.com",
        }}
        value={email}
        error={errors.email?.[0]}
        onChange={handleFieldChange}
      />

      <FormFieldText
        field={{
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "********",
        }}
        value={password}
        error={errors.password?.[0]}
        onChange={handleFieldChange}
      />

      <FormError>{errors.non_field_errors?.[0]}</FormError>

      {emailNotVerified && (
        <FormLink
          text="Need a new verification email?"
          to="/resend-verification-email"
          linkText="Resend it"
        />
      )}

      <FormSubmitButton
        onClick={handleSubmit}
        disabled={loading}
      >
        <HStack gap={2} justify="center">
          {loading && <ButtonSpinner />}
          <span>{loading ? "Logging in..." : "Login"}</span>
        </HStack>
      </FormSubmitButton>

      <FormLink
        text="New here? "
        to="/register"
        linkText="Register"
      />

      <FormLink
        text="Have an old deactivated account?"
        to="/reactivate-account"
        linkText="Reactivate"
      />

      <FormLink
      text = "Forgotten your password?"
        to="/forgot-password"
        linkText="Reset it"
      />

    </FormContainer>
  );
};

export default LoginForm;
