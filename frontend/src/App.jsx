import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminRoute from "./routes/AdminRoute";

import Layout from "./layouts/Layout";

import HomePage from "./pages/Homepage/HomePage";
import AboutPage from "./pages/about/AboutPage";
import AdminDashboardPage from "./pages/Admin/AdminDashBoardPage";
import NotFoundPage from "./pages/NotFoundPage";

import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import AccountPage from "./pages/Account/AccountPage";
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import ReactivateRequestPage from "./pages/Auth/ReactivateRequestPage";
import ReactivateConfirmPage from "./pages/Auth/ReactivateConfirmPage";
import SubjectListPage from "./pages/SubjectList/SubjectListPage";
import SubjectDashboardPage from "./pages/SubjectDashboard/SubjectDashboardPage";




function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={
            <HomePage />
        }
        />

        <Route
          path="/about"
          element={
              <AboutPage />
          }
        />

        <Route
          path="/subjects"
          element={
              <SubjectListPage />
          }
        />

        <Route
          path="/subjects/:subjectSlug/:subjectId/"
          element={<SubjectDashboardPage/>}
        />

        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reset-password/:uid/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reactivate-account"
          element={
            <PublicRoute>
              <ReactivateRequestPage />
            </PublicRoute>
          }
        />

        <Route
          path="/reactivate-account/:uid/:token"
          element={
            <PublicRoute>
              <ReactivateConfirmPage />
            </PublicRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />


        <Route
          path="*"
          element={
            <NotFoundPage />
          }
        />

      </Routes>
    </Layout>
  );
}

export default App;
