/**
 * LOGOUT FORM TEST CHECKLIST
 * --------------------------
 * Initial Render
 * - Verify logout button is shown
 *
 * --------------------------
 * Successful Logout
 * - Verify logout is called
 * - Verify successful logout redirects user home
 *
 * --------------------------
 * Loading State
 * - Verify loading text is displayed while logout is submitting
 * - Verify submit button is disabled while logout is submitting
 * - Verify duplicate logout is prevented by the disabled submit button
 *
 * --------------------------
 * Logout Validation
 * - Verify API error displays
 * - Verify fallback error displays
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
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

import LogoutForm from "./LogoutForm";
import useAuth from "../../../hooks/useAuth";

describe("LogoutForm", () => {
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

  test("shows the logout button", () => {
    /**
     * Arrange:
     * Render the LogoutForm component.
     *
     * Act:
     * Query the logout button.
     *
     * Assert:
     * Confirm the logout button renders correctly.
     */
    renderForm(LogoutForm);

    expect(
      screen.getByRole("button", { name: "Logout" })
    ).toBeInTheDocument();
  });

  // =====================
  // Successful Logout
  // =====================

  test("calls logout and redirects home on success", async () => {
    /**
     * Arrange:
     * Mock a successful logout response.
     * Render the LogoutForm component.
     *
     * Act:
     * Submit the logout form.
     *
     * Assert:
     * Confirm logout is called.
     * Confirm the user is redirected home.
     */
    mockLogout.mockResolvedValue({});

    renderForm(LogoutForm);

    submitForm("Logout");

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while logout is submitting", async () => {
    /**
     * Arrange:
     * Mock logout so the request stays pending.
     * Render the LogoutForm component.
     *
     * Act:
     * Submit the logout form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    mockLogout.mockReturnValue(new Promise(() => {}));

    renderForm(LogoutForm);

    submitForm("Logout");

    expect(
      await screen.findByText("Logging out...")
    ).toBeInTheDocument();
  });

  test("disables the submit button while logout is submitting", async () => {
    /**
     * Arrange:
     * Mock logout so the request stays pending.
     * Render the LogoutForm component.
     *
     * Act:
     * Submit the logout form.
     *
     * Assert:
     * Confirm the submit button is disabled.
     */
    mockLogout.mockReturnValue(new Promise(() => {}));

    renderForm(LogoutForm);

    submitForm("Logout");

    await screen.findByText("Logging out...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("prevents duplicate logout while loading", async () => {
    /**
     * Arrange:
     * Mock logout so the request stays pending.
     * Render the LogoutForm component.
     *
     * Act:
     * Submit the logout form.
     *
     * Assert:
     * Confirm logout is only called once.
     */
    mockLogout.mockReturnValue(new Promise(() => {}));

    renderForm(LogoutForm);

    submitForm("Logout");

    await screen.findByText("Logging out...");

    expect(mockLogout).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Logout Validation
  // =====================

  test("displays API error when logout fails", async () => {
    /**
     * Arrange:
     * Mock a failed logout response with an API error.
     * Render the LogoutForm component.
     *
     * Act:
     * Submit the logout form.
     *
     * Assert:
     * Confirm the API error is displayed.
     */
    mockLogout.mockRejectedValue({
      response: {
        data: {
          non_field_errors: [
            "Session could not be terminated.",
          ],
        },
      },
    });

    renderForm(LogoutForm);

    submitForm("Logout");

    expect(
      await screen.findByText(
        "Session could not be terminated."
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("displays fallback error when logout fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed logout response without response data.
     * Render the LogoutForm component.
     *
     * Act:
     * Submit the logout form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    mockLogout.mockRejectedValue({});

    renderForm(LogoutForm);

    submitForm("Logout");

    expect(
      await screen.findByText("Logout failed.")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});