/**
 * buildResetFilters Tests
 *
 * This test suite verifies:
 *
 * 1. Filter keys default to "all"
 * 2. Multiple filters are reset correctly
 * 3. Empty filter arrays return empty objects
 * 4. Undefined filters return empty objects
 * 5. Filters preserve their original keys
 */

import { describe, test, expect } from "vitest";

import { buildResetFilters } from "./resetModelFilters";

describe("buildResetFilters", () => {
  test('filter keys default to "all"', () => {
    /**
     * Arrange:
     * Create a single filter configuration.
     *
     * Act:
     * Build the reset filter object.
     *
     * Assert:
     * Confirm the filter key defaults to "all".
     */
    const filters = [
      {
        key: "level",
      },
    ];

    const result = buildResetFilters(filters);

    expect(result).toEqual({
      level: "all",
    });
  });

  test("multiple filters are reset correctly", () => {
    /**
     * Arrange:
     * Create multiple filter configurations.
     *
     * Act:
     * Build the reset filter object.
     *
     * Assert:
     * Confirm all filter keys reset to "all".
     */
    const filters = [
      {
        key: "level",
      },
      {
        key: "language",
      },
      {
        key: "is_published",
      },
    ];

    const result = buildResetFilters(filters);

    expect(result).toEqual({
      level: "all",
      language: "all",
      is_published: "all",
    });
  });

  test("empty filter arrays return empty objects", () => {
    /**
     * Arrange:
     * Create an empty filter array.
     *
     * Act:
     * Build the reset filter object.
     *
     * Assert:
     * Confirm an empty object is returned.
     */
    const result = buildResetFilters([]);

    expect(result).toEqual({});
  });

  test("undefined filters return empty objects", () => {
    /**
     * Arrange:
     * Use undefined filters.
     *
     * Act:
     * Build the reset filter object.
     *
     * Assert:
     * Confirm an empty object is returned.
     */
    const result = buildResetFilters();

    expect(result).toEqual({});
  });

  test("filters preserve their original keys", () => {
    /**
     * Arrange:
     * Create filters with custom keys.
     *
     * Act:
     * Build the reset filter object.
     *
     * Assert:
     * Confirm original filter keys are preserved.
     */
    const filters = [
      {
        key: "custom_filter",
      },
      {
        key: "topic_id",
      },
    ];

    const result = buildResetFilters(filters);

    expect(result).toEqual({
      custom_filter: "all",
      topic_id: "all",
    });
  });
});
