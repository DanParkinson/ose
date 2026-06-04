/**
 * ADMIN ROUTE TEST CHECKLIST
 * --------------------------
 * Loading State
 * - Verify loading state shows permissions spinner
 *
 * --------------------------
 * Authentication
 * - Verify unauthenticated user redirects to login
 *
 * --------------------------
 * Authorization
 * - Verify authenticated non-staff user redirects home
 * - Verify authenticated staff user can view admin content
 */

import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearRouteMocks,
  mockUseAuth,
} from "../tests/routes/routeTestMocks";

import AdminRoute from "./AdminRoute";

describe("AdminRoute", () => {
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
     * Render AdminRoute.
     *
     * Assert:
     * Confirm the permissions loading message is displayed.
     */
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
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
     * Render AdminRoute.
     *
     * Assert:
     * Confirm the user is redirected to the login page.
     */
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
    );

    expect(screen.getByText("Redirect: /login")).toBeInTheDocument();
  });

  // =====================
  // Authorization
  // =====================

  test("redirects authenticated non-staff user home", () => {
    /**
     * Arrange:
     * Mock auth context with an authenticated non-staff user.
     *
     * Act:
     * Render AdminRoute.
     *
     * Assert:
     * Confirm the user is redirected to the home page.
     */
    mockUseAuth.mockReturnValue({
      user: {
        email: "user@example.com",
        is_staff: false,
      },
      loading: false,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
    );

    expect(screen.getByText("Redirect: /")).toBeInTheDocument();
  });

  test("allows authenticated staff user to view admin content", () => {
    /**
     * Arrange:
     * Mock auth context with an authenticated staff user.
     *
     * Act:
     * Render AdminRoute.
     *
     * Assert:
     * Confirm the protected admin content is displayed.
     */
    mockUseAuth.mockReturnValue({
      user: {
        email: "admin@example.com",
        is_staff: true,
      },
      loading: false,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
