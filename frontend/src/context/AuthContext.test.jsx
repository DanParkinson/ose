/**
 * AUTH CONTEXT TEST CHECKLIST
 * ---------------------------
 * Initial Session Check
 * - Verify AuthProvider fetches current user on mount
 * - Verify user is stored when current user request succeeds
 * - Verify user is null when current user request fails
 * - Verify loading becomes false after session check
 * - Verify fetchUser clears user and returns false when auth check fails
 *
 * ---------------------------
 * Login
 * - Verify login posts email and password to login endpoint
 * - Verify login fetches current user after successful login
 * - Verify login returns success response on success
 * - Verify login returns backend errors on failure
 * - Verify login returns fallback error when no backend data exists
 *
 * ---------------------------
 * Logout
 * - Verify logout posts to logout endpoint
 * - Verify logout clears user
 * - Verify logout clears user even when logout request fails
 *
 * ---------------------------
 * Register
 * - Verify register posts email and passwords to registration endpoint
 * - Verify register returns success response on success
 * - Verify register returns backend errors on failure
 * - Verify register returns fallback error when no backend data exists
 */

import { useContext } from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AuthContext, { AuthProvider } from "./AuthContext";
import { axiosRequest, axiosResponse } from "../api/axiosDefaults";

vi.mock("../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
  axiosResponse: {
    get: vi.fn(),
  },
}));

const saveResult = (result) => {
  document.body.setAttribute("data-result", JSON.stringify(result));
};

const getSavedResult = () => {
  return JSON.parse(document.body.getAttribute("data-result"));
};

const TestConsumer = () => {
  const {
    user,
    fetchUser,
    loading,
    login,
    logout,
    register,
  } = useContext(AuthContext);

  return (
    <div>
      <p>User: {user ? user.email : "No user"}</p>
      <p>Loading: {loading ? "true" : "false"}</p>

      <button
        type="button"
        onClick={async () => {
          saveResult(await login("test@example.com", "password123"));
        }}
      >
        Login
      </button>

      <button
        type="button"
        onClick={async () => {
          await logout();
        }}
      >
        Logout
      </button>

      <button
        type="button"
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
        type="button"
        onClick={async () => {
          saveResult(await fetchUser());
        }}
      >
        Fetch User
      </button>
    </div>
  );
};

const renderAuthProvider = () => {
  render(
    <AuthProvider>
      <TestConsumer />
    </AuthProvider>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.removeAttribute("data-result");
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Session Check
  // =====================

  test("fetches and stores current user on mount when request succeeds", async () => {
    axiosResponse.get.mockResolvedValue({
      data: {
        email: "test@example.com",
      },
    });

    renderAuthProvider();

    expect(
      await screen.findByText("User: test@example.com")
    ).toBeInTheDocument();

    expect(screen.getByText("Loading: false")).toBeInTheDocument();

    expect(axiosResponse.get).toHaveBeenCalledWith("/api/auth/user/");
  });

  test("sets user to null on mount when current user request fails", async () => {
    axiosResponse.get.mockRejectedValue(new Error("Not authenticated"));

    renderAuthProvider();

    expect(await screen.findByText("User: No user")).toBeInTheDocument();

    expect(screen.getByText("Loading: false")).toBeInTheDocument();

    expect(axiosResponse.get).toHaveBeenCalledWith("/api/auth/user/");
  });

  test("fetchUser clears user and returns false when auth check fails", async () => {
    axiosResponse.get
      .mockResolvedValueOnce({
        data: {
          email: "test@example.com",
        },
      })
      .mockRejectedValueOnce(new Error("Refresh token expired"));

    renderAuthProvider();

    await screen.findByText("User: test@example.com");

    fireEvent.click(screen.getByText("Fetch User"));

    await waitFor(() => {
      expect(getSavedResult()).toBe(false);
    });

    expect(screen.getByText("User: No user")).toBeInTheDocument();

    expect(axiosResponse.get).toHaveBeenCalledTimes(2);
  });

  // =====================
  // Login
  // =====================

  test("posts credentials and fetches current user on successful login", async () => {
    axiosResponse.get
      .mockRejectedValueOnce(new Error("Not authenticated"))
      .mockResolvedValueOnce({
        data: {
          email: "test@example.com",
        },
      });

    axiosRequest.post.mockResolvedValue({});

    renderAuthProvider();

    await screen.findByText("Loading: false");

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith("/api/auth/login/", {
        email: "test@example.com",
        password: "password123",
      });
    });

    expect(axiosResponse.get).toHaveBeenCalledTimes(2);

    expect(await screen.findByText("User: test@example.com")).toBeInTheDocument();

    expect(getSavedResult()).toEqual({
      success: true,
      errors: null,
    });
  });

  test("returns backend errors when login fails", async () => {
    axiosResponse.get.mockRejectedValue(new Error("Not authenticated"));

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
      expect(getSavedResult()).toEqual({
        success: false,
        errors: {
          non_field_errors: ["Unable to log in."],
        },
      });
    });
  });

  test("returns fallback error when login fails without backend data", async () => {
    axiosResponse.get.mockRejectedValue(new Error("Not authenticated"));

    axiosRequest.post.mockRejectedValue(new Error("Network error"));

    renderAuthProvider();

    await screen.findByText("Loading: false");

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(getSavedResult()).toEqual({
        success: false,
        errors: {
          non_field_errors: ["Login failed."],
        },
      });
    });
  });

  // =====================
  // Logout
  // =====================

  test("posts to logout endpoint and clears user", async () => {
    axiosResponse.get.mockResolvedValue({
      data: {
        email: "test@example.com",
      },
    });

    axiosRequest.post.mockResolvedValue({});

    renderAuthProvider();

    await screen.findByText("User: test@example.com");

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith("/api/auth/logout/");
    });

    expect(screen.getByText("User: No user")).toBeInTheDocument();
  });

  test("clears user even when logout request fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    axiosResponse.get.mockResolvedValue({
      data: {
        email: "test@example.com",
      },
    });

    axiosRequest.post.mockRejectedValue(new Error("Logout failed"));

    renderAuthProvider();

    await screen.findByText("User: test@example.com");

    fireEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByText("User: No user")).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  // =====================
  // Register
  // =====================

  test("posts registration details and returns success", async () => {
    axiosResponse.get.mockRejectedValue(new Error("Not authenticated"));

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

    expect(getSavedResult()).toEqual({
      success: true,
      errors: null,
    });
  });

  test("returns backend errors when register fails", async () => {
    axiosResponse.get.mockRejectedValue(new Error("Not authenticated"));

    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          email: ["A user is already registered with this email."],
        },
      },
    });

    renderAuthProvider();

    await screen.findByText("Loading: false");

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(getSavedResult()).toEqual({
        success: false,
        errors: {
          email: ["A user is already registered with this email."],
        },
      });
    });
  });

  test("returns fallback error when register fails without backend data", async () => {
    axiosResponse.get.mockRejectedValue(new Error("Not authenticated"));

    axiosRequest.post.mockRejectedValue(new Error("Network error"));

    renderAuthProvider();

    await screen.findByText("Loading: false");

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(getSavedResult()).toEqual({
        success: false,
        errors: {
          non_field_errors: ["Registration failed."],
        },
      });
    });
  });
});
