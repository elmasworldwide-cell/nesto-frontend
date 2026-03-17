import api from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Register
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

// Login
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// Get profile
export const getProfile = async (): Promise<User> => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Save auth data to localStorage
export const saveAuth = (data: AuthResponse) => {
  localStorage.setItem("nesto_token", data.token);
  localStorage.setItem("nesto_user", JSON.stringify(data.user));
};

// Logout
export const logout = () => {
  localStorage.removeItem("nesto_token");
  localStorage.removeItem("nesto_user");
  window.location.href = "/login";
};

// Get current user
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("nesto_user");
  return user ? JSON.parse(user) : null;
};

// Check if logged in
export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem("nesto_token");
};
