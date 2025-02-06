import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

import api from '../services/api';
import {
  login as loginService,
  logout as logoutService,
} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Coba ambil data user dari localStorage (jika disimpan)
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? { isAuthenticated: true, user: JSON.parse(storedUser) }
      : { isAuthenticated: false, user: null };
  });

  const logout = useCallback(async () => {
    await logoutService();
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAuth({ isAuthenticated: false, user: null });
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          const response = await api.get('/users/me');
          setAuth({ isAuthenticated: true, user: response.data });
          localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
          console.error('Invalid token or failed to fetch user data:', error);
          logout();
        }
      }
    };
    initializeAuth();
  }, [logout]);

  const login = useCallback(async (credentials) => {
    try {
      const user = await loginService(credentials);
      setAuth({ isAuthenticated: true, user });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const value = useMemo(
    () => ({ auth, login, logout, setAuth }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
