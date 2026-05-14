/**
 * getFieldError Tests
 *
 * This test suite verifies:
 *
 * 1. Null is returned when the field has no error
 * 2. Null is returned when the field error is undefined
 * 3. String errors are returned unchanged
 * 4. Array errors are joined into a single string
 * 5. Empty arrays return an empty string
 */

import { describe, test, expect } from "vitest";

import getFieldError from "./getFieldError";

describe("getFieldError", () => {
  test("returns null when field has no error", () => {
    /**
     * Arrange:
     * Create field errors without the target field.
     *
     * Act:
     * Request the field error for a missing field.
     *
     * Assert:
     * Confirm null is returned.
     */
    const fieldErrors = {
      title: "This field is required.",
    };

    const result = getFieldError(
      fieldErrors,
      "description"
    );

    expect(result).toBeNull();
  });

  test("returns null when field error is undefined", () => {
    /**
     * Arrange:
     * Create field errors with an undefined field value.
     *
     * Act:
     * Request the undefined field error.
     *
     * Assert:
     * Confirm null is returned.
     */
    const fieldErrors = {
      title: undefined,
    };

    const result = getFieldError(
      fieldErrors,
      "title"
    );

    expect(result).toBeNull();
  });

  test("returns string errors unchanged", () => {
    /**
     * Arrange:
     * Create field errors containing a string error.
     *
     * Act:
     * Request the string field error.
     *
     * Assert:
     * Confirm the original string is returned unchanged.
     */
    const fieldErrors = {
      title: "This field is required.",
    };

    const result = getFieldError(
      fieldErrors,
      "title"
    );

    expect(result).toBe("This field is required.");
  });

  test("joins array errors into a single string", () => {
    /**
     * Arrange:
     * Create field errors containing multiple error messages.
     *
     * Act:
     * Request the array field error.
     *
     * Assert:
     * Confirm array values are joined into a single string.
     */
    const fieldErrors = {
      title: [
        "This field is required.",
        "Minimum length is 5.",
      ],
    };

    const result = getFieldError(
      fieldErrors,
      "title"
    );

    expect(result).toBe(
      "This field is required. Minimum length is 5."
    );
  });

  test("returns empty string when error array is empty", () => {
    /**
     * Arrange:
     * Create field errors with an empty array.
     *
     * Act:
     * Request the field error.
     *
     * Assert:
     * Confirm an empty string is returned.
     */
    const fieldErrors = {
      title: [],
    };

    const result = getFieldError(
      fieldErrors,
      "title"
    );

    expect(result).toBe("");
  });
});
