/**
 * getUpdatedRelationValues Tests
 *
 * This test suite verifies:
 *
 * 1. Single relation fields return the selected option ID
 * 2. Multiple relation fields add unselected option IDs
 * 3. Multiple relation fields remove selected option IDs
 * 4. Multiple relation fields preserve existing selected values
 * 5. Custom optionValue keys are supported
 * 6. Empty multiple relation values initialise correctly
 */

import { describe, test, expect } from "vitest";

import getUpdatedRelationValues from "./getUpdatedRelationValues";

describe("getUpdatedRelationValues", () => {
  test("single relation fields return the selected option ID", () => {
    /**
     * Arrange:
     * Create a single relation field and selected option.
     *
     * Act:
     * Update the relation values.
     *
     * Assert:
     * Confirm the selected option ID is returned directly.
     */
    const field = {
      optionValue: "subject_id",
      multiple: false,
    };

    const option = {
      subject_id: "subject-1",
      title: "Mathematics",
    };

    const result = getUpdatedRelationValues({
      field,
      option,
      currentValues: "",
    });

    expect(result).toBe("subject-1");
  });

  test("multiple relation fields add unselected option IDs", () => {
    /**
     * Arrange:
     * Create a multiple relation field with unselected options.
     *
     * Act:
     * Update the relation values.
     *
     * Assert:
     * Confirm the new option ID is added.
     */
    const field = {
      optionValue: "subject_id",
      multiple: true,
    };

    const option = {
      subject_id: "subject-2",
      title: "English",
    };

    const result = getUpdatedRelationValues({
      field,
      option,
      currentValues: ["subject-1"],
    });

    expect(result).toEqual([
      "subject-1",
      "subject-2",
    ]);
  });

  test("multiple relation fields remove selected option IDs", () => {
    /**
     * Arrange:
     * Create a multiple relation field with an already selected option.
     *
     * Act:
     * Update the relation values.
     *
     * Assert:
     * Confirm the selected option ID is removed.
     */
    const field = {
      optionValue: "subject_id",
      multiple: true,
    };

    const option = {
      subject_id: "subject-1",
      title: "Mathematics",
    };

    const result = getUpdatedRelationValues({
      field,
      option,
      currentValues: [
        "subject-1",
        "subject-2",
      ],
    });

    expect(result).toEqual([
      "subject-2",
    ]);
  });

  test("multiple relation fields preserve existing selected values", () => {
    /**
     * Arrange:
     * Create a multiple relation field with existing selected values.
     *
     * Act:
     * Update the relation values with a new option.
     *
     * Assert:
     * Confirm existing selected values are preserved.
     */
    const field = {
      optionValue: "subject_id",
      multiple: true,
    };

    const option = {
      subject_id: "subject-3",
      title: "Science",
    };

    const result = getUpdatedRelationValues({
      field,
      option,
      currentValues: [
        "subject-1",
        "subject-2",
      ],
    });

    expect(result).toEqual([
      "subject-1",
      "subject-2",
      "subject-3",
    ]);
  });

  test("custom optionValue keys are supported", () => {
    /**
     * Arrange:
     * Create a field using a custom option identifier key.
     *
     * Act:
     * Update the relation values.
     *
     * Assert:
     * Confirm the custom optionValue key is used.
     */
    const field = {
      optionValue: "topic_id",
      multiple: false,
    };

    const option = {
      topic_id: "topic-1",
      title: "Algebra",
    };

    const result = getUpdatedRelationValues({
      field,
      option,
      currentValues: "",
    });

    expect(result).toBe("topic-1");
  });

  test("empty multiple relation values initialise correctly", () => {
    /**
     * Arrange:
     * Create a multiple relation field with empty selected values.
     *
     * Act:
     * Update the relation values.
     *
     * Assert:
     * Confirm the first selected option initialises correctly.
     */
    const field = {
      optionValue: "subject_id",
      multiple: true,
    };

    const option = {
      subject_id: "subject-1",
      title: "Mathematics",
    };

    const result = getUpdatedRelationValues({
      field,
      option,
      currentValues: [],
    });

    expect(result).toEqual([
      "subject-1",
    ]);
  });
});
