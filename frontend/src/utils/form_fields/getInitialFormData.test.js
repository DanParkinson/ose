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
 * 7. Existing row values are used when existing data is provided
 * 8. Missing existing row values fall back to default initial values
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

  test("existing row values are used when existing data is provided", () => {
    /**
     * Arrange:
     * Create field configurations and existing row data.
     *
     * Act:
     * Generate initial form data using existing data.
     *
     * Assert:
     * Confirm fields initialise from the existing row values.
     */
    const fields = [
      {
        name: "title",
        type: "text",
      },
      {
        name: "level",
        type: "choice",
      },
      {
        name: "is_published",
        type: "boolean",
      },
    ];

    const existingData = {
      title: "Mathematics",
      level: "secondary",
      is_published: true,
    };

    const result = getInitialFormData(fields, existingData);

    expect(result).toEqual({
      title: "Mathematics",
      level: "secondary",
      is_published: true,
    });
  });

  test("missing existing row values fall back to default initial values", () => {
    /**
     * Arrange:
     * Create field configurations and partial existing row data.
     *
     * Act:
     * Generate initial form data using incomplete existing data.
     *
     * Assert:
     * Confirm missing values fall back to their field defaults.
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
    ];

    const existingData = {
      title: "Mathematics",
    };

    const result = getInitialFormData(fields, existingData);

    expect(result).toEqual({
      title: "Mathematics",
      is_published: false,
      subjects: [],
    });
  });
});
