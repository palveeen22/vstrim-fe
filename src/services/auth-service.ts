import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.BASE_URL_API || 'http://localhost:3002/api';

// Types
export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  location?: string;
  image?: string;
  username?: string;
  createdAt: string;
  isVerified: boolean;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    token: string;
    user: UserProfile;
  };
}

export interface ApiError {
  status: 'error';
  message: string;
  errors?: Record<string, string[]>;
}

// Axios instance dengan interceptor
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token to every request
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@vstrim_user_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage
      await AsyncStorage.removeItem('@vstrim_user_token');
      await AsyncStorage.removeItem('@vstrim_user_profile');
    }
    return Promise.reject(error);
  }
);

export class AuthService {
  /**
   * Login with email/username and password
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Register new user
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await apiClient.get<{ status: 'success'; data: UserProfile }>(
        `/users/${userId}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(
    userId: string,
    data: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.patch<AuthResponse>(`/users/${userId}`, data);
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Change password
   */
  static async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  static async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/reset-password', {
        token,
        newPassword,
      });
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Validate username availability
   */
  static async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ available: boolean }>(
        `/auth/check-username/${username}`
      );
      return response.data.available;
    } catch (error) {
      return false;
    }
  }

  /**
   * Validate email availability
   */
  static async checkEmailAvailability(email: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ available: boolean }>(
        `/auth/check-email/${email}`
      );
      return response.data.available;
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh auth token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/refresh');
      return response.data;
    } catch (error) {
      return AuthService.handleError(error);
    }
  }

  /**
   * Logout - clear local storage
   */
  static async logout(): Promise<void> {
    try {
      // Optional: call backend to invalidate token
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage
      await AsyncStorage.removeItem('@vstrim_user_token');
      await AsyncStorage.removeItem('@vstrim_user_profile');
    }
  }

  /**
   * Error handler
   */
  private static handleError(error: unknown): AuthResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      
      if (axiosError.response?.data) {
        return {
          status: 'error',
          message: axiosError.response.data.message || 'An error occurred',
        };
      }
      
      if (axiosError.message === 'Network Error') {
        return {
          status: 'error',
          message: 'Network error. Please check your connection.',
        };
      }
    }

    return {
      status: 'error',
      message: 'An unexpected error occurred',
    };
  }
}