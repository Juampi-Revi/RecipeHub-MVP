import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Function to detect backend port dynamically
const detectBackendPort = async (): Promise<string> => {
  // First try environment variable
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Try common ports for backend
  const commonPorts = [3001, 3002, 3003, 3004, 3005, 8000, 8001, 8080];
  
  for (const port of commonPorts) {
    try {
      const testUrl = `http://localhost:${port}/api/health`;
      const response = await axios.get(testUrl, { timeout: 2000 });
      if (response.status === 200) {
        return `http://localhost:${port}/api`;
      }
    } catch {
      // Port not available, continue to next
      continue;
    }
  }
  
  // Fallback to default
  console.warn('⚠️ Backend port not detected, using default 3001');
  return 'http://localhost:3001/api';
};

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private baseURL: string = '';

  constructor() {
    // Initialize with temporary URL, will be updated after detection
    this.client = axios.create({
      baseURL: 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
    this.initializeBaseURL();
  }

  private async initializeBaseURL(): Promise<void> {
    try {
      this.baseURL = await detectBackendPort();
      this.client.defaults.baseURL = this.baseURL;
    } catch {
      // Silently fall back to default URL
    }
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle errors and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as RetryableAxiosRequestConfig;

        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            if (this.accessToken) {
              originalRequest.headers.Authorization = `Bearer ${this.accessToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Clear auth locally and redirect
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      const responseData = error.response.data as Record<string, unknown>;
      return {
        message: typeof responseData?.message === 'string' ? responseData.message : 'An error occurred',
        status: error.response.status,
        code: typeof responseData?.code === 'string' ? responseData.code : undefined,
        details: responseData?.details,
      };
    }

    if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    }

    return {
      message: error.message || 'An unexpected error occurred',
      status: 0,
      code: 'UNKNOWN_ERROR',
    };
  }

  private loadTokenFromStorage(): void {
    this.accessToken = localStorage.getItem('accessToken');
  }

  private saveTokenToStorage(token: string): void {
    this.accessToken = token;
    localStorage.setItem('accessToken', token);
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.client.post('/auth/refresh', {
      refreshToken,
    });
    
    // Extract tokens from the nested response structure
    const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;
    
    // Save new tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);
  }

  public setAuthTokens(accessToken: string, refreshToken: string): void {
    this.saveTokenToStorage(accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public clearAuth(): void {
    this.accessToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  // HTTP Methods
  public async get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  }

  public async post<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.post<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  public async put<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.put<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  public async patch<T>(url: string, data?: unknown): Promise<T> {
    const response = await this.client.patch<ApiResponse<T>>(url, data);
    return response.data.data;
  }

  public async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete<ApiResponse<T>>(url);
    return response.data.data;
  }
}

export const apiClient = new ApiClient();
export default apiClient;