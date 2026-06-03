/**
 * REACTIVATE CONFIRM FORM TEST CHECKLIST
 * --------------------------------------
 * Initial Render
 * - Verify reactivate account form content is shown
 * - Verify reactivate account button is shown
 *
 * --------------------------------------
 * Account Reactivation
 * - Verify reactivation request sends uid and token to confirm endpoint
 * - Verify successful reactivation shows success message
 * - Verify successful reactivation shows login link
 *
 * --------------------------------------
 * Loading State
 * - Verify loading message is displayed while reactivation is submitting
 * - Verify submit button is disabled while reactivation is submitting
 *
 * --------------------------------------
 * Reactivation Validation
 * - Verify API non-field error displays
 * - Verify API detail error displays
 * - Verify fallback error displays when no API response is returned
 * - Verify error state shows request another link
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

import ReactivateConfirmForm from "./ReactivateConfirmForm";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

describe("ReactivateConfirmForm", () => {
  beforeEach(() => {
    clearAuthMocks();

    mockParams.uid = "abc123";
    mockParams.token = "token123";
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial reactivate confirm form", () => {
    /**
     * Arrange:
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Query the heading, instruction text, and reactivate button.
     *
     * Assert:
     * Confirm the initial reactivate confirm form renders correctly.
     */
    renderForm(ReactivateConfirmForm);

    expect(
      screen.getByRole("heading", { name: "Reactivate Account" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Click the button below to reactivate your account.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reactivate Account" })
    ).toBeInTheDocument();
  });

  // =====================
  // Account Reactivation
  // =====================

  test("sends uid and token to reactivate confirm endpoint", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation response.
     * Mock route params containing uid and token.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the API request is sent to the correct endpoint
     * with the uid and token from the URL params.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/account/reactivate/confirm/",
        {
          uid: "abc123",
          token: "token123",
        }
      );
    });
  });

  test("shows success message when account reactivation succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation response.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the success message is displayed.
     * Confirm the login link is displayed.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    expect(
      await screen.findByText("Your account has been reactivated.")
    ).toBeInTheDocument();

    expect(screen.getByText("login")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading message while account is reactivating", async () => {
    /**
     * Arrange:
     * Mock reactivation request so the request stays pending.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the loading message and loading button text are displayed.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    expect(
      await screen.findByText("Reactivating account...")
    ).toBeInTheDocument();

    expect(screen.getByText("Reactivating...")).toBeInTheDocument();
  });

  test("disables the submit button while account is reactivating", async () => {
    /**
     * Arrange:
     * Mock reactivation request so the request stays pending.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the submit button is disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    await screen.findByText("Reactivating...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Reactivation Validation
  // =====================

  test("displays API non-field error when reactivation fails", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation response with a non-field error.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the API error is displayed.
     * Confirm the request another link is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["Invalid or expired link."],
        },
      },
    });

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    expect(
      await screen.findByText("Invalid or expired link.")
    ).toBeInTheDocument();

    expect(screen.getByText("Request one")).toHaveAttribute(
      "href",
      "/reactivate-account"
    );
  });

  test("displays API detail error when reactivation fails", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation response with a detail error.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the detail error is displayed.
     * Confirm the request another link is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          detail: "Not found.",
        },
      },
    });

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    expect(await screen.findByText("Not found.")).toBeInTheDocument();

    expect(screen.getByText("Request one")).toHaveAttribute(
      "href",
      "/reactivate-account"
    );
  });

  test("displays fallback error when reactivation fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation response without response data.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Submit the reactivate confirm form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     * Confirm the request another link is displayed.
     */
    axiosRequest.post.mockRejectedValue({});

    renderForm(ReactivateConfirmForm);

    submitForm("Reactivate Account");

    expect(
      await screen.findByText(
        "This reactivation link is invalid or has expired."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Request one")).toHaveAttribute(
      "href",
      "/reactivate-account"
    );
  });
});
