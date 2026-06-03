/**
 * LOGIN FORM TEST CHECKLIST
 * -------------------------
 * Initial Render
 * - Verify login form content is shown
 * - Verify login navigation links are shown
 *
 * -------------------------
 * User Input
 * - Verify email and password inputs update correctly
 *
 * -------------------------
 * Successful Login
 * - Verify login is called with valid email and password
 * - Verify successful login redirects user home
 *
 * -------------------------
 * Loading State
 * - Verify loading text is displayed while login is submitting
 * - Verify submit button is disabled while login is submitting
 * - Verify duplicate login is prevented by the disabled submit button
 *
 * -------------------------
 * Login Validation
 * - Verify login displays field errors
 * - Verify login displays non-field errors
 * - Verify unverified email error displays resend verification link
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
  mockLogin,
  mockNavigate,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  completeLoginForm,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import {
  expectRegisterLink,
  expectReactivateLink,
  expectEmailValue,
  expectPasswordValue,
  expectErrors,
} from "../../../tests/auth/authFormAssertions";

import LoginForm from "./LoginForm";
import useAuth from "../../../hooks/useAuth";

describe("LoginForm", () => {
  beforeEach(() => {
    clearAuthMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial login form", () => {
    /**
     * Arrange:
     * Render the LoginForm component.
     *
     * Act:
     * Query the heading, inputs, submit button, and navigation links.
     *
     * Assert:
     * Confirm the login form renders correctly.
     * Confirm navigation links point to the correct routes.
     */
    renderForm(LoginForm);

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("me@example.com")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("********")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Login" })
    ).toBeInTheDocument();

    expectRegisterLink();
    expectReactivateLink();

    expect(screen.getByText("Reset it")).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });

  // =====================
  // User Input
  // =====================

  test("updates email and password inputs when user types", () => {
    /**
     * Arrange:
     * Render the LoginForm component.
     *
     * Act:
     * Type values into the email and password inputs.
     *
     * Assert:
     * Confirm both input values update correctly.
     */
    renderForm(LoginForm);

    completeLoginForm({
      email: "test@example.com",
      password: "password123",
    });

    expectEmailValue("test@example.com");
    expectPasswordValue("password123");
  });

  // =====================
  // Successful Login
  // =====================

  test("calls login with entered values and redirects home on success", async () => {
    /**
     * Arrange:
     * Mock a successful login response.
     * Render the LoginForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm login is called with the correct values.
     * Confirm the user is redirected to the home page.
     */
    mockLogin.mockResolvedValue({
      success: true,
      errors: null,
    });

    renderForm(LoginForm);

    completeLoginForm({
      email: "test@example.com",
      password: "password123",
    });

    submitForm("Login");

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while login is submitting", async () => {
    /**
     * Arrange:
     * Mock login so the request stays pending.
     * Render the LoginForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    mockLogin.mockReturnValue(new Promise(() => {}));

    renderForm(LoginForm);

    completeLoginForm({
      email: "test@example.com",
      password: "password123",
    });

    submitForm("Login");

    expect(await screen.findByText("Logging in...")).toBeInTheDocument();
  });

  test("disables the submit button while login is submitting", async () => {
    /**
     * Arrange:
     * Mock login so the request stays pending.
     * Render the LoginForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm the submit button is disabled while loading.
     */
    mockLogin.mockReturnValue(new Promise(() => {}));

    renderForm(LoginForm);

    completeLoginForm({
      email: "test@example.com",
      password: "password123",
    });

    submitForm("Login");

    await screen.findByText("Logging in...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("prevents duplicate login while loading", async () => {
    /**
     * Arrange:
     * Mock login so the first request stays pending.
     * Render the LoginForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm login is only called once.
     * Confirm the button remains disabled while loading.
     */
    mockLogin.mockReturnValue(new Promise(() => {}));

    renderForm(LoginForm);

    completeLoginForm({
      email: "test@example.com",
      password: "password123",
    });

    submitForm("Login");

    await screen.findByText("Logging in...");

    expect(mockLogin).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Login Validation
  // =====================

  test("displays errors when login fails", async () => {
    /**
     * Arrange:
     * Mock a failed login response containing
     * field and non-field validation errors.
     * Render the LoginForm component.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm all returned validation errors display correctly.
     * Confirm navigation does not occur.
     */
    mockLogin.mockResolvedValue({
      success: false,
      errors: {
        email: ["Enter a valid email address."],
        password: ["Password is required."],
        non_field_errors: [
          "Unable to log in with provided credentials.",
        ],
      },
    });

    renderForm(LoginForm);

    submitForm("Login");

    await screen.findByText("Enter a valid email address.");

    expectErrors([
      "Enter a valid email address.",
      "Password is required.",
      "Unable to log in with provided credentials.",
    ]);

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows resend verification link when login fails because email is unverified", async () => {
    /**
     * Arrange:
     * Mock a failed login response containing
     * a non-field error that mentions verification.
     * Render the LoginForm component.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm the verification error is displayed.
     * Confirm the resend verification link is shown.
     */
    mockLogin.mockResolvedValue({
      success: false,
      errors: {
        non_field_errors: [
          "Email address is not verified.",
        ],
      },
    });

    renderForm(LoginForm);

    submitForm("Login");

    expect(
      await screen.findByText("Email address is not verified.")
    ).toBeInTheDocument();

    expect(screen.getByText("Resend it")).toHaveAttribute(
      "href",
      "/resend-verification-email"
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("shows resend verification link when detail error mentions verification", async () => {
    /**
     * Arrange:
     * Mock a failed login response containing
     * a detail error that mentions verification.
     * Render the LoginForm component.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm the resend verification link is shown.
     */
    mockLogin.mockResolvedValue({
      success: false,
      errors: {
        detail: "This account has not been verified.",
      },
    });

    renderForm(LoginForm);

    submitForm("Login");

    expect(
      await screen.findByText("Resend it")
    ).toHaveAttribute(
      "href",
      "/resend-verification-email"
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});