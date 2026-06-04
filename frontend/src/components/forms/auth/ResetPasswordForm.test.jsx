/**
 * RESET PASSWORD FORM TEST CHECKLIST
 * ----------------------------------
 * Initial Render
 * - Verify reset password form content is shown
 * - Verify password inputs are shown
 * - Verify login link is shown
 *
 * ----------------------------------
 * User Input
 * - Verify new password and confirm password inputs update correctly
 *
 * ----------------------------------
 * Successful Password Reset
 * - Verify reset request sends uid, token, and passwords to password reset confirm endpoint
 * - Verify successful reset shows success message
 * - Verify successful reset shows login link
 * - Verify successful reset redirects user to login after delay
 *
 * ----------------------------------
 * Loading State
 * - Verify loading text is displayed while reset request is submitting
 * - Verify submit button is disabled while reset request is submitting
 * - Verify duplicate reset is prevented by the disabled submit button
 *
 * ----------------------------------
 * Password Reset Validation
 * - Verify mismatched passwords display local validation error
 * - Verify API password field errors display
 * - Verify non-field error displays
 * - Verify fallback error displays when no API response is returned
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
  mockNavigate,
  mockParams,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import {
  expectLoginLink,
} from "../../../tests/auth/authFormAssertions";

import ResetPasswordForm from "./ResetPasswordForm";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

const typeNewPassword = (value = "newPassword123") => {
  fireEvent.change(screen.getByPlaceholderText("New password"), {
    target: { value },
  });
};

const typeConfirmPassword = (value = "newPassword123") => {
  fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
    target: { value },
  });
};

describe("ResetPasswordForm", () => {
  beforeEach(() => {
    clearAuthMocks();

    mockParams.uid = "test-uid";
    mockParams.token = "test-token";

    vi.useRealTimers();
  });

  afterEach(() => {
    cleanup();

    vi.useRealTimers();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial reset password form", () => {
    /**
     * Arrange:
     * Render the ResetPasswordForm component.
     *
     * Act:
     * Query the heading, password inputs, submit button, and login link.
     *
     * Assert:
     * Confirm the reset password form renders correctly.
     */
    renderForm(ResetPasswordForm);

    expect(
      screen.getByRole("heading", { name: "Reset Password" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // User Input
  // =====================

  test("updates password inputs when user types", () => {
    /**
     * Arrange:
     * Render the ResetPasswordForm component.
     *
     * Act:
     * Type values into the new password and confirm password inputs.
     *
     * Assert:
     * Confirm both password input values update correctly.
     */
    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    expect(screen.getByPlaceholderText("New password")).toHaveValue(
      "newPassword123"
    );

    expect(screen.getByPlaceholderText("Confirm password")).toHaveValue(
      "newPassword123"
    );
  });

  // =====================
  // Successful Password Reset
  // =====================

  test("sends uid token and passwords to reset password endpoint", async () => {
    /**
     * Arrange:
     * Mock a successful password reset confirm response.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the API request is sent to the correct endpoint
     * with the uid, token, and passwords from the form and URL params.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/auth/password/reset/confirm/",
        {
          uid: "test-uid",
          token: "test-token",
          new_password1: "newPassword123",
          new_password2: "newPassword123",
        }
      );
    });
  });

  test("shows success message when password reset succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful password reset confirm response.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the success message is displayed.
     * Confirm the login link is displayed.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    expect(
      await screen.findByText("Password updated. Redirecting...")
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while reset password is submitting", async () => {
    /**
     * Arrange:
     * Mock password reset so the request stays pending.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    expect(await screen.findByText("Resetting...")).toBeInTheDocument();
  });

  test("disables the submit button while reset password is submitting", async () => {
    /**
     * Arrange:
     * Mock password reset so the request stays pending.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the submit button is disabled.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    await screen.findByText("Resetting...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("prevents duplicate reset while loading", async () => {
    /**
     * Arrange:
     * Mock password reset so the first request stays pending.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm reset request is only called once.
     * Confirm the button remains disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    await screen.findByText("Resetting...");

    expect(axiosRequest.post).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Password Reset Validation
  // =====================

  test("displays local validation error when passwords do not match", async () => {
    /**
     * Arrange:
     * Render the ResetPasswordForm component.
     * Populate both password fields with different values.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm local mismatch error is displayed.
     * Confirm no API request is sent.
     */
    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("differentPassword123");

    submitForm("Reset Password");

    expect(
      await screen.findByText("Passwords do not match.")
    ).toBeInTheDocument();

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("displays API password field errors when reset password fails", async () => {
    /**
     * Arrange:
     * Mock a failed password reset confirm response
     * containing password field errors.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm password field errors are displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          new_password1: ["This password is too common."],
          new_password2: ["The two password fields didn’t match."],
        },
      },
    });

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    expect(
      await screen.findByText("This password is too common.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("The two password fields didn’t match.")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("displays non-field error when reset password fails", async () => {
    /**
     * Arrange:
     * Mock a failed password reset confirm response
     * containing a non-field error.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the non-field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["Invalid or expired reset link."],
        },
      },
    });

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    expect(
      await screen.findByText("Invalid or expired reset link.")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("displays fallback error when reset password fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed password reset confirm response without response data.
     * Render the ResetPasswordForm component.
     * Populate both password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    axiosRequest.post.mockRejectedValue({});

    renderForm(ResetPasswordForm);

    typeNewPassword("newPassword123");
    typeConfirmPassword("newPassword123");

    submitForm("Reset Password");

    expect(
      await screen.findByText("Invalid or expired reset link.")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
