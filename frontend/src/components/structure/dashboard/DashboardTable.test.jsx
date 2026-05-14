/**
 * DashboardTable Tests
 *
 * This test suite verifies:
 *
 * 1. The table header receives column and layout data
 * 2. Rows render from the provided row data
 * 3. renderRow is called for each row
 * 4. getRowKey is used when provided
 * 5. Row selected state is calculated correctly
 * 6. Row click handling is passed through correctly
 *
 * Chakra components and child table components are mocked so these tests focus
 * only on DashboardTable rendering and prop orchestration.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DashboardTable from "./DashboardTable";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,
}));

vi.mock("./DashboardTableHeader", () => ({
  default: ({ columns, templateColumns }) => (
    <div data-testid="dashboard-table-header">
      <p>Columns: {columns.join(", ")}</p>
      <p>Template: {templateColumns}</p>
    </div>
  ),
}));

vi.mock("./DashboardTableRow", () => ({
  default: ({
    row,
    isSelected,
    onClick,
    children,
  }) => (
    <button
      type="button"
      data-testid={`dashboard-table-row-${row.id}`}
      data-selected={String(isSelected)}
      onClick={() => onClick?.(row)}
    >
      {children}
    </button>
  ),
}));

describe("DashboardTable", () => {
  const mockColumns = [
    "Title",
    "Level",
    "Published",
  ];

  const mockRows = [
    {
      id: "1",
      title: "Mathematics",
      level: "secondary",
      is_published: true,
    },
    {
      id: "2",
      title: "English",
      level: "primary",
      is_published: false,
    },
  ];

  const mockTemplateColumns = "1fr 1fr 1fr";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders table header with columns and template columns", () => {
    /**
     * Arrange:
     * Render DashboardTable with column labels and a grid template.
     *
     * Act:
     * Query the mocked DashboardTableHeader output.
     *
     * Assert:
     * Confirm the header receives and displays the columns.
     * Confirm the header receives and displays the template columns.
     */
    render(
      <DashboardTable
        columns={mockColumns}
        rows={mockRows}
        templateColumns={mockTemplateColumns}
        renderRow={(row) => row.title}
      />
    );

    expect(
      screen.getByTestId("dashboard-table-header")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Columns: Title, Level, Published")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Template: 1fr 1fr 1fr")
    ).toBeInTheDocument();
  });

  test("renders rows using renderRow", () => {
    /**
     * Arrange:
     * Render DashboardTable with two rows and a renderRow function.
     *
     * Act:
     * Query the rendered row content.
     *
     * Assert:
     * Confirm each row renders content returned by renderRow.
     */
    render(
      <DashboardTable
        columns={mockColumns}
        rows={mockRows}
        templateColumns={mockTemplateColumns}
        renderRow={(row) => row.title}
      />
    );

    expect(screen.getByText("Mathematics")).toBeInTheDocument();

    expect(screen.getByText("English")).toBeInTheDocument();
  });

  test("calls renderRow for each row", () => {
    /**
     * Arrange:
     * Create a mocked renderRow function.
     * Render DashboardTable with multiple rows.
     *
     * Act:
     * Allow the table to render.
     *
     * Assert:
     * Confirm renderRow is called once for each row.
     * Confirm it receives the correct row objects.
     */
    const mockRenderRow = vi.fn((row) => row.title);

    render(
      <DashboardTable
        columns={mockColumns}
        rows={mockRows}
        templateColumns={mockTemplateColumns}
        renderRow={mockRenderRow}
      />
    );

    expect(mockRenderRow).toHaveBeenCalledTimes(2);

    expect(mockRenderRow).toHaveBeenCalledWith(mockRows[0]);

    expect(mockRenderRow).toHaveBeenCalledWith(mockRows[1]);
  });

  test("uses getRowKey when provided", () => {
    /**
     * Arrange:
     * Create a mocked getRowKey function.
     * Render DashboardTable with row data.
     *
     * Act:
     * Allow the table to render.
     *
     * Assert:
     * Confirm getRowKey is called for each row.
     */
    const mockGetRowKey = vi.fn((row) => row.id);

    render(
      <DashboardTable
        columns={mockColumns}
        rows={mockRows}
        templateColumns={mockTemplateColumns}
        getRowKey={mockGetRowKey}
        renderRow={(row) => row.title}
      />
    );

    expect(mockGetRowKey).toHaveBeenCalledTimes(2);

    expect(mockGetRowKey).toHaveBeenCalledWith(mockRows[0]);

    expect(mockGetRowKey).toHaveBeenCalledWith(mockRows[1]);
  });

  test("passes selected state to matching rows", () => {
    /**
     * Arrange:
     * Render DashboardTable with an isSelected function.
     *
     * Act:
     * Query both mocked row elements.
     *
     * Assert:
     * Confirm the selected row receives true.
     * Confirm the non-selected row receives false.
     */
    render(
      <DashboardTable
        columns={mockColumns}
        rows={mockRows}
        templateColumns={mockTemplateColumns}
        renderRow={(row) => row.title}
        isSelected={(row) => row.id === "2"}
      />
    );

    expect(
      screen
        .getByTestId("dashboard-table-row-1")
        .getAttribute("data-selected")
    ).toBe("false");

    expect(
      screen
        .getByTestId("dashboard-table-row-2")
        .getAttribute("data-selected")
    ).toBe("true");
  });

  test("calls onRowClick with row data when a row is clicked", () => {
    /**
     * Arrange:
     * Render DashboardTable with a mocked onRowClick handler.
     *
     * Act:
     * Click one of the mocked row elements.
     *
     * Assert:
     * Confirm onRowClick receives the clicked row object.
     */
    const mockOnRowClick = vi.fn();

    render(
      <DashboardTable
        columns={mockColumns}
        rows={mockRows}
        templateColumns={mockTemplateColumns}
        renderRow={(row) => row.title}
        onRowClick={mockOnRowClick}
      />
    );

    fireEvent.click(
      screen.getByTestId("dashboard-table-row-2")
    );

    expect(mockOnRowClick).toHaveBeenCalledWith(mockRows[1]);
  });
});
