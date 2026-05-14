/**
 * parseBackendErrors Tests
 *
 * This test suite verifies:
 *
 * 1. Invalid backend responses return default errors
 * 2. Missing backend responses return default errors
 * 3. non_field_errors arrays are joined into a single string
 * 4. non_field_errors strings are returned directly
 * 5. detail values become general errors
 * 6. Field errors are separated from general errors
 * 7. Empty backend error objects return empty errors
 */

import { describe, test, expect } from "vitest";

import parseBackendErrors from "./parseBackendErrors";

describe("parseBackendErrors", () => {
  test("returns default errors when backend response is invalid", () => {
    /**
     * Arrange:
     * Create an error object with invalid backend response data.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm default errors are returned.
     */
    const error = {
      response: {
        data: "Invalid response",
      },
    };

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {},
      generalError:
        "Could not create item. Please check the form.",
    });
  });

  test("returns default errors when backend response is missing", () => {
    /**
     * Arrange:
     * Create an error object without response data.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm default errors are returned.
     */
    const error = {};

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {},
      generalError:
        "Could not create item. Please check the form.",
    });
  });

  test("joins non_field_errors arrays into a single string", () => {
    /**
     * Arrange:
     * Create backend errors with multiple non-field errors.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm non-field errors are joined into a single string.
     */
    const error = {
      response: {
        data: {
          non_field_errors: [
            "Invalid request.",
            "Permission denied.",
          ],
        },
      },
    };

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {},
      generalError:
        "Invalid request. Permission denied.",
    });
  });

  test("returns non_field_errors strings directly", () => {
    /**
     * Arrange:
     * Create backend errors with a string non-field error.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm the string error is returned directly.
     */
    const error = {
      response: {
        data: {
          non_field_errors: "Permission denied.",
        },
      },
    };

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {},
      generalError: "Permission denied.",
    });
  });

  test("uses detail as the general error when non_field_errors do not exist", () => {
    /**
     * Arrange:
     * Create backend errors containing a detail value.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm detail becomes the general error.
     */
    const error = {
      response: {
        data: {
          detail: "Authentication credentials were not provided.",
        },
      },
    };

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {},
      generalError:
        "Authentication credentials were not provided.",
    });
  });

  test("separates field errors from general errors", () => {
    /**
     * Arrange:
     * Create backend errors containing field and non-field errors.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm field errors are separated correctly.
     */
    const error = {
      response: {
        data: {
          non_field_errors: "General error.",
          title: ["This field is required."],
          description: ["Minimum length is 10."],
        },
      },
    };

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {
        title: ["This field is required."],
        description: ["Minimum length is 10."],
      },
      generalError: "General error.",
    });
  });

  test("returns empty errors when backend response is empty", () => {
    /**
     * Arrange:
     * Create backend errors with an empty response object.
     *
     * Act:
     * Parse the backend errors.
     *
     * Assert:
     * Confirm empty field and general errors are returned.
     */
    const error = {
      response: {
        data: {},
      },
    };

    const result = parseBackendErrors(error);

    expect(result).toEqual({
      fieldErrors: {},
      generalError: "",
    });
  });
});
