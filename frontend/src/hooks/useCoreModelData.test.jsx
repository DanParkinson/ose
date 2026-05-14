/**
 * useCoreModelData Tests
 *
 * This test suite verifies:
 *
 * 1. Data is fetched when an endpoint is provided
 * 2. Paginated API responses are stored correctly
 * 3. Non-paginated API responses are handled correctly
 * 4. No request is made when endpoint is missing
 * 5. Loading state updates correctly
 * 6. Errors are stored when the request fails
 * 7. Refetch calls the API again
 */

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import {
  renderHook,
  waitFor,
  act,
  cleanup,
} from "@testing-library/react";

import useCoreModelData from "./useCoreModelData";
import { fetchCoreModelList } from "../api/coreApi";

vi.mock("../api/coreApi", () => ({
  fetchCoreModelList: vi.fn(),
}));

describe("useCoreModelData", () => {
  const emptyFilters = {};
  const secondaryFilter = { level: "secondary" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  test("fetches paginated model data when endpoint is provided", async () => {
    /**
     * Arrange:
     * Mock a paginated API response.
     *
     * Act:
     * Render the hook with endpoint, offset, search query, and filters.
     *
     * Assert:
     * Confirm the API is called with the correct request config.
     * Confirm rows, count, next, and previous are stored correctly.
     */
    const mockData = {
      count: 2,
      next: "/core/subjects/?offset=20",
      previous: null,
      results: [
        { subject_id: "1", title: "Mathematics" },
        { subject_id: "2", title: "English" },
      ],
    };

    fetchCoreModelList.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useCoreModelData(
        "/core/subjects/",
        0,
        "math",
        secondaryFilter
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCoreModelList).toHaveBeenCalledWith({
      endpoint: "/core/subjects/",
      limit: 20,
      offset: 0,
      searchQuery: "math",
      filters: secondaryFilter,
    });

    expect(result.current.rows).toEqual(mockData.results);
    expect(result.current.count).toBe(2);
    expect(result.current.next).toBe("/core/subjects/?offset=20");
    expect(result.current.previous).toBe(null);
  });

  test("handles non-paginated API responses", async () => {
    /**
     * Arrange:
     * Mock a non-paginated API response array.
     *
     * Act:
     * Render the hook.
     *
     * Assert:
     * Confirm the array is stored as rows.
     * Confirm count defaults to 0.
     * Confirm next and previous default to null.
     */
    const mockData = [
      { subject_id: "1", title: "Mathematics" },
      { subject_id: "2", title: "English" },
    ];

    fetchCoreModelList.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useCoreModelData(
        "/core/subjects/",
        0,
        "",
        emptyFilters
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.rows).toEqual(mockData);
    expect(result.current.count).toBe(0);
    expect(result.current.next).toBe(null);
    expect(result.current.previous).toBe(null);
  });

  test("does not fetch when endpoint is missing", async () => {
    /**
     * Arrange:
     * Render the hook with no endpoint.
     *
     * Act:
     * Allow the hook effect to run.
     *
     * Assert:
     * Confirm no API request is made.
     * Confirm default state values remain unchanged.
     */
    const { result } = renderHook(() =>
      useCoreModelData(
        "",
        0,
        "",
        emptyFilters
      )
    );

    expect(fetchCoreModelList).not.toHaveBeenCalled();
    expect(result.current.rows).toEqual([]);
    expect(result.current.count).toBe(0);
    expect(result.current.next).toBe(null);
    expect(result.current.previous).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  test("sets loading state while fetching", async () => {
    /**
     * Arrange:
     * Mock a delayed API response.
     *
     * Act:
     * Render the hook while the request is pending.
     *
     * Assert:
     * Confirm loading becomes true during the request.
     * Confirm loading becomes false after the request resolves.
     */
    let resolveRequest;

    fetchCoreModelList.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    const { result } = renderHook(() =>
      useCoreModelData(
        "/core/subjects/",
        0,
        "",
        emptyFilters
      )
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(true);
    });

    await act(async () => {
      resolveRequest({
        count: 0,
        results: [],
      });
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("stores error when fetch fails", async () => {
    /**
     * Arrange:
     * Mock a failed API request.
     * Spy on console.error to avoid noisy test output.
     *
     * Act:
     * Render the hook.
     *
     * Assert:
     * Confirm the error is stored in state.
     * Confirm loading returns to false.
     */
    const mockError = new Error("Request failed");

    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    fetchCoreModelList.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useCoreModelData(
        "/core/subjects/",
        0,
        "",
        emptyFilters
      )
    );

    await waitFor(() => {
      expect(result.current.error).toBe(mockError);
    });

    expect(result.current.loading).toBe(false);

    consoleErrorSpy.mockRestore();
  });

  test("refetch calls the API again", async () => {
    /**
     * Arrange:
     * Mock a successful API response.
     * Render the hook and wait for the initial fetch.
     *
     * Act:
     * Call refetch manually.
     *
     * Assert:
     * Confirm the API is called again.
     */
    fetchCoreModelList.mockResolvedValue({
      count: 1,
      results: [
        { subject_id: "1", title: "Mathematics" },
      ],
    });

    const { result } = renderHook(() =>
      useCoreModelData(
        "/core/subjects/",
        0,
        "",
        emptyFilters
      )
    );

    await waitFor(() => {
      expect(fetchCoreModelList).toHaveBeenCalledTimes(1);
    });

    await act(async () => {
      await result.current.refetch();
    });

    expect(fetchCoreModelList).toHaveBeenCalledTimes(2);
  });
});
