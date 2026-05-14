import {
  createContext,
  useEffect,
  useState,
} from "react";

import { axiosRequest } from "../api/axiosDefaults";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await axiosRequest.get("/api/auth/user/");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      await axiosRequest.post("/api/auth/login/", {
        email,
        password,
      });

      await fetchUser();

      return {
        success: true,
        errors: null,
      };
    } catch (error) {
      const data = error.response?.data;

      return {
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
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data || error
      );
    } finally {
      setUser(null);
    }
  };

  const register = async (
    email,
    password1,
    password2
  ) => {
    try {
      await axiosRequest.post(
        "/api/auth/registration/",
        {
          email,
          password1,
          password2,
        }
      );

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

  const changePassword = async (
    oldPassword,
    newPassword1,
    newPassword2
  ) => {
    try {
      await axiosRequest.post(
        "/api/auth/password/change/",
        {
          old_password: oldPassword,
          new_password1: newPassword1,
          new_password2: newPassword2,
        }
      );

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
            "Password change failed.",
          ],
        },
      };
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        register,
        changePassword,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
