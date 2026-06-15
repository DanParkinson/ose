/**
 * ACCOUNT SIDEBAR TEST CHECKLIST
 * ------------------------------
 * User Display
 * - Verify Avatar recieves user's email as fallback name
 * - Verify user email is displayed
 *
 * ------------------------------
 * Desktop Navigation
 * - Verify profile option is displayed
 * - Verify selecting profile calls onSelectSection with profile
 * - Verify settings option is displayed
 * - Verify selecting settings calls onSelectSection with settings
 * - Verify logout option is displayed
 * - Verify selecting logout calls onSelectSection with logout
 *
 * ------------------------------
 * Mobile Dropdown
 * - Verify active section is shown in mobile dropdown button
 * - Verify clicking mobile dropdown opens section options
 * - Verify selecting settings from mobile dropdown calls onSelectSection with settings
 * - Verify selecting logout from mobile dropdown calls onSelectSection with logout
 * - Verify selecting a mobile option closes the dropdown
 * - Verify clicking outside the dropdown closes the dropdown
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { forwardRef } from "react";

import AccountSidebar from "./AccountSidebar";

// Chakra Mocks
vi.mock("@chakra-ui/react", () => ({
    Avatar: {
        Root: ({ children }) => <div data-testid="avatar">{children}</div>,
        Fallback: ({ name }) => <span>{name?.charAt(0).toUpperCase()}</span>,
    },
    Box: forwardRef(({ children }, ref) => (
        <div ref={ref}>{children}</div>
    )),
    Button: ({ children, onClick }) => (
        <button type="button" onClick={onClick}>
            {children}
        </button>
    ),
    HStack: ({ children }) => <div>{children}</div>,
    Stack: ({ children }) => <div>{children}</div>,
    Text: ({ children }) => <span>{children}</span>,
    VStack: ({ children }) => <div>{children}</div>,
}))

// icon mocks
vi.mock("react-icons/hi", () => ({
  HiChevronDown: () => <span>Chevron Icon</span>,
  HiCog: () => <span>Settings Icon</span>,
  HiUser: () => <span>User Icon</span>,
  HiLogout: () => <span>Logout Icon</span>,
}));

// props
describe("AccountSidebar", () => {
    const mockOnSelectSection = vi.fn();

    const defaultProps = {
        user: {
            email: "test@example.com",
        },
        selectedSection: "profile",
        onSelectSection: mockOnSelectSection,
    };
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    // =====================
    // User display
    // =====================

    test("Avatar shows user intial from email", () => {
        /**
         * Arrange:
         * Provide a user with an email address
         *
         * Act:
         * Render the AccountSidebar component.
         *
         * Assert:
         * Confirm the avatar displays the first letter of the user's email.
         */

        render(<AccountSidebar {...defaultProps} />);

        expect(
            screen.getByTestId("avatar")
        ).toHaveTextContent("T");
    });

    test("User email is shown", () => {
        /**
         * Arrange:
         * Provide a user with an email address
         *
         * Act:
         * Render the AccountSidebar component
         *
         * Assert:
         * User email is displayed
         */

        render(<AccountSidebar {...defaultProps} />);

        expect(
            screen.getByText("test@example.com")
        ).toBeInTheDocument();
    });

    // =====================
    // Desktop navigation
    // =====================
    test("Confirm profile navigation section is shown", () => {
        /**
         * Arrange:
         * Provide a selected profile section.
         *
         * Act:
         * Render the AccountSidebar component
         *
         * Assert:
         * Confrim that profile section is displayed
         */

        render(<AccountSidebar {...defaultProps} />);

        expect(
            screen.getAllByText("Profile")[0]
        ).toBeInTheDocument();
    });

    test("Confirm selecting profile section calls onSelectSection with profile", () => {
        /**
         * Arrange:
         * Provide a selected profile section.
         *
         * Act:
         * Render the AccountSidebar component
         * Click the profile navigation button.
         *
         * Assert:
         * Confrim that selecting profile section calls onSelectSection with Prfolie
         */

        render(<AccountSidebar {...defaultProps} />);

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /profile/i,
            })[1]
        );

        expect(mockOnSelectSection).toHaveBeenCalledWith("profile")
    });

    test("Confirm settings navigation option is shown", () => {
        /**
         * Arrange:
         * Provide a selected settings section.
         *
         * Act:
         * Render the AccountSidebar component
         *
         * Assert:
         * Confrim that settings section is displayed
         */

        render(<AccountSidebar {...defaultProps} />);

        expect(
            screen.getAllByText("Settings")[0]
        ).toBeInTheDocument();
    });

    test("Confirm selecting settings section call onSelectSection with settings", () => {
        /**
         * Arrange:
         * Provide a selected settings section.
         *
         * Act:
         * Render the AccountSidebar component
         * Click the settings navigation button.
         *
         * Assert:
         * Confrim that selecting settings section calls onSelectSection with settings
         */

        render(<AccountSidebar {...defaultProps} /> );

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /settings/i,
            })[0]
        );

        expect(mockOnSelectSection).toHaveBeenCalledWith("settings");
    });

    test("Confirm Logout navigation option is shown", () => {
        /**
         * Arrange:
         * Provide a selected logout section.
         *
         * Act:
         * Render the AccountSidebar component
         *
         * Assert:
         * Confrim that logout section is displayed
         */

        render(<AccountSidebar {...defaultProps} /> );

        expect(
            screen.getAllByText("Logout")[0]
        ).toBeInTheDocument();
    })

    test("Confirm selecting Logout section passed Logout to onSelectSection with logout", () => {
        /**
         * Arrange:
         * Provide a selected logout section.
         *
         * Act:
         * Render the AccountSidebar component
         * Click the logout navigation button.
         *
         * Assert:
         * Confrim that selecting logout section calls onSelectSection with logout
         */

        render(<AccountSidebar {...defaultProps} /> );

        fireEvent.click(
            screen.getAllByRole("button", {
                name: /logout/i,
            })[0],
        );

        expect(mockOnSelectSection).toHaveBeenCalledWith("logout")
    })

    // =====================
    // Mobile Navigation
    // =====================
    test("shows active section in mobile dropdown button", () => {
    /**
     * Arrange:
     * Provide profile as the selected section.
     *
     * Act:
     * Render the AccountSidebar component.
     *
     * Assert:
     * Confirm the mobile dropdown button displays the active section.
     */
    render(<AccountSidebar {...defaultProps} />);

    expect(
        screen.getAllByRole("button", {
        name: /profile/i,
        })[0]
    ).toBeInTheDocument();
    });

    test("opens mobile dropdown when active section button is clicked", () => {
    /**
     * Arrange:
     * Provide profile as the selected section.
     *
     * Act:
     * Render the AccountSidebar component.
     * Click the mobile dropdown button.
     *
     * Assert:
     * Confirm the dropdown section options are displayed.
     */
    render(<AccountSidebar {...defaultProps} />);

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /profile/i,
        })[0]
    );

    expect(
        screen.getAllByRole("button", {
        name: /settings/i,
        })
    ).toHaveLength(2);

    expect(
        screen.getAllByRole("button", {
        name: /logout/i,
        })
    ).toHaveLength(2);
    });

    test("selecting settings from mobile dropdown calls onSelectSection with settings", () => {
    /**
     * Arrange:
     * Provide profile as the selected section.
     *
     * Act:
     * Render the AccountSidebar component.
     * Open the mobile dropdown.
     * Click the mobile Settings option.
     *
     * Assert:
     * Confirm selecting Settings calls onSelectSection with settings.
     */
    render(<AccountSidebar {...defaultProps} />);

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /profile/i,
        })[0]
    );

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /settings/i,
        })[0]
    );

    expect(mockOnSelectSection).toHaveBeenCalledWith("settings");
    });

    test("selecting logout from mobile dropdown calls onSelectSection with logout", () => {
    /**
     * Arrange:
     * Provide profile as the selected section.
     *
     * Act:
     * Render the AccountSidebar component.
     * Open the mobile dropdown.
     * Click the mobile Logout option.
     *
     * Assert:
     * Confirm selecting Logout calls onSelectSection with logout.
     */
    render(<AccountSidebar {...defaultProps} />);

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /profile/i,
        })[0]
    );

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /logout/i,
        })[0]
    );

    expect(mockOnSelectSection).toHaveBeenCalledWith("logout");
    });

    test("closes mobile dropdown after selecting an option", () => {
    /**
     * Arrange:
     * Provide profile as the selected section.
     *
     * Act:
     * Render the AccountSidebar component.
     * Open the mobile dropdown.
     * Select the mobile Settings option.
     *
     * Assert:
     * Confirm the dropdown closes after selection.
     */
    render(<AccountSidebar {...defaultProps} />);

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /profile/i,
        })[0]
    );

    expect(
        screen.getAllByRole("button", {
        name: /settings/i,
        })
    ).toHaveLength(2);

    fireEvent.click(
        screen.getAllByRole("button", {
        name: /settings/i,
        })[0]
    );

    expect(
        screen.getAllByRole("button", {
        name: /settings/i,
        })
    ).toHaveLength(1);
    });

    test("clicking outside the dropdown closes the dropdown", () => {
    /**
     * Arrange:
     * Render the AccountSidebar component.
     *
     * Act:
     * Open the mobile dropdown.
     * Click outside the dropdown.
     *
     * Assert:
     * Confirm the dropdown closes.
     */
    render(<AccountSidebar {...defaultProps} />);

    // Open dropdown
    fireEvent.click(
        screen.getAllByRole("button", {
        name: /profile/i,
        })[0]
    );

    expect(
        screen.getAllByRole("button", {
        name: /settings/i,
        })
    ).toHaveLength(2);

    // Click outside
    fireEvent.mouseDown(document);

    expect(
        screen.getAllByRole("button", {
        name: /settings/i,
        })
    ).toHaveLength(1);
    });
});
