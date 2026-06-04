/**
 * PROTECTED ROUTE TEST CHECKLIST
 * ------------------------------
 * Loading State
 * - Verify loading state shows permissions spinner
 *
 * ------------------------------
 * Authentication
 * - Verify unauthenticated user redirects to login
 * - Verify authenticated user can view protected content
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearRouteMocks,
  mockUseAuth,
} from "../tests/routes/routeTestMocks";

import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    clearRouteMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Loading State
  // =====================

  test("shows loading spinner while checking permissions", () => {
    /**
     * Arrange:
     * Mock auth context in loading state.
     *
     * Act:
     * Render ProtectedRoute.
     *
     * Assert:
     * Confirm the permissions loading message is displayed.
     */
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    expect(
      screen.getByText("Checking permissions...")
    ).toBeInTheDocument();
  });

  // =====================
  // Authentication
  // =====================

  test("redirects unauthenticated user to login", () => {
    /**
     * Arrange:
     * Mock auth context with no authenticated user.
     *
     * Act:
     * Render ProtectedRoute.
     *
     * Assert:
     * Confirm the user is redirected to the login page.
     */
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    expect(screen.getByText("Redirect: /login")).toBeInTheDocument();
  });

  test("allows authenticated user to view protected content", () => {
    /**
     * Arrange:
     * Mock auth context with an authenticated user.
     *
     * Act:
     * Render ProtectedRoute.
     *
     * Assert:
     * Confirm the protected content is displayed.
     */
    mockUseAuth.mockReturnValue({
      user: {
        email: "user@example.com",
      },
      loading: false,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
