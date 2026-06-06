/**
 * AXIOS DEFAULTS TEST CHECKLIST
 * -----------------------------
 * Global Configuration
 * - Verify global axios baseURL is configured
 * - Verify global POST content type is JSON
 * - Verify global requests include credentials
 *
 * -----------------------------
 * Custom Axios Instances
 * - Verify axiosRequest uses the correct baseURL
 * - Verify axiosRequest sends credentials
 * - Verify axiosResponse uses the correct baseURL
 * - Verify axiosResponse sends credentials
 *
 * -----------------------------
 * Response Interceptor
 * - Verify successful responses are returned unchanged
 * - Verify 401 responses refresh the access token and retry the original request
 * - Verify retried requests are marked with _retry
 * - Verify already retried requests are rejected
 * - Verify user endpoint errors can refresh and retry
 * - Verify login endpoint errors are not retried
 * - Verify registration endpoint errors are not retried
 * - Verify refresh endpoint errors are not retried
 * - Verify refresh failure rejects the request
 * - Verify non-401 errors are rejected without refresh
 */

import { describe, test, expect, vi, beforeEach } from "vitest";
import axios from "axios";

import { axiosRequest, axiosResponse } from "./axiosDefaults";

describe("axiosDefaults", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getResponseInterceptor = () => {
    return axiosResponse.interceptors.response.handlers[0];
  };

  // =====================
  // Global Configuration
  // =====================

  test("sets global axios defaults", () => {
    expect(axios.defaults.baseURL).toBe("http://localhost:8000");

    expect(axios.defaults.headers.post["Content-Type"]).toBe(
      "application/json"
    );

    expect(axios.defaults.withCredentials).toBe(true);
  });

  // =====================
  // Custom Axios Instances
  // =====================

  test("creates axiosRequest with correct config", () => {
    expect(axiosRequest.defaults.baseURL).toBe("http://localhost:8000");

    expect(axiosRequest.defaults.withCredentials).toBe(true);
  });

  test("creates axiosResponse with correct config", () => {
    expect(axiosResponse.defaults.baseURL).toBe("http://localhost:8000");

    expect(axiosResponse.defaults.withCredentials).toBe(true);
  });

  // =====================
  // Response Interceptor
  // =====================

  test("returns successful responses unchanged", async () => {
    const interceptor = getResponseInterceptor();

    const response = {
      data: {
        detail: "ok",
      },
    };

    const result = await interceptor.fulfilled(response);

    expect(result).toBe(response);
  });

  test("refreshes access token and retries original request on 401", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/protected/",
        _retry: false,
      },
    };

    vi.spyOn(axiosRequest, "post").mockResolvedValue({});

    axiosResponse.defaults.adapter = vi.fn().mockResolvedValue({
      data: {
        detail: "retried",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: error.config,
    });

    const result = await interceptor.rejected(error);

    expect(axiosRequest.post).toHaveBeenCalledWith(
      "/api/auth/token/refresh/"
    );

    expect(error.config._retry).toBe(true);

    expect(result.data).toEqual({
      detail: "retried",
    });
  });

  test("rejects already retried 401 requests", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/protected/",
        _retry: true,
      },
    };

    await expect(interceptor.rejected(error)).rejects.toBe(error);

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("does not retry login endpoint errors", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/auth/login/",
        _retry: false,
      },
    };

    await expect(interceptor.rejected(error)).rejects.toBe(error);

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("does not retry registration endpoint errors", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/auth/registration/",
        _retry: false,
      },
    };

    await expect(interceptor.rejected(error)).rejects.toBe(error);

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("does not retry refresh endpoint errors", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/auth/token/refresh/",
        _retry: false,
      },
    };

    await expect(interceptor.rejected(error)).rejects.toBe(error);

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("rejects original request when refresh fails", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/protected/",
        _retry: false,
      },
    };

    vi.spyOn(axiosRequest, "post").mockRejectedValue("refresh failed");

    await expect(interceptor.rejected(error)).rejects.toBe("refresh failed");

    expect(axiosRequest.post).toHaveBeenCalledWith(
      "/api/auth/token/refresh/"
    );

    expect(error.config._retry).toBe(true);
  });

  test("rejects non-401 errors without refreshing token", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 403,
      },
      config: {
        url: "/api/protected/",
        _retry: false,
      },
    };

    await expect(interceptor.rejected(error)).rejects.toBe(error);

    expect(axiosRequest.post).not.toHaveBeenCalled();
  });

  test("refreshes access token and retries user endpoint on 401", async () => {
    const interceptor = getResponseInterceptor();

    const error = {
      response: {
        status: 401,
      },
      config: {
        url: "/api/auth/user/",
        _retry: false,
      },
    };

    vi.spyOn(axiosRequest, "post").mockResolvedValue({});

    axiosResponse.defaults.adapter = vi.fn().mockResolvedValue({
      data: {
        id: 1,
        email: "test@example.com",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: error.config,
    });

    const result = await interceptor.rejected(error);

    expect(axiosRequest.post).toHaveBeenCalledWith(
      "/api/auth/token/refresh/"
    );

    expect(error.config._retry).toBe(true);

    expect(result.data).toEqual({
      id: 1,
      email: "test@example.com",
    });
  });
});
