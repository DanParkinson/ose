/**
 * AXIOS DEFAULTS TEST CHECKLIST
 * -----------------------------
 * Global Axios Defaults
 * - Verify global baseURL is configured
 * - Verify sets POST content type is JSON
 * - Verify sets credentials to be included globally
 * -----------------------------
 * axiosRequest
 * - Verify axiosRequest uses configured baseURL
 * - Verify axiosRequest include credentials
 * -----------------------------
 * axiosResponse
 * - Verify axiosResponse uses configured baseURL
 * - Verify axiosResponse include credentials
 * -----------------------------
 * Response: Base behaviour
 * - Verify successful responses are returned unchanged
 * - Verify rejects unhandled errors unchanged
 * -----------------------------
 * Response: 401 retry logic
 * - Verify eligible 401 errors request a token refresh
 * - Verify eligible 401 errors mark the original request as retried
 * - Verify eligible 401 errors retry the original request after refresh
 * - Verify already retried 401 errors are rejected unchanged
 * - Verify failed refresh is rejected
 * -----------------------------
 * Response: 429
 * - Verify 429 errors do not trigger token refresh
 * - Verify 429 rejects the original error unchanged
 * - Verify dispatches global rate limit event
 * - Verify rate-limit event includes the response message
 * - Verify rate-limit event includes the retry-after value when provided
 * -----------------------------
 * Response: Exluded Endpoints
 * - Verify Login errors are rejected without retry
 * - Verify Register errors are rejected without retry
 * - Verify reresh errrors are rejected without retry
 */

import { describe, test, expect, vi, beforeEach } from "vitest";

import axios from "axios";
import { axiosRequest, axiosResponse } from "./axiosDefaults";

beforeEach(() => {
    vi.restoreAllMocks();
});

const getResponseInterceptor = () => {
  return axiosResponse.interceptors.response.handlers[0];
};

describe("axiosDefaults", () => {
    // =====================
    // Global Axios Defaults
    // =====================

    test("Defaults: global baseURL is configured", () => {
        /**
         * Arrange: Nothing
         * Act: Read the global axios defaults
         * Assert: Confirm the baseURL is configured
         */
        expect(axios.defaults.baseURL).toBe(import.meta.env.VITE_API_BASE_URL);
    });

    test("Defaults: sets POST content type is JSON", () => {
        /**
         * Arrange: Nothing
         * Act: Read the global axios defaults
         * Assert: Confirm the conte type is JSON
         */

        expect(axios.defaults.headers.post["Content-Type"]).toBe("application/json")
    });

    test("Defaults: sets credentials to be included globally", () => {
        /**
         * Arrange: Nothing
         * Act: Read the global axios defaults
         * Assert: Confirm withCredentials is set to true
         */
        expect(axios.defaults.withCredentials).toBe(true)
    });

    // =====================
    // AxiosRequest
    // ====================

    test("axiosRequest: uses configured baseURL", () => {
        /**
         * Arrange: Nothing
         * Act: Read the axiosRequest configuration
         * Assert: Confirm the configured baseURL is used
         */
        expect(axiosRequest.defaults.baseURL).toBe(import.meta.env.VITE_API_BASE_URL);
    });

    test("axiosRequest: includes credentials", () => {
        /**
         * Arrange: Nothing
         * Act: Read the axiosRequest configuration
         * Assert: Confirm withCredentials is included
         */
        expect(axiosRequest.defaults.withCredentials).toBe(true);
    });

    // =====================
    // AxiosResponse
    // ====================

    test("axiosResponse: uses configured baseURL", () => {
        /**
         * Arrange: Nothing
         * Act: Read the axiosResponse configuration
         * Assert: Confirm the configured baseURL is used
         */
        expect(axiosResponse.defaults.baseURL).toBe(import.meta.env.VITE_API_BASE_URL);
    });

    test("axiosResponse: includes credentials", () => {
        /**
         * Arrange: Nothing
         * Act: Read the axiosResponse configuration
         * Assert: Confirm withCredentials is included
         */
        expect(axiosResponse.defaults.withCredentials).toBe(true);
    });

    // =====================
    // Response base behaviour
    // ====================

    test("Response Base: successful responses are returned unchanged", async () => {
        /**
         * Arrange:
         * - get the response interceptor
         * - Mock succesful repsonse
         * Act: Pass the response through the interceptor
         * Assert: Confirm response mathces original
         */

        const interceptor = getResponseInterceptor();

        const response = {
          data: {
            detail: "ok"
          },
        };

        const result = await interceptor.fulfilled(response);

        expect(result).toBe(response);
    });

    test("Response Base: rejects unhandled errors unchanged", async () => {
        /**
         * Arrange:
         * - get the response interceptor
         * - Mock failed repsonse
         * Act: Pass the error through the interceptor
         * Assert: Confirm response is rejected unchanged
         */

        const interceptor = getResponseInterceptor();

        const error = {
          response: {
            status: 403,
          },
          config: {
            url: "/api/protected",
          },
        };

        await expect(interceptor.rejected(error)).rejects.toBe(error);
    });

    // =====================
    // Response 401
    // ====================
    test("Response Error: eligible errors mark the original request as retried", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error on a protected route
       * - Mock successful refresh request
       * - Mock successful retried request
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Original request is marked as retried
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 401,
        },
        config: {
          url: "/api/protected",
        },
      };

      vi.spyOn(axiosRequest, "post").mockResolvedValue({
        status: 200,
      });

      axiosResponse.defaults.adapter = vi.fn().mockResolvedValue({
          data: {
              detail: "retried",
          },
          status: 200,
          statusText: "OK",
          headers: {},
          config: error.config,
      });

      await interceptor.rejected(error);

      expect(error.config._retry).toBe(true);
    });

    test("Response 401: eligable 401 errors request a token refresh", async () => {
        /**
         * Arrange:
         * - get the response interceptor
         * - Mock a 401 error on a protected route
         * - mock succesful refresh request
         * - Mock retry request
         * Act: Pass the error through the interceptor
         * Assert: Token refresh endpoint is requested
         */

        const interceptor = getResponseInterceptor();

        const error = {
          response: {
            status: 401,
          },
          config: {
            url: "/api/protected",
          },
        };

        vi.spyOn(axiosRequest, "post").mockResolvedValue({
            status: 200,
        });

        axiosResponse.defaults.adapter = vi.fn().mockResolvedValue({
          data: {
            detail: "retried",
          },
          status: 200,
          headers: {},
          config: error.config,
        });

        await interceptor.rejected(error);

        expect(axiosRequest.post).toHaveBeenCalledTimes(1);

        expect(axiosRequest.post).toHaveBeenCalledWith(
          "/api/auth/token/refresh/"
        );
    });

    test("Response 401: eligible 401 errors retry the original request after refresh", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error on a protected route
       * - Mock successful refresh request
       * - Mock succesful retried request
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Original request is retried after refresh
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 401,
        },
        config: {
          url: "/api/protected",
        },
      };

      vi.spyOn(axiosRequest, "post").mockResolvedValue({
        status: 200,
      });

      axiosResponse.defaults.adapter = vi.fn().mockResolvedValue({
        data: {
          detail: "retried",
        },
        status: 200,
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

    test("Response 401: already retried 401 errors are rejected unchanged", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error where the original request has already been retried
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Error is rejected unchanged
       * - Token refresh is not requested
       */

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

      vi.spyOn(axiosRequest, "post").mockResolvedValue({
        status: 200,
      });

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(axiosRequest.post).not.toHaveBeenCalled();
    });

    test("Response 401: failed refresh is rejected", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error on a protected route
       * - Mock a failed token refresh request
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Refresh error is rejected
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 401,
        },
        config: {
          url: "/api/protected/",
        },
      };

      const refreshError = {
        response: {
          status: 401,
        },
      };

      vi.spyOn(axiosRequest, "post").mockRejectedValue(refreshError);

      await expect(interceptor.rejected(error)).rejects.toBe(refreshError);

      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/auth/token/refresh/"
      );
    });

    // =====================
    // Response 429
    // ====================

    test("Response 429: Errors do not trigger token refresh", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 429 error
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - 429 error does not trigger token refresh
       */
      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 429,
        },
      };

      vi.spyOn(axiosRequest, "post")

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(axiosRequest.post).not.toHaveBeenCalled();
    });

    test("Response 429: Reject the orignal error unchanged", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 429 error
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - 429 error matches orginal
       */
      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 429,
        },
      };

      await expect(interceptor.rejected(error)).rejects.toBe(error);
    });

    test("Response 429: dispatches global rate limit event", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 429 error
       * - Spy on the global dispatchEvent method
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Global rate limit event is dispatched
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 429,
        },
      };

      const dispatchSpy = vi.spyOn(window, "dispatchEvent");

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    test("Response 429: dispatches rate limit event with error message", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 429 error with a message
       * - Spy on the global dispatchEvent method
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Rate limit event contains the server message
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 429,
          data: {
            detail: "Too many requests. Please try again later.",
          },
        },
      };

      const dispatchSpy = vi.spyOn(window, "dispatchEvent");

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      const event = dispatchSpy.mock.calls[0][0];

      expect(event.type).toBe("api-rate-limit");

      expect(event.detail).toEqual({
        message: "Too many requests. Please try again later.",
      });
    });

    test("Response 429: dispatches rate limit event with retry-after value", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 429 error with a Retry-After header
       * - Spy on the global dispatchEvent method
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Rate limit event contains the retry-after value
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 429,
          data: {
            detail: "Too many requests.",
          },
          headers: {
            "retry-after": "60",
          },
        },
      };

      const dispatchSpy = vi.spyOn(window, "dispatchEvent");

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);

      const event = dispatchSpy.mock.calls[0][0];

      expect(event.type).toBe("api-rate-limit");

      expect(event.detail).toEqual({
        message: "Too many requests.",
        retryAfter: "60",
      });
    });

    // =====================
    // Excluded endpoints
    // ====================

    test("Excluded Enpoints: Login errors are rejected without refresh", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error from the login endpoint
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Error is rejected unchanged
       * - Token refresh is not requested
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 401,
        },
        config: {
          url: "/api/auth/login/"
        },
      };

      vi.spyOn(axiosRequest, "post");

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(axiosRequest.post).not.toHaveBeenCalled();


    });

    test("Excluded Endpoints: Register errors are rejected without refresh", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error from the register endpoint
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Error is rejected unchanged
       * - Token refresh is not requested
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 401,
        },
        config: {
          url: "/api/auth/registration/"
        },
      };

      vi.spyOn(axiosRequest, "post");

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(axiosRequest.post).not.toHaveBeenCalled();
    });

    test("Excluded Endpoints: Refresh errors are rejected without refresh", async () => {
      /**
       * Arrange:
       * - Get the response interceptor
       * - Mock a 401 error from the refresh endpoint
       * Act:
       * - Pass the error through the interceptor
       * Assert:
       * - Error is rejected unchanged
       * - Token refresh is not requested
       */

      const interceptor = getResponseInterceptor();

      const error = {
        response: {
          status: 401,
        },
        config: {
          url: "/api/auth/token/refresh/"
        },
      };

      vi.spyOn(axiosRequest, "post");

      await expect(interceptor.rejected(error)).rejects.toBe(error);

      expect(axiosRequest.post).not.toHaveBeenCalled();
    })
});
