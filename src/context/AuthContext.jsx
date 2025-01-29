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
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  const logout = useCallback(async () => {
    await logoutService();
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // Coba mendapatkan data pengguna dari token
          const response = await api.get('/users/me'); // Pastikan endpoint ini tersedia di backend
          setAuth({
            isAuthenticated: true,
            user: response.data,
          });
        } catch (error) {
          // Jika token tidak valid, logout
          logout();
        }
      }
    };
    initializeAuth();
  }, [logout]); // Tambahkan 'logout' di sini

  const login = useCallback(async (credentials) => {
    const user = await loginService(credentials);
    setAuth({
      isAuthenticated: true,
      user,
    });
  }, []);

  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
