/**
 * DEACTIVATE ACCOUNT FORM TEST CHECKLIST
 * --------------------------------------
 * Initial Render
 * - Verify deactivate account button is shown
 * - Verify deactivation warning text is shown
 *
 * --------------------------------------
 * Confirmation State
 * - Verify clicking deactivate shows confirmation message
 * - Verify confirm deactivation button is shown
 * - Verify cancel button is shown
 * - Verify clicking cancel returns to initial state
 *
 * --------------------------------------
 * Successful Deactivation
 * - Verify deactivation request is sent to deactivate endpoint
 * - Verify logout is called after successful deactivation
 * - Verify user is redirected home after logout
 *
 * --------------------------------------
 * Loading State
 * - Verify loading text is displayed while deactivation is submitting
 * - Verify confirm and cancel buttons are disabled while deactivation is submitting
 * - Verify duplicate deactivation is prevented by the disabled confirm button
 *
 * --------------------------------------
 * Deactivation Validation
 * - Verify API error displays
 * - Verify fallback error displays
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
  mockLogout,
  mockNavigate,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import DeactivateAccountForm from "./DeactivateAccountForm";
import useAuth from "../../../hooks/useAuth";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

describe("DeactivateAccountForm", () => {
  beforeEach(() => {
    clearAuthMocks();

    useAuth.mockReturnValue({
      logout: mockLogout,
    });
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial deactivate account form", () => {
    /**
     * Arrange:
     * Render the DeactivateAccountForm component.
     *
     * Act:
     * Query the deactivate button and warning text.
     *
     * Assert:
     * Confirm the initial deactivate account form renders correctly.
     */
    renderForm(DeactivateAccountForm);

    expect(
      screen.getByRole("button", { name: "Deactivate Account" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Deactivating your account will hide your profile and content/i
      )
    ).toBeInTheDocument();
  });

  // =====================
  // Confirmation State
  // =====================

  test("shows confirmation options when deactivate account is clicked", () => {
    /**
     * Arrange:
     * Render the DeactivateAccountForm component.
     *
     * Act:
     * Click the deactivate account button.
     *
     * Assert:
     * Confirm the confirmation message, confirm button,
     * and cancel button are displayed.
     */
    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    expect(
      screen.getByText("Are you sure you want to deactivate your account?")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Confirm Deactivation" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toBeInTheDocument();
  });

  test("returns to initial state when cancel is clicked", () => {
    /**
     * Arrange:
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Click the cancel button.
     *
     * Assert:
     * Confirm the initial deactivate button is shown again.
     */
    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Cancel");

    expect(
      screen.getByRole("button", { name: "Deactivate Account" })
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: "Confirm Deactivation" })
    ).not.toBeInTheDocument();
  });

  // =====================
  // Successful Deactivation
  // =====================

  test("calls deactivate endpoint, logs out, and redirects home on success", async () => {
    /**
     * Arrange:
     * Mock a successful deactivate response and logout response.
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Submit the confirm deactivation button.
     *
     * Assert:
     * Confirm the deactivate API request is sent.
     * Confirm logout is called.
     * Confirm the user is redirected home.
     */
    axiosRequest.post.mockResolvedValue({});
    mockLogout.mockResolvedValue({});

    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Confirm Deactivation");

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/account/deactivate/"
      );
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while deactivation is submitting", async () => {
    /**
     * Arrange:
     * Mock deactivate request so it stays pending.
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Submit the confirm deactivation button.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Confirm Deactivation");

    expect(
      await screen.findByText("Deactivating...")
    ).toBeInTheDocument();
  });

  test("disables confirm and cancel buttons while deactivation is submitting", async () => {
    /**
     * Arrange:
     * Mock deactivate request so it stays pending.
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Submit the confirm deactivation button.
     *
     * Assert:
     * Confirm both confirm and cancel buttons are disabled.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Confirm Deactivation");

    await screen.findByText("Deactivating...");

    expect(
      screen.getByRole("button", { name: /Deactivating.../i })
    ).toBeDisabled();

    expect(
      screen.getByRole("button", { name: "Cancel" })
    ).toBeDisabled();
  });

  test("prevents duplicate deactivation while loading", async () => {
    /**
     * Arrange:
     * Mock deactivate request so the first request stays pending.
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Submit the confirm deactivation button.
     *
     * Assert:
     * Confirm deactivate request is only called once.
     * Confirm the confirm button remains disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Confirm Deactivation");

    await screen.findByText("Deactivating...");

    expect(axiosRequest.post).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("button", { name: /Deactivating.../i })
    ).toBeDisabled();
  });

  // =====================
  // Deactivation Validation
  // =====================

  test("displays API error when deactivation fails", async () => {
    /**
     * Arrange:
     * Mock a failed deactivate response with an API error.
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Submit the confirm deactivation button.
     *
     * Assert:
     * Confirm the API error is displayed.
     * Confirm logout and navigation do not occur.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: [
            "Account could not be deactivated.",
          ],
        },
      },
    });

    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Confirm Deactivation");

    expect(
      await screen.findByText("Account could not be deactivated.")
    ).toBeInTheDocument();

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("displays fallback error when deactivation fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed deactivate response without response data.
     * Render the DeactivateAccountForm component.
     * Open the confirmation state.
     *
     * Act:
     * Submit the confirm deactivation button.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     * Confirm logout and navigation do not occur.
     */
    axiosRequest.post.mockRejectedValue({});

    renderForm(DeactivateAccountForm);

    submitForm("Deactivate Account");

    submitForm("Confirm Deactivation");

    expect(
      await screen.findByText("Account deactivation failed.")
    ).toBeInTheDocument();

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
