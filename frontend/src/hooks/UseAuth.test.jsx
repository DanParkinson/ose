/**
 * useAuth Tests
 *
 * This test suite verifies:
 *
 * 1. useAuth returns the current AuthContext value
 * 2. useAuth updates when context values change
 * 3. useAuth returns null when no provider exists
 *
 * A lightweight test component is used so these tests focus only
 * on hook behaviour and React context integration.
 */

import { describe, test, expect, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AuthContext from "../context/AuthContext";
import useAuth from "./UseAuth";

const TestComponent = () => {
  const auth = useAuth();

  return (
    <div>
      <p data-testid="auth-value">
        {JSON.stringify(auth)}
      </p>
    </div>
  );
};

describe("useAuth", () => {
  afterEach(() => {
    cleanup();
  });

  test("returns the current AuthContext value", () => {
    /**
     * Arrange:
     * Render the hook inside an AuthContext provider.
     *
     * Act:
     * Read the rendered hook value.
     *
     * Assert:
     * Verify the hook returns the provided context data.
     */
    const authValue = {
      user: {
        id: 1,
        email: "test@example.com",
      },
      login: () => {},
      logout: () => {},
    };

    render(
      <AuthContext.Provider value={authValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(
      screen.getByTestId("auth-value")
    ).toHaveTextContent(
      JSON.stringify(authValue)
    );
  });

  test("updates when context values change", () => {
    /**
     * Arrange:
     * Render the hook with an initial context value.
     *
     * Act:
     * Re-render with updated context data.
     *
     * Assert:
     * Verify the hook reflects the updated context value.
     */
    const initialValue = {
      user: null,
    };

    const updatedValue = {
      user: {
        id: 2,
        email: "updated@example.com",
      },
    };

    const { rerender } = render(
      <AuthContext.Provider value={initialValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(
      screen.getByTestId("auth-value")
    ).toHaveTextContent(
      JSON.stringify(initialValue)
    );

    rerender(
      <AuthContext.Provider value={updatedValue}>
        <TestComponent />
      </AuthContext.Provider>
    );

    expect(
      screen.getByTestId("auth-value")
    ).toHaveTextContent(
      JSON.stringify(updatedValue)
    );
  });

  test("returns null when no provider exists", () => {
    /**
     * Arrange:
     * Render the hook without an AuthContext provider.
     *
     * Act:
     * Read the hook value.
     *
     * Assert:
     * Verify the hook returns the default null context value.
     */
    render(<TestComponent />);

    expect(
      screen.getByTestId("auth-value")
    ).toHaveTextContent("null");
  });
});
