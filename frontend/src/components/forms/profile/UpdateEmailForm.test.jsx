/**
 * UPDATE EMAIL FORM TEST CHECKLIST
 * --------------------------------
 * Initial Render
 * - Verify current email is shown
 * --------------------------------
 * Current Email
 * - Verify current email displays the user's email if available
 * - Verify fallback message is displayed if no user is found
 * - Verify fallback message is displayed if user exists but has no email
 * - Verify current email input is disabled
 * --------------------------------
 * New Email
 * - Verify update email input is displayed
 * - Verify update email input updates when user types
 * --------------------------------
 * Submit Button
 * - Verify send verification code button is displayed
 * - Verify button is disabled when update email is empty
 * - Verify button becomes enabled when a valid email is entered
 * --------------------------------
 * Form Submission
 * - Verify clicking submit sends the update email request
 * - Verify request is sent with the entered email address
 * - Verify request is not sent when update email is empty
 * --------------------------------
 * Loading State
 * - Verify submit button is disabled while request is in progress
 * - Verify loading spinner is displayed while request is in progress
 * --------------------------------
 * Success Handling
 * - Verify shows verification message when verification email is sent
 * - Verify hides submit button and shows verification message after successful request
 * - Verify keeps update email value after successful submission
 * --------------------------------
 * Error Handling
 * - Verify displays field errors
 * - Verify displays non-field errors
 * --------------------------------
 * Verification Pending State
 * - Verify disables update email input while verification is pending
 * - Verify update email input is disabled while verification is pending
 * - Verify current email remains unchanged until verification completes
 * -------------------
 * Resend Verification
 * - Verify clicking resend sends a new verification email
 * - Verify resend button is disabled while resend request is in progress
 * - Verify loading indicator is displayed while resend request is in progress
 * - Verify success feedback is displayed after resend completes
 * - Verify resend field errors are displayed **
 * - Verify resend non-field errors are displayed **
 * -------------
 * Cancel Update
 * - Verify cancel button is displayed**
 * - Verify clicking cancel removes the verification state
 * - Verify verification message is hidden after cancellation
 * - Verify resend button is hidden after cancellation
 * - Verify cancel button is hidden after cancellation
 * - Verify update email input becomes editable again
 * - Verify update email field remains empty after cancellation
 * - Verify pending verification token is invalidated after cancellation **
 * - Verify cancel request field errors are displayed **
 * - Verify cancel request non-field errors are displayed **
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import { axiosResponse } from "../../../api/axiosDefaults";

import UpdateEmailForm from "./UpdateEmailForm";
import useAuth from "../../../hooks/useAuth";

vi.mock("../../../hooks/useAuth", () => ({
    default: vi.fn(),
}));

vi.mock("../../../api/axiosDefaults", () => ({
  axiosResponse: {
    post: vi.fn(),
  },
}));

vi.mock("@chakra-ui/react", () => ({
  HStack: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/containers/WideFormContainer", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../base/form_field/FormFieldText", () => ({
  default: ({ field, disabled, value = "", onChange, error }) => (
    <>
        <label>{field.label}</label>
        <input
            id={field.name}
            placeholder={field.placeholder}
            value={value}
            disabled={disabled}
            readOnly={disabled}
            onChangeCapture={(event) =>
                onChange?.(field.name, event.target.value)
            }
        />
        {error && <p>{error}</p>}
    </>
  ),
}));

vi.mock("../base/buttons/FormSubmitButton", () => ({
    default: ({ children, disabled, onClick }) => (
        <button
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    ),
}));

vi.mock("../base/buttons/FormSubmitButtonDanger", () => ({
    default: ({ children, disabled, onClick }) => (
        <button
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    ),
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
  default: () => (
    <div data-testid="loading-spinner">
      Loading...
    </div>
  ),
}));

vi.mock("../base/feedback/FormError", () => ({
  default: ({ children }) =>
    children ? <p>{children}</p> : null,
}));

const typeUpdateEmail = (
    value ="newemail@example.com"
) => {
    fireEvent.change(
        screen.getByPlaceholderText("Enter new email"),
        {
            target: {value},
        }
    )
}

describe("UpdateEmailForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });
  // =====================
  // Initial Render
  // =====================

  test("Rendering: Shows current email", () => {
    /**
     * Arrange:
     * - Render no user for basic functionality
     * - Render the UpdateEmailForm component.
     * Act: No additional action required.
     * Assert: Confirm current email is in the document.
     */
    useAuth.mockReturnValue({
        user: null,
    });

    render(<UpdateEmailForm />);

    expect(screen.getByText("Current Email")).toBeInTheDocument();
  });

  // =====================
  // Current email
  // =====================

  test("Current Email: displays users email if avaialable", async () => {
    /**
     * Arrange:
     * - Create a test user
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm user email is rendered inside of the form field.
     */
    useAuth.mockReturnValue({
        user: {
            email: "test@example.com"
        },
    });

    render(<UpdateEmailForm/>)

    expect(screen.getByPlaceholderText("test@example.com")).toBeInTheDocument();
  });

  test("Current Email: display fallback message input if no user found", () => {
    /**
     * Arrange:
     * - Create an empty test user
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm fallback is rendered inside of the form field.
     */

    useAuth.mockReturnValue({
        user: {
            email: null,
        }
    });

    render(<UpdateEmailForm/>)

    expect(screen.getByPlaceholderText("User email undefined, Please refresh the page")).toBeInTheDocument();
  });

  test("Current Email: display fallback message if user but no email", () => {
    /**
     * Arrange:
     * - Create a user with no email
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm fallback is rendered inside of the form field.
     */

    useAuth.mockReturnValue({
        user: {}
    });

    render(<UpdateEmailForm/>);

    expect(screen.getByPlaceholderText("User email undefined, Please refresh the page")).toBeInTheDocument();
  });

  test("Current Email: Input is disabled", () => {
    /**
     * Arrange:
     * - Create a user
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm input is disabled
     */

    useAuth.mockReturnValue({
        user: {
            email: "test@example.com"
        }
    });

    render(<UpdateEmailForm/>);

    expect(screen.getByPlaceholderText("test@example.com")).toBeDisabled();
  });

  // =====================
  // Update email
  // =====================

  test("Update Email: Update email input is displayed", () => {
    /**
     * Arrange:
     * - Create a user
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm update email input is shown
     */

    useAuth.mockReturnValue({
        user: {
            email: "test@example.com"
        }
    });

    render(<UpdateEmailForm/>);

    expect(screen.getByPlaceholderText("Enter new email")).toBeInTheDocument();
  });

  test("Update Email: updates input value when user types", async () => {
    /**
     * Arrange:
     * - Mock an authenticated user
     * - Render the UpdateEmailForm component.
     * Act: Type a new email address into the new email input.
     * Assert: Confirm the input value updates.
     */
    useAuth.mockReturnValue({
        user: {
            email: "test@example.com"
        }
    });

    render(<UpdateEmailForm/>);

    typeUpdateEmail();

    expect(
        screen.getByPlaceholderText("Enter new email")
    ).toHaveValue("newemail@example.com")
  });

  // =====================
  // Submit button
  // =====================

  test("Submit button: Is displayed", () => {
    /**
     * Arrange:
     * - Create a user
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm update email button is shown
     */

    useAuth.mockReturnValue({
        user: {
            email: "test@example.com"
        }
    });

    render(<UpdateEmailForm />);

    expect(screen.getByRole("button", {
        name: "Send verification email"
    })).toBeInTheDocument();
  });

  test("Submit button: Is disabled when update email is empty", () => {
    /**
     * Arrange:
     * - Create a user
     * - Render the UpdateEmailForm component.
     * Act: Nothing More
     * Assert: Confirm update email button is disabled when no user input
     */

    useAuth.mockReturnValue({
        user: {
            email: "test@example.com",
        }
    });

    render(<UpdateEmailForm/>);

    expect(
        screen.getByRole("button", {
            name: "Send verification email"
        })
    ).toBeDisabled();
  });

  test("Submit button: Becomes enabled when a valid email is entered", async () => {
    /**
     * Arrange:
     * - Create a user
     * - Render the UpdateEmailForm component.
     * Act: User enters new email
     * Assert: Confirm update email button is not disabled
     */
    useAuth.mockReturnValue({
        user: {
            email: "test@example.com",
        }
    });
    render(<UpdateEmailForm/>);

    typeUpdateEmail();

    expect(
        screen.getByRole("button", {
            name: "Send verification email"
        })
    ).not.toBeDisabled();

  });

  // =====================
  // Form Submission
  // =====================

    test("Form Submission: clicking submit sends the update email request", () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a new email.
         * - Click the submit button.
         * Assert:
         * - Confirm the update email request is sent with the correct data.
         */

        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: "Send verification email",
            })
        );

        expect(axiosResponse.post).toHaveBeenCalledWith(
            "/api/account/update-email/", {
                new_email: "new@example.com",
            }
        );
    });

    test("Form Submission: request is sent with the entered email address", () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a new email.
         * - Click the submit button.
         * Assert:
         * - Confirm the request contains the entered email address.
         */

        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: "Send verification email",
            })
        );

        expect(axiosResponse.post).toHaveBeenCalledWith(
            "/api/account/update-email/", {
                new_email: "new@example.com",
            }
        );
    });

    test("Form Submission: request is not sent when update email is empty", () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Click the submit button without entering an email.
         * Assert:
         * - Confirm the update email request is not sent.
         */

        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        render(<UpdateEmailForm />);

        fireEvent.click(
            screen.getByRole("button", {
                name: "Send verification email",
            })
        );

        expect(axiosResponse.post).not.toHaveBeenCalled();
    });

  // =====================
  // Loading State
  // =====================

    test("Loading State: submit button is disabled while request is in progress", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the update email request to never resolve.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a valid email.
         * - Click the submit button.
         * Assert:
         * - Confirm the submit button is disabled while the request is in progress.
         */

        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockImplementation(
            () => new Promise(() => {})
        );

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        const submitButton = screen.getByRole("button", {
            name: "Send verification email",
        });

        fireEvent.click(submitButton);

        expect(submitButton).toBeDisabled();
    });

    test("Loading State: loading spinner is displayed while request is in progress", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the update email request to never resolve.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a valid email.
         * - Click the submit button.
         * Assert:
         * - Confirm the loading spinner is displayed.
         */

        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockImplementation(
            () => new Promise(() => {})
        );

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: "Send verification email",
            })
        );

        expect(
            screen.getByTestId("loading-spinner")
        ).toBeInTheDocument();
    });


  // =====================
  // Success handling
  // =====================

    test("Success Handling: shows verification pending state when verification email is sent", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a valid new email address.
         * - Click the send verification email button.
         * Assert:
         * - Confirm the verification pending state is displayed.
         * - Confirm the resend verification link is shown.
         * - Confirm the cancel update button is shown.
         * - Confirm the verification instructions are displayed.
         */
        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: "Send verification email",
            })
        );

        expect(
            await screen.findByText("Resend Verification Link")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Cancel Update")
        ).toBeInTheDocument();

        expect(
            screen.getByText(
            "A verification link has been sent to your new email address. Please follow the instructions in email to verify and update your email."
            )
        ).toBeInTheDocument();
    });

    test("Success Handling: hides submit button and shows verification message after successful request", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock successful update email request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Type a new email.
         * - Click the submit button.
         *
         * Assert:
         * - The send verification button is removed.
         * - The verification message is displayed.
         */
        useAuth.mockReturnValue({
            user: {
            email: "user@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("newemail@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
            screen.getByText(
                /a verification link has been sent to your new email address/i
            )
            ).toBeInTheDocument();
        });

        expect(
            screen.queryByRole("button", {
            name: /send verification email/i,
            })
        ).not.toBeInTheDocument();
    });

    test("Success Handling: keeps update email value after successful submission", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         *
         * Assert:
         * - Confirm the entered email remains in the update email input.
         */
        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
            screen.getByText(
                /a verification link has been sent to your new email address/i
            )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByPlaceholderText("Enter new email")
        ).toHaveValue("new@example.com");
    });

    // =====================
    // Error Handling
    // =====================
    test("Error Handling: displays field errors", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the update email request to return a field error.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * Assert:
         * - Confirm the field error is displayed.
         */

        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockRejectedValue({
            response: {
            data: {
                new_email: ["This email address is already in use."],
            },
            },
        });

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: "Send verification email",
            })
        );

        expect(
            await screen.findByText(
            "This email address is already in use."
            )
        ).toBeInTheDocument();
    });

    test("Error Handling: displays non-field errors", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the update email request to return a non-field error.
         * - Render the UpdateEmailForm component.
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * Assert:
         * - Confirm the non-field error is displayed.
         */

        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockRejectedValue({
            response: {
            data: {
                non_field_errors: ["Email update failed."],
            },
            },
        });

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: "Send verification email",
            })
        );

        expect(
            await screen.findByText("Email update failed.")
        ).toBeInTheDocument();
    });

    // =====================
    // Pending State
    // =====================

    test("Verification Pending State: disables update email input while verification is pending", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         *
         * Assert:
         * - Confirm the update email input is disabled while waiting for verification.
         */
        useAuth.mockReturnValue({
            user: {
            email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
            name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
            screen.getByText(
                /a verification link has been sent to your new email address/i
            )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByPlaceholderText("Enter new email")
        ).toBeDisabled();
    });

    test("Verification Pending State: current email remains unchanged while verification is pending", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         *
         * Assert:
         * - Confirm the current email field still displays the user's existing email.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    /a verification link has been sent to your new email address/i
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByPlaceholderText("test@example.com")
        ).toBeInTheDocument();
    });

    // =====================
    // Resend verification
    // =====================
    test("Resend Verification: clicking resend sends a new verification email", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock successful update email requests.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the resend verification link button.
         *
         * Assert:
         * - Confirm a second update email request is sent with the same pending email.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    /a verification link has been sent to your new email address/i
                )
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /resend verification link/i,
            })
        );

        await waitFor(() => {
            expect(axiosResponse.post).toHaveBeenCalledTimes(2);
        });

        expect(axiosResponse.post).toHaveBeenLastCalledWith(
            "/api/account/update-email/",
            {
                new_email: "new@example.com",
            }
        );
    });

    test("Resend Verification: resend button is disabled while resend request is in progress", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the initial update email request to succeed.
         * - Mock the resend request to remain pending.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Submit an update email request.
         * - Click the resend verification button.
         *
         * Assert:
         * - Confirm the resend button is disabled while the resend request is in progress.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockImplementationOnce(
                () => new Promise(() => {})
            );

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    name: /resend verification link/i,
                })
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /resend verification link/i,
            })
        );

        expect(
            screen.getByRole("button", {
                name: /resending/i,
            })
        ).toBeDisabled();
    });

    test("Resend Verification: loading indicator is displayed while resend request is in progress", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the initial update email request to succeed.
         * - Mock the resend request to remain pending.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Submit an update email request.
         * - Click the resend verification button.
         *
         * Assert:
         * - Confirm the loading spinner is displayed while the resend request is in progress.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockImplementationOnce(
                () => new Promise(() => {})
            );

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByRole("button", {
                    name: /resend verification link/i,
                })
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /resend verification link/i,
            })
        );

        expect(
            screen.getByTestId("loading-spinner")
        ).toBeInTheDocument();
    });

    test("Resend Verification: success feedback is displayed after resend completes", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock the initial update email request to succeed.
         * - Mock the resend request to succeed.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Submit an update email request.
         * - Click the resend verification button.
         *
         * Assert:
         * - Confirm resend success feedback is displayed.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByText(
            /a verification link has been sent to your new email address/i
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /resend verification link/i,
            })
        );

        expect(
            await screen.findByText(
                /a new verification link has been sent/i
            )
        ).toBeInTheDocument();
    });

    // =====================
    // Cancel update
    // =====================
    test("Cancel Update: cancel button is displayed while verification is pending", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         *
         * Assert:
         * - Confirm the cancel update button is displayed.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post.mockResolvedValue({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    /a verification link has been sent to your new email address/i
                )
            ).toBeInTheDocument();
        });

        expect(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        ).toBeInTheDocument();
    });

    test("Cancel Update: clicking cancel removes the verification state", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the verification pending state is removed.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByText(
                    /a verification link has been sent to your new email address/i
                )
            ).toBeInTheDocument();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    /a verification link has been sent to your new email address/i
                )
            ).not.toBeInTheDocument();
        });
    });

    test("Cancel Update: verification message is hidden after cancellation", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the verification message is hidden.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByText(
            /a verification link has been sent to your new email address/i
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    /a verification link has been sent to your new email address/i
                )
            ).not.toBeInTheDocument();
        });
    });

    test("Cancel Update: resend button is hidden after cancellation", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the resend verification button is hidden.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByRole("button", {
            name: /resend verification link/i,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByRole("button", {
                    name: /resend verification link/i,
                })
            ).not.toBeInTheDocument();
        });
    });

    test("Cancel Update: cancel button is hidden after cancellation", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the cancel update button is hidden.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByRole("button", {
            name: /cancel update/i,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByRole("button", {
                    name: /cancel update/i,
                })
            ).not.toBeInTheDocument();
        });
    });

    test("Cancel Update: update email input becomes editable again", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the update email input is enabled again.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText("Enter new email")
            ).toBeDisabled();
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText("Enter new email")
            ).toBeEnabled();
        });
    });

    test("Cancel Update: update email field remains empty after cancellation", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the update email field is cleared after cancellation.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByRole("button", {
            name: /cancel update/i,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(
                screen.getByPlaceholderText("Enter new email")
            ).toHaveValue("");
        });
    });

    test("Cancel Update: clicking cancel sends cancel request", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock a successful cancel request.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the cancel endpoint is called.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockResolvedValueOnce({});

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByRole("button", {
            name: /cancel update/i,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        await waitFor(() => {
            expect(axiosResponse.post).toHaveBeenLastCalledWith(
                "/api/account/update-email/cancel/"
            );
        });
    });

    test("Cancel Update: displays cancel request field errors", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock the cancel request to return a field error.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the field error is displayed.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce({
                response: {
                    data: {
                        new_email: ["Unable to cancel email update."],
                    },
                },
            });

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByRole("button", {
            name: /cancel update/i,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        expect(
            await screen.findByText(
                "Unable to cancel email update."
            )
        ).toBeInTheDocument();
    });

    test("Cancel Update: displays cancel request non-field errors", async () => {
        /**
         * Arrange:
         * - Mock an authenticated user.
         * - Mock a successful update email request.
         * - Mock the cancel request to return a non-field error.
         * - Render the UpdateEmailForm component.
         *
         * Act:
         * - Enter a new email address.
         * - Click the send verification email button.
         * - Click the cancel update button.
         *
         * Assert:
         * - Confirm the non-field error is displayed.
         */
        useAuth.mockReturnValue({
            user: {
                email: "test@example.com",
            },
        });

        axiosResponse.post
            .mockResolvedValueOnce({})
            .mockRejectedValueOnce({
                response: {
                    data: {
                        non_field_errors: [
                            "Unable to cancel email update.",
                        ],
                    },
                },
            });

        render(<UpdateEmailForm />);

        typeUpdateEmail("new@example.com");

        fireEvent.click(
            screen.getByRole("button", {
                name: /send verification email/i,
            })
        );

        await screen.findByRole("button", {
            name: /cancel update/i,
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: /cancel update/i,
            })
        );

        expect(
            await screen.findByText(
                "Unable to cancel email update."
            )
        ).toBeInTheDocument();
    });
})
