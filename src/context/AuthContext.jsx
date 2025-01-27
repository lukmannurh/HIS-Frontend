import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api'; // Import instance Axios yang dikonfigurasi
import jwt_decode from 'jwt-decode'; // Default import

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
  });

  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    if (storedAuth && storedAuth.accessToken) {
      try {
        const decoded = jwt_decode(storedAuth.accessToken);
        const currentTime = Date.now() / 1000;

        if (decoded.exp > currentTime) {
          setAuth(storedAuth);
          api.defaults.headers.common['Authorization'] = `Bearer ${storedAuth.accessToken}`;
        } else {
          // Token expired, handle refresh token jika tersedia
          logout();
        }
      } catch (error) {
        console.error('Token decoding failed:', error);
        logout();
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      console.log('Attempting to login with:', { username, password });
      const response = await api.post('/auth/login', { username, password }); // Gunakan instance Axios yang dikonfigurasi
      console.log('Login response:', response.data);

      const { accessToken, refreshToken, user } = response.data;

      const newAuth = { isAuthenticated: true, user, accessToken, refreshToken };
      setAuth(newAuth);
      localStorage.setItem('auth', JSON.stringify(newAuth));
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setAuth({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null });
    localStorage.removeItem('auth');
    delete api.defaults.headers.common['Authorization'];
  };

  const refreshAccessToken = async () => {
    try {
      console.log('Attempting to refresh access token');
      const storedAuth = JSON.parse(localStorage.getItem('auth'));
      if (storedAuth && storedAuth.refreshToken) {
        const response = await api.post('/auth/refresh', { refreshToken: storedAuth.refreshToken }); // Gunakan instance Axios yang dikonfigurasi
        const { accessToken } = response.data;
        const updatedAuth = { ...storedAuth, accessToken };
        setAuth(updatedAuth);
        localStorage.setItem('auth', JSON.stringify(updatedAuth));
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return accessToken;
      }
      // Jika tidak ada refreshToken, logout user
      logout();
    } catch (error) {
      console.error('Refresh token error:', error);
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
