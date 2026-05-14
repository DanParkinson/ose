/**
 * ModelFieldRenderer Tests
 *
 * This test suite verifies:
 *
 * 1. Boolean true values render a check icon
 * 2. Boolean false values render an X icon
 * 3. Array values render as comma-separated text
 * 4. Object array values render using title, level, and language
 * 5. Null, undefined, and empty string values render the empty fallback
 * 6. Normal text and number values render as strings
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import ModelFieldRenderer from "./ModelFieldRenderer";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <p>{children}</p>,
}));

vi.mock("react-icons/hi", () => ({
  HiCheck: () => <span data-testid="check-icon">check</span>,
  HiX: () => <span data-testid="x-icon">x</span>,
}));

describe("ModelFieldRenderer", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders check icon when value is true", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with a boolean true value.
     *
     * Act:
     * Query the mocked check icon.
     *
     * Assert:
     * Confirm the check icon is rendered.
     */
    render(<ModelFieldRenderer value={true} />);

    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  test("renders x icon when value is false", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with a boolean false value.
     *
     * Act:
     * Query the mocked x icon.
     *
     * Assert:
     * Confirm the x icon is rendered.
     */
    render(<ModelFieldRenderer value={false} />);

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
  });

  test("renders array values as comma-separated text", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with an array of primitive values.
     *
     * Act:
     * Query the rendered comma-separated text.
     *
     * Assert:
     * Confirm array values are joined and displayed correctly.
     */
    render(
      <ModelFieldRenderer
        value={["Python", "JavaScript", "React"]}
      />
    );

    expect(
      screen.getByText("Python, JavaScript, React")
    ).toBeInTheDocument();
  });

  test("renders object array values using title, level, and language", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with an array of objects.
     *
     * Act:
     * Query the rendered formatted object text.
     *
     * Assert:
     * Confirm object values are rendered using title, level, and language.
     */
    render(
      <ModelFieldRenderer
        value={[
          {
            title: "Mathematics",
            level: "secondary",
            language: "en",
          },
          {
            title: "English",
            level: "primary",
            language: "en",
          },
        ]}
      />
    );

    expect(
      screen.getByText(
        "Mathematics - secondary - en, English - primary - en"
      )
    ).toBeInTheDocument();
  });

  test("renders fallback value when value is null", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with a null value.
     *
     * Act:
     * Query the fallback text.
     *
     * Assert:
     * Confirm the default empty value is rendered.
     */
    render(<ModelFieldRenderer value={null} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders fallback value when value is undefined", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with an undefined value.
     *
     * Act:
     * Query the fallback text.
     *
     * Assert:
     * Confirm the default empty value is rendered.
     */
    render(<ModelFieldRenderer value={undefined} />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders fallback value when value is an empty string", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with an empty string value.
     *
     * Act:
     * Query the fallback text.
     *
     * Assert:
     * Confirm the default empty value is rendered.
     */
    render(<ModelFieldRenderer value="" />);

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  test("renders custom fallback value when emptyValue is provided", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with an empty value and custom fallback.
     *
     * Act:
     * Query the custom fallback text.
     *
     * Assert:
     * Confirm the custom empty value is rendered.
     */
    render(
      <ModelFieldRenderer
        value={null}
        emptyValue="Not provided"
      />
    );

    expect(
      screen.getByText("Not provided")
    ).toBeInTheDocument();
  });

  test("renders string values normally", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with a string value.
     *
     * Act:
     * Query the rendered text.
     *
     * Assert:
     * Confirm the string value is displayed.
     */
    render(<ModelFieldRenderer value="Mathematics" />);

    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  test("renders number values as strings", () => {
    /**
     * Arrange:
     * Render ModelFieldRenderer with a number value.
     *
     * Act:
     * Query the rendered number text.
     *
     * Assert:
     * Confirm the number value is converted to a string and displayed.
     */
    render(<ModelFieldRenderer value={25} />);

    expect(screen.getByText("25")).toBeInTheDocument();
  });
});
