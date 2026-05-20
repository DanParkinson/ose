/**
 * DeactivateAccountForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial warning text is shown
 * 2. Clicking "Deactivate Account" opens the confirmation state
 * 3. Clicking "Cancel" returns to the initial state
 * 4. Confirming deactivation calls the API
 * 5. Successful deactivation logs the user out and navigates home
 * 6. Backend errors are displayed
 * 7. Fallback errors are displayed when no backend error data exists
 *
 * Base form components and Chakra components are mocked so these tests focus
 * only on DeactivateAccountForm behaviour.
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

import DeactivateAccountForm from "./DeactivateAccountForm";
import useAuth from "../../../hooks/useAuth";
import { axiosRequest } from "../../../api/axiosDefaults";
import { useNavigate } from "react-router-dom";

vi.mock("../../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@chakra-ui/react", () => ({
  Text: ({ children }) => <p>{children}</p>,
  Box: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/AccountFormContainer", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/FormError", () => ({
  default: ({ children }) => (children ? <p>{children}</p> : null),
}));

vi.mock("@chakra-ui/react", () => ({
  Text: ({ children }) => <p>{children}</p>,
  Box: ({ children }) => <div>{children}</div>,
  HStack: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
  default: () => <span>spinner</span>,
}));

vi.mock("../base/FormSubmitButtonDanger", () => ({
  default: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("../base/FormSubmitButton", () => ({
  default: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

describe("DeactivateAccountForm", () => {
  const mockLogout = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      logout: mockLogout,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
  });

  test("shows the initial deactivate account button and warning text", () => {
    /**
     * Arrange:
     * Render the DeactivateAccountForm component.
     *
     * Act:
     * Query the initial warning text, deactivate button,
     * and confirmation button.
     *
     * Assert:
     * Confirm the warning text and deactivate button are shown.
     * Confirm the confirmation button is not shown yet.
     */
    render(<DeactivateAccountForm />);

    expect(screen.getByText("Deactivate Account")).toBeInTheDocument();

    expect(
      screen.getByText(/Deactivating your account will hide your profile/i)
    ).toBeInTheDocument();

    expect(
      screen.queryByText("Confirm Deactivation")
    ).not.toBeInTheDocument();
  });

  test("shows confirmation options when deactivate account is clicked", () => {
    /**
     * Arrange:
     * Render the form in its initial state.
     *
     * Act:
     * Click the Deactivate Account button.
     *
     * Assert:
     * Confirm the confirmation message, confirm button,
     * and cancel button are displayed.
     */
    render(<DeactivateAccountForm />);

    fireEvent.click(screen.getByText("Deactivate Account"));

    expect(
      screen.getByText("Are you sure you want to deactivate your account?")
    ).toBeInTheDocument();

    expect(screen.getByText("Confirm Deactivation")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("returns to initial state when cancel is clicked", () => {
    /**
     * Arrange:
     * Render the form and enter the confirmation state.
     *
     * Act:
     * Click the Cancel button.
     *
     * Assert:
     * Confirm the form returns to the initial state.
     * Confirm the confirmation button is no longer displayed.
     */
    render(<DeactivateAccountForm />);

    fireEvent.click(screen.getByText("Deactivate Account"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(screen.getByText("Deactivate Account")).toBeInTheDocument();

    expect(
      screen.queryByText("Confirm Deactivation")
    ).not.toBeInTheDocument();
  });

  test("deactivates account, logs out, and navigates home on success", async () => {
    /**
     * Arrange:
     * Mock a successful account deactivation API response.
     * Mock logout to resolve successfully.
     * Render the form and enter the confirmation state.
     *
     * Act:
     * Click Confirm Deactivation.
     *
     * Assert:
     * Confirm the deactivate API endpoint is called.
     * Confirm logout is called after successful deactivation.
     * Confirm the user is redirected to the home page.
     */
    axiosRequest.post.mockResolvedValue({});
    mockLogout.mockResolvedValue({});

    render(<DeactivateAccountForm />);

    fireEvent.click(screen.getByText("Deactivate Account"));
    fireEvent.click(screen.getByText("Confirm Deactivation"));

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/account/deactivate/"
      );
    });

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("displays backend error when deactivation fails", async () => {
    /**
     * Arrange:
     * Mock a failed deactivation response containing backend error data.
     * Render the form and enter the confirmation state.
     *
     * Act:
     * Click Confirm Deactivation.
     *
     * Assert:
     * Confirm the backend error message is displayed.
     * Confirm logout is not called.
     * Confirm navigation does not happen.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["You cannot deactivate this account."],
        },
      },
    });

    render(<DeactivateAccountForm />);

    fireEvent.click(screen.getByText("Deactivate Account"));
    fireEvent.click(screen.getByText("Confirm Deactivation"));

    expect(
      await screen.findByText("You cannot deactivate this account.")
    ).toBeInTheDocument();

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("displays fallback error when no backend error data exists", async () => {
    /**
     * Arrange:
     * Mock a failed deactivation request without backend error data.
     * Render the form and enter the confirmation state.
     *
     * Act:
     * Click Confirm Deactivation.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     * Confirm logout is not called.
     * Confirm navigation does not happen.
     */
    axiosRequest.post.mockRejectedValue(new Error("Network error"));

    render(<DeactivateAccountForm />);

    fireEvent.click(screen.getByText("Deactivate Account"));
    fireEvent.click(screen.getByText("Confirm Deactivation"));

    expect(
      await screen.findByText("Account deactivation failed.")
    ).toBeInTheDocument();

    expect(mockLogout).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
