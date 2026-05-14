/**
 * ReactivateConfirmForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial idle state is shown
 * 2. Clicking reactivate triggers API call with uid/token
 * 3. Loading state is displayed during request
 * 4. Success state shows confirmation and login link
 * 5. Backend errors are displayed
 * 6. Fallback error is displayed when no backend data exists
 *
 * Base components, Chakra components, and routing are mocked so tests focus
 * only on ReactivateConfirmForm behaviour.
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

import ReactivateConfirmForm from "./ReactivateConfirmForm";
import { axiosRequest } from "../../../api/axiosDefaults";
import { useParams } from "react-router-dom";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("@chakra-ui/react", () => ({
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

vi.mock("../base/FormSubmitButton", () => ({
  default: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("../base/FormError", () => ({
  default: ({ children }) => (children ? <p>{children}</p> : null),
}));

vi.mock("../base/FormLink", () => ({
  default: ({ text, to, linkText }) => (
    <p>
      {text} <a href={to}>{linkText}</a>
    </p>
  ),
}));

describe("ReactivateConfirmForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useParams.mockReturnValue({
      uid: "abc123",
      token: "token123",
    });
  });

  afterEach(() => {
    cleanup();
  });

  test("shows initial idle state", () => {
    /**
     * Arrange:
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Query the heading, helper text, and reactivate button.
     *
     * Assert:
     * Confirm the initial idle state is displayed correctly.
     */
    render(<ReactivateConfirmForm />);

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

  test("calls API with uid and token when button is clicked", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation response.
     * Mock route params containing uid and token.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Click the Reactivate Account button.
     *
     * Assert:
     * Confirm the API is called with the correct uid and token values.
     */
    axiosRequest.post.mockResolvedValue({});

    render(<ReactivateConfirmForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Reactivate Account" })
    );

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

  test("shows loading state while request is in progress", async () => {
    /**
     * Arrange:
     * Mock a pending reactivation request.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Click the Reactivate Account button.
     *
     * Assert:
     * Confirm the loading state message is displayed while waiting.
     */
    let resolvePromise;

    axiosRequest.post.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<ReactivateConfirmForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Reactivate Account" })
    );

    expect(
      screen.getByText("Reactivating account...")
    ).toBeInTheDocument();

    resolvePromise({});
  });

  test("shows success state after successful reactivation", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation response.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Click the Reactivate Account button.
     *
     * Assert:
     * Confirm the success message is displayed.
     * Confirm the login link is displayed correctly.
     */
    axiosRequest.post.mockResolvedValue({});

    render(<ReactivateConfirmForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Reactivate Account" })
    );

    expect(
      await screen.findByText("Your account has been reactivated.")
    ).toBeInTheDocument();

    expect(screen.getByText("login")).toHaveAttribute(
      "href",
      "/login"
    );
  });

  test("shows backend error when request fails", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation response with backend error data.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Click the Reactivate Account button.
     *
     * Assert:
     * Confirm the backend error message is displayed.
     * Confirm the reactivation request link is displayed correctly.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["Invalid or expired link."],
        },
      },
    });

    render(<ReactivateConfirmForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Reactivate Account" })
    );

    expect(
      await screen.findByText("Invalid or expired link.")
    ).toBeInTheDocument();

    expect(screen.getByText("Request one")).toHaveAttribute(
      "href",
      "/reactivate-account"
    );
  });

  test("shows fallback error when no backend data exists", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation request without backend error data.
     * Render the ReactivateConfirmForm component.
     *
     * Act:
     * Click the Reactivate Account button.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    axiosRequest.post.mockRejectedValue(new Error("Network error"));

    render(<ReactivateConfirmForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Reactivate Account" })
    );

    expect(
      await screen.findByText(
        "This reactivation link is invalid or has expired."
      )
    ).toBeInTheDocument();
  });
});
