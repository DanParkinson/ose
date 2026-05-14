/**
 * useCoreRelationOptions Tests
 *
 * This test suite verifies:
 *
 * 1. Relation field options are fetched from the API
 * 2. Only relation fields trigger API requests
 * 3. Relation options are stored using the field name
 * 4. Relation options support paginated API responses
 * 5. Relation options support non-paginated API responses
 * 6. Failed requests return empty arrays for the failed field
 * 7. Errors are logged when relation requests fail
 * 8. Relation options refetch when fields change
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import useCoreRelationOptions from "./useCoreRelationOptions";

import { fetchCoreModelList } from "../api/coreApi";

vi.mock("../api/coreApi", () => ({
  fetchCoreModelList: vi.fn(),
}));

describe("useCoreRelationOptions", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  test("fetches relation field options from the API", async () => {
    /**
     * Arrange:
     * Create stable relation field data and mock a successful API response.
     *
     * Act:
     * Render the hook with a relation field.
     *
     * Assert:
     * Confirm fetchCoreModelList is called correctly.
     */
    fetchCoreModelList.mockResolvedValue({
      results: [],
    });

    const fields = [
      {
        name: "subjects",
        type: "relation",
        endpoint: "/core/subjects/",
      },
    ];

    renderHook(() => useCoreRelationOptions(fields));

    await waitFor(() => {
      expect(fetchCoreModelList).toHaveBeenCalledWith({
        endpoint: "/core/subjects/",
        limit: 100,
        offset: 0,
      });
    });
  });

  test("only relation fields trigger API requests", async () => {
    /**
     * Arrange:
     * Create stable field data containing relation and non-relation fields.
     *
     * Act:
     * Render the hook with the stable fields array.
     *
     * Assert:
     * Confirm only relation fields trigger requests.
     */
    fetchCoreModelList.mockResolvedValue({
      results: [],
    });

    const fields = [
      {
        name: "title",
        type: "text",
      },
      {
        name: "subjects",
        type: "relation",
        endpoint: "/core/subjects/",
      },
    ];

    renderHook(() => useCoreRelationOptions(fields));

    await waitFor(() => {
      expect(fetchCoreModelList).toHaveBeenCalledTimes(1);
    });

    expect(fetchCoreModelList).toHaveBeenCalledWith({
      endpoint: "/core/subjects/",
      limit: 100,
      offset: 0,
    });
  });

  test("stores relation options using the field name", async () => {
    /**
     * Arrange:
     * Create stable relation field data and mock relation results.
     *
     * Act:
     * Render the hook and wait for state updates.
     *
     * Assert:
     * Confirm relation data is stored under the field name.
     */
    fetchCoreModelList.mockResolvedValue({
      results: [
        {
          subject_id: "subject-1",
          title: "Mathematics",
        },
      ],
    });

    const fields = [
      {
        name: "subjects",
        type: "relation",
        endpoint: "/core/subjects/",
      },
    ];

    const { result } = renderHook(() =>
      useCoreRelationOptions(fields)
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        subjects: [
          {
            subject_id: "subject-1",
            title: "Mathematics",
          },
        ],
      });
    });
  });

  test("supports paginated API responses", async () => {
    /**
     * Arrange:
     * Create stable relation field data and mock a paginated API response.
     *
     * Act:
     * Render the hook and wait for state updates.
     *
     * Assert:
     * Confirm the results array is extracted correctly.
     */
    fetchCoreModelList.mockResolvedValue({
      count: 1,
      results: [
        {
          topic_id: "topic-1",
          title: "Algebra",
        },
      ],
    });

    const fields = [
      {
        name: "topics",
        type: "relation",
        endpoint: "/core/topics/",
      },
    ];

    const { result } = renderHook(() =>
      useCoreRelationOptions(fields)
    );

    await waitFor(() => {
      expect(result.current.topics).toEqual([
        {
          topic_id: "topic-1",
          title: "Algebra",
        },
      ]);
    });
  });

  test("supports non-paginated API responses", async () => {
    /**
     * Arrange:
     * Create stable relation field data and mock a raw array API response.
     *
     * Act:
     * Render the hook and wait for state updates.
     *
     * Assert:
     * Confirm the raw response data is stored correctly.
     */
    fetchCoreModelList.mockResolvedValue([
      {
        variation_id: "variation-1",
        title: "Easy",
      },
    ]);

    const fields = [
      {
        name: "variations",
        type: "relation",
        endpoint: "/core/variations/",
      },
    ];

    const { result } = renderHook(() =>
      useCoreRelationOptions(fields)
    );

    await waitFor(() => {
      expect(result.current.variations).toEqual([
        {
          variation_id: "variation-1",
          title: "Easy",
        },
      ]);
    });
  });

  test("returns empty array when relation request fails", async () => {
    /**
     * Arrange:
     * Create stable relation field data and mock a failed API request.
     *
     * Act:
     * Render the hook and wait for failure handling.
     *
     * Assert:
     * Confirm the failed relation field returns an empty array.
     */
    fetchCoreModelList.mockRejectedValue(
      new Error("Request failed")
    );

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const fields = [
      {
        name: "subjects",
        type: "relation",
        endpoint: "/core/subjects/",
      },
    ];

    const { result } = renderHook(() =>
      useCoreRelationOptions(fields)
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        subjects: [],
      });
    });

    consoleSpy.mockRestore();
  });

  test("logs error when relation request fails", async () => {
    /**
     * Arrange:
     * Create stable relation field data, mock a failed API request, and spy on console.error.
     *
     * Act:
     * Render the hook and wait for error handling.
     *
     * Assert:
     * Confirm the error is logged.
     */
    const error = new Error("Request failed");

    fetchCoreModelList.mockRejectedValue(error);

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    const fields = [
      {
        name: "subjects",
        type: "relation",
        endpoint: "/core/subjects/",
      },
    ];

    renderHook(() => useCoreRelationOptions(fields));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    consoleSpy.mockRestore();
  });

  test("refetches relation options when fields change", async () => {
    /**
     * Arrange:
     * Create stable initial and updated field arrays.
     *
     * Act:
     * Render the hook and rerender with different fields.
     *
     * Assert:
     * Confirm relation options are refetched only when the fields prop changes.
     */
    fetchCoreModelList.mockResolvedValue({
      results: [],
    });

    const initialFields = [
      {
        name: "subjects",
        type: "relation",
        endpoint: "/core/subjects/",
      },
    ];

    const updatedFields = [
      {
        name: "topics",
        type: "relation",
        endpoint: "/core/topics/",
      },
    ];

    const { rerender } = renderHook(
      ({ fields }) => useCoreRelationOptions(fields),
      {
        initialProps: {
          fields: initialFields,
        },
      }
    );

    await waitFor(() => {
      expect(fetchCoreModelList).toHaveBeenCalledWith({
        endpoint: "/core/subjects/",
        limit: 100,
        offset: 0,
      });
    });

    rerender({
      fields: updatedFields,
    });

    await waitFor(() => {
      expect(fetchCoreModelList).toHaveBeenCalledWith({
        endpoint: "/core/topics/",
        limit: 100,
        offset: 0,
      });
    });

    expect(fetchCoreModelList).toHaveBeenCalledTimes(2);
  });
});
