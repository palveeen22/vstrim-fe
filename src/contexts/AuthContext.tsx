import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthService,
  LoginCredentials,
  RegisterData,
} from '../features/auth';
import { STORAGE_KEYS } from '../constants';
import { User } from '../shared/types';

type AuthResult = {
  success: boolean;
  error?: string;
  requiresProfileSetup?: boolean;
};

type UsernameCheckResult = {
  available: boolean;
  message?: string;
};

export interface AuthResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    accessToken: string;
    refreshToken?: string;
    user: User;
    requiresProfileSetup?: boolean;
  };
}

type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<any | null | undefined>;
  updateProfile: (data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => Promise<AuthResult>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<AuthResult>;
  checkUsernameAvailability: (username: string) => Promise<UsernameCheckResult>;
  completeProfileSetup: (data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  setUser: () => { },
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => { },
  refreshUserProfile: async () => { },
  updateProfile: async () => ({ success: false }),
  changePassword: async () => ({ success: false }),
  checkUsernameAvailability: async () => ({ available: false }),
  completeProfileSetup: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);


  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    console.log('=== 🔍 AUTH INIT START ===');

    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (!token && refreshToken) {
        // ✅ Jika ada refresh token tapi token access habis
        console.log('🔄 Refresh token found, attempting to refresh access token...');
        const refreshResponse = await AuthService.refreshToken();

        if (refreshResponse.status === 'success' && refreshResponse.data?.accessToken) {
          console.log('✅ Token refreshed on init');
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResponse.data.accessToken);
        } else {
          console.warn('⚠️ Failed to refresh token, clearing auth data');
          await AuthService.clearAuthData();
          setIsLoggedIn(false);
          setUser(null);
          setIsLoading(false);
          return;
        }
      }

      if (!userDataString) {
        console.log('⚠️ No user data found, user not logged in');
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      const userData: User = JSON.parse(userDataString);
      setUser(userData);
      setIsLoggedIn(true);

      // Optional: refresh profile from server
      const freshUserData = await AuthService.getUserProfile(userData.id);
      if (freshUserData) {
        setUser(freshUserData);
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(freshUserData));
      }

    } catch (error) {
      console.error('❌ AUTH INIT ERROR', error);
      await AuthService.clearAuthData();
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };


  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      console.log('📤 Attempting login for:', credentials);

      const response = await AuthService.login(credentials);

      console.log(response);

      if (response.status === 'success' && response.data) {
        const { accessToken, user: userData, refreshToken, requiresProfileSetup } = response.data;

        console.log('✅ Login API successful, saving auth data...');

        // ✅ CRITICAL: Await to ensure data is saved before proceeding
        await AuthService.saveAuthData(accessToken, userData, refreshToken);

        // ✅ Verify data was actually saved
        const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        console.log('🔍 Verification - Token saved:', !!savedToken);
        console.log('🔍 Verification - User saved:', !!savedUser);

        if (!savedToken || !savedUser) {
          console.error('❌ Failed to save auth data to storage!');
          return {
            success: false,
            error: 'Failed to save login session'
          };
        }

        // ✅ Update state
        setUser(userData);
        setIsLoggedIn(true);

        console.log('✅ Login completed successfully');
        console.log('📍 Requires profile setup:', requiresProfileSetup);

        return {
          success: true,
          requiresProfileSetup
        };
      } else {
        console.error('❌ Login failed:', response.message);
        return {
          success: false,
          error: response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed due to an error'
      };
    }
  };


  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      console.log('📤 Attempting registration for:', data.email);

      const response = await AuthService.register(data);

      if (response.status === 'success' && response.data) {
        const { accessToken, user: userData, refreshToken } = response.data;

        console.log('✅ Registration API successful, saving auth data...');

        // ✅ CRITICAL: Await to ensure data is saved before proceeding
        await AuthService.saveAuthData(accessToken, userData, refreshToken);

        // ✅ Verify data was actually saved
        const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        console.log('🔍 Verification - Token saved:', !!savedToken);
        console.log('🔍 Verification - User saved:', !!savedUser);

        if (!savedToken || !savedUser) {
          console.error('❌ Failed to save auth data to storage!');
          return {
            success: false,
            error: 'Failed to save registration session'
          };
        }

        // ✅ Update state
        setUser(userData);
        setIsLoggedIn(true);

        console.log('✅ Registration completed successfully');

        return {
          success: true,
          requiresProfileSetup: true // New users always need profile setup
        };
      } else {
        console.error('❌ Registration failed:', response.message);
        return {
          success: false,
          error: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed due to an error'
      };
    }
  };

  const completeProfileSetup = async (
    data: any
  ): Promise<AuthResult> => {
    if (!user?.id) {
      console.error('❌ No user logged in');
      return { success: false, error: 'No user logged in' };
    }

    console.log('📤 Completing profile registration for user:', user.id);

    try {
      const response = await AuthService.completeProfileSetup(user.id, data);

      console.log('📦 Complete profile response:', response);

      if (response.status === 'success') {
        console.log('✅ Profile registration completed');

        // ✅ Update langsung dari response
        if (response.data) {
          console.log('📦 User data from response:', response.data);

          // ✅ Set user langsung
          setUser(response.data);

          // ✅ Save to AsyncStorage
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(response.data)
          );

          console.log('✅ User state updated:', {
            isVerified: response.data.user.isVerified,
            onboardingCompleted: response.data.user.verificationCompleted,
          });

          return { success: true };
        } else {
          console.error('❌ No data in response');
          return { success: false, error: 'No user data returned' };
        }
      } else {
        console.error('❌ Profile registration failed:', response.message);
        return { success: false, error: response.message || 'Profile registration failed' };
      }
    } catch (error) {
      console.error('❌ Profile registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error'
      };
    }
  };
  const updateProfile = async (
    data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
  ): Promise<AuthResult> => {
    try {
      if (!user?.id) {
        console.error('❌ No user logged in');
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      console.log('📤 Updating profile for user:', user.id);

      const response = await AuthService.updateProfile(user.id, data);

      if (response.status === 'success') {
        console.log('✅ Profile updated successfully');

        // Refresh user profile
        await refreshUserProfile();

        return { success: true };
      } else {
        console.error('❌ Profile update failed:', response.message);
        return {
          success: false,
          error: response.message || 'Profile update failed'
        };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed due to an error'
      };
    }
  };

  const refreshUserProfile = async () => {
    try {
      if (!user?.id) {
        console.warn('⚠️ Cannot refresh profile: no user ID');
        return;
      }

      console.log('🔄 Refreshing profile for user:', user.id);

      const freshUserData = await AuthService.getUserProfile(user.id);

      if (freshUserData) {
        console.log('📦 Fresh data from server:', freshUserData);

        // ✅ Replace completely - trust backend as source of truth
        setUser(freshUserData);

        // ✅ Persist to AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(freshUserData)
        );

        console.log('✅ Profile refreshed and saved successfully');

        return freshUserData;
      } else {
        console.warn('⚠️ Failed to refresh profile: no data returned from server');
        return null;
      }
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
      return null;
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResult> => {
    try {
      console.log('📤 Attempting to change password...');

      const response = await AuthService.changePassword(oldPassword, newPassword);

      if (response.status === 'success') {
        console.log('✅ Password changed successfully');
        return { success: true };
      } else {
        console.error('❌ Password change failed:', response.message);
        return {
          success: false,
          error: response.message || 'Password change failed'
        };
      }
    } catch (error) {
      console.error('❌ Password change error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password change failed due to an error'
      };
    }
  };

  const checkUsernameAvailability = async (
    username: string
  ): Promise<UsernameCheckResult> => {
    try {
      // Client-side validation first (fast feedback)
      if (!username || username.length < 3) {
        return {
          available: false,
          message: 'Username must be at least 3 characters'
        };
      }

      if (username.length > 20) {
        return {
          available: false,
          message: 'Username must be at most 20 characters'
        };
      }

      // Check for invalid characters
      const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!validUsernameRegex.test(username)) {
        return {
          available: false,
          message: 'Username can only contain letters, numbers, and underscores'
        };
      }

      // Check availability with backend
      console.log('🔍 Checking username availability:', username);
      const result = await AuthService.checkUsernameAvailability(username);

      return result;
    } catch (error) {
      console.error('❌ Username check error:', error);
      return {
        available: false,
        message: 'Unable to verify username availability'
      };
    }
  };

  const logout = async () => {
    try {
      console.log('📤 Logging out user...');

      // Clear from server/backend
      await AuthService.logout();

      // Clear local state
      setIsLoggedIn(false);
      setUser(null);

      console.log('✅ Logout completed successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);

      // ✅ IMPORTANT: Reset state even if server logout fails
      // This ensures user is logged out locally
      setIsLoggedIn(false);
      setUser(null);

      console.log('⚠️ Logged out locally despite error');
    }
  };


  const contextValue: AuthContextType = {
    isLoading,
    isLoggedIn,
    user,
    setUser,
    login,
    register,
    logout,
    refreshUserProfile,
    updateProfile,
    completeProfileSetup,
    changePassword,
    checkUsernameAvailability,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};