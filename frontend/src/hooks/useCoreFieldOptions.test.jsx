/**
 * useCoreFieldOptions Tests
 *
 * This test suite verifies:
 *
 * 1. Field options are fetched when an endpoint is provided
 * 2. POST field options are stored in state
 * 3. Empty state is returned when no endpoint exists
 * 4. Field options reset to an empty object when the request fails
 * 5. Errors are logged when the request fails
 * 6. Field options refetch when the endpoint changes
 */

import { describe, test, expect, vi, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

import useCoreFieldOptions from "./useCoreFieldOptions";

import { fetchCoreModelOptions } from "../api/coreApi";

vi.mock("../api/coreApi", () => ({
  fetchCoreModelOptions: vi.fn(),
}));

describe("useCoreFieldOptions", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("fetches field options when endpoint is provided", async () => {
    /**
     * Arrange:
     * Mock a successful API response containing POST field options.
     *
     * Act:
     * Render the hook with a valid endpoint.
     *
     * Assert:
     * Confirm fetchCoreModelOptions is called with the endpoint.
     */
    fetchCoreModelOptions.mockResolvedValue({
      actions: {
        POST: {},
      },
    });

    renderHook(() =>
      useCoreFieldOptions("/core/subjects/")
    );

    await waitFor(() => {
      expect(fetchCoreModelOptions).toHaveBeenCalledWith({
        endpoint: "/core/subjects/",
      });
    });
  });

  test("stores POST field options in state", async () => {
    /**
     * Arrange:
     * Mock a successful API response with POST field configuration.
     *
     * Act:
     * Render the hook and wait for state updates.
     *
     * Assert:
     * Confirm POST field options are stored and returned.
     */
    fetchCoreModelOptions.mockResolvedValue({
      actions: {
        POST: {
          title: {
            type: "string",
            required: true,
          },
        },
      },
    });

    const { result } = renderHook(() =>
      useCoreFieldOptions("/core/subjects/")
    );

    await waitFor(() => {
      expect(result.current).toEqual({
        title: {
          type: "string",
          required: true,
        },
      });
    });
  });

  test("returns empty object when endpoint does not exist", async () => {
    /**
     * Arrange:
     * Render the hook without an endpoint.
     *
     * Act:
     * Observe the returned state.
     *
     * Assert:
     * Confirm no request is made and the default empty object is returned.
     */
    const { result } = renderHook(() =>
      useCoreFieldOptions(undefined)
    );

    expect(fetchCoreModelOptions).not.toHaveBeenCalled();

    expect(result.current).toEqual({});
  });

  test("resets field options to empty object when request fails", async () => {
    /**
     * Arrange:
     * Mock a failed API request.
     *
     * Act:
     * Render the hook and wait for the failure handling.
     *
     * Assert:
     * Confirm field options reset to an empty object.
     */
    fetchCoreModelOptions.mockRejectedValue(
      new Error("Request failed")
    );

    const { result } = renderHook(() =>
      useCoreFieldOptions("/core/subjects/")
    );

    await waitFor(() => {
      expect(result.current).toEqual({});
    });
  });

  test("logs error when request fails", async () => {
    /**
     * Arrange:
     * Mock a failed API request and spy on console.error.
     *
     * Act:
     * Render the hook and wait for error handling.
     *
     * Assert:
     * Confirm the error is logged.
     */
    const error = new Error("Request failed");

    fetchCoreModelOptions.mockRejectedValue(error);

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderHook(() =>
      useCoreFieldOptions("/core/subjects/")
    );

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(error);
    });

    consoleSpy.mockRestore();
  });

  test("refetches field options when endpoint changes", async () => {
    /**
     * Arrange:
     * Mock successful API responses.
     *
     * Act:
     * Render the hook and rerender with a new endpoint.
     *
     * Assert:
     * Confirm fetchCoreModelOptions is called again with the updated endpoint.
     */
    fetchCoreModelOptions.mockResolvedValue({
      actions: {
        POST: {},
      },
    });

    const { rerender } = renderHook(
      ({ endpoint }) =>
        useCoreFieldOptions(endpoint),
      {
        initialProps: {
          endpoint: "/core/subjects/",
        },
      }
    );

    await waitFor(() => {
      expect(fetchCoreModelOptions).toHaveBeenCalledWith({
        endpoint: "/core/subjects/",
      });
    });

    rerender({
      endpoint: "/core/topics/",
    });

    await waitFor(() => {
      expect(fetchCoreModelOptions).toHaveBeenCalledWith({
        endpoint: "/core/topics/",
      });
    });

    expect(fetchCoreModelOptions).toHaveBeenCalledTimes(2);
  });
});
