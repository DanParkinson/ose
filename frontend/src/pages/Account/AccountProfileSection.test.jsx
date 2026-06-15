/**
 * ACCOUNT PROFILE SECTION TEST CHECKLIST
 * --------------------------------------
 * Rendering
 * - Verify account profile heading is displayed
 * - Verify profile description is displayed
 *
 * --------------------------------------
 * Email Display
 * - Verify user email is displayed
 * - Verify email input is disabled
 * - Verify empty value is shown when user is missing
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

import AccountProfileSection from "./AccountProfileSection";

// Chakra mocks
vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,

  Stack: ({ children }) => (
    <div>{children}</div>
  ),

  Text: ({ children }) => (
    <span>{children}</span>
  ),

  Input: ({
    value,
    disabled,
  }) => (
    <input
      value={value}
      disabled={disabled}
      readOnly
    />
  ),
}));

vi.mock(
  "../../components/structure/SectionDividerHeading",
  () => ({
    default: () => (
      <div>Section Divider</div>
    ),
  })
);

describe("AccountProfileSection", () => {
  afterEach(() => {
    cleanup();
  });

  test("shows account profile heading", () => {
    /**
     * Arrange:
     * Provide a user.
     *
     * Act:
     * Render the component.
     *
     * Assert:
     * Confirm the heading is displayed.
     */

    render(
      <AccountProfileSection
        user={{
          email: "test@example.com",
        }}
      />
    );

    expect(
      screen.getByText(
        "Account Profile"
      )
    ).toBeInTheDocument();
  });

  test("shows profile description", () => {
    /**
     * Arrange:
     * Provide a user.
     *
     * Act:
     * Render the component.
     *
     * Assert:
     * Confirm the description is displayed.
     */

    render(
      <AccountProfileSection
        user={{
          email: "test@example.com",
        }}
      />
    );

    expect(
      screen.getByText(
        "View your account information and profile details."
      )
    ).toBeInTheDocument();
  });

  test("shows user email in input", () => {
    /**
     * Arrange:
     * Provide a user email.
     *
     * Act:
     * Render the component.
     *
     * Assert:
     * Confirm the email is displayed.
     */

    render(
      <AccountProfileSection
        user={{
          email: "test@example.com",
        }}
      />
    );

    expect(
      screen.getByDisplayValue(
        "test@example.com"
      )
    ).toBeInTheDocument();
  });

  test("email input is disabled", () => {
    /**
     * Arrange:
     * Provide a user email.
     *
     * Act:
     * Render the component.
     *
     * Assert:
     * Confirm the email input is disabled.
     */

    render(
      <AccountProfileSection
        user={{
          email: "test@example.com",
        }}
      />
    );

    expect(
      screen.getByDisplayValue(
        "test@example.com"
      )
    ).toBeDisabled();
  });

  test("shows empty input when user is missing", () => {
    /**
     * Arrange:
     * Provide no user.
     *
     * Act:
     * Render the component.
     *
     * Assert:
     * Confirm the input falls back to an empty string.
     */

    render(
      <AccountProfileSection
        user={null}
      />
    );

    expect(
      screen.getByDisplayValue("")
    ).toBeInTheDocument();
  });
});
