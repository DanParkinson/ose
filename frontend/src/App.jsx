import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Spinner, Box } from "@chakra-ui/react";

// Routes
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";

// Layout
import Layout from "./layouts/Layout";

// Feedback
import PageLoadingSpinner from "./components/feedback/PageLoadingSpinner";

// Pages
const HomePage = lazy(() => import("./pages/Homepage/HomePage"));
const AboutPage = lazy(() => import("./pages/about/AboutPage"));
const AdminDashboardPage = lazy(() => import("./pages/Admin/AdminDashBoardPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Auth Pages
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const AccountPage = lazy(() => import("./pages/Account/AccountPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const ReactivateRequestPage = lazy(() => import("./pages/Auth/ReactivateRequestPage"));
const ReactivateConfirmPage = lazy(() => import("./pages/Auth/ReactivateConfirmPage"));
const VerifyEmailPage = lazy(() => import("./pages/Auth/VerifyEmailPage"));
const VerifyEmailResendPage = lazy(() => import("./pages/Auth/VerifyEmailResenPage"));

const PageFallback = () => (
  <Box minH="100vh">
    <LoadingSpinner />
  </Box>
);

function App() {
  return (
    <Layout>
      <Suspense fallback={<PageLoadingSpinner />}>
        <Routes>

          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/account" element={
              <ProtectedRoute>
                <AccountPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />

          <Route path="/register" element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route path="/login" element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route path="/verify-email/:key" element={
              <PublicRoute>
                <VerifyEmailPage />
              </PublicRoute>
            }
          />
          <Route path="/resend-verification-email" element={
              <PublicRoute>
                <VerifyEmailResendPage />
              </PublicRoute>
            }
          />
          <Route path="/forgot-password" element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route path="/reset-password/:uid/:token" element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
          <Route path="/reactivate-account" element={
              <PublicRoute>
                <ReactivateRequestPage />
              </PublicRoute>
            }
          />
          <Route path="/reactivate-account/:uid/:token" element={
              <PublicRoute>
                <ReactivateConfirmPage />
              </PublicRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
