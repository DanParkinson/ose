/**
 * ResetPasswordForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial reset password form content is shown
 * 2. Password fields update correctly
 * 3. Password mismatch is handled before the API request
 * 4. Successful reset posts uid, token, and passwords to the API
 * 5. Successful reset redirects to login
 * 6. Backend validation errors are displayed
 * 7. Fallback error is displayed when no backend data exists
 * 8. Field-specific errors clear when the user edits fields
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

import ResetPasswordForm from "./ResetPasswordForm";
import { axiosRequest } from "../../../api/axiosDefaults";
import { useNavigate, useParams } from "react-router-dom";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}));

vi.mock("@chakra-ui/react", () => ({
  chakra: (Component) => Component,
  Input: (props) => <input {...props} />,
  Text: ({ children }) => <p>{children}</p>,
  Box: ({ children }) => <div>{children}</div>,
  HStack: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/FormContainer", () => ({
  default: ({ title, children }) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

vi.mock("../base/FormTextInput", () => ({
  default: (props) => <input {...props} />,
}));

vi.mock("../base/FormError", () => ({
  default: ({ children }) => (children ? <p>{children}</p> : null),
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
  default: () => <span>spinner</span>,
}));

vi.mock("../base/FormSubmitButton", () => ({
  default: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("../base/FormLink", () => ({
  default: ({ text, to, linkText }) => (
    <p>
      {text} <a href={to}>{linkText}</a>
    </p>
  ),
}));

describe("ResetPasswordForm", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);

    useParams.mockReturnValue({
      uid: "uid123",
      token: "token123",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  test("shows the initial reset password form", () => {
    /**
     * Arrange:
     * Render the ResetPasswordForm component.
     *
     * Act:
     * Query the form heading, password inputs, submit button,
     * and login link.
     *
     * Assert:
     * Confirm the initial reset password form renders correctly.
     * Confirm the login link points to the login page.
     */
    render(<ResetPasswordForm />);

    expect(
      screen.getByRole("heading", { name: "Reset Password" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("New password")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Reset Password" })
    ).toBeInTheDocument();

    expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
  });

  test("updates password fields when user types", () => {
    /**
     * Arrange:
     * Render the ResetPasswordForm component.
     *
     * Act:
     * Type matching values into the new password and confirm password fields.
     *
     * Assert:
     * Confirm both password input values update correctly.
     */
    render(<ResetPasswordForm />);

    const passwordInput = screen.getByPlaceholderText("New password");
    const confirmInput = screen.getByPlaceholderText("Confirm password");

    fireEvent.change(passwordInput, {
      target: { value: "newpassword123" },
    });

    fireEvent.change(confirmInput, {
      target: { value: "newpassword123" },
    });

    expect(passwordInput).toHaveValue("newpassword123");
    expect(confirmInput).toHaveValue("newpassword123");
  });

  test("shows mismatch error and does not call API when passwords do not match", async () => {
    /**
     * Arrange:
     * Render the ResetPasswordForm component.
     * Enter different values into the password fields.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm a mismatch error is displayed.
     * Confirm the API request is not called.
     */
    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "differentpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(
      await screen.findByText("Passwords do not match")
    ).toBeInTheDocument();

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("posts reset data and redirects to login on success", async () => {
    /**
     * Arrange:
     * Mock a successful password reset response.
     * Mock route params containing uid and token.
     * Render the form and enter matching passwords.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the API is called with uid, token, and password values.
     * Confirm the user is redirected to the login page.
     */
    axiosRequest.post.mockResolvedValue({});

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "newpassword123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/auth/password/reset/confirm/",
        {
          uid: "uid123",
          token: "token123",
          new_password1: "newpassword123",
          new_password2: "newpassword123",
        }
      );
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/login");
      },
      { timeout: 2500 }
    );
  });

  test("displays backend validation errors when reset request fails", async () => {
    /**
     * Arrange:
     * Mock a failed password reset response containing
     * field-specific and non-field backend errors.
     * Render the form and enter matching passwords.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm all backend validation errors are displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          new_password1: ["This password is too common."],
          new_password2: ["The two password fields didn’t match."],
          non_field_errors: ["Invalid token."],
        },
      },
    });

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(
      await screen.findByText("This password is too common.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("The two password fields didn’t match.")
    ).toBeInTheDocument();

    expect(screen.getByText("Invalid token.")).toBeInTheDocument();
  });

  test("displays fallback error when no backend error data exists", async () => {
    /**
     * Arrange:
     * Mock a failed password reset request without backend error data.
     * Render the form and enter matching passwords.
     *
     * Act:
     * Submit the reset password form.
     *
     * Assert:
     * Confirm the fallback reset-link error is displayed.
     */
    axiosRequest.post.mockRejectedValue(new Error("Network error"));

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(
      await screen.findByText("Invalid or expired reset link")
    ).toBeInTheDocument();
  });

  test("clears new password error when new password field changes", async () => {
    /**
     * Arrange:
     * Mock a failed password reset response with a new password error.
     * Render the form, enter matching passwords, and submit it.
     *
     * Act:
     * Update the new password field.
     *
     * Assert:
     * Confirm the new password error is cleared after editing the field.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          new_password1: ["This password is too common."],
        },
      },
    });

    render(<ResetPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "password123" },
    });

    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Reset Password" }));

    expect(
      await screen.findByText("This password is too common.")
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("New password"), {
      target: { value: "betterpassword123" },
    });

    expect(
      screen.queryByText("This password is too common.")
    ).not.toBeInTheDocument();
  });
});
