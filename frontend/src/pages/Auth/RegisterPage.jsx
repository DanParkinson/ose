import RegisterForm from "../../components/forms/auth/RegisterForm";
import AuthSplitLayout from "../../layouts/AuthSplitLayout";

const RegisterPage = () => {
  return (
    <AuthSplitLayout>
      <RegisterForm />
    </AuthSplitLayout>
  );
};

export default RegisterPage;
