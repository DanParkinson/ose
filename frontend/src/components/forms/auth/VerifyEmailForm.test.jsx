/**
 * VERIFY EMAIL FORM TEST CHECKLIST
 * --------------------------------
 * Initial Render
 * - Verify verify email form content is shown
 * - Verify verify email button is shown
 *
 * --------------------------------
 * Email Verification
 * - Verify valid verification key sends request to verify email endpoint
 * - Verify successful verification shows success message
 * - Verify successful verification shows login link
 *
 * --------------------------------
 * Loading State
 * - Verify loading message is displayed while email is verifying
 * - Verify submit button is disabled while email is verifying
 *
 * --------------------------------
 * Verify Email Validation
 * - Verify invalid verification key displays API error
 * - Verify detail error displays when returned by API
 * - Verify missing API error displays fallback error message
 * - Verify error state shows resend verification link
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
  mockParams,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import VerifyEmailForm from "./VerifyEmailForm";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

describe("VerifyEmailForm", () => {
  beforeEach(() => {
    clearAuthMocks();

    mockParams.key = "valid-verification-key";
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial verify email form", () => {
    /**
     * Arrange:
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Query the heading, instruction text, and verify button.
     *
     * Assert:
     * Confirm the verify email form renders correctly.
     */
    renderForm(VerifyEmailForm);

    expect(
      screen.getByRole("heading", { name: "Verify Email" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Click the button below to verify your email address.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Verify Email" })
    ).toBeInTheDocument();
  });

  // =====================
  // Email Verification
  // =====================

  test("sends verification key to verify email endpoint", async () => {
    /**
     * Arrange:
     * Mock a successful verify email response.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the API request is sent to the correct endpoint
     * with the verification key from the URL params.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/auth/registration/verify-email/",
        {
          key: "valid-verification-key",
        }
      );
    });
  });

  test("shows success message when email verification succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful verify email response.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the success message is displayed.
     * Confirm the login link is displayed.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    expect(
      await screen.findByText("Your email address has been verified.")
    ).toBeInTheDocument();

    expect(screen.getByText("login")).toHaveAttribute("href", "/login");
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading message while email is verifying", async () => {
    /**
     * Arrange:
     * Mock verify email so the request stays pending.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the loading message is displayed.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    expect(
      await screen.findByText("Verifying email address...")
    ).toBeInTheDocument();

    expect(screen.getByText("Verifying...")).toBeInTheDocument();
  });

  test("disables the submit button while email is verifying", async () => {
    /**
     * Arrange:
     * Mock verify email so the request stays pending.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the submit button is disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    await screen.findByText("Verifying...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Verify Email Validation
  // =====================

  test("displays API error when email verification fails", async () => {
    /**
     * Arrange:
     * Mock a failed verify email response with an API error.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the API error is displayed.
     * Confirm the resend verification link is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: [
            "This verification link is invalid or has expired.",
          ],
        },
      },
    });

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    expect(
      await screen.findByText(
        "This verification link is invalid or has expired."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Resend it")).toHaveAttribute(
      "href",
      "/resend-verification-email"
    );
  });

  test("displays detail error when email verification fails with detail response", async () => {
    /**
     * Arrange:
     * Mock a failed verify email response with a detail error.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the detail error is displayed.
     * Confirm the resend verification link is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          detail: "Not found.",
        },
      },
    });

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    expect(await screen.findByText("Not found.")).toBeInTheDocument();

    expect(screen.getByText("Resend it")).toHaveAttribute(
      "href",
      "/resend-verification-email"
    );
  });

  test("displays fallback error when email verification fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed verify email response without response data.
     * Render the VerifyEmailForm component.
     *
     * Act:
     * Submit the verify email form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     * Confirm the resend verification link is displayed.
     */
    axiosRequest.post.mockRejectedValue({});

    renderForm(VerifyEmailForm);

    submitForm("Verify Email");

    expect(
      await screen.findByText(
        "This verification link is invalid or has expired."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Resend it")).toHaveAttribute(
      "href",
      "/resend-verification-email"
    );
  });
});