/**
 * Pagination Tests
 *
 * This test suite verifies:
 *
 * 1. Pagination controls render correctly
 * 2. Pagination values are passed to the label
 * 3. Previous button disables correctly
 * 4. Next button disables correctly
 * 5. Previous and next click handlers are called correctly
 *
 * Chakra components and child pagination components are mocked so these tests
 * focus only on Pagination behaviour.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import Pagination from "./Pagination";

vi.mock("@chakra-ui/react", () => ({
  Grid: ({ children }) => <div>{children}</div>,
  GridItem: ({ children }) => <div>{children}</div>,
}));

vi.mock("../buttons/PaginationButton", () => ({
  default: ({ children, disabled, onClick }) => (
    <button disabled={disabled} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("./PaginationLabel", () => ({
  default: ({ offset, limit, count }) => (
    <p>
      Showing {offset + 1} - {Math.min(offset + limit, count)} of {count}
    </p>
  ),
}));

describe("Pagination", () => {
  const mockOnPrevious = vi.fn();
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders pagination label and buttons", () => {
    /**
     * Arrange:
     * Render Pagination with previous and next page values.
     *
     * Act:
     * Query the pagination label and navigation buttons.
     *
     * Assert:
     * Confirm the label, Previous button, and Next button render correctly.
     */
    render(
      <Pagination
        previous="/api/items/?offset=0"
        next="/api/items/?offset=40"
        offset={20}
        limit={20}
        count={60}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    );

    expect(screen.getByText("Showing 21 - 40 of 60")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  test("disables previous button when there is no previous page", () => {
    /**
     * Arrange:
     * Render Pagination with previous set to null.
     *
     * Act:
     * Query the Previous button.
     *
     * Assert:
     * Confirm the Previous button is disabled.
     */
    render(
      <Pagination
        previous={null}
        next="/api/items/?offset=20"
        offset={0}
        limit={20}
        count={40}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    );

    expect(
      screen.getByRole("button", { name: "Previous" })
    ).toBeDisabled();
  });

  test("disables previous button when offset is zero", () => {
    /**
     * Arrange:
     * Render Pagination with offset set to zero.
     *
     * Act:
     * Query the Previous button.
     *
     * Assert:
     * Confirm the Previous button is disabled even if a previous value exists.
     */
    render(
      <Pagination
        previous="/api/items/?offset=0"
        next="/api/items/?offset=20"
        offset={0}
        limit={20}
        count={40}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    );

    expect(
      screen.getByRole("button", { name: "Previous" })
    ).toBeDisabled();
  });

  test("disables next button when there is no next page", () => {
    /**
     * Arrange:
     * Render Pagination with next set to null.
     *
     * Act:
     * Query the Next button.
     *
     * Assert:
     * Confirm the Next button is disabled.
     */
    render(
      <Pagination
        previous="/api/items/?offset=0"
        next={null}
        offset={20}
        limit={20}
        count={40}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    );

    expect(
      screen.getByRole("button", { name: "Next" })
    ).toBeDisabled();
  });

  test("calls onPrevious when previous button is clicked", () => {
    /**
     * Arrange:
     * Render Pagination with an enabled Previous button.
     *
     * Act:
     * Click the Previous button.
     *
     * Assert:
     * Confirm onPrevious is called once.
     */
    render(
      <Pagination
        previous="/api/items/?offset=0"
        next="/api/items/?offset=40"
        offset={20}
        limit={20}
        count={60}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Previous" })
    );

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  test("calls onNext when next button is clicked", () => {
    /**
     * Arrange:
     * Render Pagination with an enabled Next button.
     *
     * Act:
     * Click the Next button.
     *
     * Assert:
     * Confirm onNext is called once.
     */
    render(
      <Pagination
        previous="/api/items/?offset=0"
        next="/api/items/?offset=40"
        offset={20}
        limit={20}
        count={60}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Next" })
    );

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });
});
