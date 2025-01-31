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
          // Sertakan header Authorization dengan token
          const response = await api.get('/users/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setAuth({
            isAuthenticated: true,
            user: response.data,
          });
        } catch (error) {
          // Jika token tidak valid atau permintaan gagal, lakukan logout
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
      setAuth({
        isAuthenticated: true,
        user,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Agar komponen login dapat menangani error
    }
  }, []);

  const value = useMemo(() => ({ auth, login, logout }), [auth, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
