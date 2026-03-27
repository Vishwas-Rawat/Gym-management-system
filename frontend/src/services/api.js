// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8085'; // Trainer Panel & Exercise Service (Default)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to setup interceptors
const setupInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('Session expired or unauthorized. Logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole'); // Ensure all auth data is cleared
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// Apply interceptors to default instance
setupInterceptors(api);

// User Service API (Port 8083) - Admin, User CRUD, Gym Management
export const userApi = axios.create({
  baseURL: 'http://localhost:8083',
  headers: { 'Content-Type': 'application/json' },
});
setupInterceptors(userApi);

// Attendance API (Port 8085)
// Attendance API (via Proxy)
export const attendanceApi = axios.create({
  baseURL: '', // Relies on Vite proxy pointing /attendance -> 8085
  headers: { 'Content-Type': 'application/json' },
});
setupInterceptors(attendanceApi);

// Chat API (Port 8085)
export const chatApi = axios.create({
  baseURL: 'http://localhost:8085',
  headers: { 'Content-Type': 'application/json' },
});
setupInterceptors(chatApi);

// Diet API (Port 8085)
export const dietApi = axios.create({
  baseURL: 'http://localhost:8085',
  headers: { 'Content-Type': 'application/json' },
});
setupInterceptors(dietApi);

// Trainer Dashboard API (Port 8085)
export const trainerDashboardApi = axios.create({
  baseURL: 'http://localhost:8085',
  headers: { 'Content-Type': 'application/json' },
});
setupInterceptors(trainerDashboardApi);

// Member Activity API (Port 8085) - For Dashboard, Logs, etc.
export const memberActivityApi = axios.create({
  baseURL: 'http://localhost:8085',
  headers: { 'Content-Type': 'application/json' },
});
setupInterceptors(memberActivityApi);

export default api;