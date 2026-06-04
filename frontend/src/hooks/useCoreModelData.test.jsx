/**
 * USE CORE MODEL DATA TEST CHECKLIST
 * ----------------------------------
 * Fetch Model Data
 * - Verify model data is fetched when endpoint is provided
 * - Verify paginated responses are stored correctly
 * - Verify non-paginated responses are stored correctly
 * - Verify no request is made when endpoint is missing
 *
 * ----------------------------------
 * Loading State
 * - Verify loading is true while request is pending
 * - Verify loading is false after request completes
 *
 * ----------------------------------
 * Error Handling
 * - Verify errors are stored when request fails
 * - Verify loading is false after request fails
 *
 * ----------------------------------
 * Refetch
 * - Verify refetch calls the API again
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
  const activeFilters = {
    level: "secondary",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Fetch Model Data
  // =====================

  test("fetches paginated model data when endpoint is provided", async () => {
    const mockData = {
      count: 2,
      next: "/core/subjects/?offset=20",
      previous: null,
      results: [
        {
          subject_id: "subject-1",
          title: "Mathematics",
        },
        {
          subject_id: "subject-2",
          title: "English",
        },
      ],
    };

    fetchCoreModelList.mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useCoreModelData(
        "/core/subjects/",
        0,
        "math",
        activeFilters
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
      filters: activeFilters,
    });

    expect(result.current.rows).toEqual(mockData.results);
    expect(result.current.count).toBe(2);
    expect(result.current.next).toBe("/core/subjects/?offset=20");
    expect(result.current.previous).toBe(null);
    expect(result.current.error).toBe(null);
  });

  test("handles non-paginated API responses", async () => {
    const mockData = [
      {
        subject_id: "subject-1",
        title: "Mathematics",
      },
      {
        subject_id: "subject-2",
        title: "English",
      },
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
    expect(result.current.error).toBe(null);
  });

  test("does not fetch when endpoint is missing", () => {
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
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  // =====================
  // Loading State
  // =====================

  test("sets loading while fetching model data", async () => {
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

  // =====================
  // Error Handling
  // =====================

  test("stores error when fetch fails", async () => {
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

  // =====================
  // Refetch
  // =====================

  test("refetch calls the API again", async () => {
    fetchCoreModelList.mockResolvedValue({
      count: 1,
      results: [
        {
          subject_id: "subject-1",
          title: "Mathematics",
        },
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
