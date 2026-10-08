// src/service/authService.ts
import { authApiClient } from './authApi';
import type { AuthUser, LoginCredentials } from '../types';

interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      isActive: boolean;
      role: {
        code: string;
        name: string;
      };
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      expiresIn: number;
      refreshExpiresIn: number;
    };
  };
  timestamp: string;
  path: string;
  requestId: string;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthUser> => {
    const response = await authApiClient.post<AuthResponse>(
      '/api/v1/auth/login',
      credentials
    );

    const { user, tokens } = response.data.data;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.code.toLowerCase() as AuthUser['role'],
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  refresh: async (refreshToken: string): Promise<AuthUser> => {
    const response = await authApiClient.post<AuthResponse>(
      '/api/v1/auth/refresh',
      { refreshToken }
    );

    const { user, tokens } = response.data.data;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.code.toLowerCase() as AuthUser['role'],
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  },

  logout: async (refreshToken: string): Promise<void> => {
    await authApiClient.post('/api/v1/auth/logout', {
      refreshToken,
    });
  },
};

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}