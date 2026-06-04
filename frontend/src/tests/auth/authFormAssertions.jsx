import { screen } from "@testing-library/react";
import { expect } from "vitest";
import "@testing-library/jest-dom/vitest";
/**
 * Links
 */

export const expectLoginLink =
  () => {
    expect(
      screen.getByText("Login")
    ).toHaveAttribute(
      "href",
      "/login"
    );
  };

export const expectRegisterLink =
  () => {
    expect(
      screen.getByText("Register")
    ).toHaveAttribute(
      "href",
      "/register"
    );
  };

export const expectReactivateLink =
  () => {
    expect(
      screen.getByText("Reactivate")
    ).toHaveAttribute(
      "href",
      "/reactivate-account"
    );
  };

export const expectResendVerificationLink =
  () => {
    expect(
      screen.getByText(
        "Resend verification email"
      )
    ).toHaveAttribute(
      "href",
      "/resend-verification-email"
    );
  };

/**
 * Success Messages
 */

export const expectRegisterSuccess =
  () => {
    expect(
      screen.getByText(
        "Your account has been created."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Please check your email to verify your account before logging in."
      )
    ).toBeInTheDocument();
  };

/**
 * Validation Errors
 */

export const expectError =
  (message) => {
    expect(
      screen.getByText(message)
    ).toBeInTheDocument();
  };

export const expectErrors = (
  errors
) => {
  errors.forEach((error) => {
    expectError(error);
  });
};

/**
 * Inputs
 */

export const expectEmailValue =
  (value) => {
    expect(
      screen.getByPlaceholderText(
        "me@example.com"
      )
    ).toHaveValue(value);
  };

export const expectPasswordValue =
  (value) => {
    const inputs =
      screen.getAllByPlaceholderText(
        "********"
      );

    expect(inputs[0]).toHaveValue(
      value
    );
  };

export const expectConfirmPasswordValue =
  (value) => {
    const inputs =
      screen.getAllByPlaceholderText(
        "********"
      );

    expect(inputs[1]).toHaveValue(
      value
    );
  };