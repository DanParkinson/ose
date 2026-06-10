/**
 * AUTH CONTEXT TEST CHECKLIST
 * ---------------------------
 * Inital Provider State
 * - Verify AuthProvider renders its children
 * - Verify AuthProvider provides auth state
 * ---------------------------
 * Authenticating users - Fetch User
 * - Verify AuthProvider requests the current user when it mounts
 * - Verify AuthProvider keeps fetchUser stable between renders
 * - Verify AuthProvider stores user state on success
 * - Verify AuthProvider sets user to null on request failure
 * - Verify fetchUser keeps user logged in on 429 response.
 * ---------------------------
 * Feedback - Loading
 * - Verify Loading state start as true
 * - Verify Loading state on successful fetch
 * - Verify loading becomes false on failed fetch
 * ---------------------------
 * Manual User Refetch
 * - Verify fetchUser is exposed to consumers
 * - Verify fetchUser requests current user
 * ---------------------------
 * Register User
 * - Verify register is exposed to consumers
 * - Verify register sends email and passwords to the API
 * - Verify successful registration returns success: true
 * - Verify successful registration returns errors: null
 * - Verify failed registration returns success: false
 * - Verify failed registration returns API errors
 * - Verify failed registration returns default error when no response data exists
 * ---------------------------
 * Login
 * - Verify login exposed to consumer
 * - Verify login sends email and password to the API
 * - Verify successful login calls fetchUser
 * - Verify successful login returns success: true
 * - Verify successful login returns errors: null
 * - Verify failed login returns success: false
 * - Verify failed login returns API errors
 * - Verify failed login returns default error message with no response data
 * ---------------------------
 * Logout
 * - Verify logout is exposed to consumers
 * - Verify logout requests the logout endpoint
 * - Verify successful logout clears the current user
 * - Verify successful logout returns success: true
 * - Verify successful logout returns errors: null
 * - Verify failed logout returns success: false
 * - Verify failed logout returns API errors
 * - Verify failed logout returns default error message when no response data exists
 * - Verify failed logout still clears the current user
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup, fireEvent, } from "@testing-library/react"
import "@testing-library/jest-dom/vitest"
import { useContext, useState } from "react";

import AuthContext, { AuthProvider } from "./AuthContext";
import { axiosResponse, axiosRequest } from "../api/axiosDefaults";

beforeEach(() => {
    vi.clearAllMocks();

    axiosResponse.get.mockResolvedValue({
        data:null,
    });
});

afterEach(() => {
  cleanup();
});

vi.mock("../api/axiosDefaults", () => ({
    axiosResponse: {
        get: vi.fn(),
    },

    axiosRequest: {
        post: vi.fn(),
    },
}));

const TestConsumer = () => {
    const auth = useContext(AuthContext)

    return (
        <>
            <p>User: {auth.user === null ? "No user" : "User found"}</p>
            <p>Loading: {auth.loading ? "Loading" : "Not loading"}</p>
            <p>fetchUser: {typeof auth.fetchUser === "function" ? "Exists" : "Missing"} </p>
            <p>Register: {typeof auth.register === "function" ? "Exists" : "Missing"} </p>
            <p>Login: {typeof auth.login === "function" ? "Exists" : "Missing"} </p>
            <p>Logout: {typeof auth.logout === "function" ? "Exists" : "Missing"} </p>
        </>
    );
};

const RefetchConsumer = () => {
    const auth = useContext(AuthContext)

    return (
        <>
            <button onClick={auth.fetchUser}>
                Refetch User
            </button>

            <p>User: {auth.user ? auth.user.email : "None"}</p>
        </>

    );
};

const RegisterConsumer = () => {
    const auth = useContext(AuthContext);
    const [result, setResult] = useState(null)

    const handleRegsiter = async () => {
        const response = await auth.register(
            "test@example.com",
            "password123",
            "password123"
        );

        setResult(response)
    }

    return(
        <>
            <button onClick={handleRegsiter}>
                Register
            </button>

            {result && (
                <>
                    <p>Success: {result?.success ? "True" : "False"}</p>
                    <p>Errors: {result?.errors ? "Set" : "None"}</p>
                    <p>Non Field Errors:{" "} {result?.errors?.non_field_errors?.[0] || "None"}</p>
                </>
            )}

        </>
    );
};

const LoginConsumer = () => {
    const auth = useContext(AuthContext);
    const [result, setResult] = useState(null)

    const handleLogin = async () => {
        const response = await auth.login(
            "test@example.com",
            "password123",
        );

        setResult(response)
    };

    return(
        <>
            <button onClick={handleLogin}>
                Login
            </button>

            {result && (
                <>
                    <p>Success: {result?.success ? "True" : "False"}</p>
                    <p>Errors: {result?.errors ? "Set" : "None"}</p>
                    <p>Non Field Errors:{" "} {result?.errors?.non_field_errors?.[0] || "None"}</p>
                </>
            )}
        </>
    );
};

const LogoutConsumer = () => {
    const auth = useContext(AuthContext);
    const [result, setResult] = useState(null);

    const handleLogout = async () => {
        const response = await auth.logout();

        setResult(response);
    };

    return (
        <>
            <button onClick={handleLogout}>
                Logout
            </button>

            <p>User: {auth.user ? auth.user.email : "None"}</p>

            {result && (
                <>
                    <p>Success: {result?.success ? "True" : "False"}</p>
                    <p>Errors: {result?.errors ? "Set" : "None"}</p>
                    <p>
                        Non Field Errors:{" "}
                        {result?.errors?.non_field_errors?.[0] || "None"}
                    </p>
                </>
            )}
        </>
    );
};

describe("AuthProvider", () => {
    test("AuthProvider renders its children", () => {
        /**
         * Arrange: Render AuthProvider with child content.
         * Act: No additional action required.
         * Assert: Confirm the child content is rendered.
         */
        render(
            <AuthProvider>
                <p>App Content</p>
            </AuthProvider>
        );

        expect(
            screen.getByText("App Content")
        ).toBeInTheDocument();
    });

    test("AuthProvider Provides auth state to children", () => {
        /**
         * Arrange: Render AuthProvider with test consumer
         * Act: Read the AuthContext values.
         * Assert: Confirm default user is null
         */

        render(
            <AuthProvider>
                <TestConsumer/>
            </AuthProvider>
        );

        expect(screen.getByText("User: No user")).toBeInTheDocument();
    });

    // =====================
    // Authenticating users - Fetch User
    // =====================

    test("AuthProvider requests current user on mount", async () => {
        /**
         * Arrange: Render AuthProvider with test consumer
         * Act: AuthProvider mounts
         * Assert: Confirm the current user endpoint is requested
         */

        axiosResponse.get.mockResolvedValue({
            data: {
                id: 1,
                email: "test@example.com"
            },
        });

        render(
            <AuthProvider>
                <TestConsumer/>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(axiosResponse.get).toHaveBeenCalledWith(
                "/api/auth/user/"
            );
        });
    });

    test("AuthProvider keeps fetchUser stable between renders", async () => {
        /**
         * Arrange: Render AuthProvider with a consumer that records fetchUser.
         * Act: Let AuthProvider update after fetching the user.
         * Assert: Confirm fetchUser is the same function before and after re-render.
         */

        const fetchUserReferences = [];

        const ReferenceConsumer = () => {
            const auth = useContext(AuthContext);

            fetchUserReferences.push(auth.fetchUser);

            return <p>Reference Consumer</p>;
        };

        axiosResponse.get.mockResolvedValue({
            data: {
            id: 1,
            email: "test@example.com",
            },
        });

        render(
            <AuthProvider>
                <ReferenceConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(fetchUserReferences.length).toBeGreaterThan(1);
        });

        expect(fetchUserReferences[0]).toBe(fetchUserReferences[1]);
    });

    test("AuthProvider stores user state on 200", async () => {
        /**
         * Arrange: Mock a successful current user response.
         * Act: Render AuthProvider with test consumer.
         * Assert: Confirm the current user  is set on 200
         */

        axiosResponse.get.mockResolvedValue({
            data: {
                id: 1,
                email: "test@example.com"
            },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(await screen.findByText("User: User found")).toBeInTheDocument();
    });

    test("AuthProvider sets user to null on request failure", async () => {
        /**
         * Arrange: Mock a failed current user response.
         * Act: Render AuthProvider with test consumer.
         * Assert: Confirm the current user is set to null
         */

        axiosResponse.get.mockRejectedValue(
            new Error("Request failed")
        );

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect( await screen.findByText("User: No user")).toBeInTheDocument();
    });

    test("fetchUser: keeps user logged in on 429 response", async () => {
        /**
         * Arrange:
         *  - Mock first fetUser with logged in user
         *  - Mock second fetchUser with 429 response
         *  - Render AuthProvider with refetchConsumer.
         * Act: click the refetch user button
         * Assert: Current user remains logged in after 429 response
         */

        axiosResponse.get.mockResolvedValueOnce({
            data: {
                email: "test@example.com"
            }
        }).mockRejectedValueOnce({
            response: {
                status: 429
            },
        });

        render(
            <AuthProvider>
                <RefetchConsumer />
            </AuthProvider>
        );

        expect( await screen.findByText("User: test@example.com")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Refetch User"
            })
        );

        await waitFor(() => {
            expect(axiosResponse.get).toHaveBeenCalledTimes(2);
        })

        expect( await screen.findByText("User: test@example.com")).toBeInTheDocument();
    })

    // =====================
    // Feedback - Loading
    // =====================
    test("AuthProvider provides loading state to children and starts as true", () => {
        /**
         * Arrange: Render AuthProvider
         * Act: Read AuthContext values
         * Assert: Confirm loading is set to true
         */

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(screen.getByText("Loading: Loading")).toBeInTheDocument();
    });

    test("AuthProvider sets loading to false on succesful request", async () => {
        /**
         * Arrange: Mock succesful request
         * Act: render authprovider
         * Assert: confirm loading set to false
         */

        axiosResponse.get.mockResolvedValue({
            data: {
                id: 1,
                email: "test@example.com"
            },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(await screen.findByText("Loading: Not loading")).toBeInTheDocument();
    });

    test("AuthProvider sets loading to false on failed request", async () => {
        /**
         * Arrange: Mock failed request error
         * Act: render authprovider
         * Assert: confirm loading set to false
         */

        axiosResponse.get.mockRejectedValue(
            new Error("Request failed.")
        );

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect( await screen.findByText("Loading: Not loading")).toBeInTheDocument();
    });

    // =====================
    // Manual User refetch
    // =====================
    test("fetchUser: exposed to consumers", () => {
        /**
         * Arrange: Render AuthProvider and consumer
         * Act: nothing
         * Assert: confirm consumer has access to usefetch
         */
        render(
            <AuthProvider>
                <TestConsumer/>
            </AuthProvider>
        );

        expect( screen.getByText("fetchUser: Exists")).toBeInTheDocument();
    });

    test("fetchUser: requests current user when called", async () => {
        /**
         * Arrange: Mock successful response, Render AuthProvider with refetch consumer
         * Act: Click the button
         * Assert: expect axiosResponse to be called twice (on  mount and on click)
         */

        axiosResponse.get.mockResolvedValue({
            data: {
                id: 1,
                email: "test@example.com"
            },
        });

        render(
            <AuthProvider>
                <RefetchConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(axiosResponse.get).toHaveBeenCalledTimes(1);
        });

        fireEvent.click(
            screen.getByRole("button", {
                name: "Refetch User",
            })
        );

        await waitFor(() => {
            expect(axiosResponse.get).toHaveBeenCalledTimes(2)
        });

        expect(axiosResponse.get).toHaveBeenNthCalledWith(
            2,
            "/api/auth/user/"
        );
    });
    // =====================
    // Register
    // =====================
    test("Registration: exposed to consumers", () => {
        /**
         * Arrange: Render AuthProvider with test consumer
         * Act: Nothing
         * Assert: test register button is present
         */

        render(
            <AuthProvider>
                <TestConsumer/>
            </AuthProvider>
        );

        expect( screen.getByText("Register: Exists")).toBeInTheDocument();
    });

    test("Registration: sends email and passwords to the API", async () => {
        /**
         * Arrange:
         * - Mock successful register request
         * - Render AuthProvider with RegisterConsumer
         * Act: trigger registerUser with email and passwords
         * Assert: Confirm API call is made with the correct data.
         */

        axiosRequest.post.mockResolvedValue({
            status: 201,
        });

        render(
            <AuthProvider>
                <RegisterConsumer />
            </AuthProvider>
        );

        fireEvent.click(
            screen.getByRole( "button", {
                name: "Register",
            })
        );

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
    });

    test("Registration: successful registration returns 'success: true'", async () => {
        /**
         * Arrange:
         * - Mock successful register request
         * - Render AuthProvider with RegisterConsumer
         * Act: trigger registerUser with email and passwords
         * Assert: Confirm 'success: true' is returned
         */

        axiosRequest.post.mockResolvedValue({
            status: 201
        });

        render(
            <AuthProvider>
                <RegisterConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Success:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Register",
            })
        );

        expect( await screen.findByText("Success: True")).toBeInTheDocument();
    });

    test("Registration: successful registration returns 'errors:null'", async () => {
        /**
         * Arrange:
         * - Mock successful register request
         * - Render AuthProvider with RegisterConsumer
         * Act: trigger registerUser with email and passwords
         * Assert: Confirm 'errors:null' is returned
         */

        axiosRequest.post.mockResolvedValue({
            status: 201
        });

        render(
            <AuthProvider>
                <RegisterConsumer/>
            </AuthProvider>
        );

        expect(screen.queryByText(/Errors:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Register"
            }),
        );

        expect( await screen.findByText("Errors: None")).toBeInTheDocument();
    });

    test("Registration: failed registration returns 'success: false'", async() => {
        /**
         * Arrange:
         * - Mock failed register request
         * - Render AuthProvider with RegisterConsumer
         * Act: trigger registerUser
         * Assert: Confirm 'success: false' is returned
         */
        axiosRequest.post.mockRejectedValue(
            new Error("Registration failed")
        );

        render(
            <AuthProvider>
                <RegisterConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Success:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Register"
            })
        );

        expect (await screen.findByText("Success: False")).toBeInTheDocument();
    });

    test("Registration: failed registration returns api errors", async () => {
        /**
         * Arrange:
         * - Mock failed register request with API repsonse data
         * - Render AuthProvider with RegisterConsumer
         * Act: trigger registerUser with incorrect email and passwords
         * Assert: Confirm api error is returned
         */

        axiosRequest.post.mockRejectedValue({
            response: {
                data: {
                    email: ["This email is already registered."],
                },
            },
        });

        render(
            <AuthProvider>
                <RegisterConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Errors:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Register"
            })
        );

        expect( await screen.findByText("Errors: Set")).toBeInTheDocument();
    });

    test("Registration: failed registration returns default error message with no response data", async () => {
        /**
         * Arrange:
         * - Mock failed register request with no API response data
         * - Render AuthProvider with RegisterConsumer
         * Act: trigger registerUser with incorrect email and passwords
         * Assert: Confirm backup error message is displayed
         */
        axiosRequest.post.mockRejectedValue(
            new Error("Registration failed")
        );
        render(
            <AuthProvider>
                <RegisterConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Non Field Errors:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Register",
            })
        );

        expect( await screen.findByText("Non Field Errors: Registration failed.")).toBeInTheDocument();
    });

    // =====================
    // Login
    // =====================

    test("Login: exposed to consumer", () => {
        /**
         * Arrange:
         * - Render AuthProvider and TestConsumer
         * Act: Nothing
         * Assert: Confirm exposed to children
         */

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect( screen.getByText("Login: Exists")).toBeInTheDocument();
    });

    test("Login: send email and password to the API", ()=> {
        /**
         * Arrange:
         * - Mock succesfult response
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert: api called once with correct information
         */
        axiosRequest.post.mockResolvedValue({
            status: 200
        });

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect(axiosRequest.post).toHaveBeenCalledTimes(1);

        expect(axiosRequest.post).toHaveBeenCalledWith(
            "/api/auth/login/",
            {
                email: "test@example.com",
                password: "password123",
            }
        )
    });

    test("Login: successful request calls fetchUser", async () => {
        /**
         * Arrange:
         * - Mock succesful login response
         * - Mock successfull fetchUser repsonse
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert: User api is called on mount and on click
         */

        axiosRequest.post.mockResolvedValue({
            status: 200
        });

        axiosResponse.get.mockResolvedValue({
            email: "test@example.com",
            password: "password123"
        });

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        fireEvent.click(
            screen.getByRole("button",{
                name: "Login"
            })
        );

        await waitFor(() => {
            expect(axiosResponse.get).toHaveBeenCalledTimes(2)
        });
    });

    test("Login: Success returns 'success: true", async () => {
        /**
         * Arrange:
         * - Mock succesful login response
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert: Login consumer returns success true
         */

        axiosRequest.post.mockResolvedValue({
            status: 200
        });

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Success:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect(await screen.findByText("Success: True")).toBeInTheDocument();
    });

    test("Login: Success return 'errors: none'", async () => {
        /**
         * Arrange:
         * - Mock succesful login response
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert: Login consumer returns errors: none
         */

        axiosRequest.post.mockResolvedValue({
            status: 201
        });

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Errors:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect( await screen.findByText("Errors: None")).toBeInTheDocument();
    });

    test("Login: Failed request returns 'success: false'", async () => {
        /**
         * Arrange:
         * - Mock failed login response
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert:
         * - Success is initially not displayed
         * - Login consumer displays Success: False after the failed request
         */
        axiosRequest.post.mockRejectedValue(
            new Error("Login failed")
        );

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Success:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect( await screen.findByText("Success: False")).toBeInTheDocument();
    });

    test("Login: failed request returns api errors", async () => {
        /**
         * Arrange:
         * - Mock failed login response
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert:
         * - Errors is initially not displayed
         * - Login consumer displays Errors: Set after the failed request
         */

        axiosRequest.post.mockRejectedValue({
            response: {
                data: {
                    error: ["Can't authenticate with provided credentials."],
                },
            },
        });

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Errors:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect( await screen.findByText("Errors: Set")).toBeInTheDocument();
    });

    test("Login: failed login returns default error message with no response data", async () => {
        /**
         * Arrange:
         * - Mock failed login response
         * - render AuthProvider with LoginConsumer
         * Act: click login button
         * Assert:
         * - Errors is initially not displayed
         * - Login consumer displays Non field errors after the failed request
         */

        axiosRequest.post.mockRejectedValue(
            new Error("Login failed.")
        );

        render(
            <AuthProvider>
                <LoginConsumer />
            </AuthProvider>
        );

        expect(screen.queryByText(/Non Field Errors:/)).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Login"
            })
        );

        expect( await screen.findByText("Non Field Errors: Login failed.")).toBeInTheDocument();
    });


    // =====================
    // Logout
    // =====================
    test("Logout: exposed to consumer", () => {
        /**
         * Arrange:
         * - render AuthProvider with testConsumer
         * Act: nothing
         * Assert: Logout exists in consumer
         */

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect( screen.getByText("Logout: Exists")).toBeInTheDocument();
    });

    test("Logout: requests the logout endpoint", () => {
        /**
         * Arrange:
         * - mock axios request
         * - render AuthProvider with logoutConsumer
         * Act: click logout button
         * Assert: api call to logout
         */

        axiosRequest.post.mockResolvedValue({
            status: 200,
        });

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout"
            })
        );

        expect(axiosRequest.post).toHaveBeenCalledWith(
            "/api/auth/logout/",
        )
    });

    test("Logout: successful logout clears the current user", async() => {
        /**
         * Arrange:
         * - mock logged in user
         * - render AuthProvider with logoutConsumer
         * Act: click logout button
         * Assert: setUser becomes null
         */

        axiosResponse.get.mockResolvedValue({
            data: {
                email: "test@example.com"
            }
        });

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        expect(await screen.findByText("User: test@example.com")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout"
            })
        );

        expect(await screen.findByText("User: None")).toBeInTheDocument();
    });

    test("Logout: successful request returns success: true", async () => {
        /**
         * Arrange:
         * - Mock successful logout request
         * - Render AuthProvider with LogoutConsumer
         * Act:
         * - Click logout button
         * Assert:
         * - Logout returns success: true
         */

        axiosRequest.post.mockResolvedValue({
            status: 200,
        });

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        expect(
            screen.queryByText(/Success:/)
        ).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout",
            })
        );

        expect(
            await screen.findByText("Success: True")
        ).toBeInTheDocument();
    });

    test("Logout: failed request returns success: false", async () => {
        /**
         * Arrange:
         * - Mock failed logout request
         * - Render AuthProvider with LogoutConsumer
         * Act:
         * - Click logout button
         * Assert:
         * - Logout returns success: false
         */

        axiosRequest.post.mockRejectedValue(
            new Error("Logout failed")
        );

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        expect(
            screen.queryByText(/Success:/)
        ).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout",
            })
        );

        expect(
            await screen.findByText("Success: False")
        ).toBeInTheDocument();
    });

    test("Logout: failed request returns API errors", async () => {
        /**
         * Arrange:
         * - Mock failed logout request with API response data
         * - Render AuthProvider with LogoutConsumer
         * Act:
         * - Click logout button
         * Assert:
         * - Logout returns API errors
         */

        axiosRequest.post.mockRejectedValue({
            response: {
                data: {
                    non_field_errors: [
                        "Logout failed.",
                    ],
                },
            },
        });

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        expect(
            screen.queryByText(/Errors:/)
        ).not.toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout",
            })
        );

        expect(
            await screen.findByText("Errors: Set")
        ).toBeInTheDocument();

        expect(
            await screen.findByText(
                "Non Field Errors: Logout failed."
            )
        ).toBeInTheDocument();
    });

    test("Logout: failed request returns default error message with no response data", async () => {
        /**
         * Arrange:
         * - Mock failed logout request with no API response data
         * - Render AuthProvider with LogoutResultConsumer
         * Act:
         * - Click logout button
         * Assert:
         * - Default error message is returned
         */

        axiosRequest.post.mockRejectedValue(
            new Error("Logout failed")
        );

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout",
            })
        );

        expect(await screen.findByText("Non Field Errors: Logout failed.")).toBeInTheDocument();
    });

    test("Logout: clears the current user even if the request fails", async () => {
        /**
         * Arrange:
         * - Mock logged in user
         * - Mock failed logout request
         * - Render AuthProvider with LogoutConsumer
         * Act:
         * - Click logout button
         * Assert:
         * - User is cleared even when logout request fails
         */

        axiosResponse.get.mockResolvedValue({
            data: {
                email: "test@example.com",
            },
        });

        axiosRequest.post.mockRejectedValue(
            new Error("Logout failed")
        );

        render(
            <AuthProvider>
                <LogoutConsumer />
            </AuthProvider>
        );

        expect(await screen.findByText("User: test@example.com")).toBeInTheDocument();

        fireEvent.click(
            screen.getByRole("button", {
                name: "Logout",
            })
        );

        expect(await screen.findByText("User: None")).toBeInTheDocument();
    });
});
