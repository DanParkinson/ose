/**
 * DashboardTableHeader Tests
 *
 * This test suite verifies:
 *
 * 1. All column labels render correctly
 * 2. Columns render in the correct order
 * 3. Template column layout is passed correctly
 *
 * Chakra components are mocked so these tests focus only on
 * DashboardTableHeader rendering behaviour.
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import DashboardTableHeader from "./DashboardTableHeader";

vi.mock("@chakra-ui/react", () => ({
  Grid: ({ children, templateColumns }) => (
    <div data-template-columns={templateColumns}>
      {children}
    </div>
  ),

  Text: ({ children }) => <p>{children}</p>,
}));

describe("DashboardTableHeader", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders all column labels", () => {
    /**
     * Arrange:
     * Render DashboardTableHeader with multiple column labels.
     *
     * Act:
     * Query the rendered column labels.
     *
     * Assert:
     * Confirm all column labels are displayed.
     */
    render(
      <DashboardTableHeader
        columns={[
          "Title",
          "Level",
          "Published",
        ]}
        templateColumns="1fr 1fr 1fr"
      />
    );

    expect(screen.getByText("Title")).toBeInTheDocument();

    expect(screen.getByText("Level")).toBeInTheDocument();

    expect(screen.getByText("Published")).toBeInTheDocument();
  });

  test("renders columns in the correct order", () => {
    /**
     * Arrange:
     * Render DashboardTableHeader with ordered columns.
     *
     * Act:
     * Query all rendered column labels.
     *
     * Assert:
     * Confirm the labels render in the same order provided.
     */
    render(
      <DashboardTableHeader
        columns={[
          "First",
          "Second",
          "Third",
        ]}
        templateColumns="1fr 1fr 1fr"
      />
    );

    const columnLabels = screen.getAllByText(
      /First|Second|Third/
    );

    expect(columnLabels[0]).toHaveTextContent("First");

    expect(columnLabels[1]).toHaveTextContent("Second");

    expect(columnLabels[2]).toHaveTextContent("Third");
  });

  test("passes templateColumns to the grid layout", () => {
    /**
     * Arrange:
     * Render DashboardTableHeader with a template column layout.
     *
     * Act:
     * Query the mocked Grid wrapper.
     *
     * Assert:
     * Confirm the templateColumns value is passed correctly.
     */
    render(
      <DashboardTableHeader
        columns={["Title"]}
        templateColumns="2fr 1fr 1fr"
      />
    );

    expect(
      screen
        .getByText("Title")
        .parentElement
    ).toHaveAttribute(
      "data-template-columns",
      "2fr 1fr 1fr"
    );
  });
});
