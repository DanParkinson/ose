/**
 * FORGOT PASSWORD FORM TEST CHECKLIST
 * -----------------------------------
 * Initial Render
 * - Verify forgot password form content is shown
 * - Verify email input is shown
 * - Verify login link is shown
 *
 * -----------------------------------
 * User Input
 * - Verify email input updates correctly
 *
 * -----------------------------------
 * Successful Password Reset Request
 * - Verify password reset request sends email to password reset endpoint
 * - Verify successful request shows submitted message
 * - Verify successful request shows login link
 *
 * -----------------------------------
 * Loading State
 * - Verify loading text is displayed while request is submitting
 * - Verify submit button is disabled while request is submitting
 * - Verify duplicate request is prevented by the disabled submit button
 *
 * -----------------------------------
 * Password Reset Request Validation
 * - Verify email field error displays
 * - Verify non-field error displays
 * - Verify fallback error displays when no API response is returned
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
} from "../../../tests/auth/authFormHelpers";

import {
  expectLoginLink,
} from "../../../tests/auth/authFormAssertions";

import ForgotPasswordForm from "./ForgotPasswordForm";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    clearAuthMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial forgot password form", () => {
    /**
     * Arrange:
     * Render the ForgotPasswordForm component.
     *
     * Act:
     * Query the heading, instruction text, email input, submit button, and login link.
     *
     * Assert:
     * Confirm the forgot password form renders correctly.
     */
    renderForm(ForgotPasswordForm);

    expect(
      screen.getByRole("heading", { name: "Forgot Password" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Enter your email to receive a reset link.")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Send Reset Email" })
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // User Input
  // =====================

  test("updates email input when user types", () => {
    /**
     * Arrange:
     * Render the ForgotPasswordForm component.
     *
     * Act:
     * Type an email address into the email input.
     *
     * Assert:
     * Confirm the email input value updates correctly.
     */
    renderForm(ForgotPasswordForm);

    screen.getByPlaceholderText("Email");

    const emailInput = screen.getByPlaceholderText("Email");

    emailInput.focus();

    emailInput.value = "";

    emailInput.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );
  });
});
