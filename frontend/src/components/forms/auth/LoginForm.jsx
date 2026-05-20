import { useState } from "react";
import useAuth from "../../../hooks/UseAuth";
import { useNavigate } from "react-router-dom";
import { HStack } from "@chakra-ui/react";

import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";

import ButtonSpinner from "../../feedback/ButtonSpinner";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrors({});
    if (loading) return;

    setLoading(true);

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
      <FormTextInput
      placeholder = "Email"
      value = {email}
      onChange={(e) => setEmail(e.target.value)}
      />
      <FormError>{errors.email}</FormError>

      <FormTextInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormError>{errors.password}</FormError>

      <FormError>{errors.non_field_errors?.[0]}</FormError>

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
