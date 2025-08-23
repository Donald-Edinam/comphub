import axios, { AxiosResponse } from 'axios';

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

interface AuthResponse {
  token: string;
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

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401 if we're not already on a public page
    if (error.response?.status === 401 && !window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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