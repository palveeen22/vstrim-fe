import apiClient from './api-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosError } from 'axios';
import { STORAGE_KEYS } from '../constants';

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface DailyQuiz {
  createdAt: Date;
  id: string;
  isCompleted: boolean;
  userId: string;
}

interface UserComunity {
  createdAt: Date;
  description: string;
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  tokens?: number;
  email: string;
  username: string;
  bio?: string | null;
  dateOfBirth?: Date | null;
  image?: string | null;
  joinReasons?: string[];
  isVerified?: boolean;
  onboardingCompleted?: boolean;
  createdAt?: Date;
  dailyQuizzes: DailyQuiz[];
  communities: {
    comunity: UserComunity[]
  }
}

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    accessToken: string;
    refreshToken?: string;
    user: UserProfile;
    requiresProfileSetup?: boolean;
  };
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
}

export interface UpdateProfileData {
  username?: string;
  bio?: string;
  dateOfBirth?: Date;
  image?: string;
  joinReasons?: string[];
}

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 AuthService: Attempting login...');
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      console.log('✅ AuthService: Login successful');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Login failed');
      return AuthService.handleError(error);
    }
  }

  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 AuthService: Attempting registration...');
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      console.log('✅ AuthService: Registration successful');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Registration failed');
      return AuthService.handleError(error);
    }
  }

  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      console.log('👤 AuthService: Fetching user profile for:', userId);
      const response = await apiClient.get<ApiResponse<UserProfile>>(
        `/users/profile/${userId}`
      );

      if (response.data.status === 'success' && response.data.data) {
        console.log('✅ AuthService: User profile fetched successfully');
        return response.data.data;
      }

      console.warn('⚠️ AuthService: No user data in response');
      return null;
    } catch (error) {
      console.error('❌ AuthService: Error fetching user profile:', error);

      // If it's a 401/403, the token might be invalid
      if (error instanceof AxiosError) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn('⚠️ AuthService: Unauthorized - token might be invalid');
        }
      }

      return null;
    }
  }

  static async updateProfile(
    userId: string,
    data: any
  ): Promise<AuthResponse> {
    try {
      console.log('📝 AuthService: Updating profile for user:', userId);
      const response = await apiClient.patch<AuthResponse>(
        `/users/${userId}`,
        data
      );
      console.log('✅ AuthService: Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Profile update failed');
      return AuthService.handleError(error);
    }
  }

  static async completeProfileSetup(
    userId: string,
    data: any
  ): Promise<AuthResponse> {
    try {
      console.log('📝 Completing profile setup for user:', userId);
      const response = await apiClient.patch<AuthResponse>(
        `/users/${userId}/profile-setup`,
        data
      );
      console.log('✅ Profile setup request successful');
      return response.data;
    } catch (error) {
      console.error('❌ Profile setup request failed', error);
      return AuthService.handleError(error);
    }
  }

  static async checkUsernameAvailability(username: string): Promise<{
    available: boolean;
    message?: string;
  }> {
    try {
      console.log('🔍 AuthService: Checking username availability:', username);
      const response = await apiClient.get<ApiResponse<{ available: boolean }>>(
        `/auth/check-username/${username}`
      );

      if (response.data.status === 'success' && response.data.data) {
        console.log('✅ AuthService: Username check complete');
        return {
          available: response.data.data.available,
          message: response.data.message
        };
      }

      return { available: false, message: 'Unable to verify username' };

    } catch (error) {
      if (error instanceof AxiosError) {
        // Some backends return 404 for available usernames
        if (error.response?.status === 404) {
          console.log('✅ AuthService: Username available (404)');
          return { available: true };
        }

        console.error('❌ AuthService: Username check failed');
        return {
          available: false,
          message: error.response?.data?.message || 'Unable to check username'
        };
      }

      console.error('❌ AuthService: Network error during username check');
      return { available: false, message: 'Network error occurred' };
    }
  }

  static async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      console.log('🔒 AuthService: Changing password...');
      const response = await apiClient.post<AuthResponse>(
        '/auth/change-password',
        { oldPassword, newPassword }
      );
      console.log('✅ AuthService: Password changed successfully');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Password change failed');
      return AuthService.handleError(error);
    }
  }

  static async requestPasswordReset(email: string): Promise<AuthResponse> {
    try {
      console.log('📧 AuthService: Requesting password reset for:', email);
      const response = await apiClient.post<AuthResponse>(
        '/auth/forgot-password',
        { email }
      );
      console.log('✅ AuthService: Password reset email sent');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Password reset request failed');
      return AuthService.handleError(error);
    }
  }


  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<AuthResponse> {
    try {
      console.log('🔑 AuthService: Resetting password with token...');
      const response = await apiClient.post<AuthResponse>(
        '/auth/reset-password',
        { token, newPassword }
      );
      console.log('✅ AuthService: Password reset successful');
      return response.data;
    } catch (error) {
      console.error('❌ AuthService: Password reset failed');
      return AuthService.handleError(error);
    }
  }

  static async refreshToken(): Promise<AuthResponse> {
    try {
      console.log('🔄 AuthService: Attempting to refresh token...');
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      console.log(refreshToken);

      if (!refreshToken) {
        console.warn('⚠️ AuthService: No refresh token found in storage');
        return { status: 'error', message: 'No refresh token available' };
      }

      // Call backend refresh endpoint
      const response = await apiClient.post<AuthResponse>('/auth/refresh', {
        refreshToken,
      });

      const { status, data } = response.data;

      if (status === 'success' && data?.accessToken) {
        console.log('✅ AuthService: Token refreshed successfully');

        // Save the new access token
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.accessToken);

        // Optionally, if backend sends new refresh token → update it too
        if (data.refreshToken) {
          await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }

        return {
          status: 'success',
          message: 'Token refreshed successfully',
          data,
        };
      }

      console.warn('⚠️ AuthService: Refresh endpoint did not return a new token');
      return { status: 'error', message: 'Failed to refresh token' };
    } catch (error) {
      console.error('❌ AuthService: Token refresh failed:', error);
      return AuthService.handleError(error);
    }
  }

  static async logout(): Promise<void> {
    try {
      console.log('👋 AuthService: Logging out...');

      await AuthService.clearAuthData();

      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (userData) {
        const user = JSON.parse(userData);
        const quizCompletionKey = `@quiz_completion_${user.id}`;
        await AsyncStorage.removeItem(quizCompletionKey);
        console.log(`🧹 Quiz completion data cleared for user ${user.id}`);
      }

      console.log('✅ AuthService: Logout complete');
    } catch (error) {
      console.error('❌ AuthService: Logout error (clearing data anyway):', error);

      // Force clear even if something fails
      try {
        await AuthService.clearAuthData();
      } catch (clearError) {
        console.error('❌ AuthService: Critical - failed to clear auth data:', clearError);
      }
    }
  }


  static async clearAuthData(): Promise<void> {
    try {
      console.log('🧹 AuthService: Clearing auth data...');

      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA),
      ]);

      console.log('✅ AuthService: Auth data cleared successfully');
    } catch (error) {
      console.error('❌ AuthService: Error clearing auth data:', error);
      throw error; // Re-throw so caller knows it failed
    }
  }

  static async saveAuthData(
    token: string,
    user: UserProfile,
    refreshToken?: string
  ): Promise<void> {
    try {
      console.log('💾 AuthService.saveAuthData called with:', {
        token,
        refreshToken,
        userId: user?.id,
        userEmail: user?.email,
      });

      // Validate input
      if (!token || token.trim() === '') {
        throw new Error('Access token is required');
      }
      if (!user || !user.id) {
        throw new Error('Valid user object is required');
      }

      // Save access token and user data
      const saveOps = [
        AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
        AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user)),
      ];

      // Save refresh token if provided
      if (refreshToken && refreshToken.trim() !== '') {
        saveOps.push(AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken));
      } else {
        console.warn('⚠️ No refresh token provided; skipping save.');
      }

      await Promise.all(saveOps);
      console.log('✅ AuthService: Auth data saved to AsyncStorage');

      // Verify saved data
      const [savedToken, savedUser, savedRefreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      if (!savedToken || !savedUser) {
        console.error('❌ AuthService: Failed to verify saved token or user data!');
        throw new Error('Failed to verify saved auth data');
      }

      console.log('🔍 Verification successful:', {
        tokenSaved: !!savedToken,
        userSaved: !!savedUser,
        refreshTokenSaved: !!savedRefreshToken,
      });
    } catch (error) {
      console.error('❌ AuthService: Error saving auth data:', error);
      throw error; // Re-throw so caller knows save failed
    }
  }

  static async verifyAuthDataSaved(): Promise<{
    success: boolean;
    details: {
      hasToken: boolean;
      hasUser: boolean;
      hasRefreshToken: boolean;
    };
  }> {
    try {
      const [token, userData, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      const details = {
        hasToken: !!token,
        hasUser: !!userData,
        hasRefreshToken: !!refreshToken,
      };

      const success = details.hasToken && details.hasUser;

      if (!success) {
        console.warn('⚠️ AuthService: Verification failed:', details);
      }

      return { success, details };
    } catch (error) {
      console.error('❌ AuthService: Error verifying auth data:', error);
      return {
        success: false,
        details: {
          hasToken: false,
          hasUser: false,
          hasRefreshToken: false,
        }
      };
    }
  }

  static async getAuthData(): Promise<{
    token: string | null;
    user: UserProfile | null;
    refreshToken: string | null;
  }> {
    try {
      console.log('📖 AuthService: Reading auth data from storage...');

      const [token, userData, refreshToken] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.USER_DATA),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      ]);

      let user: UserProfile | null = null;

      if (userData) {
        try {
          user = JSON.parse(userData);
          console.log('✅ AuthService: User data parsed successfully');
        } catch (parseError) {
          console.error('❌ AuthService: Failed to parse user data:', parseError);
          // Clear corrupt data
          await AuthService.clearAuthData();
        }
      }

      console.log('📊 AuthService: Auth data retrieved:', {
        hasToken: !!token,
        hasUser: !!user,
        hasRefreshToken: !!refreshToken,
        userId: user?.id,
        userEmail: user?.email
      });

      return { token, user, refreshToken };
    } catch (error) {
      console.error('❌ AuthService: Error getting auth data:', error);
      return { token: null, user: null, refreshToken: null };
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const { token, user } = await AuthService.getAuthData();
      const isAuth = !!(token && user?.id);
      console.log('🔐 AuthService: Authentication status:', isAuth);
      return isAuth;
    } catch (error) {
      console.error('❌ AuthService: Error checking auth status:', error);
      return false;
    }
  }

  private static handleError(error: unknown): AuthResponse {
    if (error instanceof AxiosError) {
      // Network error
      if (error.message === 'Network Error') {
        console.error('🌐 Network error - no internet connection');
        return {
          status: 'error',
          message: 'No internet connection. Please check your network.',
        };
      }

      // Timeout
      if (error.code === 'ECONNABORTED') {
        console.error('⏱️ Request timeout');
        return {
          status: 'error',
          message: 'Request timeout. Please try again.',
        };
      }

      // Server response error
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        const errorMessage = errorData?.message || 'An error occurred';

        console.error(`❌ API Error ${status}:`, errorMessage);

        // Handle specific status codes
        switch (status) {
          case 400:
            return {
              status: 'error',
              message: errorMessage || 'Invalid request. Please check your input.',
            };
          case 401:
            return {
              status: 'error',
              message: 'Invalid credentials. Please try again.',
            };
          case 403:
            return {
              status: 'error',
              message: 'Access denied.',
            };
          case 404:
            return {
              status: 'error',
              message: 'Resource not found.',
            };
          case 409:
            return {
              status: 'error',
              message: errorMessage || 'A conflict occurred.',
            };
          case 422:
            return {
              status: 'error',
              message: errorMessage || 'Validation failed.',
            };
          case 500:
          case 502:
          case 503:
            return {
              status: 'error',
              message: 'Server error. Please try again later.',
            };
          default:
            return {
              status: 'error',
              message: errorMessage,
            };
        }
      }

      // Request made but no response
      console.error('❌ No response from server');
      return {
        status: 'error',
        message: 'No response from server. Please try again.',
      };
    }

    // Unknown error
    console.error('❌ Unexpected error:', error);
    return {
      status: 'error',
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}