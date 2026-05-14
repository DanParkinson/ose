/**
 * getInitialFormData Tests
 *
 * This test suite verifies:
 *
 * 1. Boolean fields default to false
 * 2. Multiple relation fields default to empty arrays
 * 3. Single relation fields default to empty strings
 * 4. Standard fields default to empty strings
 * 5. Multiple field types are initialised correctly together
 * 6. Empty field arrays return empty objects
 */

import { describe, test, expect } from "vitest";

import getInitialFormData from "./getInitialFormData";

describe("getInitialFormData", () => {
  test("boolean fields default to false", () => {
    /**
     * Arrange:
     * Create a boolean field configuration.
     *
     * Act:
     * Generate initial form data.
     *
     * Assert:
     * Confirm boolean fields initialise as false.
     */
    const fields = [
      {
        name: "is_published",
        type: "boolean",
      },
    ];

    const result = getInitialFormData(fields);

    expect(result).toEqual({
      is_published: false,
    });
  });

  test("multiple relation fields default to empty arrays", () => {
    /**
     * Arrange:
     * Create a multiple relation field configuration.
     *
     * Act:
     * Generate initial form data.
     *
     * Assert:
     * Confirm multiple relation fields initialise as empty arrays.
     */
    const fields = [
      {
        name: "subjects",
        type: "relation",
        multiple: true,
      },
    ];

    const result = getInitialFormData(fields);

    expect(result).toEqual({
      subjects: [],
    });
  });

  test("single relation fields default to empty strings", () => {
    /**
     * Arrange:
     * Create a single relation field configuration.
     *
     * Act:
     * Generate initial form data.
     *
     * Assert:
     * Confirm single relation fields initialise as empty strings.
     */
    const fields = [
      {
        name: "subject",
        type: "relation",
        multiple: false,
      },
    ];

    const result = getInitialFormData(fields);

    expect(result).toEqual({
      subject: "",
    });
  });

  test("standard fields default to empty strings", () => {
    /**
     * Arrange:
     * Create standard text field configurations.
     *
     * Act:
     * Generate initial form data.
     *
     * Assert:
     * Confirm standard fields initialise as empty strings.
     */
    const fields = [
      {
        name: "title",
        type: "text",
      },
      {
        name: "description",
        type: "textarea",
      },
    ];

    const result = getInitialFormData(fields);

    expect(result).toEqual({
      title: "",
      description: "",
    });
  });

  test("multiple field types are initialised correctly together", () => {
    /**
     * Arrange:
     * Create mixed field configurations.
     *
     * Act:
     * Generate initial form data.
     *
     * Assert:
     * Confirm all field types initialise correctly together.
     */
    const fields = [
      {
        name: "title",
        type: "text",
      },
      {
        name: "is_published",
        type: "boolean",
      },
      {
        name: "subjects",
        type: "relation",
        multiple: true,
      },
      {
        name: "subject",
        type: "relation",
        multiple: false,
      },
    ];

    const result = getInitialFormData(fields);

    expect(result).toEqual({
      title: "",
      is_published: false,
      subjects: [],
      subject: "",
    });
  });

  test("empty field arrays return empty objects", () => {
    /**
     * Arrange:
     * Create an empty field array.
     *
     * Act:
     * Generate initial form data.
     *
     * Assert:
     * Confirm an empty object is returned.
     */
    const result = getInitialFormData([]);

    expect(result).toEqual({});
  });
});
