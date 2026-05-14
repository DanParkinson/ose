/**
 * getSelectedRelationOptions Tests
 *
 * This test suite verifies:
 *
 * 1. Multiple selected relation options are returned
 * 2. Single selected relation options are returned
 * 3. Non-selected options are excluded
 * 4. Empty selectedValues arrays return empty arrays
 * 5. Missing selectedValues return empty arrays for single relations
 * 6. Custom optionValue keys are supported
 */

import { describe, test, expect } from "vitest";

import getSelectedRelationOptions from "./getSelectedRelationOptions";

describe("getSelectedRelationOptions", () => {
  test("returns multiple selected relation options", () => {
    /**
     * Arrange:
     * Create relation options and multiple selected values.
     *
     * Act:
     * Get selected relation options.
     *
     * Assert:
     * Confirm all matching selected options are returned.
     */
    const options = [
      { subject_id: "subject-1", title: "Mathematics" },
      { subject_id: "subject-2", title: "English" },
      { subject_id: "subject-3", title: "Science" },
    ];

    const result = getSelectedRelationOptions({
      options,
      selectedValues: ["subject-1", "subject-3"],
      optionValue: "subject_id",
      multiple: true,
    });

    expect(result).toEqual([
      { subject_id: "subject-1", title: "Mathematics" },
      { subject_id: "subject-3", title: "Science" },
    ]);
  });

  test("returns single selected relation options", () => {
    /**
     * Arrange:
     * Create relation options and a single selected value.
     *
     * Act:
     * Get selected relation options.
     *
     * Assert:
     * Confirm the matching selected option is returned.
     */
    const options = [
      { subject_id: "subject-1", title: "Mathematics" },
      { subject_id: "subject-2", title: "English" },
    ];

    const result = getSelectedRelationOptions({
      options,
      selectedValues: "subject-2",
      optionValue: "subject_id",
    });

    expect(result).toEqual([
      { subject_id: "subject-2", title: "English" },
    ]);
  });

  test("excludes non-selected options", () => {
    /**
     * Arrange:
     * Create relation options with one selected value.
     *
     * Act:
     * Get selected relation options.
     *
     * Assert:
     * Confirm non-selected options are excluded.
     */
    const options = [
      { subject_id: "subject-1", title: "Mathematics" },
      { subject_id: "subject-2", title: "English" },
    ];

    const result = getSelectedRelationOptions({
      options,
      selectedValues: ["subject-1"],
      optionValue: "subject_id",
      multiple: true,
    });

    expect(result).toEqual([
      { subject_id: "subject-1", title: "Mathematics" },
    ]);
  });

  test("empty selectedValues arrays return empty arrays", () => {
    /**
     * Arrange:
     * Create relation options and an empty selected values array.
     *
     * Act:
     * Get selected relation options.
     *
     * Assert:
     * Confirm an empty array is returned.
     */
    const options = [
      { subject_id: "subject-1", title: "Mathematics" },
    ];

    const result = getSelectedRelationOptions({
      options,
      selectedValues: [],
      optionValue: "subject_id",
      multiple: true,
    });

    expect(result).toEqual([]);
  });

  test("missing selectedValues return empty arrays for single relations", () => {
    /**
     * Arrange:
     * Create relation options and an empty selected value.
     *
     * Act:
     * Get selected relation options.
     *
     * Assert:
     * Confirm no single relation option is selected.
     */
    const options = [
      { subject_id: "subject-1", title: "Mathematics" },
    ];

    const result = getSelectedRelationOptions({
      options,
      selectedValues: "",
      optionValue: "subject_id",
    });

    expect(result).toEqual([]);
  });

  test("custom optionValue keys are supported", () => {
    /**
     * Arrange:
     * Create relation options using a custom identifier key.
     *
     * Act:
     * Get selected relation options.
     *
     * Assert:
     * Confirm the custom optionValue key is used for matching.
     */
    const options = [
      { topic_id: "topic-1", title: "Algebra" },
      { topic_id: "topic-2", title: "Geometry" },
    ];

    const result = getSelectedRelationOptions({
      options,
      selectedValues: ["topic-2"],
      optionValue: "topic_id",
      multiple: true,
    });

    expect(result).toEqual([
      { topic_id: "topic-2", title: "Geometry" },
    ]);
  });
});
