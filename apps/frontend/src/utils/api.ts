import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// It's good practice to also handle responses, e.g., for 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // For example, redirect to login or clear user data
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('privileges');
      // window.location.href = '/login'; // This can be handled in a component
    }
    return Promise.reject(error);
  }
);
