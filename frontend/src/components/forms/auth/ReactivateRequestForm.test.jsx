/**
 * ReactivateRequestForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial form content is shown
 * 2. Email input updates correctly
 * 3. Submitting sends the email to the reactivation request endpoint
 * 4. Successful submission shows the confirmation message
 * 5. Backend email and non-field errors are displayed
 * 6. Email-specific errors clear when the email field changes
 * 7. Fallback errors are displayed when no backend error data exists
 *
 * Base form components and Chakra components are mocked so these tests focus
 * only on ReactivateRequestForm behaviour.
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

import ReactivateRequestForm from "./ReactivateRequestForm";
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

describe("ReactivateRequestForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("shows the initial reactivate request form", () => {
    /**
     * Arrange:
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Query the heading, helper text, email input,
     * submit button, and login link.
     *
     * Assert:
     * Confirm the initial form content renders correctly.
     * Confirm the login link points to the login page.
     */
    render(<ReactivateRequestForm />);

    expect(
      screen.getByRole("heading", { name: "Reactivate Account" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Enter your email to receive a reactivation link."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Send Reactivation Email",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Login")
    ).toHaveAttribute("href", "/login");
  });

  test("updates email input when user types", () => {
    /**
     * Arrange:
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Type into the email input field.
     *
     * Assert:
     * Confirm the email input updates correctly.
     */
    render(<ReactivateRequestForm />);

    const emailInput = screen.getByPlaceholderText("Email");

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    expect(emailInput).toHaveValue("test@example.com");
  });

  test("posts email and shows confirmation message on success", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation request response.
     * Render the form and enter an email address.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the API is called with the entered email.
     * Confirm the success message is displayed.
     * Confirm the login link remains visible.
     */
    axiosRequest.post.mockResolvedValue({});

    render(<ReactivateRequestForm />);

    fireEvent.change(
      screen.getByPlaceholderText("Email"),
      {
        target: { value: "test@example.com" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Reactivation Email",
      })
    );

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/account/reactivate/request/",
        {
          email: "test@example.com",
        }
      );
    });

    expect(
      await screen.findByText(
        /If a deactivated account exists with that email/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Login")
    ).toHaveAttribute("href", "/login");
  });

  test("displays backend email error when request fails", async () => {
    /**
     * Arrange:
     * Mock a failed request containing an email validation error.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the backend email error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          email: ["Enter a valid email address."],
        },
      },
    });

    render(<ReactivateRequestForm />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Reactivation Email",
      })
    );

    expect(
      await screen.findByText(
        "Enter a valid email address."
      )
    ).toBeInTheDocument();
  });

  test("clears email error when email field changes", async () => {
    /**
     * Arrange:
     * Mock a failed request containing an email validation error.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the form and then update the email field.
     *
     * Assert:
     * Confirm the email-specific error is cleared after input changes.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          email: ["Enter a valid email address."],
        },
      },
    });

    render(<ReactivateRequestForm />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Reactivation Email",
      })
    );

    expect(
      await screen.findByText(
        "Enter a valid email address."
      )
    ).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText("Email"),
      {
        target: { value: "test@example.com" },
      }
    );

    expect(
      screen.queryByText(
        "Enter a valid email address."
      )
    ).not.toBeInTheDocument();
  });

  test("displays backend non-field error when request fails", async () => {
    /**
     * Arrange:
     * Mock a failed request containing a non-field error.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the backend non-field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: [
            "This account cannot be reactivated.",
          ],
        },
      },
    });

    render(<ReactivateRequestForm />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Reactivation Email",
      })
    );

    expect(
      await screen.findByText(
        "This account cannot be reactivated."
      )
    ).toBeInTheDocument();
  });

  test("displays fallback error when no backend error data exists", async () => {
    /**
     * Arrange:
     * Mock a failed request without backend error data.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    axiosRequest.post.mockRejectedValue(
      new Error("Network error")
    );

    render(<ReactivateRequestForm />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Send Reactivation Email",
      })
    );

    expect(
      await screen.findByText(
        "Reactivation request failed. Please try again."
      )
    ).toBeInTheDocument();
  });
});
