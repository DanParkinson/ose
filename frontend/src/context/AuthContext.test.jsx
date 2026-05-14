/**
 * AuthContext Tests
 *
 * This test suite verifies:
 *
 * 1. Initial authentication check
 * 2. Login behaviour
 * 3. Logout behaviour
 * 4. Register behaviour
 * 5. Change password behaviour
 *
 * These tests mock axiosRequest so no real API requests are made.
 */

import { useContext } from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AuthContext, { AuthProvider } from "./AuthContext";
import { axiosRequest } from "../api/axiosDefaults";

vi.mock("../api/axiosDefaults", () => ({
  axiosRequest: {
    get: vi.fn(),
    post: vi.fn(),
  },
  axiosResponse: {},
}));

const TestConsumer = () => {
  const {
    user,
    loading,
    login,
    logout,
    register,
    changePassword,
  } = useContext(AuthContext);

  const saveResult = (result) => {
    document.body.setAttribute(
      "data-result",
      JSON.stringify(result)
    );
  };

  return (
    <div>
      <p>User: {user ? user.email : "No user"}</p>
      <p>Loading: {loading ? "true" : "false"}</p>

      <button
        onClick={async () => {
          saveResult(
            await login("test@example.com", "password123")
          );
        }}
      >
        Login
      </button>

      <button onClick={logout}>
        Logout
      </button>

      <button
        onClick={async () => {
          saveResult(
            await register(
              "test@example.com",
              "password123",
              "password123"
            )
          );
        }}
      >
        Register
      </button>

      <button
        onClick={async () => {
          saveResult(
            await changePassword(
              "oldpassword",
              "newpassword123",
              "newpassword123"
            )
          );
        }}
      >
        Change Password
      </button>
    </div>
  );
};

const renderAuthProvider = () =>
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.removeAttribute("data-result");
  });

  afterEach(() => {
    cleanup();
  });

  describe("initial user fetch", () => {
    test("fetches and sets user on mount when request succeeds", async () => {
      /**
       * Arrange:
       * Mock a successful initial user request.
       *
       * Act:
       * Render AuthProvider with a test consumer.
       *
       * Assert:
       * Confirm the authenticated user is stored in context.
       * Confirm loading becomes false.
       * Confirm the user endpoint is called.
       */
      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      renderAuthProvider();

      expect(
        await screen.findByText("User: test@example.com")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Loading: false")
      ).toBeInTheDocument();

      expect(axiosRequest.get).toHaveBeenCalledWith(
        "/api/auth/user/"
      );
    });

    test("sets user to null on mount when fetchUser fails", async () => {
      /**
       * Arrange:
       * Mock a failed initial user request.
       *
       * Act:
       * Render AuthProvider with a test consumer.
       *
       * Assert:
       * Confirm user is set to null.
       * Confirm loading becomes false.
       */
      axiosRequest.get.mockRejectedValue(
        new Error("Not authenticated")
      );

      renderAuthProvider();

      expect(
        await screen.findByText("User: No user")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Loading: false")
      ).toBeInTheDocument();
    });
  });

  describe("login", () => {
    test("posts credentials and fetches user on success", async () => {
      /**
       * Arrange:
       * Mock the initial user fetch and login request as successful.
       *
       * Act:
       * Click the Login button.
       *
       * Assert:
       * Confirm credentials are posted to the login endpoint.
       * Confirm the user is fetched again after login.
       * Confirm login returns a success result.
       */
      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      axiosRequest.post.mockResolvedValue({});

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Login"));

      await waitFor(() => {
        expect(axiosRequest.post).toHaveBeenCalledWith(
          "/api/auth/login/",
          {
            email: "test@example.com",
            password: "password123",
          }
        );
      });

      expect(axiosRequest.get).toHaveBeenCalledTimes(2);

      const result = JSON.parse(
        document.body.getAttribute("data-result")
      );

      expect(result).toEqual({
        success: true,
        errors: null,
      });
    });

    test("returns backend errors when login request fails", async () => {
      /**
       * Arrange:
       * Mock unauthenticated initial state.
       * Mock a failed login request with backend error data.
       *
       * Act:
       * Click the Login button.
       *
       * Assert:
       * Confirm login returns the backend validation errors.
       */
      axiosRequest.get.mockRejectedValue(
        new Error("Not authenticated")
      );

      axiosRequest.post.mockRejectedValue({
        response: {
          data: {
            non_field_errors: ["Unable to log in."],
          },
        },
      });

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Login"));

      await waitFor(() => {
        const result = JSON.parse(
          document.body.getAttribute("data-result")
        );

        expect(result).toEqual({
          success: false,
          errors: {
            non_field_errors: ["Unable to log in."],
          },
        });
      });
    });

    test("returns fallback error when login fails without backend error data", async () => {
      /**
       * Arrange:
       * Mock unauthenticated initial state.
       * Mock a failed login request without backend error data.
       *
       * Act:
       * Click the Login button.
       *
       * Assert:
       * Confirm login returns the fallback login error.
       */
      axiosRequest.get.mockRejectedValue(
        new Error("Not authenticated")
      );

      axiosRequest.post.mockRejectedValue(
        new Error("Network error")
      );

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Login"));

      await waitFor(() => {
        const result = JSON.parse(
          document.body.getAttribute("data-result")
        );

        expect(result).toEqual({
          success: false,
          errors: {
            non_field_errors: ["Login failed."],
          },
        });
      });
    });
  });

  describe("logout", () => {
    test("posts to logout endpoint and clears user", async () => {
      /**
       * Arrange:
       * Mock an authenticated user and successful logout request.
       *
       * Act:
       * Click the Logout button.
       *
       * Assert:
       * Confirm logout endpoint is called.
       * Confirm user is cleared from context.
       */
      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      axiosRequest.post.mockResolvedValue({});

      renderAuthProvider();

      await screen.findByText("User: test@example.com");

      fireEvent.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(axiosRequest.post).toHaveBeenCalledWith(
          "/api/auth/logout/"
        );

        expect(
          screen.getByText("User: No user")
        ).toBeInTheDocument();
      });
    });

    test("clears user even when logout request fails", async () => {
      /**
       * Arrange:
       * Mock an authenticated user.
       * Mock a failed logout request.
       * Spy on console.error to avoid noisy test output.
       *
       * Act:
       * Click the Logout button.
       *
       * Assert:
       * Confirm the user is still cleared from context.
       */
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      axiosRequest.post.mockRejectedValue(
        new Error("Logout failed")
      );

      renderAuthProvider();

      await screen.findByText("User: test@example.com");

      fireEvent.click(screen.getByText("Logout"));

      await waitFor(() => {
        expect(
          screen.getByText("User: No user")
        ).toBeInTheDocument();
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe("register", () => {
    test("posts user details and returns success", async () => {
      /**
       * Arrange:
       * Mock unauthenticated initial state.
       * Mock a successful registration request.
       *
       * Act:
       * Click the Register button.
       *
       * Assert:
       * Confirm registration data is posted correctly.
       * Confirm register returns a success result.
       */
      axiosRequest.get.mockRejectedValue(
        new Error("Not authenticated")
      );

      axiosRequest.post.mockResolvedValue({});

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Register"));

      await waitFor(() => {
        expect(axiosRequest.post).toHaveBeenCalledWith(
          "/api/auth/registration/",
          {
            email: "test@example.com",
            password1: "password123",
            password2: "password123",
          }
        );
      });

      const result = JSON.parse(
        document.body.getAttribute("data-result")
      );

      expect(result).toEqual({
        success: true,
        errors: null,
      });
    });

    test("returns backend errors when register request fails", async () => {
      /**
       * Arrange:
       * Mock unauthenticated initial state.
       * Mock a failed registration request with backend error data.
       *
       * Act:
       * Click the Register button.
       *
       * Assert:
       * Confirm register returns the backend validation errors.
       */
      axiosRequest.get.mockRejectedValue(
        new Error("Not authenticated")
      );

      axiosRequest.post.mockRejectedValue({
        response: {
          data: {
            email: [
              "A user is already registered with this email.",
            ],
          },
        },
      });

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Register"));

      await waitFor(() => {
        const result = JSON.parse(
          document.body.getAttribute("data-result")
        );

        expect(result).toEqual({
          success: false,
          errors: {
            email: [
              "A user is already registered with this email.",
            ],
          },
        });
      });
    });

    test("returns fallback error when register fails without backend error data", async () => {
      /**
       * Arrange:
       * Mock unauthenticated initial state.
       * Mock a failed registration request without backend error data.
       *
       * Act:
       * Click the Register button.
       *
       * Assert:
       * Confirm register returns the fallback registration error.
       */
      axiosRequest.get.mockRejectedValue(
        new Error("Not authenticated")
      );

      axiosRequest.post.mockRejectedValue(
        new Error("Network error")
      );

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Register"));

      await waitFor(() => {
        const result = JSON.parse(
          document.body.getAttribute("data-result")
        );

        expect(result).toEqual({
          success: false,
          errors: {
            non_field_errors: ["Registration failed."],
          },
        });
      });
    });
  });

  describe("changePassword", () => {
    test("posts password details and returns success", async () => {
      /**
       * Arrange:
       * Mock authenticated initial state.
       * Mock a successful password change request.
       *
       * Act:
       * Click the Change Password button.
       *
       * Assert:
       * Confirm password data is posted correctly.
       * Confirm changePassword returns a success result.
       */
      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      axiosRequest.post.mockResolvedValue({});

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Change Password"));

      await waitFor(() => {
        expect(axiosRequest.post).toHaveBeenCalledWith(
          "/api/auth/password/change/",
          {
            old_password: "oldpassword",
            new_password1: "newpassword123",
            new_password2: "newpassword123",
          }
        );
      });

      const result = JSON.parse(
        document.body.getAttribute("data-result")
      );

      expect(result).toEqual({
        success: true,
        errors: null,
      });
    });

    test("returns backend errors when changePassword request fails", async () => {
      /**
       * Arrange:
       * Mock authenticated initial state.
       * Mock a failed password change request with backend error data.
       *
       * Act:
       * Click the Change Password button.
       *
       * Assert:
       * Confirm changePassword returns the backend validation errors.
       */
      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      axiosRequest.post.mockRejectedValue({
        response: {
          data: {
            old_password: [
              "Your old password was entered incorrectly.",
            ],
          },
        },
      });

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Change Password"));

      await waitFor(() => {
        const result = JSON.parse(
          document.body.getAttribute("data-result")
        );

        expect(result).toEqual({
          success: false,
          errors: {
            old_password: [
              "Your old password was entered incorrectly.",
            ],
          },
        });
      });
    });

    test("returns fallback error when changePassword fails without backend error data", async () => {
      /**
       * Arrange:
       * Mock authenticated initial state.
       * Mock a failed password change request without backend error data.
       *
       * Act:
       * Click the Change Password button.
       *
       * Assert:
       * Confirm changePassword returns the fallback password change error.
       */
      axiosRequest.get.mockResolvedValue({
        data: { email: "test@example.com" },
      });

      axiosRequest.post.mockRejectedValue(
        new Error("Network error")
      );

      renderAuthProvider();

      await screen.findByText("Loading: false");

      fireEvent.click(screen.getByText("Change Password"));

      await waitFor(() => {
        const result = JSON.parse(
          document.body.getAttribute("data-result")
        );

        expect(result).toEqual({
          success: false,
          errors: {
            non_field_errors: [
              "Password change failed.",
            ],
          },
        });
      });
    });
  });
});
