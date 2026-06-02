/**
 * VERIFY EMAIL RESEND FORM TEST CHECKLIST
 * ---------------------------------------
 * Initial Render
 * - Verify resend verification form content is shown
 * - Verify email input is shown
 * - Verify login link is shown
 *
 * ---------------------------------------
 * User Input
 * - Verify email input updates correctly
 *
 * ---------------------------------------
 * Successful Resend
 * - Verify resend request sends email to resend verification endpoint
 * - Verify successful resend shows success message
 * - Verify successful resend shows login link
 *
 * ---------------------------------------
 * Loading State
 * - Verify loading text is displayed while request is submitting
 * - Verify submit button is disabled while request is submitting
 * - Verify duplicate resend is prevented by the disabled submit button
 *
 * ---------------------------------------
 * Resend Validation
 * - Verify email field error displays
 * - Verify non-field error displays
 * - Verify detail error displays
 * - Verify fallback error displays when no API response is returned
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
  mockNavigate,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  typeEmail,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import {
  expectLoginLink,
  expectEmailValue,
  expectErrors,
} from "../../../tests/auth/authFormAssertions";

import VerifyEmailResendForm from "./VerifyEmailResendForm";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

describe("VerifyEmailResendForm", () => {
  beforeEach(() => {
    clearAuthMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial resend verification form", () => {
    /**
     * Arrange:
     * Render the VerifyEmailResendForm component.
     *
     * Act:
     * Query the heading, instruction text, email input, submit button, and login link.
     *
     * Assert:
     * Confirm the resend verification form renders correctly.
     */
    renderForm(VerifyEmailResendForm);

    expect(
      screen.getByRole("heading", { name: "Resend Verification Email" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Enter your email address and we will send you a new verification link."
      )
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("me@example.com")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Resend Verification Email" })
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // User Input
  // =====================

  test("updates email input when user types", () => {
    /**
     * Arrange:
     * Render the VerifyEmailResendForm component.
     *
     * Act:
     * Type an email address into the email input.
     *
     * Assert:
     * Confirm the email input value updates correctly.
     */
    renderForm(VerifyEmailResendForm);

    typeEmail("test@example.com");

    expectEmailValue("test@example.com");
  });

  // =====================
  // Successful Resend
  // =====================

  test("sends email to resend verification endpoint", async () => {
    /**
     * Arrange:
     * Mock a successful resend verification response.
     * Render the VerifyEmailResendForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the API request is sent to the correct endpoint
     * with the entered email address.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(VerifyEmailResendForm);

    typeEmail("test@example.com");

    submitForm("Resend Verification Email");

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/auth/registration/resend-email/",
        {
          email: "test@example.com",
        }
      );
    });
  });

  test("shows success message when resend verification succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful resend verification response.
     * Render the VerifyEmailResendForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the success message is displayed.
     * Confirm the login link is displayed.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(VerifyEmailResendForm);

    typeEmail("test@example.com");

    submitForm("Resend Verification Email");

    expect(
      await screen.findByText(
        "If the email address belongs to an unverified account, a new verification email has been sent."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please check your inbox and follow the verification link.")
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while resend verification is submitting", async () => {
    /**
     * Arrange:
     * Mock resend verification so the request stays pending.
     * Render the VerifyEmailResendForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(VerifyEmailResendForm);

    typeEmail("test@example.com");

    submitForm("Resend Verification Email");

    expect(await screen.findByText("Sending...")).toBeInTheDocument();
  });

  test("disables the submit button while resend verification is submitting", async () => {
    /**
     * Arrange:
     * Mock resend verification so the request stays pending.
     * Render the VerifyEmailResendForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the submit button is disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(VerifyEmailResendForm);

    typeEmail("test@example.com");

    submitForm("Resend Verification Email");

    await screen.findByText("Sending...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("prevents duplicate resend while loading", async () => {
    /**
     * Arrange:
     * Mock resend verification so the first request stays pending.
     * Render the VerifyEmailResendForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm resend is only called once.
     * Confirm the button remains disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(VerifyEmailResendForm);

    typeEmail("test@example.com");

    submitForm("Resend Verification Email");

    await screen.findByText("Sending...");

    expect(axiosRequest.post).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Resend Validation
  // =====================

  test("displays email field error when resend verification fails", async () => {
    /**
     * Arrange:
     * Mock a failed resend verification response with an email field error.
     * Render the VerifyEmailResendForm component.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the email field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          email: ["Enter a valid email address."],
        },
      },
    });

    renderForm(VerifyEmailResendForm);

    submitForm("Resend Verification Email");

    expect(
      await screen.findByText("Enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("displays non-field error when resend verification fails", async () => {
    /**
     * Arrange:
     * Mock a failed resend verification response with a non-field error.
     * Render the VerifyEmailResendForm component.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the non-field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: [
            "Unable to resend verification email.",
          ],
        },
      },
    });

    renderForm(VerifyEmailResendForm);

    submitForm("Resend Verification Email");

    expect(
      await screen.findByText("Unable to resend verification email.")
    ).toBeInTheDocument();
  });

  test("displays detail error when resend verification fails", async () => {
    /**
     * Arrange:
     * Mock a failed resend verification response with a detail error.
     * Render the VerifyEmailResendForm component.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the detail error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          detail: "Request failed.",
        },
      },
    });

    renderForm(VerifyEmailResendForm);

    submitForm("Resend Verification Email");

    expect(await screen.findByText("Request failed.")).toBeInTheDocument();
  });

  test("displays fallback error when resend verification fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed resend verification response without response data.
     * Render the VerifyEmailResendForm component.
     *
     * Act:
     * Submit the resend verification form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    axiosRequest.post.mockRejectedValue({});

    renderForm(VerifyEmailResendForm);

    submitForm("Resend Verification Email");

    expect(
      await screen.findByText(
        "Unable to resend verification email. Please check the email address and try again."
      )
    ).toBeInTheDocument();
  });
});