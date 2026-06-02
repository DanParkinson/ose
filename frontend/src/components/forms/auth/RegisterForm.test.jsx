/**
 * REGISTER FORM TEST CHECKLIST
 * ----------------------------
 * Initial Render
 * - Verify register form content is shown
 * - Verify register navigation links are shown
 *
 * ----------------------------
 * User Input
 * - Verify email, password, and confirm password inputs update correctly
 *
 * ----------------------------
 * Successful Registration
 * - Verify register is called with valid email and passwords
 * - Verify successful registration shows verification message
 * - Verify successful registration does not redirect automatically
 *
 * ----------------------------
 * Loading State
 * - Verify loading text is displayed while registration is submitting
 * - Verify submit button is disabled while registration is submitting
 * - Verify duplicate registration is prevented by the disabled submit button
 *
 * ----------------------------
 * Register Validation
 * - Verify register displays field errors
 * - Verify register displays non-field errors
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
  mockRegister,
  mockNavigate,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  completeRegisterForm,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import {
  expectLoginLink,
  expectReactivateLink,
  expectResendVerificationLink,
  expectRegisterSuccess,
  expectErrors,
  expectEmailValue,
  expectPasswordValue,
  expectConfirmPasswordValue,
} from "../../../tests/auth/authFormAssertions";

import RegisterForm from "./RegisterForm";
import useAuth from "../../../hooks/useAuth";

describe("RegisterForm", () => {
  beforeEach(() => {
    clearAuthMocks();

    useAuth.mockReturnValue({
      register: mockRegister,
    });
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial register form", () => {
    /**
     * Arrange:
     * Render the RegisterForm component.
     *
     * Act:
     * Query the heading, inputs, and navigation links.
     *
     * Assert:
     * Confirm the register form renders correctly.
     * Confirm navigation links point to the correct routes.
     */
    renderForm(RegisterForm);

    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("me@example.com")).toBeInTheDocument();

    expect(screen.getAllByPlaceholderText("********")).toHaveLength(2);

    expectLoginLink();
    expectReactivateLink();
  });

  // =====================
  // User Input
  // =====================

  test("updates email and password inputs when user types", () => {
    /**
     * Arrange:
     * Render the RegisterForm component.
     *
     * Act:
     * Type values into the email, password,
     * and confirm password inputs.
     *
     * Assert:
     * Confirm all input values update correctly.
     */
    renderForm(RegisterForm);

    completeRegisterForm({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    expectEmailValue("test@example.com");
    expectPasswordValue("password123");
    expectConfirmPasswordValue("password123");
  });

  // =====================
  // Successful Registration
  // =====================

  test("calls register with entered values and shows success message", async () => {
    /**
     * Arrange:
     * Mock a successful register response.
     * Render the RegisterForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm register is called with the correct values.
     * Confirm the success verification message is displayed.
     * Confirm the user is not redirected automatically.
     */
    mockRegister.mockResolvedValue({
      success: true,
      errors: null,
    });

    renderForm(RegisterForm);

    completeRegisterForm({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    submitForm("Register");

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "password123"
      );
    });

    expectRegisterSuccess();
    expectResendVerificationLink();
    expectLoginLink();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while registration is submitting", async () => {
    /**
     * Arrange:
     * Mock register so the request stays pending.
     * Render the RegisterForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    mockRegister.mockReturnValue(new Promise(() => {}));

    renderForm(RegisterForm);

    completeRegisterForm({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    submitForm("Register");

    expect(await screen.findByText("Registering...")).toBeInTheDocument();
  });

  test("disables the submit button while registration is submitting", async () => {
    /**
     * Arrange:
     * Mock register so the request stays pending.
     * Render the RegisterForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm the submit button is disabled.
     */
    mockRegister.mockReturnValue(new Promise(() => {}));

    renderForm(RegisterForm);

    completeRegisterForm({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    submitForm("Register");

    await screen.findByText("Registering...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("prevents duplicate registration while loading", async () => {
    /**
     * Arrange:
     * Mock register so the first request stays pending.
     * Render the RegisterForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm register is only called once.
     * Confirm the button remains disabled while loading.
     */
    mockRegister.mockReturnValue(new Promise(() => {}));

    renderForm(RegisterForm);

    completeRegisterForm({
      email: "test@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    submitForm("Register");

    await screen.findByText("Registering...");

    expect(mockRegister).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Register Validation
  // =====================

  test("displays errors when registration fails", async () => {
    /**
     * Arrange:
     * Mock a failed register response containing
     * field and non-field validation errors.
     * Render the RegisterForm component.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm all returned validation errors display correctly.
     * Confirm navigation does not occur.
     */
    mockRegister.mockResolvedValue({
      success: false,
      errors: {
        email: ["A user is already registered with this email."],
        password1: ["This password is too common."],
        password2: ["The two password fields didn’t match."],
        non_field_errors: ["Registration failed."],
      },
    });

    renderForm(RegisterForm);

    submitForm("Register");

    await screen.findByText("A user is already registered with this email.");

    expectErrors([
      "A user is already registered with this email.",
      "This password is too common.",
      "The two password fields didn’t match.",
      "Registration failed.",
    ]);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});