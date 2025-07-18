import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
// || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Token refresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Attach access token to every request
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Handle 401 responses, refresh token if needed
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        alert('Sesi Anda telah habis. Silahkan login kembali.');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await api.post('/auth/refresh', { refreshToken });
        const newAccessToken = data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        alert('Sesi Anda telah habis. Silahkan login kembali.');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

// Named service methods for reports
export const reportService = {
  getReports: () => api.get('/reports'),
  getReport: (id) => api.get(`/reports/${id}`),
  createReport: (payload) => api.post('/reports', payload),
  updateReport: (id, payload) => api.put(`/reports/${id}`, payload),
  updateReportStatus: (id, payload) =>
    api.put(`/reports/${id}/status`, payload),
  deleteReport: (id) => api.delete(`/reports/${id}`),
  autoArchive: (payload) => api.post('/reports/archive/auto', payload),
};

// Default export is axios instance for auth and generic calls
export default api;
