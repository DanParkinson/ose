/**
 * REACTIVATE REQUEST FORM TEST CHECKLIST
 * --------------------------------------
 * Initial Render
 * - Verify reactivate account form content is shown
 * - Verify email input is shown
 * - Verify login link is shown
 *
 * --------------------------------------
 * User Input
 * - Verify email input updates correctly
 *
 * --------------------------------------
 * Successful Reactivation Request
 * - Verify reactivation request sends email to reactivation request endpoint
 * - Verify successful request shows submitted message
 * - Verify successful request shows login link
 *
 * --------------------------------------
 * Loading State
 * - Verify loading text is displayed while request is submitting
 * - Verify submit button is disabled while request is submitting
 * - Verify duplicate request is prevented by the disabled submit button
 *
 * --------------------------------------
 * Reactivation Request Validation
 * - Verify email field error displays
 * - Verify non-field error displays
 * - Verify fallback error displays when no API response is returned
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import {
  clearAuthMocks,
} from "../../../tests/auth/authFormMocks";

import {
  renderForm,
  submitForm,
} from "../../../tests/auth/authFormHelpers";

import {
  expectLoginLink,
} from "../../../tests/auth/authFormAssertions";

import ReactivateRequestForm from "./ReactivateRequestForm";
import { axiosRequest } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosRequest: {
    post: vi.fn(),
  },
}));

const typeEmail = (value = "test@example.com") => {
  fireEvent.change(screen.getByPlaceholderText("Email"), {
    target: { value },
  });
};

describe("ReactivateRequestForm", () => {
  beforeEach(() => {
    clearAuthMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows the initial reactivate request form", () => {
    /**
     * Arrange:
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Query the heading, instruction text, email input,
     * submit button, and login link.
     *
     * Assert:
     * Confirm the reactivate request form renders correctly.
     */
    renderForm(ReactivateRequestForm);

    expect(
      screen.getByRole("heading", { name: "Reactivate Account" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Enter your email to receive a reactivation link.")
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Send Reactivation Email" })
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // User Input
  // =====================

  test("updates email input when user types", () => {
    /**
     * Arrange:
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Type an email address into the email input.
     *
     * Assert:
     * Confirm the email input value updates correctly.
     */
    renderForm(ReactivateRequestForm);

    typeEmail("test@example.com");

    expect(screen.getByPlaceholderText("Email")).toHaveValue(
      "test@example.com"
    );
  });

  // =====================
  // Successful Reactivation Request
  // =====================

  test("sends email to reactivate request endpoint", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation request response.
     * Render the ReactivateRequestForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the API request is sent to the correct endpoint
     * with the entered email address.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(ReactivateRequestForm);

    typeEmail("test@example.com");

    submitForm("Send Reactivation Email");

    await waitFor(() => {
      expect(axiosRequest.post).toHaveBeenCalledWith(
        "/api/account/reactivate/request/",
        {
          email: "test@example.com",
        }
      );
    });
  });

  test("shows submitted message when reactivation request succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful reactivation request response.
     * Render the ReactivateRequestForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the submitted message is displayed.
     * Confirm the login link is displayed.
     */
    axiosRequest.post.mockResolvedValue({});

    renderForm(ReactivateRequestForm);

    typeEmail("test@example.com");

    submitForm("Send Reactivation Email");

    expect(
      await screen.findByText(
        /If a deactivated account exists with that email, a reactivation link/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(/has been sent./i)
    ).toBeInTheDocument();

    expectLoginLink();
  });

  // =====================
  // Loading State
  // =====================

  test("displays loading text while reactivation request is submitting", async () => {
    /**
     * Arrange:
     * Mock reactivation request so the request stays pending.
     * Render the ReactivateRequestForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ReactivateRequestForm);

    typeEmail("test@example.com");

    submitForm("Send Reactivation Email");

    expect(await screen.findByText("Sending...")).toBeInTheDocument();
  });

  test("disables the submit button while reactivation request is submitting", async () => {
    /**
     * Arrange:
     * Mock reactivation request so the request stays pending.
     * Render the ReactivateRequestForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the submit button is disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ReactivateRequestForm);

    typeEmail("test@example.com");

    submitForm("Send Reactivation Email");

    await screen.findByText("Sending...");

    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("prevents duplicate request while loading", async () => {
    /**
     * Arrange:
     * Mock reactivation request so the first request stays pending.
     * Render the ReactivateRequestForm component.
     * Populate the email field.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm reactivation request is only called once.
     * Confirm the button remains disabled while loading.
     */
    axiosRequest.post.mockReturnValue(new Promise(() => {}));

    renderForm(ReactivateRequestForm);

    typeEmail("test@example.com");

    submitForm("Send Reactivation Email");

    await screen.findByText("Sending...");

    expect(axiosRequest.post).toHaveBeenCalledTimes(1);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  // =====================
  // Reactivation Request Validation
  // =====================

  test("displays email field error when reactivation request fails", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation request response with an email field error.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the email field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          email: ["Enter a valid email address."],
        },
      },
    });

    renderForm(ReactivateRequestForm);

    submitForm("Send Reactivation Email");

    expect(
      await screen.findByText("Enter a valid email address.")
    ).toBeInTheDocument();
  });

  test("displays non-field error when reactivation request fails", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation request response with a non-field error.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the non-field error is displayed.
     */
    axiosRequest.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: ["Reactivation request failed."],
        },
      },
    });

    renderForm(ReactivateRequestForm);

    submitForm("Send Reactivation Email");

    expect(
      await screen.findByText("Reactivation request failed.")
    ).toBeInTheDocument();
  });

  test("displays fallback error when reactivation request fails without API response", async () => {
    /**
     * Arrange:
     * Mock a failed reactivation request response without response data.
     * Render the ReactivateRequestForm component.
     *
     * Act:
     * Submit the reactivation request form.
     *
     * Assert:
     * Confirm the fallback error message is displayed.
     */
    axiosRequest.post.mockRejectedValue({});

    renderForm(ReactivateRequestForm);

    submitForm("Send Reactivation Email");

    expect(
      await screen.findByText("Reactivation request failed. Please try again.")
    ).toBeInTheDocument();
  });
});
