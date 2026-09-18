import { apiGateway } from './api';
import { AuthResponse, SignupRequest, SigninRequest, DecodedToken } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

export const authService = {
  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiGateway.post<AuthResponse>('/api/v1/user/signup', data);
    return response.data;
  },

  signin: async (data: SigninRequest): Promise<AuthResponse> => {
    const response = await apiGateway.post<AuthResponse>('/api/v1/user/signin', data);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.data.token);
      const decoded = authService.decodeToken(response.data.data.token);
      if (decoded) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(decoded));
      }
    }
    return response.data;
  },

  signout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getToken: (): string | null => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  getCurrentUser: (): DecodedToken | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  },

  decodeToken: (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;

    const decoded = authService.decodeToken(token);
    if (!decoded) return false;

    // Check if token is expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  },

  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.role === 'admin';
  },
};
