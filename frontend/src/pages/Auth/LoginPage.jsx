import AuthSplitLayout from "../../layouts/AuthSplitLayout";
import LoginForm from "../../components/forms/auth/LoginForm";

const LoginPage = () => {
  return (
    <AuthSplitLayout>
      <LoginForm />
    </AuthSplitLayout>
  );
};

export default LoginPage;
