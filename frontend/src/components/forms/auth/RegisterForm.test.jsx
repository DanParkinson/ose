/**
 * RegisterForm Tests
 *
 * This test suite verifies:
 *
 * 1. Initial register form content is shown
 * 2. Email, password, and confirm password inputs update correctly
 * 3. Successful registration calls register with the correct values
 * 4. Successful registration redirects the user to login
 * 5. Failed registration displays field and non-field errors
 *
 * Base form components, authentication hooks, and navigation are mocked so
 * these tests focus only on RegisterForm behaviour.
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

import RegisterForm from "./RegisterForm";
import useAuth from "../../../hooks/UseAuth";
import { useNavigate } from "react-router-dom";

vi.mock("../../../hooks/UseAuth", () => ({
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

describe("RegisterForm", () => {
  const mockRegister = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useAuth.mockReturnValue({
      register: mockRegister,
    });

    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup();
  });

  test("shows the initial register form", () => {
    /**
     * Arrange:
     * Render the RegisterForm component.
     *
     * Act:
     * Query the heading, inputs, buttons, and navigation links.
     *
     * Assert:
     * Confirm the register form renders correctly.
     * Confirm navigation links point to the correct routes.
     */
    render(<RegisterForm />);

    expect(
      screen.getByRole("heading", { name: "Register" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirm password")
    ).toBeInTheDocument();

    expect(screen.getByText("Login")).toHaveAttribute(
      "href",
      "/login"
    );

    expect(screen.getByText("Reactivate")).toHaveAttribute(
      "href",
      "/reactivate-account"
    );
  });

  test("updates email and password inputs when user types", () => {
    /**
     * Arrange:
     * Render the RegisterForm component.
     *
     * Act:
     * Type values into the email, password,
     * and confirm password inputs.
     *
     * Assert:
     * Confirm all input values update correctly.
     */
    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText("Email");

    const passwordInput = screen.getByPlaceholderText("Password");

    const confirmPasswordInput =
      screen.getByPlaceholderText("Confirm password");

    fireEvent.change(emailInput, {
      target: { value: "test@example.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    fireEvent.change(confirmPasswordInput, {
      target: { value: "password123" },
    });

    expect(emailInput).toHaveValue("test@example.com");

    expect(passwordInput).toHaveValue("password123");

    expect(confirmPasswordInput).toHaveValue("password123");
  });

  test("calls register with entered values and navigates to login on success", async () => {
    /**
     * Arrange:
     * Mock a successful register response.
     * Render the RegisterForm component.
     * Populate all form fields.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm register is called with the correct values.
     * Confirm navigation redirects to the login page.
     */
    mockRegister.mockResolvedValue({
      success: true,
      errors: null,
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Confirm password"),
      {
        target: { value: "password123" },
      }
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Register" })
    );

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith(
        "test@example.com",
        "password123",
        "password123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("displays errors when registration fails", async () => {
    /**
     * Arrange:
     * Mock a failed register response containing
     * field and non-field validation errors.
     * Render the RegisterForm component.
     *
     * Act:
     * Submit the register form.
     *
     * Assert:
     * Confirm all returned validation errors display correctly.
     * Confirm navigation does not occur.
     */
    mockRegister.mockResolvedValue({
      success: false,
      errors: {
        email: "A user is already registered with this email.",
        password1: "This password is too common.",
        password2: "The two password fields didn’t match.",
        non_field_errors: ["Registration failed."],
      },
    });

    render(<RegisterForm />);

    fireEvent.click(
      screen.getByRole("button", { name: "Register" })
    );

    expect(
      await screen.findByText(
        "A user is already registered with this email."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("This password is too common.")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "The two password fields didn’t match."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Registration failed.")
    ).toBeInTheDocument();

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
