import { useState } from "react";
import { HStack, Text, Box, VStack} from "@chakra-ui/react";
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

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");

  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "email") {
      setEmail(value);
      setErrors((prev) => ({ ...prev, email: undefined }));
    }

    if (fieldName === "password1") {
      setPassword1(value);
      setErrors((prev) => ({ ...prev, password1: undefined }));
    }

    if (fieldName === "password2") {
      setPassword2(value);
      setErrors((prev) => ({ ...prev, password2: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    const response = await register(email, password1, password2);

    if (response.success) {
      setStatus("success");
      setLoading(false);
    } else {
      setErrors(response.errors);
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Register">
      {status === "idle" && (
        <>
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
              name: "password1",
              label: "Password",
              type: "password",
              placeholder: "********",
            }}
            value={password1}
            error={errors.password1?.[0]}
            onChange={handleFieldChange}
          />
          <FormFieldText
            field={{
              name: "password2",
              label: "Confirm Password",
              type: "password",
              placeholder: "********",
            }}
            value={password2}
            error={errors.password2?.[0]}
            onChange={handleFieldChange}
          />

          <FormError>{errors.non_field_errors?.[0]}</FormError>

          <FormSubmitButton
            onClick={handleSubmit}
            disabled={loading}
          >
            <HStack gap={2} justify="center">
              {loading && <ButtonSpinner />}
              <span>{loading ? "Registering..." : "Register"}</span>
            </HStack>
          </FormSubmitButton>

          <FormLink
            text="Already have an account?"
            to="/login"
            linkText="Login"
          />

          <FormLink
            text="Have an old deactivated account?"
            to="/reactivate-account"
            linkText="Reactivate"
          />
        </>
      )}

      {status === "success" && (
        <Box
        >
          <VStack gap={4} textAlign="center">
            <Text color="text.light1" fontWeight="bold">
              Your account has been created.
            </Text>

            <Text color="text.light2">
              Please check your email to verify your account before logging in.
            </Text>

            <FormLink
              to="/resend-verification-email"
              linkText="Resend verification email"
            />

            <FormLink
              to="/login"
              linkText="Login"
            />


          </VStack>
        </Box>
      )}
    </FormContainer>
  );
};

export default RegisterForm;
