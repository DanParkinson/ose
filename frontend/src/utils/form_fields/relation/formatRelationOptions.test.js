/**
 * formatRelationOption Tests
 *
 * This test suite verifies:
 *
 * 1. displayFields are combined correctly
 * 2. Missing displayField values are ignored
 * 3. displayFields are joined using " - "
 * 4. title, level, and language fallback formatting works
 * 5. optionLabel fallback values are returned
 * 6. Single displayFields work correctly
 * 7. Empty displayFields return empty strings
 */

import { describe, test, expect } from "vitest";

import formatRelationOption from "./formatRelationOptions";

describe("formatRelationOption", () => {
  test("combines displayFields correctly", () => {
    /**
     * Arrange:
     * Create an option object and displayFields configuration.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm displayFields are combined correctly.
     */
    const option = {
      title: "Mathematics",
      level: "secondary",
      language: "en",
    };

    const field = {
      displayFields: ["title", "level", "language"],
    };

    const result = formatRelationOption(option, field);

    expect(result).toBe(
      "Mathematics - secondary - en"
    );
  });

  test("ignores missing displayField values", () => {
    /**
     * Arrange:
     * Create an option object with missing displayField values.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm missing values are ignored.
     */
    const option = {
      title: "Mathematics",
      language: "en",
    };

    const field = {
      displayFields: ["title", "level", "language"],
    };

    const result = formatRelationOption(option, field);

    expect(result).toBe("Mathematics - en");
  });

  test('joins displayFields using " - "', () => {
    /**
     * Arrange:
     * Create an option object with multiple displayFields.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm displayFields are joined using " - ".
     */
    const option = {
      first_name: "Daniel",
      last_name: "Parkinson",
    };

    const field = {
      displayFields: ["first_name", "last_name"],
    };

    const result = formatRelationOption(option, field);

    expect(result).toBe("Daniel - Parkinson");
  });

  test("uses title, level, and language fallback formatting", () => {
    /**
     * Arrange:
     * Create an option object without displayFields.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm the fallback formatting is used.
     */
    const option = {
      title: "Mathematics",
      level: "secondary",
      language: "en",
    };

    const field = {};

    const result = formatRelationOption(option, field);

    expect(result).toBe(
      "Mathematics - secondary - en"
    );
  });

  test("returns optionLabel fallback values", () => {
    /**
     * Arrange:
     * Create an option object using optionLabel fallback configuration.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm the optionLabel value is returned.
     */
    const option = {
      name: "John Smith",
    };

    const field = {
      optionLabel: "name",
    };

    const result = formatRelationOption(option, field);

    expect(result).toBe("John Smith");
  });

  test("single displayFields work correctly", () => {
    /**
     * Arrange:
     * Create an option object with a single displayField.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm single displayFields return correctly.
     */
    const option = {
      title: "Mathematics",
    };

    const field = {
      displayFields: ["title"],
    };

    const result = formatRelationOption(option, field);

    expect(result).toBe("Mathematics");
  });

  test("empty displayFields return empty strings", () => {
    /**
     * Arrange:
     * Create an option object with empty displayFields.
     *
     * Act:
     * Format the relation option.
     *
     * Assert:
     * Confirm an empty string is returned.
     */
    const option = {
      title: "Mathematics",
    };

    const field = {
      displayFields: [],
    };

    const result = formatRelationOption(option, field);

    expect(result).toBe("");
  });
});
