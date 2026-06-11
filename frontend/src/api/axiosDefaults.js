import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

export const axiosRequest = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const axiosResponse = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosResponse.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 429) {
      window.dispatchEvent(
        new CustomEvent("api-rate-limit", {
          detail: {
            message: error.response.data?.detail,
            retryAfter: error.response.headers?.["retry-after"],
          },
        },
      ));

      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/login/") &&
      !originalRequest.url.includes("/api/auth/registration/") &&
      !originalRequest.url.includes("/api/auth/token/refresh/")
    ) {
      originalRequest._retry = true;
        await axiosRequest.post("/api/auth/token/refresh/");
        return axiosResponse(originalRequest);
    }
    return Promise.reject(error);
  }
);
