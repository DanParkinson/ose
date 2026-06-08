/**
 * ACCOUNT LOGOUT SECTION TEST CHECKLIST
 * -------------------------------------
 * Rendering
 * - Verify logout heading is displayed
 * - Verify logout description is displayed
 * - Verify logout form is displayed
 * - Verify helper text is displayed
 */

import {
  describe,
  test,
  expect,
  vi,
  afterEach,
} from "vitest";

import {
  render,
  screen,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import AccountLogoutSection from "./AccountLogoutSection";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Stack: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,
}));

vi.mock("../../components/forms/auth/LogoutForm", () => ({
  default: () => <div>Logout Form</div>,
}));

describe("AccountLogoutSection", () => {
  afterEach(() => {
    cleanup();
  });

  // =====================
  // Rendering
  // =====================

  test("shows logout heading", () => {
    /**
     * Arrange:
     * Render the AccountLogoutSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the logout heading is displayed.
     */
    render(<AccountLogoutSection />);

    expect(
      screen.getByText("Logout")
    ).toBeInTheDocument();
  });

  test("shows logout description", () => {
    /**
     * Arrange:
     * Render the AccountLogoutSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the logout description is displayed.
     */
    render(<AccountLogoutSection />);

    expect(
      screen.getByText(
        "End your current session and return to the homepage."
      )
    ).toBeInTheDocument();
  });

  test("shows logout form", () => {
    /**
     * Arrange:
     * Render the AccountLogoutSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the logout form is displayed.
     */
    render(<AccountLogoutSection />);

    expect(
      screen.getByText("Logout Form")
    ).toBeInTheDocument();
  });

  test("shows helper text", () => {
    /**
     * Arrange:
     * Render the AccountLogoutSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the logout helper text is displayed.
     */
    render(<AccountLogoutSection />);

    expect(
      screen.getByText(
        "You can log back in at any time using your email address and password."
      )
    ).toBeInTheDocument();
  });
});
