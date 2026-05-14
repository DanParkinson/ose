/**
 * PaginationLabel Tests
 *
 * This test suite verifies:
 *
 * 1. Current page is calculated correctly
 * 2. Total pages are calculated correctly
 * 3. Result count is displayed correctly
 * 4. Total pages defaults to 1 when count is 0
 *
 * Chakra components are mocked so these tests focus only on
 * PaginationLabel calculation and rendering behaviour.
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import PaginationLabel from "./PaginationLabel";

vi.mock("@chakra-ui/react", () => ({
  VStack: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <p>{children}</p>,
}));

describe("PaginationLabel", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders current page and total pages correctly", () => {
    /**
     * Arrange:
     * Render PaginationLabel with an offset of 0,
     * a limit of 20, and a count of 60.
     *
     * Act:
     * Query the page label.
     *
     * Assert:
     * Confirm the label shows page 1 of 3.
     */
    render(
      <PaginationLabel
        offset={0}
        limit={20}
        count={60}
      />
    );

    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
  });

  test("renders total result count correctly", () => {
    /**
     * Arrange:
     * Render PaginationLabel with a count of 60.
     *
     * Act:
     * Query the result count label.
     *
     * Assert:
     * Confirm the correct number of results is displayed.
     */
    render(
      <PaginationLabel
        offset={0}
        limit={20}
        count={60}
      />
    );

    expect(screen.getByText("60 results")).toBeInTheDocument();
  });

  test("defaults total pages to 1 when count is 0", () => {
    /**
     * Arrange:
     * Render PaginationLabel with no results.
     *
     * Act:
     * Query the page label and result count label.
     *
     * Assert:
     * Confirm the component displays page 1 of 1.
     * Confirm the result count displays 0 results.
     */
    render(
      <PaginationLabel
        offset={0}
        limit={20}
        count={0}
      />
    );

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    expect(screen.getByText("0 results")).toBeInTheDocument();
  });

  test("calculates later pages correctly", () => {
    /**
     * Arrange:
     * Render PaginationLabel with an offset representing page 3.
     *
     * Act:
     * Query the page label.
     *
     * Assert:
     * Confirm the current page is calculated from offset and limit.
     */
    render(
      <PaginationLabel
        offset={40}
        limit={20}
        count={100}
      />
    );

    expect(screen.getByText("Page 3 of 5")).toBeInTheDocument();
  });
});
