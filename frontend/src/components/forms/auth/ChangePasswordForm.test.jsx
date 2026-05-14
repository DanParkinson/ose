/**
 * ChangePasswordForm Tests
 *
 * This test suite verifies:
 *
 * 1. Password form submission
 * 2. Correct values are passed to changePassword
 * 3. Success response clears the form and displays a success message
 * 4. Backend validation errors are displayed
 * 5. Field-specific errors are cleared when the user edits that field
 *
 * Base form components are mocked so this test focuses only on
 * ChangePasswordForm behaviour, not Chakra UI rendering.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import ChangePasswordForm from "./ChangePasswordForm";
import useAuth from "../../../hooks/UseAuth";

vi.mock("../../../hooks/UseAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../base/AccountFormContainer", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/FormTextInput", () => ({
  default: (props) => <input {...props} />,
}));

vi.mock("../base/FormError", () => ({
  default: ({ children }) => (children ? <p>{children}</p> : null),
}));

vi.mock("../base/FormSuccess", () => ({
  default: ({ children }) => <p>{children}</p>,
}));

vi.mock("../base/FormSubmitButton", () => ({
  default: ({ children, onClick }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

describe("ChangePasswordForm", () => {
  const mockChangePassword = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      changePassword: mockChangePassword,
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("calls changePassword with the entered password values", async () => {
    /**
     * Arrange:
     * Mock a successful password change response.
     * Render the form and enter values into all password fields.
     *
     * Act:
     * Click the Update Password button.
     *
     * Assert:
     * Confirm changePassword is called with the current password,
     * new password, and confirm password values.
     */
    mockChangePassword.mockResolvedValue({
      success: true,
      errors: null,
    });

    render(<ChangePasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Current password"), {
      target: { value: "oldpassword" },
    });

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByText("Update Password"));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith(
        "oldpassword",
        "newpassword123",
        "newpassword123"
      );
    });
  });

  test("shows success message and clears fields when password change succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful password change response.
     * Render the form and fill in all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the success message is displayed.
     * Confirm all password fields are cleared.
     */
    mockChangePassword.mockResolvedValue({
      success: true,
      errors: null,
    });

    render(<ChangePasswordForm />);

    const oldInput = screen.getByPlaceholderText("Current password");
    const newInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm new password");

    fireEvent.change(oldInput, {
      target: { value: "oldpassword" },
    });

    fireEvent.change(newInput, {
      target: { value: "newpassword123" },
    });

    fireEvent.change(confirmInput, {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByText("Update Password"));

    expect(
      await screen.findByText("Password updated successfully.")
    ).toBeInTheDocument();

    expect(oldInput).toHaveValue("");
    expect(newInput).toHaveValue("");
    expect(confirmInput).toHaveValue("");
  });

  test("displays backend validation errors when password change fails", async () => {
    /**
     * Arrange:
     * Mock a failed password change response containing
     * field-specific and non-field validation errors.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm all backend validation errors are rendered.
     */
    mockChangePassword.mockResolvedValue({
      success: false,
      errors: {
        old_password: ["Your old password was entered incorrectly."],
        new_password1: ["This password is too common."],
        new_password2: ["The two password fields didn’t match."],
        non_field_errors: ["Password change failed."],
      },
    });

    render(<ChangePasswordForm />);

    fireEvent.click(screen.getByText("Update Password"));

    expect(
      await screen.findByText("Your old password was entered incorrectly.")
    ).toBeInTheDocument();

    expect(screen.getByText("This password is too common.")).toBeInTheDocument();

    expect(
      screen.getByText("The two password fields didn’t match.")
    ).toBeInTheDocument();

    expect(screen.getByText("Password change failed.")).toBeInTheDocument();
  });

  test("clears old password error when current password field changes", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with an old password error.
     * Render the form and submit it.
     *
     * Act:
     * Update the current password field.
     *
     * Assert:
     * Confirm the old password error is removed after editing the field.
     */
    mockChangePassword.mockResolvedValue({
      success: false,
      errors: {
        old_password: ["Your old password was entered incorrectly."],
      },
    });

    render(<ChangePasswordForm />);

    fireEvent.click(screen.getByText("Update Password"));

    expect(
      await screen.findByText("Your old password was entered incorrectly.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Current password"), {
      target: { value: "updated-old-password" },
    });

    expect(
      screen.queryByText("Your old password was entered incorrectly.")
    ).not.toBeInTheDocument();
  });

  test("clears new password error when new password field changes", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with a new password error.
     * Render the form and submit it.
     *
     * Act:
     * Update the new password field.
     *
     * Assert:
     * Confirm the new password error is removed after editing the field.
     */
    mockChangePassword.mockResolvedValue({
      success: false,
      errors: {
        new_password1: ["This password is too common."],
      },
    });

    render(<ChangePasswordForm />);

    fireEvent.click(screen.getByText("Update Password"));

    expect(
      await screen.findByText("This password is too common.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "better-password" },
    });

    expect(
      screen.queryByText("This password is too common.")
    ).not.toBeInTheDocument();
  });

  test("clears confirm password error when confirm password field changes", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with a confirm password error.
     * Render the form and submit it.
     *
     * Act:
     * Update the confirm password field.
     *
     * Assert:
     * Confirm the confirm password error is removed after editing the field.
     */
    mockChangePassword.mockResolvedValue({
      success: false,
      errors: {
        new_password2: ["The two password fields didn’t match."],
      },
    });

    render(<ChangePasswordForm />);

    fireEvent.click(screen.getByText("Update Password"));

    expect(
      await screen.findByText("The two password fields didn’t match.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Confirm new password"), {
      target: { value: "matching-password" },
    });

    expect(
      screen.queryByText("The two password fields didn’t match.")
    ).not.toBeInTheDocument();
  });
});
