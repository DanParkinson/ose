/**
 * LoginForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial login form content is shown
 * 2. Email and password inputs update correctly
 * 3. Successful login calls login with the correct values
 * 4. Successful login redirects the user home
 * 5. Failed login displays field and non-field errors
 *
 * Base form components, authentication hooks, and navigation are mocked so
 * these tests focus only on LoginForm behaviour.
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

import LoginForm from "./LoginForm";
import useAuth from "../../../hooks/UseAuth";
import { useNavigate } from "react-router-dom";

vi.mock("../../../hooks/UseAuth", () => ({
  default: vi.fn(),
}));

vi.mock("../../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
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

describe("LoginForm", () => {
  const mockLogin = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      login: mockLogin,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
  });

  test("shows the initial login form", () => {
    /**
     * Arrange:
     * Render the LoginForm component.
     *
     * Act:
     * Query the form heading, inputs, and navigation links.
     *
     * Assert:
     * Confirm the login form renders correctly.
     * Confirm all navigation links point to the correct routes.
     */
    render(<LoginForm />);

    expect(
      screen.getByRole("heading", { name: "Login" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(screen.getByText("Register")).toHaveAttribute(
      "href",
      "/register"
    );

    expect(screen.getByText("Reactivate")).toHaveAttribute(
      "href",
      "/reactivate-account"
    );

    expect(screen.getByText("Reset it")).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });

  test("updates email and password inputs when user types", () => {
    /**
     * Arrange:
     * Render the LoginForm component.
     *
     * Act:
     * Type values into the email and password inputs.
     *
     * Assert:
     * Confirm both inputs update correctly.
     */
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  test("calls login with entered values and navigates home on success", async () => {
    /**
     * Arrange:
     * Mock a successful login response.
     * Render the form and enter login credentials.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm login is called with the entered credentials.
     * Confirm the user is redirected to the home page.
     */
    mockLogin.mockResolvedValue({
      success: true,
      errors: null,
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("displays errors when login fails", async () => {
    /**
     * Arrange:
     * Mock a failed login response with field and non-field errors.
     * Render the LoginForm component.
     *
     * Act:
     * Submit the login form.
     *
     * Assert:
     * Confirm all returned errors are displayed.
     * Confirm navigation does not occur.
     */
    mockLogin.mockResolvedValue({
      success: false,
      errors: {
        email: "Enter a valid email address.",
        password: "Password is required.",
        non_field_errors: [
          "Unable to log in with provided credentials.",
        ],
      },
    });

    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(
      await screen.findByText("Enter a valid email address.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Password is required.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Unable to log in with provided credentials."
      )
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
