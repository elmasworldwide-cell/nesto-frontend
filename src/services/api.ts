import axios from "axios";

const api = axios.create({
  baseURL: "https://lokesta-backend-production-623a.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lokesta_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 — token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("lokesta_token");
      localStorage.removeItem("lokesta_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
