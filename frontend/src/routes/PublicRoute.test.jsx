/**
 * PUBLIC ROUTE TEST CHECKLIST
 * ---------------------------
 *
 * ---------------------------
 * Public Access
 * - Verify unauthenticated user can view public content
 *
 * ---------------------------
 * Authentication
 * - Verify authenticated user redirects home
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearRouteMocks,
  mockUseAuth,
} from "../tests/routes/routeTestMocks";

import PublicRoute from "./PublicRoute";

describe("PublicRoute", () => {
  beforeEach(() => {
    clearRouteMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Loading State
  // =====================



  // =====================
  // Public Access
  // =====================

  test("allows unauthenticated user to view public content", () => {
    /**
     * Arrange:
     * Mock auth context with no authenticated user.
     *
     * Act:
     * Render PublicRoute.
     *
     * Assert:
     * Confirm the public content is displayed.
     */
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <PublicRoute>
        <p>Public Content</p>
      </PublicRoute>
    );

    expect(
      screen.getByText("Public Content")
    ).toBeInTheDocument();
  });

  // =====================
  // Authentication
  // =====================

  test("redirects authenticated user home", () => {
    /**
     * Arrange:
     * Mock auth context with an authenticated user.
     *
     * Act:
     * Render PublicRoute.
     *
     * Assert:
     * Confirm the user is redirected to the home page.
     */
    mockUseAuth.mockReturnValue({
      user: {
        email: "user@example.com",
      },
      loading: false,
    });

    render(
      <PublicRoute>
        <p>Public Content</p>
      </PublicRoute>
    );

    expect(
      screen.getByText("Redirect: /")
    ).toBeInTheDocument();
  });
});
