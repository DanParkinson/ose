/**
 * DashboardTableRow Tests
 *
 * This test suite verifies:
 *
 * 1. Row children render correctly
 * 2. Template columns are passed to the grid layout
 * 3. Selected state is passed correctly
 * 4. Clickable rows call onClick with row data
 * 5. Rows without onClick do not throw when clicked
 *
 * Chakra Grid is mocked so these tests focus only on
 * DashboardTableRow rendering and interaction behaviour.
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DashboardTableRow from "./DashboardTableRow";

vi.mock("@chakra-ui/react", () => ({
  Grid: ({
    children,
    templateColumns,
    bg,
    borderLeftColor,
    cursor,
    onClick,
  }) => (
    <div
      data-testid="dashboard-table-row"
      data-template-columns={templateColumns}
      data-bg={bg}
      data-border-left-color={borderLeftColor}
      data-cursor={cursor}
      onClick={onClick}
    >
      {children}
    </div>
  ),
}));

describe("DashboardTableRow", () => {
  const mockRow = {
    id: "1",
    title: "Mathematics",
  };

  afterEach(() => {
    cleanup();
  });

  test("renders row children", () => {
    /**
     * Arrange:
     * Render DashboardTableRow with child content.
     *
     * Act:
     * Query the rendered child content.
     *
     * Assert:
     * Confirm the row children render correctly.
     */
    render(
      <DashboardTableRow
        row={mockRow}
        templateColumns="1fr 1fr"
        isSelected={false}
      >
        <span>Mathematics</span>
      </DashboardTableRow>
    );

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  test("passes templateColumns to the grid layout", () => {
    /**
     * Arrange:
     * Render DashboardTableRow with a template column layout.
     *
     * Act:
     * Query the mocked Grid wrapper.
     *
     * Assert:
     * Confirm templateColumns is passed to the Grid.
     */
    render(
      <DashboardTableRow
        row={mockRow}
        templateColumns="2fr 1fr"
        isSelected={false}
      >
        <span>Mathematics</span>
      </DashboardTableRow>
    );

    expect(
      screen.getByTestId("dashboard-table-row")
    ).toHaveAttribute(
      "data-template-columns",
      "2fr 1fr"
    );
  });

  test("applies selected state styles when row is selected", () => {
    /**
     * Arrange:
     * Render DashboardTableRow with isSelected set to true.
     *
     * Act:
     * Query the mocked Grid wrapper.
     *
     * Assert:
     * Confirm the selected background and border values are applied.
     */
    render(
      <DashboardTableRow
        row={mockRow}
        templateColumns="1fr"
        isSelected={true}
      >
        <span>Mathematics</span>
      </DashboardTableRow>
    );

    const row = screen.getByTestId("dashboard-table-row");

    expect(row).toHaveAttribute("data-bg", "bg.dark3");

    expect(row).toHaveAttribute(
      "data-border-left-color",
      "text.primarylight"
    );
  });

  test("applies default state styles when row is not selected", () => {
    /**
     * Arrange:
     * Render DashboardTableRow with isSelected set to false.
     *
     * Act:
     * Query the mocked Grid wrapper.
     *
     * Assert:
     * Confirm the default background and border values are applied.
     */
    render(
      <DashboardTableRow
        row={mockRow}
        templateColumns="1fr"
        isSelected={false}
      >
        <span>Mathematics</span>
      </DashboardTableRow>
    );

    const row = screen.getByTestId("dashboard-table-row");

    expect(row).toHaveAttribute("data-bg", "bg.dark2");

    expect(row).toHaveAttribute(
      "data-border-left-color",
      "transparent"
    );
  });

  test("calls onClick with row data when clicked", () => {
    /**
     * Arrange:
     * Render DashboardTableRow with a mocked onClick handler.
     *
     * Act:
     * Click the row.
     *
     * Assert:
     * Confirm onClick receives the row object.
     */
    const mockOnClick = vi.fn();

    render(
      <DashboardTableRow
        row={mockRow}
        templateColumns="1fr"
        isSelected={false}
        onClick={mockOnClick}
      >
        <span>Mathematics</span>
      </DashboardTableRow>
    );

    fireEvent.click(
      screen.getByTestId("dashboard-table-row")
    );

    expect(mockOnClick).toHaveBeenCalledWith(mockRow);
  });

  test("does not throw when clicked without onClick", () => {
    /**
     * Arrange:
     * Render DashboardTableRow without an onClick handler.
     *
     * Act:
     * Click the row.
     *
     * Assert:
     * Confirm clicking the row does not throw an error.
     */
    render(
      <DashboardTableRow
        row={mockRow}
        templateColumns="1fr"
        isSelected={false}
      >
        <span>Mathematics</span>
      </DashboardTableRow>
    );

    expect(() => {
      fireEvent.click(
        screen.getByTestId("dashboard-table-row")
      );
    }).not.toThrow();
  });
});
