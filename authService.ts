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

// Register new user
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post("/auth/register", {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });
  return res.data;
};

// Login existing user
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post("/auth/login", {
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });
  return res.data;
};

// Get user profile (requires JWT)
export const getProfile = async (): Promise<User> => {
  const res = await api.get("/auth/profile");
  return res.data;
};

// Save auth data to localStorage
export const saveAuth = (data: AuthResponse) => {
  if (data.token) {
    localStorage.setItem("nesto_token", data.token);
  }
  if (data.user) {
    localStorage.setItem("nesto_user", JSON.stringify(data.user));
  }
};

// Logout — clear storage and redirect
export const logout = () => {
  localStorage.removeItem("nesto_token");
  localStorage.removeItem("nesto_user");
  localStorage.removeItem("lokesta_user");
};

// Get current logged in user
export const getCurrentUser = (): User | null => {
  try {
    const user = localStorage.getItem("nesto_user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Check if user is logged in
export const isLoggedIn = (): boolean => {
  const token = localStorage.getItem("nesto_token");
  if (!token) return false;
  try {
    // Check token is not expired (basic check)
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      logout();
      return false;
    }
    return true;
  } catch {
    return !!token;
  }
};
