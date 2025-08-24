import axios, { AxiosResponse } from 'axios';

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

interface UserResponse {
  id: number;
  name: string;
  email: string;
}

interface Component {
  id: number;
  name: string;
  type?: string;
  quantity: number;
  supplier?: string;
  price?: number;
  status?: string;
  description?: string;
  image_url?: string;
  user_id: number;
  last_updated: string;
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
api.interceptors.request.use(
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

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Update stored tokens
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // Update default authorization header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        
        // Process queued requests
        processQueue(null, accessToken);
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, redirect to login
        processQueue(refreshError, null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        // Only redirect if we're not already on a public page
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => 
    api.post('/auth/signin', { email, password }),
  
  signup: (name: string, email: string, password: string): Promise<AxiosResponse<ApiResponse<UserResponse>>> => 
    api.post('/auth/signup', { name, email, password }),
  
  refresh: (refreshToken: string): Promise<AxiosResponse<ApiResponse<AuthResponse>>> => 
    api.post('/auth/refresh', { refreshToken }),
  
  logout: (refreshToken: string): Promise<AxiosResponse<ApiResponse<null>>> => 
    api.post('/auth/logout', { refreshToken }),
};

// Components API calls
export const componentsAPI = {
  getAll: (): Promise<AxiosResponse<ApiResponse<Component[]>>> => 
    api.get('/components'),
  
  getById: (id: number): Promise<AxiosResponse<ApiResponse<Component>>> => 
    api.get(`/components/${id}`),
  
  create: (formData: FormData): Promise<AxiosResponse<ApiResponse<Component>>> => 
    api.post('/components', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  update: (id: number, formData: FormData): Promise<AxiosResponse<ApiResponse<Component>>> => 
    api.put(`/components/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  delete: (id: number): Promise<AxiosResponse<ApiResponse<null>>> => 
    api.delete(`/components/${id}`),
};

export default api;