/**
 * PROTECTED ROUTE TEST CHECKLIST
 * ------------------------------
 * Loading State
 * - Verify loading state shows permissions spinner
 * - Verify protected route checking state shows permissions spinner
 *
 * ------------------------------
 * Authentication
 * - Verify ProtectedRoute calls fetchUser on mount
 * - Verify unauthenticated user redirects to login after auth check
 * - Verify authenticated user can view protected content after auth check
 */

import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
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

  test("shows loading spinner while auth context is loading", () => {
    const fetchUser = vi.fn().mockResolvedValue(false);

    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      fetchUser,
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

  test("shows loading spinner while protected route is checking auth", () => {
    const fetchUser = vi.fn(() => new Promise(() => {}));

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      fetchUser,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    expect(
      screen.getByText("Checking permissions...")
    ).toBeInTheDocument();

    expect(fetchUser).toHaveBeenCalled();
  });

  test("calls fetchUser on mount", async () => {
    const fetchUser = vi.fn().mockResolvedValue(false);

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      fetchUser,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(fetchUser).toHaveBeenCalledTimes(1);
    });
  });

  test("redirects unauthenticated user to login after auth check", async () => {
    const fetchUser = vi.fn().mockResolvedValue(false);

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      fetchUser,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    expect(await screen.findByText("Redirect: /login")).toBeInTheDocument();
  });

  test("allows authenticated user to view protected content after auth check", async () => {
    const fetchUser = vi.fn().mockResolvedValue(true);

    mockUseAuth.mockReturnValue({
      user: {
        email: "user@example.com",
      },
      loading: false,
      fetchUser,
    });

    render(
      <ProtectedRoute>
        <p>Protected Content</p>
      </ProtectedRoute>
    );

    expect(await screen.findByText("Protected Content")).toBeInTheDocument();

    expect(fetchUser).toHaveBeenCalledTimes(1);
  });
});
