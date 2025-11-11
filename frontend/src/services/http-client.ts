import axios, { AxiosInstance } from "axios";

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

// Normalize base URL (remove trailing slash if exists)
const normalizedBaseUrl = API_CONFIG.BASE_URL.replace(/\/$/, "");

// Token management utilities
export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
  httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
  delete httpClient.defaults.headers.common["Authorization"];
};

// Create axios instance
export const httpClient: AxiosInstance = axios.create({
  baseURL: normalizedBaseUrl,
  headers: API_CONFIG.HEADERS,
});

// Initialize token if it exists
const token = getAuthToken();
if (token) {
  httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Request interceptor - ensure token is always included
httpClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type if FormData (let browser set it automatically with boundary)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle auth errors globally
httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("API Error:", error.response?.status, error.response?.data);
    console.log("Request URL:", error.config?.url);

    if (error.response?.status === 401) {
      console.log("401 Error - clearing token and redirecting to login");
      removeAuthToken();

      // Don't redirect if on certain pages (may be validation errors)
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" &&
        window.location.pathname !== "/create-event" &&
        !window.location.pathname.startsWith("/profile/")
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default httpClient;
