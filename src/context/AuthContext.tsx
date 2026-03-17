import React, { createContext, useState, useEffect } from 'react';
import { login as serviceLogin, logout as serviceLogout, register as serviceRegister, getCurrentUser } from '../services/authService';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
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

  const login = (email: string, password: string) =>
    serviceLogin({ email, password }).then((res) => {
      setUser(res.data.user);
      return res;
    });

  const logout = () =>
    serviceLogout().then(() => {
      setUser(null);
    });

  const register = (name: string, email: string, password: string) =>
    serviceRegister({ name, email, password }).then((res) => {
      setUser(res.data.user);
      return res;
    });

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
