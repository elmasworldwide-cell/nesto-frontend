import { useState, useEffect } from 'react';
import { login as serviceLogin, logout as serviceLogout, getCurrentUser } from '../services/authService';

export const useAuth = () => {
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

  const logout = () => serviceLogout().then(() => setUser(null));

  return { user, loading, login, logout };
};
