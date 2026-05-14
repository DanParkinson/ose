/**
 * DashboardFilterPanel Tests
 *
 * This test suite verifies:
 *
 * 1. The filter panel heading renders correctly
 * 2. Filter section titles render correctly
 * 3. FilterOptions receives the correct filter data
 * 4. Filter changes call onFilterChange with the correct values
 *
 * Chakra components and FilterOptions are mocked so these tests focus only on
 * DashboardFilterPanel rendering and prop orchestration.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DashboardFilterPanel from "./DashboardFilterPanel";

vi.mock("@chakra-ui/react", () => ({
  Grid: ({ children }) => <div>{children}</div>,
  Box: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <p>{children}</p>,
  VStack: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../filters/FilterOptions", () => ({
  default: ({
    filterKey,
    options,
    activeFilters,
    onFilterChange,
  }) => (
    <div data-testid={`filter-options-${filterKey}`}>
      <p>Filter key: {filterKey}</p>
      <p>
        Active value:{" "}
        {String(activeFilters[filterKey] ?? "all")}
      </p>

      {options.map((option) => (
        <button
          key={String(option.value)}
          onClick={() =>
            onFilterChange(filterKey, option.value)
          }
        >
          {option.label}
        </button>
      ))}
    </div>
  ),
}));

describe("DashboardFilterPanel", () => {
  const mockOnFilterChange = vi.fn();

  const mockFilters = [
    {
      key: "level",
      title: "Level",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Primary",
          value: "primary",
        },
        {
          label: "Secondary",
          value: "secondary",
        },
      ],
    },
    {
      key: "is_published",
      title: "Published",
      options: [
        {
          label: "All",
          value: "all",
        },
        {
          label: "Yes",
          value: true,
        },
        {
          label: "No",
          value: false,
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("renders filter panel heading", () => {
    /**
     * Arrange:
     * Render DashboardFilterPanel with filter data.
     *
     * Act:
     * Query the panel heading.
     *
     * Assert:
     * Confirm the FILTER heading is displayed.
     */
    render(
      <DashboardFilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText("FILTER")).toBeInTheDocument();
  });

  test("renders all filter section titles", () => {
    /**
     * Arrange:
     * Render DashboardFilterPanel with multiple filters.
     *
     * Act:
     * Query each filter title.
     *
     * Assert:
     * Confirm all filter section titles are displayed.
     */
    render(
      <DashboardFilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByText("Level")).toBeInTheDocument();
    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  test("passes correct filter data to FilterOptions", () => {
    /**
     * Arrange:
     * Render DashboardFilterPanel with active filter values.
     *
     * Act:
     * Query the mocked FilterOptions output.
     *
     * Assert:
     * Confirm each FilterOptions instance receives the correct filter key.
     * Confirm active filter values are passed through correctly.
     */
    render(
      <DashboardFilterPanel
        filters={mockFilters}
        activeFilters={{
          level: "secondary",
          is_published: true,
        }}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(
      screen.getByTestId("filter-options-level")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("filter-options-is_published")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Filter key: level")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Active value: secondary")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Filter key: is_published")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Active value: true")
    ).toBeInTheDocument();
  });

  test("calls onFilterChange when a filter option is clicked", () => {
    /**
     * Arrange:
     * Render DashboardFilterPanel with mocked FilterOptions buttons.
     *
     * Act:
     * Click the Secondary filter option.
     *
     * Assert:
     * Confirm onFilterChange is called with the correct filter key and value.
     */
    render(
      <DashboardFilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText("Secondary"));

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      "level",
      "secondary"
    );
  });
});
