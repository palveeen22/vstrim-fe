// contexts/auth-context.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthService,
  LoginCredentials,
  RegisterData,
  UserProfile
} from '../services/auth-service';
import { STORAGE_KEYS } from '../constants';

type AuthResult = {
  success: boolean;
  error?: string;
  requiresProfileSetup?: boolean;
};

type UsernameCheckResult = {
  available: boolean;
  message?: string;
};

type ProfileSetupData = {
  username: string;
  mood: string;
  interests: string[];
  joinReasons: string[];
  coordinates: {
    latitude: number;
    longitude: number;
    city?: string;
    district?: string;
  };
  hangoutPlaces: Array<{
    placeName: string;
    placeType: string;
    latitude: number;
    longitude: number;
    address?: string;
  }>;
};

type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: UserProfile | null;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  updateProfile: (data: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>) => Promise<AuthResult>;
  completeProfileSetup: (data: ProfileSetupData) => Promise<AuthResult>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<AuthResult>;
  checkUsernameAvailability: (username: string) => Promise<UsernameCheckResult>;
  profileRegistration: (data: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>) => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => { },
  refreshUserProfile: async () => { },
  updateProfile: async () => ({ success: false }),
  completeProfileSetup: async () => ({ success: false }),
  changePassword: async () => ({ success: false }),
  checkUsernameAvailability: async () => ({ available: false }),
  profileRegistration: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);


  useEffect(() => {
    initializeAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = async () => {
    console.log('=== 🔍 AUTH INIT START ===');
    
    try {
      // ✅ Step 1: Check if token exists in storage
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      console.log('🔑 Token exists:', !!token);
      console.log('👤 User data exists:', !!userDataString);

      // ✅ Step 2: If no token or user data, user is not logged in
      if (!token || !userDataString) {
        console.log('⚠️ No auth session found - user not logged in');
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // ✅ Step 3: Parse user data from storage
      let userData: UserProfile;
      try {
        userData = JSON.parse(userDataString);
        console.log('✅ User data parsed:', userData.email);
      } catch (parseError) {
        console.error('❌ Failed to parse user data:', parseError);
        // Data corrupt, clear storage
        await AuthService.clearAuthData();
        setIsLoggedIn(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // ✅ Step 4: Set user as logged in with cached data FIRST
      console.log('✅ Setting user as logged in with cached data');
      setUser(userData);
      setIsLoggedIn(true);

      // ✅ Step 5: Try to refresh from server (optional, don't fail if this errors)
      try {
        console.log('🔄 Attempting to refresh profile from server...');
        const freshUserData = await AuthService.getUserProfile(userData.id);

        if (freshUserData) {
          console.log('✅ Profile refreshed from server');
          setUser(freshUserData);

          // Update storage with fresh data
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(freshUserData)
          );
        } else {
          console.log('⚠️ Server returned no data, keeping cached profile');
        }
      } catch (refreshError) {
        // ✅ IMPORTANT: Don't logout user if refresh fails!
        // Network issues shouldn't invalidate a valid session
        console.warn('⚠️ Could not refresh from server (using cached data):', refreshError);
        // User stays logged in with cached data
      }

    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      
      // ✅ Only clear auth if storage is completely broken
      // Don't clear auth just because of network issues
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          console.log('⚠️ Error occurred but token exists, keeping user logged in');
          // Keep user logged in if token exists
          return;
        }
      } catch (storageError) {
        console.error('❌ Storage access error:', storageError);
      }
      
      // Only if we truly can't access storage or no token
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('=== ✅ AUTH INIT END ===', { 
        isLoggedIn, 
        hasUser: !!user,
        userEmail: user?.email 
      });
    }
  };


  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      console.log('📤 Attempting login for:', credentials);

      const response = await AuthService.login(credentials);

      if (response.status === 'success' && response.data) {
        const { token, user: userData, refreshToken, requiresProfileSetup } = response.data;

        console.log('✅ Login API successful, saving auth data...');

        // ✅ CRITICAL: Await to ensure data is saved before proceeding
        await AuthService.saveAuthData(token, userData, refreshToken);

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
        const { token, user: userData, refreshToken } = response.data;

        console.log('✅ Registration API successful, saving auth data...');

        // ✅ CRITICAL: Await to ensure data is saved before proceeding
        await AuthService.saveAuthData(token, userData, refreshToken);

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


  const completeProfileSetup = async (data: ProfileSetupData): Promise<AuthResult> => {
    try {
      if (!user?.id) {
        console.error('❌ No user logged in');
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      console.log('📤 Completing profile setup for user:', user.id);

      const response = await AuthService.completeProfileSetup(user.id, data);

      if (response.status === 'success' && response.data?.user) {
        console.log('✅ Profile setup completed successfully');

        // Update user in state
        const updatedUser = response.data.user;
        setUser(updatedUser);

        // Update storage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(updatedUser)
        );

        return { success: true };
      } else {
        console.error('❌ Profile setup failed:', response.message);
        return {
          success: false,
          error: response.message || 'Profile setup failed'
        };
      }
    } catch (error) {
      console.error('❌ Profile setup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile setup failed due to an error'
      };
    }
  };


  const updateProfile = async (
    data: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>
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


  const profileRegistration = async (
    data: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>
  ): Promise<AuthResult> => {
    try {
      if (!user?.id) {
        console.error('❌ No user logged in');
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      console.log('📤 Profile registration for user:', user.id);

      const response = await AuthService.completeProfileSetup(user.id, data);

      if (response.status === 'success') {
        console.log('✅ Profile registration completed');

        // Refresh user profile
        await refreshUserProfile();

        return { success: true };
      } else {
        console.error('❌ Profile registration failed:', response.message);
        return {
          success: false,
          error: response.message || 'Profile registration failed'
        };
      }
    } catch (error) {
      console.error('❌ Profile registration error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile registration failed due to an error'
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
        const updatedUser = {
          ...user,
          ...freshUserData,
        };

        setUser(updatedUser);

        // ✅ Persist to AsyncStorage
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(updatedUser)
        );

        console.log('✅ Profile refreshed and saved successfully');
      } else {
        console.warn('⚠️ Failed to refresh profile: no data returned from server');
      }
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
      // Don't throw - let the app continue with cached data
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
    login,
    register,
    logout,
    refreshUserProfile,
    updateProfile,
    profileRegistration,
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