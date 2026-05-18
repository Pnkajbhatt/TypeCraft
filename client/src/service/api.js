import axios from "axios";

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error statuses
      switch (error.response.status) {
        case 401:
          // Token expired or invalid: Redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
          break;
        case 403:
          console.error("Access forbidden:", error.response.data.error);
          break;
        case 404:
          console.error("Resource not found:", error.response.data.error);
          break;
        case 500:
          console.error("Server error:", error.response.data.error);
          break;
        default:
          console.error("Error:", error.response.data);
      }
    } else if (error.request) {
      // Network error
      console.error("Network error - no response received");
    } else {
      // Other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
