import {createContext, useState, useEffect, useCallback } from "react";
import { axiosRequest, axiosResponse } from "../api/axiosDefaults";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        try {
            const {data} = await axiosResponse.get("/api/auth/user/");
            setUser(data);
        } catch (error) {
            if (error.response?.status === 429) {
                return;
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const register = async ( email, password1, password2) => {
        try {
            await axiosRequest.post(
                "/api/auth/registration/",
                {
                    email,
                    password1,
                    password2,
                }
            )
            return {
                success: true,
                errors: null,
            };
        } catch (error) {
            const data = error.response?.data;
            return {

                success: false,
                errors: data || {
                    non_field_errors: [
                        "Registration failed.",
                    ],
                },
            };
        }
    };

    const login = async (email, password) => {
        try {
            await axiosRequest.post(
                "/api/auth/login/",
                {
                    email,
                    password,
                }
            );

            fetchUser();

            return {
                success: true,
                errors: null,
            }
        } catch (error) {
            const data = error.response?.data
            return{
                success: false,
                errors: data || {
                    non_field_errors: ["Login failed."],
                },
            };
        }
    };

    const logout = async () => {
        try {
            await axiosRequest.post("/api/auth/logout/");

            return {
                success: true,
                errors: null,
            };
        } catch (error) {
            return {
                success: false,
                errors: error.response?.data || {
                    non_field_errors: [
                        "Logout failed.",
                    ],
                },
            };
        } finally {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <AuthContext.Provider value ={{user, loading, fetchUser, register, login, logout}}>
            { children }
        </AuthContext.Provider>
    );
};

export default AuthContext
