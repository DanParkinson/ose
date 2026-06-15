/**
 * LAYOUT TEST CHECKLIST
 * -----------------------------
 * Rendering
 * - Verify children are rendered inside the layout
 * -----------------------------
 * Non-auth Pages
 * - Verify NavBar is rendered on non-auth pages
 * - Verify Footer is rendered on non-auth pages
 * -----------------------------
 * Auth Pages
 * - Verify NavBar is hidden on auth pages
 * - Verify Footer is hidden on auth pages
 * -----------------------------
 * Rate Limit Banner
 * - Verify RateLimitBanner is included in the layout
 */
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, test, vi } from "vitest";

import Layout from "./Layout";
import RateLimitBanner from "../components/RateLimitBanner";
import { Box } from "@chakra-ui/react";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,
}));

vi.mock("./../components/NavBar", () => ({
  default: () => <nav>Mock NavBar</nav>,
}));

vi.mock("./../components/Footer", () => ({
  default: () => <footer>Mock Footer</footer>,
}));

vi.mock("./../components/RateLimitBanner", () => ({
    default: () => <div>Mock Banner</div>,
}));

afterEach(() => {
  cleanup();
});

const authRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/reactivate-account",
  "/verify-email",
  "/resend-verification-email",
];

const renderLayout = (route = "/") => {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Layout>
        <p>Page content</p>
      </Layout>
    </MemoryRouter>
  );
};

describe("Layout", () => {
    // =====================
    // Rederning
    // =====================
    test("Rendering: children are rendered inside the layout", () => {
        /**
         * Arrange:
         * - Render the Layout component with child content
         * Act:
         * - Query for the child content
         * Assert:
         * - Child content is rendered
         */

        renderLayout();

        expect(screen.getByText("Page content")).toBeInTheDocument();
    });
        // =====================
        // Non-auth pages
        // =====================
    test("Non-auth Pages: NavBar is rendered", () => {
        /**
         * Arrange:
         * - Render the Layout component on a non-auth route
         * Act:
         * - Query for the NavBar
         * Assert:
         * - NavBar is rendered
         */

        renderLayout("/dashboard");

        expect(screen.getByText("Mock NavBar")).toBeInTheDocument();
    });

    test("Non-auth Pages: Footer is rendered", () => {
        /**
         * Arrange:
         * - Render the Layout component on a non-auth route
         * Act:
         * - Query for the Footer
         * Assert:
         * - Footer is rendered
         */

        renderLayout("/dashboard");

        expect(screen.getByText("Mock Footer")).toBeInTheDocument();
    });

        // =====================
        // Atuh pages
        // =====================

    test.each(authRoutes)("Auth Pages: NavBar is hidden on %s", (route) => {
        /**
         * Arrange:
         * - Render the Layout component on an auth route
         * Act:
         * - Query for the NavBar
         * Assert:
         * - NavBar is not rendered
         */

        renderLayout(route);

        expect(screen.queryByText("Mock NavBar")).not.toBeInTheDocument();
    });

    test.each(authRoutes)("Auth Pages: Footer is hidden on %s", (route) => {
        /**
         * Arrange:
         * - Render the Layout component on an auth route
         * Act:
         * - Query for the Footer
         * Assert:
         * - Footer is not rendered
         */

        renderLayout(route);

        expect(screen.queryByText("Mock Footer")).not.toBeInTheDocument();
    });

    // =====================
    // RateLimit banner
    // =====================
    test("Rate Limit Banner: is included in the layout", () => {
        /**
         * Arrange:
         * - Render the Layout component
         * Act:
         * - Nothing
         * Assert:
         * - Assert banner is not visible
         */
        renderLayout();

        expect(screen.getByText("Mock Banner")).toBeInTheDocument();
    });
});
