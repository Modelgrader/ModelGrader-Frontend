import axios from "axios";

// Create axios instance with base URL from environment
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Request interceptor to automatically add authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear it from localStorage
            localStorage.removeItem('token');
            // Optionally redirect to login page
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;