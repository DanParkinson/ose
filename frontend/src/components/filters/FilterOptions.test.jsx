/**
 * FilterOptions Tests
 *
 * This test suite verifies:
 *
 * 1. All filter options render correctly
 * 2. The component defaults to "all" when no active filter exists
 * 3. Active filter styling is applied correctly
 * 4. Clicking an option calls onFilterChange with correct values
 *
 * Notes:
 * - Chakra components are mocked to avoid ChakraProvider requirements
 * - AppRadioIndicator is mocked to simplify rendering
 * - Tests focus on behaviour rather than Chakra styling internals
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";

import FilterOptions from "./FilterOptions";

vi.mock("@chakra-ui/react", () => ({
  HStack: ({
    children,
    as,
    onClick,
    type,
  }) => {
    const Component = as || "div";

    return (
      <Component
        type={type}
        onClick={onClick}
      >
        {children}
      </Component>
    );
  },

  Text: ({ children }) => (
    <span>{children}</span>
  ),
}));

vi.mock("../ui/AppRadioIndicator", () => ({
  default: ({ bg }) => (
    <div
      data-testid="radio-indicator"
      data-bg={bg}
    />
  ),
}));

describe("FilterOptions", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const mockOptions = [
    {
      label: "All",
      value: "all",
    },
    {
      label: "Published",
      value: true,
    },
    {
      label: "Unpublished",
      value: false,
    },
  ];

  test("renders all filter options", () => {
    /**
     * Arrange:
     * Render the component with multiple filter options.
     *
     * Act:
     * Query each filter label.
     *
     * Assert:
     * Confirm all filter labels are rendered.
     */
    render(
      <FilterOptions
        filterKey="is_published"
        options={mockOptions}
        activeFilters={{}}
        onFilterChange={vi.fn()}
      />
    );

    expect(screen.getByText("All")).toBeTruthy();
    expect(screen.getByText("Published")).toBeTruthy();
    expect(screen.getByText("Unpublished")).toBeTruthy();
  });

  test('defaults to "all" when no active filter exists', () => {
    /**
     * Arrange:
     * Render the component with no active filter value.
     *
     * Act:
     * Retrieve all mocked radio indicators.
     *
     * Assert:
     * Confirm the "All" option is active by default.
     */
    render(
      <FilterOptions
        filterKey="is_published"
        options={mockOptions}
        activeFilters={{}}
        onFilterChange={vi.fn()}
      />
    );

    const indicators = screen.getAllByTestId("radio-indicator");

    expect(indicators[0].getAttribute("data-bg")).toBe(
      "text.primarylight"
    );
  });

  test("applies active styling to the selected option", () => {
    /**
     * Arrange:
     * Render the component with a selected filter value.
     *
     * Act:
     * Retrieve all mocked radio indicators.
     *
     * Assert:
     * Confirm the selected option is active.
     * Confirm non-selected options remain inactive.
     */
    render(
      <FilterOptions
        filterKey="is_published"
        options={mockOptions}
        activeFilters={{
          is_published: true,
        }}
        onFilterChange={vi.fn()}
      />
    );

    const indicators = screen.getAllByTestId("radio-indicator");

    expect(indicators[1].getAttribute("data-bg")).toBe(
      "text.primarylight"
    );

    expect(indicators[0].getAttribute("data-bg")).toBe(
      "transparent"
    );
  });

  test("calls onFilterChange with correct values when clicked", () => {
    /**
     * Arrange:
     * Render the component with a mocked onFilterChange handler.
     *
     * Act:
     * Click the Published filter option.
     *
     * Assert:
     * Confirm onFilterChange receives the correct filter key and value.
     */
    const mockOnFilterChange = vi.fn();

    render(
      <FilterOptions
        filterKey="is_published"
        options={mockOptions}
        activeFilters={{}}
        onFilterChange={mockOnFilterChange}
      />
    );

    fireEvent.click(screen.getByText("Published"));

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      "is_published",
      true
    );
  });
});
