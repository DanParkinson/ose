import { useState } from "react";
import useAuth from "../../../hooks/UseAuth";
import { useNavigate } from "react-router-dom";

import FormContainer from "../base/FormContainer";
import FormSubmitButton from "../base/FormSubmitButton";
import FormLink from "../base/FormLink";
import FormError from "../base/FormError";
import FormTextInput from "../base/FormTextInput";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    setErrors({});

    const response = await login(email, password);

    if (response.success) {
      navigate("/");
    } else {
      setErrors(response.errors)
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

      <FormSubmitButton onClick={handleSubmit}>
        Login
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
