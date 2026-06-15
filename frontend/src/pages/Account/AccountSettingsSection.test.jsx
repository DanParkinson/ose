/**
 * ACCOUNT SETTINGS SECTION TEST CHECKLIST
 * ---------------------------------------
 * Rendering
 * - Verify shows account settings heading
 * - Verify shows settings description
 * ---------------------------------------
 * Tab Buttons
 * - Verify shows change password tab
 * - Verify shows deactivate account tab
 * - Verify shows Update email tab
 * ---------------------------------------
 * Default State
 * - Verify shows update email section by default
 * ---------------------------------------
 * Tab Navigation
 * - Verify clicking deactivate account displays deactivate section
 * - Verify clicking change password displays change password section
 * - Verify clicking update email displays update email section
 *
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
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

vi.mock(
  "../../components/forms/profile/UpdateEmailForm",
  () => ({
    default: () => <div> Update Email Form</div>
  })
);

describe("AccountSettingsSection", () => {
  afterEach(() => {
    cleanup();
  });

  // =====================
  // Rendering
  // =====================

  test("Rendering: shows account settings heading", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     * Act: No additional action required.
     * Assert: Confirm the account settings heading is displayed.
     */
    render(<AccountSettingsSection />);

    expect( screen.getByText("Account Settings")).toBeInTheDocument();
  });

  test("Rendering: shows settings description", () => {
    /**
     * Arrange: Render the AccountSettingsSection component.
     * Act: No additional action required.
     * Assert: Confirm the settings description is displayed.
     */
    render(<AccountSettingsSection />);

    expect(screen.getByText("Manage your account security and preferences.")).toBeInTheDocument();
  });

  // =====================
  // Tabs
  // =====================

  test("Tabs: shows change password tab", () => {
    /**
     * Arrange: Render the AccountSettingsSection component.
     * Act: No additional action required.
     * Assert: Confirm the change password tab is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByRole("button", {
        name: "Change Password",
      })
    ).toBeInTheDocument();
  });

  test("Tabs: shows deactivate account tab", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     * Act: No additional action required.
     * Assert: Confirm the deactivate account tab is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByRole("button", {
        name: "Deactivate Account",
      })
    ).toBeInTheDocument();
  });

  test("Tabs: Shows update email tab", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     * Act: No additional action required.
     * Assert: Confirm the update email tab is displayed.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByRole("button", {
        name: "Update Email",
      })
    );
  })

  // =====================
  // Default State
  // =====================

  test("Default State: shows update email section by default", () => {
    /**
     * Arrange:
     * Render the AccountSettingsSection component.
     * Act: No additional action required.
     * Assert: Confirm the change password section is shown by default.
     */
    render(<AccountSettingsSection />);

    expect(
      screen.getByText("Update Email Form")
    ).toBeInTheDocument();
  });

  // =====================
  // Tab Navigation
  // =====================

  test("Navigation: clicking deactivate account shows deactivate section", () => {
    /**
     * Arrange: Render the AccountSettingsSection component.
     * Act: Click the deactivate account tab.
     * Assert: Confirm the deactivate account section is displayed.
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

  test("Navigation: Clicking Change Password tab shows change password section", async () => {
    /**
     * Arrange: Render the AccountSettingsSection component.
     * Act:
     * - Click the deactivate account tab.
     * - Check form renders
     * - Click the change password tab
     * - check change password form renders
     * Assert: Confirm the Change Password form is shown section is displayed.
     */

    render( <AccountSettingsSection /> );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Deactivate Account"
      })
    );

    await expect(screen.getByText("Deactivate Account Form")).toBeInTheDocument();

    await fireEvent.click(
      screen.getByRole("button", {
        name: "Change Password"
      })
    );

    await expect(screen.getByText("Change Password Form")).toBeInTheDocument();
  });

  test("Navigation: Clicking Update Email tab shows update email section", () => {
    /**
     * Arrange: Render the AccountSettingsSection component.
     * Act: Click the Update Email tab.
     * Assert: Confirm the update email section is displayed.
     */

    render(<AccountSettingsSection/>);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Update Email"
      })
    );

    expect(screen.getByText("Update Email Form")).toBeInTheDocument();
  });

});
