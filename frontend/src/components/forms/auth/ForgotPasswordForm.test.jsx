/**
 * ForgotPasswordForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial form content is shown
 * 2. Email input updates correctly
 * 3. Submitting sends the email to the password reset endpoint
 * 4. Successful submission shows the confirmation message
 * 5. Backend email errors are displayed
 * 6. Fallback errors are displayed when no backend error data exists
 *
 * Base form components and Chakra components are mocked so these tests focus
 * only on ForgotPasswordForm behaviour.
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

import ForgotPasswordForm from "./ForgotPasswordForm";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

vi.mock("@chakra-ui/react", () => ({
  chakra: (Component) => Component,
  Input: (props) => <input {...props} />,
  Text: ({ children }) => <p>{children}</p>,
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

describe("ForgotPasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("shows the initial forgot password form", () => {
    /**
     * Arrange:
     * Render the ForgotPasswordForm component.
     *
     * Act:
     * Query the title, helper text, email input, submit button,
     * and login link.
     *
     * Assert:
     * Confirm the initial form content is displayed correctly.
     * Confirm the login link points to the login page.
     */
    render(<ForgotPasswordForm />);

    expect(screen.getByText("Forgot Password")).toBeInTheDocument();

    expect(
      screen.getByText("Enter your email to receive a reset link.")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(screen.getByText("Send Reset Email")).toBeInTheDocument();

    expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
  });

  test("updates email input when user types", () => {
    /**
     * Arrange:
     * Render the ForgotPasswordForm component.
     *
     * Act:
     * Type an email address into the email input.
     *
     * Assert:
     * Confirm the input value updates to match the typed email.
     */
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByPlaceholderText("Email");

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    expect(emailInput).toHaveValue("test@example.com");
  });

  test("posts email and shows confirmation message on success", async () => {
    /**
     * Arrange:
     * Mock a successful password reset API response.
     * Render the form and enter an email address.
     *
     * Act:
     * Click the Send Reset Email button.
     *
     * Assert:
     * Confirm the reset endpoint is called with the entered email.
     * Confirm the confirmation message is displayed.
     * Confirm the login link is still available.
     */
    axiosRequest.post.mockResolvedValue({});

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByText("Send Reset Email"));

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/auth/password/reset/",
        { email: "test@example.com" }
      );
    });

    expect(
      await screen.findByText(
        "If an account exists with that email, a reset link has been sent."
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Login")).toHaveAttribute("href", "/login");
  });

  test("displays backend email error when reset request fails", async () => {
    /**
     * Arrange:
     * Mock a failed password reset response with an email field error.
     * Render the form and enter an invalid email.
     *
     * Act:
     * Submit the password reset request.
     *
     * Assert:
     * Confirm the backend email validation error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          email: ["Enter a valid email address."],
        },
      },
    });

    render(<ForgotPasswordForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByText("Send Reset Email"));

    expect(
      await screen.findByText("Enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("displays backend non-field error when reset request fails", async () => {
    /**
     * Arrange:
     * Mock a failed password reset response with a non-field error.
     * Render the form.
     *
     * Act:
     * Submit the password reset request.
     *
     * Assert:
     * Confirm the backend non-field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["Too many reset attempts."],
        },
      },
    });

    render(<ForgotPasswordForm />);

    fireEvent.click(screen.getByText("Send Reset Email"));

    expect(
      await screen.findByText("Too many reset attempts.")
    ).toBeInTheDocument();
  });

  test("displays fallback error when no backend error data exists", async () => {
    /**
     * Arrange:
     * Mock a failed password reset request without backend error data.
     * Render the form.
     *
     * Act:
     * Submit the password reset request.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    axiosRequest.post.mockRejectedValue(new Error("Network error"));

    render(<ForgotPasswordForm />);

    fireEvent.click(screen.getByText("Send Reset Email"));

    expect(
      await screen.findByText("Password reset failed. Please try again.")
    ).toBeInTheDocument();
  });
});
