/**
 * axiosDefaults Tests
 *
 * This test suite verifies:
 *
 * 1. Global axios configuration is set correctly
 * 2. Custom axios instances are created with correct defaults
 * 3. Response interceptor behaviour:
 *    - Returns successful responses unchanged
 *    - Retries requests on 401 after refreshing token
 *    - Prevents retry loops using _retry flag
 *    - Does not retry login or refresh endpoints
 *    - Rejects when refresh fails
 *
 * Notes:
 * - Axios adapter is mocked to prevent real HTTP requests
 * - Interceptor handlers are accessed directly for unit testing
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { axiosRequest, axiosResponse } from "./axiosDefaults";

describe("axiosDefaults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("sets global axios defaults", () => {
    /**
     * Arrange:
     * The axiosDefaults module is imported, which applies the global axios config.
     *
     * Act:
     * Access the global axios default settings.
     *
     * Assert:
     * Confirm the base URL, POST content type, and credentials setting are correct.
     */
    expect(axios.defaults.baseURL).toBe("http://localhost:8000");
    expect(axios.defaults.headers.post["Content-Type"]).toBe("application/json");
    expect(axios.defaults.withCredentials).toBe(true);
  });

  test("creates axiosRequest with correct config", () => {
    /**
     * Arrange:
     * The axiosRequest instance is imported from axiosDefaults.
     *
     * Act:
     * Access the default config values on axiosRequest.
     *
     * Assert:
     * Confirm axiosRequest uses the correct base URL and sends credentials.
     */
    expect(axiosRequest.defaults.baseURL).toBe("http://localhost:8000");
    expect(axiosRequest.defaults.withCredentials).toBe(true);
  });

  test("creates axiosResponse with correct config", () => {
    /**
     * Arrange:
     * The axiosResponse instance is imported from axiosDefaults.
     *
     * Act:
     * Access the default config values on axiosResponse.
     *
     * Assert:
     * Confirm axiosResponse uses the correct base URL and sends credentials.
     */
    expect(axiosResponse.defaults.baseURL).toBe("http://localhost:8000");
    expect(axiosResponse.defaults.withCredentials).toBe(true);
  });

  test("returns response unchanged on success", async () => {
    /**
     * Arrange:
     * Get the response interceptor and create a mock successful response.
     *
     * Act:
     * Pass the mock response through the interceptor success handler.
     *
     * Assert:
     * Confirm the same response object is returned unchanged.
     */
    const interceptor = axiosResponse.interceptors.response.handlers[0];

    const mockResponse = { data: "ok" };

    const result = await interceptor.fulfilled(mockResponse);

    expect(result).toBe(mockResponse);
  });

  test("retries request on 401 and refresh succeeds", async () => {
    /**
     * Arrange:
     * Create a mock 401 error for a normal API request.
     * Mock the refresh token request so it succeeds.
     * Mock the axiosResponse adapter so the retried request does not make a real HTTP call.
     *
     * Act:
     * Pass the mock error through the interceptor error handler.
     *
     * Assert:
     * Confirm the refresh endpoint is called.
     * Confirm the original request is marked as retried.
     * Confirm the original request is retried and returns the mocked response.
     */
    const interceptor = axiosResponse.interceptors.response.handlers[0];

    const mockError = {
      response: { status: 401 },
      config: {
        url: "/api/some-endpoint/",
        _retry: false,
      },
    };

    const mockPost = vi.spyOn(axiosRequest, "post").mockResolvedValue({});

    axiosResponse.defaults.adapter = vi.fn().mockResolvedValue({
      data: "retried",
      status: 200,
      statusText: "OK",
      headers: {},
      config: mockError.config,
    });

    const result = await interceptor.rejected(mockError);

    expect(mockPost).toHaveBeenCalledWith("/api/auth/token/refresh/");
    expect(mockError.config._retry).toBe(true);
    expect(result.data).toBe("retried");
  });

  test("does not retry if request already retried", async () => {
    /**
     * Arrange:
     * Create a mock 401 error where the original request already has _retry set to true.
     *
     * Act:
     * Pass the mock error through the interceptor error handler.
     *
     * Assert:
     * Confirm the error is rejected immediately instead of retrying again.
     */
    const interceptor = axiosResponse.interceptors.response.handlers[0];

    const mockError = {
      response: { status: 401 },
      config: {
        url: "/api/some-endpoint/",
        _retry: true,
      },
    };

    await expect(interceptor.rejected(mockError)).rejects.toBe(mockError);
  });

  test("does not retry login endpoint", async () => {
    /**
     * Arrange:
     * Create a mock 401 error from the login endpoint.
     *
     * Act:
     * Pass the mock error through the interceptor error handler.
     *
     * Assert:
     * Confirm the login error is rejected without attempting a token refresh.
     */
    const interceptor = axiosResponse.interceptors.response.handlers[0];

    const mockError = {
      response: { status: 401 },
      config: {
        url: "/api/auth/login/",
        _retry: false,
      },
    };

    await expect(interceptor.rejected(mockError)).rejects.toBe(mockError);
  });

  test("does not retry refresh endpoint", async () => {
    /**
     * Arrange:
     * Create a mock 401 error from the refresh token endpoint.
     *
     * Act:
     * Pass the mock error through the interceptor error handler.
     *
     * Assert:
     * Confirm the refresh error is rejected without trying to refresh again.
     */
    const interceptor = axiosResponse.interceptors.response.handlers[0];

    const mockError = {
      response: { status: 401 },
      config: {
        url: "/api/auth/token/refresh/",
        _retry: false,
      },
    };

    await expect(interceptor.rejected(mockError)).rejects.toBe(mockError);
  });

  test("rejects if refresh request fails", async () => {
    /**
     * Arrange:
     * Create a mock 401 error from a normal API request.
     * Mock the refresh token request so it fails.
     *
     * Act:
     * Pass the mock error through the interceptor error handler.
     *
     * Assert:
     * Confirm the interceptor rejects with the refresh failure.
     */
    const interceptor = axiosResponse.interceptors.response.handlers[0];

    const mockError = {
      response: { status: 401 },
      config: {
        url: "/api/some-endpoint/",
        _retry: false,
      },
    };

    vi.spyOn(axiosRequest, "post").mockRejectedValue("refresh failed");

    await expect(interceptor.rejected(mockError)).rejects.toBe("refresh failed");
  });
});
