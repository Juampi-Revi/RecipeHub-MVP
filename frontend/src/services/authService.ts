import { apiClient } from './api';
import type { User, LoginRequest, CreateUserRequest } from '../types';

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface BackendAuthResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>('/auth/login', credentials);

    apiClient.setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);

    return {
      user: response.user,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
    };
  }

  async register(userData: CreateUserRequest): Promise<AuthResponse> {
    const response = await apiClient.post<BackendAuthResponse>('/auth/register', userData);

    apiClient.setAuthTokens(response.tokens.accessToken, response.tokens.refreshToken);

    return {
      user: response.user,
      accessToken: response.tokens.accessToken,
      refreshToken: response.tokens.refreshToken,
    };
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });

    apiClient.setAuthTokens(response.accessToken, refreshToken);
    
    return response;
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.warn('Logout request failed, but clearing local tokens:', error);
    } finally {
      apiClient.clearAuth();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/profile');
    return response.user;
  }

  async getStatistics(): Promise<{ totalRecipes: number; totalComments: number; totalLikes: number; totalFollowers: number; totalFollowing: number }> {
    const response = await apiClient.get<{ statistics: { totalRecipes: number; totalComments: number; totalLikes: number; totalFollowers: number; totalFollowing: number } }>('/auth/statistics');
    return response.statistics;
  }



  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const authService = new AuthService();
export default authService;