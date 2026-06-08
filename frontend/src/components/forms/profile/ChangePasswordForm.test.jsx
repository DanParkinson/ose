/**
 * CHANGE PASSWORD FORM TEST CHECKLIST
 * -----------------------------------
 * Initial Render
 * - Verify current password input is shown
 * - Verify new password input is shown
 * - Verify confirm password input is shown
 * - Verify update password button is shown
 *
 * -----------------------------------
 * User Input
 * - Verify current password input updates when user types
 * - Verify new password input updates when user types
 * - Verify confirm password input updates when user types
 *
 * -----------------------------------
 * Successful Password Change
 * - Verify password change request sends old password and new passwords to endpoint
 * - Verify successful password change shows success message
 * - Verify successful password change clears all password fields
 *
 * -----------------------------------
 * Loading State
 * - Verify loading text is displayed while password change is submitting
 * - Verify submit button is disabled while password change is submitting
 * - Verify duplicate submit is prevented while loading
 *
 * -----------------------------------
 * API Validation Errors
 * - Verify old password field error displays
 * - Verify new password field error displays
 * - Verify confirm password field error displays
 * - Verify non-field error displays
 * - Verify fallback error displays when no API response is returned
 *
 * -----------------------------------
 * Error Cleanup
 * - Verify old password error clears when current password changes
 * - Verify new password error clears when new password changes
 * - Verify confirm password error clears when confirm password changes
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
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import ChangePasswordForm from "./ChangePasswordForm";
import { axiosResponse } from "../../../api/axiosDefaults";

vi.mock("../../../api/axiosDefaults", () => ({
  axiosResponse: {
    post: vi.fn(),
  },
}));

vi.mock("@chakra-ui/react", () => ({
  HStack: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/containers/WideFormContainer", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/form_field/FormFieldText", () => ({
  default: ({
    field,
    value,
    error,
    onChange,
  }) => (
    <>
      <input
        placeholder={field.placeholder}
        value={value}
        onChange={(event) =>
          onChange(field.name, event.target.value)
        }
      />

      {error && <p>{error}</p>}
    </>
  ),
}));

vi.mock("../base/buttons/FormSubmitButton", () => ({
  default: ({
    children,
    onClick,
    disabled,
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  ),
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
  default: () => <span>Loading Spinner</span>,
}));

vi.mock("../base/feedback/FormError", () => ({
  default: ({ children }) =>
    children ? <p>{children}</p> : null,
}));

vi.mock("../base/feedback/FormSuccess", () => ({
  default: ({ children }) =>
    children ? <p>{children}</p> : null,
}));

const typeCurrentPassword = (
  value = "oldPassword123"
) => {
  fireEvent.change(
    screen.getByPlaceholderText("Current Password"),
    {
      target: { value },
    }
  );
};

const typeNewPassword = (
  value = "newPassword123"
) => {
  fireEvent.change(
    screen.getByPlaceholderText("New Password"),
    {
      target: { value },
    }
  );
};

const typeConfirmPassword = (
  value = "newPassword123"
) => {
  fireEvent.change(
    screen.getByPlaceholderText("Confirm New Password"),
    {
      target: { value },
    }
  );
};

const completeChangePasswordForm = ({
  currentPassword = "oldPassword123",
  newPassword1 = "newPassword123",
  newPassword2 = "newPassword123",
} = {}) => {
  typeCurrentPassword(currentPassword);
  typeNewPassword(newPassword1);
  typeConfirmPassword(newPassword2);
};

const submitForm = () => {
  fireEvent.click(
    screen.getByRole("button", {
      name: /update password/i,
    })
  );
};

describe("ChangePasswordForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // =====================
  // Initial Render
  // =====================

  test("shows current password input", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the current password input is displayed.
     */
    render(<ChangePasswordForm />);

    expect(
      screen.getByPlaceholderText("Current Password")
    ).toBeInTheDocument();
  });

  test("shows new password input", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the new password input is displayed.
     */
    render(<ChangePasswordForm />);

    expect(
      screen.getByPlaceholderText("New Password")
    ).toBeInTheDocument();
  });

  test("shows confirm password input", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the confirm password input is displayed.
     */
    render(<ChangePasswordForm />);

    expect(
      screen.getByPlaceholderText("Confirm New Password")
    ).toBeInTheDocument();
  });

  test("shows update password button", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * No additional action required.
     *
     * Assert:
     * Confirm the update password button is displayed.
     */
    render(<ChangePasswordForm />);

    expect(
      screen.getByRole("button", {
        name: "Update Password",
      })
    ).toBeInTheDocument();
  });

  // =====================
  // User Input
  // =====================

  test("updates current password input when user types", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Type into the current password input.
     *
     * Assert:
     * Confirm the current password value updates.
     */
    render(<ChangePasswordForm />);

    typeCurrentPassword("oldPassword123");

    expect(
      screen.getByPlaceholderText("Current Password")
    ).toHaveValue("oldPassword123");
  });

  test("updates new password input when user types", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Type into the new password input.
     *
     * Assert:
     * Confirm the new password value updates.
     */
    render(<ChangePasswordForm />);

    typeNewPassword("newPassword123");

    expect(
      screen.getByPlaceholderText("New Password")
    ).toHaveValue("newPassword123");
  });

  test("updates confirm password input when user types", () => {
    /**
     * Arrange:
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Type into the confirm password input.
     *
     * Assert:
     * Confirm the confirm password value updates.
     */
    render(<ChangePasswordForm />);

    typeConfirmPassword("newPassword123");

    expect(
      screen.getByPlaceholderText("Confirm New Password")
    ).toHaveValue("newPassword123");
  });

  // =====================
  // Successful Password Change
  // =====================

  test("sends password change request with correct payload", async () => {
    /**
     * Arrange:
     * Mock a successful password change response.
     * Render the ChangePasswordForm component.
     * Fill all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the correct endpoint and payload are used.
     */
    axiosResponse.post.mockResolvedValue({});

    render(<ChangePasswordForm />);

    completeChangePasswordForm();

    submitForm();

    await waitFor(() => {
      expect(axiosResponse.post).toHaveBeenCalledWith(
        "/api/auth/password/change/",
        {
          old_password: "oldPassword123",
          new_password1: "newPassword123",
          new_password2: "newPassword123",
        }
      );
    });
  });

  test("shows success message when password change succeeds", async () => {
    /**
     * Arrange:
     * Mock a successful password change response.
     * Render the ChangePasswordForm component.
     * Fill all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the success message is displayed.
     */
    axiosResponse.post.mockResolvedValue({});

    render(<ChangePasswordForm />);

    completeChangePasswordForm();

    submitForm();

    expect(
      await screen.findByText("Password updated successfully.")
    ).toBeInTheDocument();
  });

  test("clears all password fields after successful password change", async () => {
    /**
     * Arrange:
     * Mock a successful password change response.
     * Render the ChangePasswordForm component.
     * Fill all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm all password fields are cleared.
     */
    axiosResponse.post.mockResolvedValue({});

    render(<ChangePasswordForm />);

    completeChangePasswordForm();

    submitForm();

    await screen.findByText("Password updated successfully.");

    expect(
      screen.getByPlaceholderText("Current Password")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText("New Password")
    ).toHaveValue("");

    expect(
      screen.getByPlaceholderText("Confirm New Password")
    ).toHaveValue("");
  });

  // =====================
  // Loading State
  // =====================

  test("shows loading text while password change is submitting", async () => {
    /**
     * Arrange:
     * Mock the password change request so it stays pending.
     * Render the ChangePasswordForm component.
     * Fill all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the loading text is displayed.
     */
    axiosResponse.post.mockReturnValue(
      new Promise(() => {})
    );

    render(<ChangePasswordForm />);

    completeChangePasswordForm();

    submitForm();

    expect(
      await screen.findByText("Updating...")
    ).toBeInTheDocument();
  });

  test("disables submit button while password change is submitting", async () => {
    /**
     * Arrange:
     * Mock the password change request so it stays pending.
     * Render the ChangePasswordForm component.
     * Fill all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the submit button is disabled.
     */
    axiosResponse.post.mockReturnValue(
      new Promise(() => {})
    );

    render(<ChangePasswordForm />);

    completeChangePasswordForm();

    submitForm();

    await screen.findByText("Updating...");

    expect(
      screen.getByRole("button")
    ).toBeDisabled();
  });

  test("prevents duplicate submit while loading", async () => {
    /**
     * Arrange:
     * Mock the password change request so it stays pending.
     * Render the ChangePasswordForm component.
     * Fill all password fields.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm only one request is sent.
     */
    axiosResponse.post.mockReturnValue(
      new Promise(() => {})
    );

    render(<ChangePasswordForm />);

    completeChangePasswordForm();

    submitForm();

    await screen.findByText("Updating...");

    expect(axiosResponse.post).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole("button")
    ).toBeDisabled();
  });

  // =====================
  // API Validation Errors
  // =====================

  test("displays old password field error", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with old password error.
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the old password error is displayed.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          old_password: [
            "Your old password was entered incorrectly.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    expect(
      await screen.findByText(
        "Your old password was entered incorrectly."
      )
    ).toBeInTheDocument();
  });

  test("displays new password field error", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with new password error.
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the new password error is displayed.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          new_password1: [
            "This password is too common.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    expect(
      await screen.findByText("This password is too common.")
    ).toBeInTheDocument();
  });

  test("displays confirm password field error", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with confirm password error.
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the confirm password error is displayed.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          new_password2: [
            "The two password fields did not match.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    expect(
      await screen.findByText(
        "The two password fields did not match."
      )
    ).toBeInTheDocument();
  });

  test("displays non-field error", async () => {
    /**
     * Arrange:
     * Mock a failed password change response with non-field error.
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the non-field error is displayed.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          non_field_errors: [
            "Password change could not be completed.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    expect(
      await screen.findByText(
        "Password change could not be completed."
      )
    ).toBeInTheDocument();
  });

  test("displays fallback error when no API response is returned", async () => {
    /**
     * Arrange:
     * Mock a failed password change response without response data.
     * Render the ChangePasswordForm component.
     *
     * Act:
     * Submit the form.
     *
     * Assert:
     * Confirm the fallback error is displayed.
     */
    axiosResponse.post.mockRejectedValue({});

    render(<ChangePasswordForm />);

    submitForm();

    expect(
      await screen.findByText("Password change failed.")
    ).toBeInTheDocument();
  });

  // =====================
  // Error Cleanup
  // =====================

  test("clears old password error when current password changes", async () => {
    /**
     * Arrange:
     * Mock a failed response with an old password error.
     * Render the ChangePasswordForm component.
     * Submit the form to display the error.
     *
     * Act:
     * Type into the current password input.
     *
     * Assert:
     * Confirm the old password error is cleared.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          old_password: [
            "Your old password was entered incorrectly.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    await screen.findByText(
      "Your old password was entered incorrectly."
    );

    typeCurrentPassword("updatedOldPassword123");

    expect(
      screen.queryByText(
        "Your old password was entered incorrectly."
      )
    ).not.toBeInTheDocument();
  });

  test("clears new password error when new password changes", async () => {
    /**
     * Arrange:
     * Mock a failed response with a new password error.
     * Render the ChangePasswordForm component.
     * Submit the form to display the error.
     *
     * Act:
     * Type into the new password input.
     *
     * Assert:
     * Confirm the new password error is cleared.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          new_password1: [
            "This password is too common.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    await screen.findByText("This password is too common.");

    typeNewPassword("updatedNewPassword123");

    expect(
      screen.queryByText("This password is too common.")
    ).not.toBeInTheDocument();
  });

  test("clears confirm password error when confirm password changes", async () => {
    /**
     * Arrange:
     * Mock a failed response with a confirm password error.
     * Render the ChangePasswordForm component.
     * Submit the form to display the error.
     *
     * Act:
     * Type into the confirm password input.
     *
     * Assert:
     * Confirm the confirm password error is cleared.
     */
    axiosResponse.post.mockRejectedValue({
      response: {
        data: {
          new_password2: [
            "The two password fields did not match.",
          ],
        },
      },
    });

    render(<ChangePasswordForm />);

    submitForm();

    await screen.findByText(
      "The two password fields did not match."
    );

    typeConfirmPassword("updatedConfirmPassword123");

    expect(
      screen.queryByText(
        "The two password fields did not match."
      )
    ).not.toBeInTheDocument();
  });
});
