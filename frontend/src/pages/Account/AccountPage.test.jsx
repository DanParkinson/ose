/**
 * ACCOUNT PAGE TEST CHECKLIST
 * ---------------------------
 * Initial Render
 * - Verify profile section is shown by default
 * - Verify Account Page Heading is shown
 *
 * ---------------------------
 * Section Navigation
 * - Verify selecting settings displays settings section
 * - Verify selecting logout displays logout section
 */

import {describe, test, expect, vi, beforeEach, afterEach} from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AccountPage from "./AccountPage";
import useAuth from "../../hooks/useAuth";

// Mock Auth
vi.mock("../../hooks/useAuth", () => ({
    default: vi.fn(),
}));

// componenets
vi.mock("../../components/structure/PageHeading", () => ({
    default: ({title, description}) => (
        <header>
            <h1>{title}</h1>
            <p>{description}</p>
        </header>
    ),
}));

vi.mock("../../layouts/AccountLayout", () => ({
    default: ({ sidebar, children}) => (
    <div>
        <aside>{sidebar}</aside>
        <main>{children}</main>
    </div>
    ),
}));

// sections components
vi.mock("./AccountProfileSection", () => ({
    default: ({user}) => (
        <section>
            Profile Section: {user?.email}
        </section>
    ),
}));

vi.mock("./AccountSettingsSection", () => ({
  default: ({ user }) => (
    <section>
      Settings Section: {user?.email}
    </section>
  ),
}));

vi.mock("./AccountLogoutSection", () => ({
  default: () => (
    <section>
      Logout Section
    </section>
  ),
}));

// sidebar
vi.mock("../../components/structure/account/AccountSidebar", () => ({
  default: ({ onSelectSection }) => (
    <>
        <button
            onClick={()=> onSelectSection("settings")}
        >
            Settings
        </button>

        <button
            onClick={()=> onSelectSection("logout")}
        >
            Logout
        </button>
    </>
  ),
}));

describe("AccountPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });
    });

    afterEach(() => {
        cleanup();
    });

    // =====================
    // Initial Render
    // =====================

    test("shows account page heading"), () => {
        /**
         * Arrange:
         * render account page.
         *
         * Act:
         * Render the page heading component
         *
         * Assert:
         * Confirm expected text to be present
         */

        render(<AccountPage />);

        expect(
            screen.getByText("My Account")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Manage your profile and account settings")
        ).toBeInTheDocument();
    }

    test("shows profile section by default", () => {
        /**
         * Arrange:
         * Mock an authenticated user.
         *
         * Act:
         * Render the AccountPage component.
         *
         * Assert:
         * Confirm the profile section is shown by default.
         */

        render(<AccountPage />);

        expect(
            screen.getByText("Profile Section: test@example.com")
        ).toBeInTheDocument();
    });

    // =====================
    // Selection Navigation
    // =====================

    test("shows settings section when settings is selected", () => {
        /**
         * Arrange:
         * Render the AccountPage component.
         *
         * Act:
         * Click the Settings button in the mocked sidebar.
         *
         * Assert:
         * Confirm the settings section is displayed.
         * Confirm the profile section is not displayed
        */

        render(<AccountPage />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Settings",
            })
        );

        expect(
            screen.getByText("Settings Section: test@example.com")
        ).toBeInTheDocument();

        expect(
            screen.queryByText("Profile Section: test@example.com")
        ).not.toBeInTheDocument();
    });

    test("shows logout section when logout is selected", () => {
        /**
         * Arrange:
         * Render the AccountPage component.
         *
         * Act:
         * Click the Logout button in the mocked sidebar.
         *
         * Assert:
         * Confirm the logout section is displayed.
        */

        render(<AccountPage />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout",
            })
        );

        expect(
            screen.getByText("Logout Section")
        ).toBeInTheDocument();
    });
});
