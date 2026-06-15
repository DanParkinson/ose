/**
 * UPDATE EMAIL CONFIRM FORM TEST CHECKLIST
 * ---------------------------------------
 * Rendering
 * - Verify verification message is displayed
 * ---------------------------------------
 * Confirmation Request
 * - Verify email confirmation request is sent on page load
 * - Verify request is sent with URL uid and token
 * ---------------------------------------
 * Loading State
 * - Verify verification message is displayed while confirmation is in progress
 * - Verify loading indicator is displayed while confirmation is in progress
 * ---------------------------------------
 * Success Handling
 * - Verify user details are refreshed after successful confirmation
 * - Verify user is redirected to account page after successful confirmation
 * ---------------------------------------
 * Error Handling
 * - Verify invalid link message is displayed when confirmation fails
 * - Verify expired link message is displayed when confirmation fails
 * - Verify non-field errors are displayed
 * - Verify loading indicator is hidden after failure
 * - Verify user is not redirected when confirmation fails
 */

import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup, waitFor, } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import UpdateEmailConfirmForm from "./UpdateEmailConfirmForm";
import { axiosResponse } from "../../../api/axiosDefaults";
import useAuth from "../../../hooks/useAuth";

vi.mock("../../../hooks/useAuth", () => ({
    default: vi.fn(),
}));

vi.mock("../../../api/axiosDefaults", () => ({
    axiosResponse: {
        post: vi.fn(),
    },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
    useParams: () => ({
        uid: "test-uid",
        token: "test-token",
    }),
    useNavigate: () => mockNavigate,
}));

vi.mock("../base/containers/WideFormContainer", () => ({
    default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
    default: () => (
        <div data-testid="loading-spinner">
            Loading...
        </div>
    ),
}));

vi.mock("@chakra-ui/react", () => ({
    HStack: ({ children }) => <div>{children}</div>,
    Text: ({ children }) => <p>{children}</p>,
}));

describe("UpdateEmailConfirmForm", () => {
    afterEach(() => {
        cleanup();
    });

    beforeEach(() => {
        vi.clearAllMocks();

        useAuth.mockReturnValue({
            fetchUser: vi.fn(),
        });
    });

    // =====================
    // Rendering
    // =====================

    test("Rendering: displays verification message", () => {
        /**
         * Arrange:
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - No additional action required.
         *
         * Assert:
         * - Confirm the verification message is displayed.
         */
        render(<UpdateEmailConfirmForm />);

        expect(
            screen.getByText(
                "Verifying your new email address..."
            )
        ).toBeInTheDocument();
    });

    // =====================
    // Confirmation request
    // =====================

    test("Confirmation Request: sends email confirmation request on page load", async () => {
        /**
         * Arrange:
         * - Mock the email confirmation request.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - No additional action required.
         *
         * Assert:
         * - Confirm the email confirmation request is sent.
         */
        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailConfirmForm />);

        await waitFor(() => {
            expect(axiosResponse.post).toHaveBeenCalled();
        });
    });

    test("Confirmation Request: request is sent with URL uid and token", async () => {
        /**
         * Arrange:
         * - Mock route params.
         * - Mock the email confirmation request.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - No additional action required.
         *
         * Assert:
         * - Confirm the request is sent with the uid and token from the URL.
         */
        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailConfirmForm />);

        await waitFor(() => {
            expect(axiosResponse.post).toHaveBeenCalledWith(
                "/api/account/update-email/confirm/",
                {
                    uid: "test-uid",
                    token: "test-token",
                }
            );
        });
    });

    // =====================
    // Loading state
    // =====================
    test("Loading State: loading indicator is displayed while confirmation is in progress", async () => {
        /**
         * Arrange:
         * - Mock the email confirmation request to remain pending.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - No additional action required.
         *
         * Assert:
         * - Confirm the loading spinner is displayed.
         */
        axiosResponse.post.mockImplementation(
            () => new Promise(() => {})
        );

        render(<UpdateEmailConfirmForm />);

        expect(
            screen.getByTestId("loading-spinner")
        ).toBeInTheDocument();
    });
    // =====================
    // Success Handling
    // =====================
    test("Success Handling: refreshes user details after successful confirmation", async () => {
        /**
         * Arrange:
         * - Mock a successful email confirmation request.
         * - Mock the auth context fetchUser function.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to complete.
         *
         * Assert:
         * - Confirm the user details are refreshed.
         */
        const fetchUser = vi.fn();

        useAuth.mockReturnValue({
            fetchUser,
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailConfirmForm />);

        await waitFor(() => {
            expect(fetchUser).toHaveBeenCalled();
        });
    });

    test("Success Handling: redirects user to account page after successful confirmation", async () => {
        /**
         * Arrange:
         * - Mock a successful email confirmation request.
         * - Mock the auth context.
         * - Mock navigation.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to complete.
         *
         * Assert:
         * - Confirm the user is redirected to the account page.
         */
        useAuth.mockReturnValue({
            fetchUser: vi.fn(),
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailConfirmForm />);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/account");
        });
    });

    // =====================
    // Error Handling
    // =====================
    test("Error Handling: invalid link message is displayed when confirmation fails", async () => {
        /**
         * Arrange:
         * - Mock a failed email confirmation request.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to fail.
         *
         * Assert:
         * - Confirm an invalid link message is displayed.
         */
        axiosResponse.post.mockRejectedValue({
            response: {
                data: {
                    detail: "Invalid email change link.",
                },
            },
        });

        render(<UpdateEmailConfirmForm />);

        expect(
            await screen.findByText("Invalid email change link.")
        ).toBeInTheDocument();
    });

    test("Error Handling: expired link message is displayed when confirmation fails", async () => {
        /**
         * Arrange:
         * - Mock the email confirmation request to fail with an expired link error.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to fail.
         *
         * Assert:
         * - Confirm the expired link message is displayed.
         */
        axiosResponse.post.mockRejectedValue({
            response: {
                data: {
                    detail: "This email change link has expired.",
                },
            },
        });

        render(<UpdateEmailConfirmForm />);

        expect(
            await screen.findByText(
                "This email change link has expired."
            )
        ).toBeInTheDocument();
    });

    test("Error Handling: non-field errors are displayed", async () => {
        /**
         * Arrange:
         * - Mock the email confirmation request to fail with a non-field error.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to fail.
         *
         * Assert:
         * - Confirm the non-field error is displayed.
         */
        axiosResponse.post.mockRejectedValue({
            response: {
                data: {
                    non_field_errors: [
                        "Unable to confirm email change.",
                    ],
                },
            },
        });

        render(<UpdateEmailConfirmForm />);

        expect(
            await screen.findByText(
                "Unable to confirm email change."
            )
        ).toBeInTheDocument();
    });

    test("Error Handling: loading indicator is hidden after failure", async () => {
        /**
         * Arrange:
         * - Mock the email confirmation request to fail.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to fail.
         *
         * Assert:
         * - Confirm the loading indicator is no longer displayed.
         */
        axiosResponse.post.mockRejectedValue({
            response: {
                data: {
                    detail: "Invalid email change link.",
                },
            },
        });

        render(<UpdateEmailConfirmForm />);

        await screen.findByText(
            "Invalid email change link."
        );

        expect(
            screen.queryByTestId("loading-spinner")
        ).not.toBeInTheDocument();

        expect(
            screen.queryByText(
                "Verifying your new email address..."
            )
        ).not.toBeInTheDocument();
    });

    test("Error Handling: user is not redirected when confirmation fails", async () => {
        /**
         * Arrange:
         * - Mock the email confirmation request to fail.
         * - Mock the auth context.
         * - Render the UpdateEmailConfirmForm component.
         *
         * Act:
         * - Allow the confirmation request to fail.
         *
         * Assert:
         * - Confirm the user is not redirected to the account page.
         */
        useAuth.mockReturnValue({
            fetchUser: vi.fn(),
        });

        axiosResponse.post.mockRejectedValue({
            response: {
                data: {
                    detail: "Invalid email change link.",
                },
            },
        });

        render(<UpdateEmailConfirmForm />);

        await screen.findByText("Invalid email change link.");

        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
