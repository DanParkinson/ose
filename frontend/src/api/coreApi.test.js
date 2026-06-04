/**
 * CORE API TEST CHECKLIST
 * -----------------------
 * Fetch Core Model List
 * - Verify list request uses default pagination params
 * - Verify list request uses custom pagination params
 * - Verify list request includes search query
 * - Verify list request includes active filters
 * - Verify list request ignores filters with value "all"
 *
 * -----------------------
 * Fetch Core Model Options
 * - Verify options request is sent to endpoint
 * - Verify options request returns response data
 *
 * -----------------------
 * Create Core Model Item
 * - Verify create request posts data to endpoint
 * - Verify create request returns response data
 *
 * -----------------------
 * Update Core Model Item
 * - Verify update request patches detail endpoint and id
 * - Verify update request returns response data
 *
 * -----------------------
 * Delete Core Model Item
 * - Verify delete request deletes detail endpoint and id
 * - Verify delete request returns response data
 */

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  fetchCoreModelList,
  fetchCoreModelOptions,
  createCoreModelItem,
  updateCoreModelItem,
  deleteCoreModelItem,
} from "./coreApi";

import { axiosResponse } from "./axiosDefaults";

vi.mock("./axiosDefaults", () => ({
  axiosResponse: {
    get: vi.fn(),
    options: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("coreApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // =====================
  // Fetch Core Model List
  // =====================

  test("fetches list using default params", async () => {
    const mockData = {
      count: 1,
      results: [],
    };

    axiosResponse.get.mockResolvedValue({
      data: mockData,
    });

    const result = await fetchCoreModelList({
      endpoint: "/core/subjects/",
    });

    expect(axiosResponse.get).toHaveBeenCalledWith(
      "/core/subjects/",
      {
        params: {
          limit: 20,
          offset: 0,
          search: undefined,
        },
      }
    );

    expect(result).toEqual(mockData);
  });

  test("fetches list using custom pagination", async () => {
    const mockData = {
      count: 1,
      results: [],
    };

    axiosResponse.get.mockResolvedValue({
      data: mockData,
    });

    const result = await fetchCoreModelList({
      endpoint: "/core/subjects/",
      limit: 50,
      offset: 100,
    });

    expect(axiosResponse.get).toHaveBeenCalledWith(
      "/core/subjects/",
      {
        params: {
          limit: 50,
          offset: 100,
          search: undefined,
        },
      }
    );

    expect(result).toEqual(mockData);
  });

  test("fetches list using search query", async () => {
    const mockData = {
      count: 1,
      results: [],
    };

    axiosResponse.get.mockResolvedValue({
      data: mockData,
    });

    const result = await fetchCoreModelList({
      endpoint: "/core/subjects/",
      searchQuery: "math",
    });

    expect(axiosResponse.get).toHaveBeenCalledWith(
      "/core/subjects/",
      {
        params: {
          limit: 20,
          offset: 0,
          search: "math",
        },
      }
    );

    expect(result).toEqual(mockData);
  });

  test("fetches list using active filters", async () => {
    const mockData = {
      count: 1,
      results: [],
    };

    axiosResponse.get.mockResolvedValue({
      data: mockData,
    });

    const result = await fetchCoreModelList({
      endpoint: "/core/subjects/",
      filters: {
        level: "secondary",
        language: "en",
      },
    });

    expect(axiosResponse.get).toHaveBeenCalledWith(
      "/core/subjects/",
      {
        params: {
          limit: 20,
          offset: 0,
          search: undefined,
          level: "secondary",
          language: "en",
        },
      }
    );

    expect(result).toEqual(mockData);
  });

  test('ignores filters with value "all"', async () => {
    const mockData = {
      count: 1,
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
      },
    });

    expect(axiosResponse.get).toHaveBeenCalledWith(
      "/core/subjects/",
      {
        params: {
          limit: 20,
          offset: 0,
          search: undefined,
          language: "en",
        },
      }
    );

    expect(result).toEqual(mockData);
  });

  // ==========================
  // Fetch Core Model Options
  // ==========================

  test("fetches model options from endpoint", async () => {
    const mockData = {
      actions: {},
    };

    axiosResponse.options.mockResolvedValue({
      data: mockData,
    });

    const result = await fetchCoreModelOptions({
      endpoint: "/core/subjects/",
    });

    expect(
      axiosResponse.options
    ).toHaveBeenCalledWith(
      "/core/subjects/"
    );

    expect(result).toEqual(mockData);
  });

  // =====================
  // Create Core Model Item
  // =====================

  test("creates model item using endpoint and data", async () => {
    const payload = {
      title: "Mathematics",
    };

    const mockData = {
      subject_id: "subject-1",
      title: "Mathematics",
    };

    axiosResponse.post.mockResolvedValue({
      data: mockData,
    });

    const result = await createCoreModelItem({
      endpoint: "/core/subjects/",
      data: payload,
    });

    expect(axiosResponse.post).toHaveBeenCalledWith(
      "/core/subjects/",
      payload
    );

    expect(result).toEqual(mockData);
  });

  // =====================
  // Update Core Model Item
  // =====================

  test("updates model item using detail endpoint and id", async () => {
    const payload = {
      title: "Updated Mathematics",
    };

    const mockData = {
      subject_id: "subject-1",
      title: "Updated Mathematics",
    };

    axiosResponse.patch.mockResolvedValue({
      data: mockData,
    });

    const result = await updateCoreModelItem({
      detailEndpoint: "/core/subjects/",
      id: "subject-1",
      data: payload,
    });

    expect(axiosResponse.patch).toHaveBeenCalledWith(
      "/core/subjects/subject-1/",
      payload
    );

    expect(result).toEqual(mockData);
  });

  // =====================
  // Delete Core Model Item
  // =====================

  test("deletes model item using detail endpoint and id", async () => {
    const mockData = {};

    axiosResponse.delete.mockResolvedValue({
      data: mockData,
    });

    const result = await deleteCoreModelItem({
      detailEndpoint: "/core/subjects/",
      id: "subject-1",
    });

    expect(axiosResponse.delete).toHaveBeenCalledWith(
      "/core/subjects/subject-1/"
    );

    expect(result).toEqual(mockData);
  });
});
