/**
 * FormFieldRenderer Tests
 *
 * This test suite verifies:
 *
 * 1. Boolean fields render FormFieldBoolean
 * 2. Relation fields render FormFieldRelation
 * 3. Fields with backend choices render FormFieldChoice
 * 4. Standard fields render FormFieldText
 * 5. Field errors are passed to the rendered field component
 * 6. Relation fields receive search, selected, and filtered option data
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import FormFieldRenderer from "./FormFieldRenderer";

vi.mock("../forms/base/form_field/FormFieldBoolean", () => ({
  default: ({ field, value, error }) => (
    <div data-testid="form-field-boolean">
      <p>{field.name}</p>
      <p>{String(value)}</p>
      <p>{error}</p>
    </div>
  ),
}));

vi.mock("../forms/base/form_field/FormFieldChoice", () => ({
  default: ({ field, value, error, choices }) => (
    <div data-testid="form-field-choice">
      <p>{field.name}</p>
      <p>{value}</p>
      <p>{error}</p>
      <p>{choices.map((choice) => choice.label).join(", ")}</p>
    </div>
  ),
}));

vi.mock("../forms/base/form_field/FormFieldRelation", () => ({
  default: ({
    field,
    error,
    searchValue,
    filteredOptions,
    selectedValues,
    selectedOptions,
  }) => (
    <div data-testid="form-field-relation">
      <p>{field.name}</p>
      <p>{error}</p>
      <p>{searchValue}</p>
      <p>{selectedValues.join(", ")}</p>
      <p>{selectedOptions.map((option) => option.title).join(", ")}</p>
      <p>{filteredOptions.map((option) => option.title).join(", ")}</p>
    </div>
  ),
}));

vi.mock("../forms/base/form_field/FormFieldText", () => ({
  default: ({ field, value, error }) => (
    <div data-testid="form-field-text">
      <p>{field.name}</p>
      <p>{value}</p>
      <p>{error}</p>
    </div>
  ),
}));

describe("FormFieldRenderer", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const defaultProps = {
    formData: {},
    fieldOptions: {},
    fieldErrors: {},
    relationOptions: {},
    relationSearch: {},
    debouncedSearch: {},
    onChange: vi.fn(),
    onRelationToggle: vi.fn(),
    onRelationSearchChange: vi.fn(),
  };

  test("renders FormFieldBoolean when field type is boolean", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with a boolean field configuration.
     *
     * Act:
     * Query the mocked boolean field component.
     *
     * Assert:
     * Confirm FormFieldBoolean is rendered with the correct value.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{ name: "is_published", type: "boolean" }}
        formData={{ is_published: true }}
      />
    );

    expect(screen.getByTestId("form-field-boolean")).toBeInTheDocument();
    expect(screen.getByText("is_published")).toBeInTheDocument();
    expect(screen.getByText("true")).toBeInTheDocument();
  });

  test("renders FormFieldRelation when field type is relation", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with a relation field configuration.
     *
     * Act:
     * Query the mocked relation field component.
     *
     * Assert:
     * Confirm FormFieldRelation is rendered.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{
          name: "subjects",
          type: "relation",
          optionValue: "subject_id",
          optionLabel: "title",
          multiple: true,
        }}
        formData={{ subjects: ["subject-1"] }}
        relationOptions={{
          subjects: [
            {
              subject_id: "subject-1",
              title: "Mathematics",
            },
          ],
        }}
      />
    );

    expect(screen.getByTestId("form-field-relation")).toBeInTheDocument();
    expect(screen.getByText("subjects")).toBeInTheDocument();
  });

  test("renders FormFieldChoice when backend choices exist", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with a normal field that has backend choices.
     *
     * Act:
     * Query the mocked choice field component.
     *
     * Assert:
     * Confirm FormFieldChoice is rendered with the available choices.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{ name: "level", type: "text" }}
        formData={{ level: "secondary" }}
        fieldOptions={{
          level: {
            choices: [
              { value: "primary", label: "Primary" },
              { value: "secondary", label: "Secondary" },
            ],
          },
        }}
      />
    );

    expect(screen.getByTestId("form-field-choice")).toBeInTheDocument();
    expect(screen.getByText("level")).toBeInTheDocument();
    expect(screen.getByText("secondary")).toBeInTheDocument();
    expect(screen.getByText("Primary, Secondary")).toBeInTheDocument();
  });

  test("renders FormFieldText by default when field has no special type or choices", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with a standard text field.
     *
     * Act:
     * Query the mocked text field component.
     *
     * Assert:
     * Confirm FormFieldText is rendered by default.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{ name: "title", type: "text" }}
        formData={{ title: "Mathematics" }}
      />
    );

    expect(screen.getByTestId("form-field-text")).toBeInTheDocument();
    expect(screen.getByText("title")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  test("passes field error to the rendered field component", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with a field error for the current field.
     *
     * Act:
     * Query the rendered error text.
     *
     * Assert:
     * Confirm the field error is passed to the child component.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{ name: "title", type: "text" }}
        formData={{ title: "" }}
        fieldErrors={{
          title: "This field is required.",
        }}
      />
    );

    expect(screen.getByTestId("form-field-text")).toBeInTheDocument();
    expect(screen.getByText("This field is required.")).toBeInTheDocument();
  });

  test("passes relation search value to FormFieldRelation", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with a relation search value.
     *
     * Act:
     * Query the mocked relation field.
     *
     * Assert:
     * Confirm the current relation search value is passed through.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{
          name: "subjects",
          type: "relation",
          optionValue: "subject_id",
          optionLabel: "title",
          multiple: true,
        }}
        formData={{ subjects: [] }}
        relationSearch={{
          subjects: "math",
        }}
      />
    );

    expect(screen.getByTestId("form-field-relation")).toBeInTheDocument();
    expect(screen.getByText("math")).toBeInTheDocument();
  });

  test("passes selected relation options to FormFieldRelation", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with relation options and selected values.
     *
     * Act:
     * Query the rendered selected option text.
     *
     * Assert:
     * Confirm selected relation options are calculated and passed through.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{
          name: "subjects",
          type: "relation",
          optionValue: "subject_id",
          optionLabel: "title",
          multiple: true,
        }}
        formData={{
          subjects: ["subject-1"],
        }}
        relationOptions={{
          subjects: [
            {
              subject_id: "subject-1",
              title: "Mathematics",
            },
            {
              subject_id: "subject-2",
              title: "English",
            },
          ],
        }}
      />
    );

    expect(screen.getByTestId("form-field-relation")).toBeInTheDocument();
    expect(screen.getByText("subject-1")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  test("passes filtered relation options to FormFieldRelation", () => {
    /**
     * Arrange:
     * Render FormFieldRenderer with relation options and a debounced search value.
     *
     * Act:
     * Query the rendered filtered option text.
     *
     * Assert:
     * Confirm filtered relation options are calculated and passed through.
     */
    render(
      <FormFieldRenderer
        {...defaultProps}
        field={{
          name: "subjects",
          type: "relation",
          optionValue: "subject_id",
          optionLabel: "title",
          multiple: true,
        }}
        formData={{
          subjects: [],
        }}
        relationOptions={{
          subjects: [
            {
              subject_id: "subject-1",
              title: "Mathematics",
            },
            {
              subject_id: "subject-2",
              title: "English",
            },
          ],
        }}
        debouncedSearch={{
          subjects: "eng",
        }}
      />
    );

    expect(screen.getByTestId("form-field-relation")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.queryByText("Mathematics")).not.toBeInTheDocument();
  });
});
