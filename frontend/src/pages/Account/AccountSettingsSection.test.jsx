/**
 * ACCOUNT SETTINGS SECTION TEST CHECKLIST
 * ---------------------------------------
 * Rendering
 * - Verify account settings heading is displayed
 * - Verify description is displayed
 * - Verify change password tab is displayed
 * - Verify deactivate account tab is displayed
 *
 * ---------------------------------------
 * Default State
 * - Verify change password section is shown by default
 *
 * ---------------------------------------
 * Tab Navigation
 * - Verify clicking deactivate account displays deactivate section
 * - Verify clicking deactivate account hides password section
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
  fireEvent,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import AccountSettingsSection from "./AccountSettingsSection";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Stack: ({ children }) => <div>{children}</div>,
  SimpleGrid: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <span>{children}</span>,
}));

vi.mock("../../components/buttons/TabButton", () => ({
  default: ({ children, onClick }) => (
    <button
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

vi.mock(
  "../../components/structure/SectionDividerHeading",
  () => ({
    default: ({ title }) => <h2>{title}</h2>,
  })
);

vi.mock(
  "../../components/forms/profile/ChangePasswordForm",
  () => ({
    default: () => <div>Change Password Form</div>,
  })
);

vi.mock(
  "../../components/forms/profile/DeactivateAccountForm",
  () => ({
    default: () => <div>Deactivate Account Form</div>,
  })
);

describe("AccountSettingsSection", () => {
  afterEach(() => {
    cleanup();
  });

  // =====================
  // Rendering
  // =====================

  test("shows account settings heading", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the account settings heading is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByText("Account Settings")
    ).toBeInTheDocument();
  });

  test("shows settings description", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the settings description is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByText(
        "Manage your account security and preferences."
      )
    ).toBeInTheDocument();
  });

  test("shows change password tab", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the change password tab is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByRole("button", {
        name: "Change Password",
      })
    ).toBeInTheDocument();
  });

  test("shows deactivate account tab", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the deactivate account tab is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByRole("button", {
        name: "Deactivate Account",
      })
    ).toBeInTheDocument();
  });

  // =====================
  // Default State
  // =====================

  test("shows change password section by default", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the change password section is shown by default.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByText("Change Password Form")
    ).toBeInTheDocument();
  });

  // =====================
  // Tab Navigation
  // =====================

  test("clicking deactivate account shows deactivate section", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * Click the deactivate account tab.
     *
     * Assert:
     * Confirm the deactivate account section is displayed.
     */
    render(<AccountSettingsSection />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Deactivate Account",
      })
    );

    expect(
      screen.getByText("Deactivate Account Form")
    ).toBeInTheDocument();
  });

  test("clicking deactivate account hides password section", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     *
     * Act:
     * Click the deactivate account tab.
     *
     * Assert:
     * Confirm the password section is no longer displayed.
     */
    render(<AccountSettingsSection />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Deactivate Account",
      })
    );

    expect(
      screen.queryByText("Change Password Form")
    ).not.toBeInTheDocument();
  });
});
