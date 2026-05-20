import { useState } from "react";
import { HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import useAuth from "../../../hooks/UseAuth";

import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";

import ButtonSpinner from "../../feedback/ButtonSpinner";

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setErrors({});

    const response = await register(email, password1, password2);

    if (response.success) {
      navigate("/login");
    } else {
      setErrors(response.errors);
      setLoading(false);
    }
  };

  return (
    <FormContainer title="Register">
      <FormTextInput
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <FormError>{errors.email}</FormError>

      <FormTextInput
        type="password"
        placeholder="Password"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
      />

      <FormError>{errors.password1}</FormError>

      <FormTextInput
        type="password"
        placeholder="Confirm password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />

      <FormError>{errors.password2}</FormError>

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
    </FormContainer>
  );
};

export default RegisterForm;
