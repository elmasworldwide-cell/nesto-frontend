import React, { createContext, useState, useEffect } from 'react';
import { 
  loginUser, 
  logout as serviceLogout, 
  registerUser, 
  getCurrentUser,
  saveAuth
} from '../services/authService';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginUser({ email, password });
    saveAuth(res);
    setUser(res.user);
    return res;
  };

  const logout = () => {
    serviceLogout();
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await registerUser({ name, email, password });
    saveAuth(res);
    setUser(res.user);
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};