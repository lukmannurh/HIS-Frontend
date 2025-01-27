import axios from 'axios';

// Membuat instance Axios dengan baseURL yang benar
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Sesuaikan dengan URL dan port backend Anda
});

// Request interceptor untuk menambahkan Authorization header
api.interceptors.request.use(
  (config) => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    if (storedAuth && storedAuth.accessToken) {
      config.headers['Authorization'] = `Bearer ${storedAuth.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk menangani error 401 dan mencoba refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const storedAuth = JSON.parse(localStorage.getItem('auth'));
        if (storedAuth && storedAuth.refreshToken) {
          // Refresh token secara manual menggunakan endpoint refresh
          const response = await api.post('/auth/refresh', { refreshToken: storedAuth.refreshToken });
          const { accessToken } = response.data;

          // Update auth di localStorage
          const updatedAuth = { ...storedAuth, accessToken };
          localStorage.setItem('auth', JSON.stringify(updatedAuth));

          // Update header Authorization
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          // Retry request asli
          return api(originalRequest);
        }
        // Jika tidak ada refreshToken, logout user
        // Anda perlu mengimplementasikan logout secara global atau melalui EventEmitter
      } catch (err) {
        // Jika refresh token gagal, logout user
        // Anda perlu mengimplementasikan logout secara global atau melalui EventEmitter
        console.error('Refresh token gagal:', err);
        // Implementasi logout di sini (misalnya, redirect ke login)
      }
    }

    return Promise.reject(error);
  }
);

export default api;
