import axios from "axios";

const BASE_URL = "https://nesto-backend-production-623a.up.railway.app/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000, // 15 seconds timeout
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nesto_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — clear and redirect to login
      localStorage.removeItem("nesto_token");
      localStorage.removeItem("nesto_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
