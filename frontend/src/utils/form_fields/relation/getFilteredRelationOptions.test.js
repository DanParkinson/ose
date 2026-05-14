/**
 * getFilteredRelationOptions Tests
 *
 * This test suite verifies:
 *
 * 1. Empty search values return empty arrays
 * 2. Whitespace-only search values return empty arrays
 * 3. Matching options are returned
 * 4. Non-matching options are excluded
 * 5. Searches are case-insensitive
 * 6. formatOption is called correctly
 * 7. Multiple matching options are returned
 */

import { describe, test, expect, vi } from "vitest";

import getFilteredRelationOptions from "./getFilteredRelationOptions";

describe("getFilteredRelationOptions", () => {
  test("returns empty array when search value is empty", () => {
    /**
     * Arrange:
     * Create relation options with an empty search value.
     *
     * Act:
     * Filter relation options.
     *
     * Assert:
     * Confirm an empty array is returned.
     */
    const result = getFilteredRelationOptions({
      options: [
        { title: "Mathematics" },
      ],
      searchValue: "",
      field: {},
      formatOption: (option) => option.title,
    });

    expect(result).toEqual([]);
  });

  test("returns empty array when search value contains only whitespace", () => {
    /**
     * Arrange:
     * Create relation options with a whitespace-only search value.
     *
     * Act:
     * Filter relation options.
     *
     * Assert:
     * Confirm an empty array is returned.
     */
    const result = getFilteredRelationOptions({
      options: [
        { title: "Mathematics" },
      ],
      searchValue: "   ",
      field: {},
      formatOption: (option) => option.title,
    });

    expect(result).toEqual([]);
  });

  test("returns matching options", () => {
    /**
     * Arrange:
     * Create relation options containing matching values.
     *
     * Act:
     * Filter relation options.
     *
     * Assert:
     * Confirm matching options are returned.
     */
    const options = [
      { title: "Mathematics" },
      { title: "English" },
    ];

    const result = getFilteredRelationOptions({
      options,
      searchValue: "math",
      field: {},
      formatOption: (option) => option.title,
    });

    expect(result).toEqual([
      { title: "Mathematics" },
    ]);
  });

  test("excludes non-matching options", () => {
    /**
     * Arrange:
     * Create relation options without matching values.
     *
     * Act:
     * Filter relation options.
     *
     * Assert:
     * Confirm non-matching options are excluded.
     */
    const options = [
      { title: "Mathematics" },
      { title: "English" },
    ];

    const result = getFilteredRelationOptions({
      options,
      searchValue: "science",
      field: {},
      formatOption: (option) => option.title,
    });

    expect(result).toEqual([]);
  });

  test("searches are case-insensitive", () => {
    /**
     * Arrange:
     * Create relation options with mixed-case values.
     *
     * Act:
     * Filter relation options using different casing.
     *
     * Assert:
     * Confirm matching is case-insensitive.
     */
    const options = [
      { title: "Mathematics" },
    ];

    const result = getFilteredRelationOptions({
      options,
      searchValue: "MATH",
      field: {},
      formatOption: (option) => option.title,
    });

    expect(result).toEqual([
      { title: "Mathematics" },
    ]);
  });

  test("calls formatOption correctly", () => {
    /**
     * Arrange:
     * Create relation options and spy on formatOption.
     *
     * Act:
     * Filter relation options.
     *
     * Assert:
     * Confirm formatOption receives the correct arguments.
     */
    const options = [
      { title: "Mathematics" },
    ];

    const formatOption = vi.fn(
      (option) => option.title
    );

    const field = {
      displayFields: ["title"],
    };

    getFilteredRelationOptions({
      options,
      searchValue: "math",
      field,
      formatOption,
    });

    expect(formatOption).toHaveBeenCalledWith(
      options[0],
      field
    );
  });

  test("returns multiple matching options", () => {
    /**
     * Arrange:
     * Create relation options with multiple matches.
     *
     * Act:
     * Filter relation options.
     *
     * Assert:
     * Confirm all matching options are returned.
     */
    const options = [
      { title: "Mathematics" },
      { title: "Mathematical Logic" },
      { title: "English" },
    ];

    const result = getFilteredRelationOptions({
      options,
      searchValue: "math",
      field: {},
      formatOption: (option) => option.title,
    });

    expect(result).toEqual([
      { title: "Mathematics" },
      { title: "Mathematical Logic" },
    ]);
  });
});
