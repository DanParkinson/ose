/**
 * RATE LIMIT BANNER TEST CHECKLIST
 * -----------------------------
 * Rendering
 * - Verify banner is hidden by default
 *
 * -----------------------------
 * Event Handling
 * - Verify banner appears when api-rate-limit event is dispatched
 * - Verify banner converts retry seconds from the backend message into minutes
 * - Verify displays singular minute when retry time is one minute
 * - Verify banner updates when another event is dispatched
 * - Verify fallback message is shown when backend message has no seconds
 *
 * -----------------------------
 * Cleanup
 * - Verify event listener is removed on unmount
 */

import "@testing-library/jest-dom/vitest";
import {cleanup, render, screen, act } from "@testing-library/react";
import { describe, afterEach, expect, vi, test } from "vitest";

import RateLimitBanner from "./RateLimitBanner";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children, "data-testid": dataTestId }) => (
    <div data-testid={dataTestId}>{children}</div>
  ),
  Text: ({ children }) => <p>{children}</p>,
}));

afterEach(() => {
  cleanup();
});



describe("RateLimitBanner", () => {
    test("Rendering: banner is hidden by default", () => {
        /**
         * Arrange:
         * - Render the RateLimitBanner component
         * Act:
         * - Query for the banner text
         * Assert:
         * - Banner is not visible by default
         */

        render(<RateLimitBanner />);

        expect(screen.queryByTestId("rate-limit-banner")).not.toBeInTheDocument();
    });

    test("Event Handling: banner appears when api-rate-limit event is dispatched", async () => {
        /**
         * Arrange:
         * - Render the RateLimitBanner component
         * Act:
         * - Dispatch an api-rate-limit event
         * Assert:
         * - Banner is rendered
         */
        render(<RateLimitBanner />);

        act(() => {
            window.dispatchEvent(
            new CustomEvent("api-rate-limit", {
                detail: {
                message: "Too many requests",
                },
            })
            );
        });

        expect(screen.getByTestId("rate-limit-banner")).toBeInTheDocument();
    });

    test("Event Handling: converts retry seconds from the backend message into minutes", () => {
        /**
         * Arrange:
         * - Render the RateLimitBanner component
         * Act:
         * - Dispatch an api-rate-limit event with backend seconds in the message
         * Assert:
         * - Seconds are converted into minutes
         */

        render(<RateLimitBanner />);

        act(() => {
            window.dispatchEvent(
            new CustomEvent("api-rate-limit", {
                detail: {
                message:
                    "Request was throttled. Expected available in 7200 seconds.",
                },
            })
            );
        });

        expect(screen.getByText(/120 minutes/i)).toBeInTheDocument();
    });

    test("Event Handling: displays singular minute when retry time is one minute", () => {
        /**
         * Arrange:
         * - Render the RateLimitBanner component
         * Act:
         * - Dispatch an api-rate-limit event with 60 seconds
         * Assert:
         * - Singular minute label is displayed
         */

        render(<RateLimitBanner />);

        act(() => {
            window.dispatchEvent(
            new CustomEvent("api-rate-limit", {
                detail: {
                message:
                    "Request was throttled. Expected available in 60 seconds.",
                },
            })
            );
        });

        expect(screen.getByText(/1 minute/i)).toBeInTheDocument();
    });

    test("Event Handling: banner updates when another event is dispatched", () => {
        /**
         * Arrange:
         * - Render the RateLimitBanner component
         * Act:
         * - Dispatch one api-rate-limit event
         * - Dispatch another api-rate-limit event with a different backend time
         * Assert:
         * - Banner displays the latest converted time
         */

        render(<RateLimitBanner />);

        act(() => {
            window.dispatchEvent(
            new CustomEvent("api-rate-limit", {
                detail: {
                message:
                    "Request was throttled. Expected available in 3600 seconds.",
                },
            })
            );
        });

        act(() => {
            window.dispatchEvent(
            new CustomEvent("api-rate-limit", {
                detail: {
                message:
                    "Request was throttled. Expected available in 7200 seconds.",
                },
            })
            );
        });

        expect(screen.getByText(/120 minutes/i)).toBeInTheDocument();
        expect(screen.queryByText(/60 minutes/i)).not.toBeInTheDocument();
    });

    test("Event Handling: banner displays fallback message when no retry time is provided", () => {
        /**
         * Arrange:
         * - Render the RateLimitBanner component
         * Act:
         * - Dispatch an api-rate-limit event without retry seconds
         * Assert:
         * - Fallback message is displayed
         */

        render(<RateLimitBanner />);

        act(() => {
            window.dispatchEvent(
            new CustomEvent("api-rate-limit", {
                detail: {
                message: "Too many requests",
                },
            })
            );
        });

        expect(
            screen.getByText(/Please try again later/i)
        ).toBeInTheDocument();
    });

    test("Cleanup: event listener is removed on unmount", () => {
    /**
     * Arrange:
     * - Spy on window.removeEventListener
     * - Render the RateLimitBanner component
     * Act:
     * - Unmount the component
     * Assert:
     * - Event listener is removed
     */

    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<RateLimitBanner />);

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
        "api-rate-limit",
        expect.any(Function)
    );
    });
});
