/**
 * coreApi Tests
 *
 * This test suite verifies:
 *
 * 1. fetchCoreModelList
 *    - Sends GET requests to the correct endpoint
 *    - Applies default pagination params
 *    - Applies search query params
 *    - Applies filters correctly
 *    - Ignores filters with a value of "all"
 *    - Returns response.data
 *
 * 2. fetchCoreModelOptions
 *    - Sends OPTIONS requests to the correct endpoint
 *    - Returns response.data
 *
 * 3. createCoreModelItem
 *    - Sends POST requests with the correct data
 *    - Returns response.data
 *
 * Notes:
 * - axiosResponse is mocked to prevent real HTTP requests
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  fetchCoreModelList,
  fetchCoreModelOptions,
  createCoreModelItem,
} from "./coreApi";
import { axiosResponse } from "./axiosDefaults";

vi.mock("./axiosDefaults", () => ({
  axiosResponse: {
    get: vi.fn(),
    options: vi.fn(),
    post: vi.fn(),
  },
}));

describe("coreApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchCoreModelList", () => {
    test("fetches a core model list using default params", async () => {
      /**
       * Arrange:
       * Mock a successful GET response from the API.
       * Provide only the required endpoint argument.
       *
       * Act:
       * Call fetchCoreModelList.
       *
       * Assert:
       * Confirm axiosResponse.get is called with the correct endpoint.
       * Confirm default limit and offset params are included.
       * Confirm search is undefined when no search query is provided.
       * Confirm response.data is returned.
       */
      const mockData = {
        count: 1,
        results: [{ subject_id: "1", title: "Mathematics" }],
      };

      axiosResponse.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchCoreModelList({
        endpoint: "/core/subjects/",
      });

      expect(axiosResponse.get).toHaveBeenCalledWith("/core/subjects/", {
        params: {
          limit: 20,
          offset: 0,
          search: undefined,
        },
      });

      expect(result).toEqual(mockData);
    });

    test("fetches a core model list with custom pagination params", async () => {
      /**
       * Arrange:
       * Mock a successful GET response.
       * Provide a custom limit and offset.
       *
       * Act:
       * Call fetchCoreModelList with custom pagination values.
       *
       * Assert:
       * Confirm the request includes the provided limit and offset.
       * Confirm response.data is returned.
       */
      const mockData = {
        count: 50,
        results: [],
      };

      axiosResponse.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchCoreModelList({
        endpoint: "/core/topics/",
        limit: 10,
        offset: 20,
      });

      expect(axiosResponse.get).toHaveBeenCalledWith("/core/topics/", {
        params: {
          limit: 10,
          offset: 20,
          search: undefined,
        },
      });

      expect(result).toEqual(mockData);
    });

    test("fetches a core model list with a search query", async () => {
      /**
       * Arrange:
       * Mock a successful GET response.
       * Provide a search query.
       *
       * Act:
       * Call fetchCoreModelList with searchQuery.
       *
       * Assert:
       * Confirm the search query is added to the request params.
       * Confirm response.data is returned.
       */
      const mockData = {
        count: 1,
        results: [{ subject_id: "1", title: "Mathematics" }],
      };

      axiosResponse.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchCoreModelList({
        endpoint: "/core/subjects/",
        searchQuery: "math",
      });

      expect(axiosResponse.get).toHaveBeenCalledWith("/core/subjects/", {
        params: {
          limit: 20,
          offset: 0,
          search: "math",
        },
      });

      expect(result).toEqual(mockData);
    });

    test("fetches a core model list with active filters", async () => {
      /**
       * Arrange:
       * Mock a successful GET response.
       * Provide filters with specific selected values.
       *
       * Act:
       * Call fetchCoreModelList with active filters.
       *
       * Assert:
       * Confirm each active filter is added to the request params.
       * Confirm response.data is returned.
       */
      const mockData = {
        count: 1,
        results: [{ subject_id: "1", title: "Mathematics" }],
      };

      axiosResponse.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchCoreModelList({
        endpoint: "/core/subjects/",
        filters: {
          level: "secondary",
          language: "en",
          is_published: true,
        },
      });

      expect(axiosResponse.get).toHaveBeenCalledWith("/core/subjects/", {
        params: {
          limit: 20,
          offset: 0,
          search: undefined,
          level: "secondary",
          language: "en",
          is_published: true,
        },
      });

      expect(result).toEqual(mockData);
    });

    test('ignores filters with a value of "all"', async () => {
      /**
       * Arrange:
       * Mock a successful GET response.
       * Provide filters where some values are set to "all".
       *
       * Act:
       * Call fetchCoreModelList with mixed filter values.
       *
       * Assert:
       * Confirm filters with "all" are not included in the request params.
       * Confirm active filters are still included.
       * Confirm response.data is returned.
       */
      const mockData = {
        count: 2,
        results: [],
      };

      axiosResponse.get.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchCoreModelList({
        endpoint: "/core/subjects/",
        filters: {
          level: "all",
          language: "en",
          is_published: "all",
        },
      });

      expect(axiosResponse.get).toHaveBeenCalledWith("/core/subjects/", {
        params: {
          limit: 20,
          offset: 0,
          search: undefined,
          language: "en",
        },
      });

      expect(result).toEqual(mockData);
    });
  });

  describe("fetchCoreModelOptions", () => {
    test("fetches core model options from the given endpoint", async () => {
      /**
       * Arrange:
       * Mock a successful OPTIONS response.
       * Provide the endpoint to inspect.
       *
       * Act:
       * Call fetchCoreModelOptions.
       *
       * Assert:
       * Confirm axiosResponse.options is called with the correct endpoint.
       * Confirm response.data is returned.
       */
      const mockData = {
        actions: {
          POST: {
            title: {
              type: "string",
              required: true,
            },
          },
        },
      };

      axiosResponse.options.mockResolvedValue({
        data: mockData,
      });

      const result = await fetchCoreModelOptions({
        endpoint: "/core/subjects/",
      });

      expect(axiosResponse.options).toHaveBeenCalledWith("/core/subjects/");
      expect(result).toEqual(mockData);
    });
  });

  describe("createCoreModelItem", () => {
    test("creates a core model item using the given endpoint and data", async () => {
      /**
       * Arrange:
       * Mock a successful POST response.
       * Provide an endpoint and data for the new item.
       *
       * Act:
       * Call createCoreModelItem.
       *
       * Assert:
       * Confirm axiosResponse.post is called with the correct endpoint and data.
       * Confirm response.data is returned.
       */
      const newSubject = {
        title: "Mathematics",
        level: "secondary",
        language: "en",
        is_published: true,
        is_protected: false,
      };

      const mockData = {
        subject_id: "1",
        ...newSubject,
      };

      axiosResponse.post.mockResolvedValue({
        data: mockData,
      });

      const result = await createCoreModelItem({
        endpoint: "/core/subjects/",
        data: newSubject,
      });

      expect(axiosResponse.post).toHaveBeenCalledWith(
        "/core/subjects/",
        newSubject
      );

      expect(result).toEqual(mockData);
    });
  });
});
