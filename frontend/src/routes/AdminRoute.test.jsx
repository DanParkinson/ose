/**
 * ADMIN ROUTE TEST CHECKLIST
 * --------------------------
 * Loading State
 * - Verify loading state shows permissions spinner
 * - Verify admin route checking state shows permissions spinner
 *
 * --------------------------
 * Authentication
 * - Verify AdminRoute calls fetchUser on mount
 * - Verify unauthenticated user redirects to login after auth check
 *
 * --------------------------
 * Authorization
 * - Verify authenticated non-staff user redirects home after auth check
 * - Verify authenticated staff user can view admin content after auth check
 */

import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
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

  test("shows loading spinner while auth context is loading", () => {
    const fetchUser = vi.fn().mockResolvedValue(false);

    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
      fetchUser,
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

  test("shows loading spinner while admin route is checking auth", () => {
    const fetchUser = vi.fn(() => new Promise(() => {}));

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      fetchUser,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
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
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
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
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
    );

    expect(await screen.findByText("Redirect: /login")).toBeInTheDocument();
  });

  test("redirects authenticated non-staff user home after auth check", async () => {
    const fetchUser = vi.fn().mockResolvedValue(true);

    mockUseAuth.mockReturnValue({
      user: {
        email: "user@example.com",
        is_staff: false,
      },
      loading: false,
      fetchUser,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
    );

    expect(await screen.findByText("Redirect: /")).toBeInTheDocument();

    expect(fetchUser).toHaveBeenCalledTimes(1);
  });

  test("allows authenticated staff user to view admin content after auth check", async () => {
    const fetchUser = vi.fn().mockResolvedValue(true);

    mockUseAuth.mockReturnValue({
      user: {
        email: "admin@example.com",
        is_staff: true,
      },
      loading: false,
      fetchUser,
    });

    render(
      <AdminRoute>
        <p>Admin Content</p>
      </AdminRoute>
    );

    expect(await screen.findByText("Admin Content")).toBeInTheDocument();

    expect(fetchUser).toHaveBeenCalledTimes(1);
  });
});
