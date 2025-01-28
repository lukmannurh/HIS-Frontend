import React, { createContext, useState, useEffect } from 'react';
import { login as loginService, logout as logoutService } from '../services/authService';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
  });

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // Coba mendapatkan data pengguna dari token
          const response = await api.get('/users/me'); // Endpoint ini harus Anda tambahkan di backend
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
  }, []);

  const login = async (credentials) => {
    const user = await loginService(credentials);
    setAuth({
      isAuthenticated: true,
      user,
    });
  };

  const logout = async () => {
    await logoutService();
    setAuth({
      isAuthenticated: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
