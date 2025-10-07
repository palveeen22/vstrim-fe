import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, LoginCredentials, RegisterData, UserProfile } from '../services/auth-service';

// Storage keys configuration
const STORAGE_KEYS = {
  AUTH_TOKEN: '@vstrim_user_token',
  USER_PROFILE: '@vstrim_user_profile',
} as const;

type AuthResult = {
  success: boolean;
  error?: string;
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
  changePassword: (oldPassword: string, newPassword: string) => Promise<AuthResult>;
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
  changePassword: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Initialize auth state when the app loads
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);

        if (token && userDataString) {
          const storedUser: UserProfile = JSON.parse(userDataString);

          // Try to refresh user data from server
          try {
            const freshUserData = await AuthService.getUserProfile(storedUser.id);

            if (freshUserData) {
              setUser(freshUserData);
              await AsyncStorage.setItem(
                STORAGE_KEYS.USER_PROFILE,
                JSON.stringify(freshUserData)
              );
            } else {
              setUser(storedUser);
            }
          } catch (refreshError) {
            console.warn('Could not refresh profile from server:', refreshError);
            setUser(storedUser);
          }

          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await AuthService.login(credentials);

      if (response.status === 'success' && response.data) {
        // Store token
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);

        // Store user profile
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PROFILE,
          JSON.stringify(response.data.user)
        );

        setUser(response.data.user);
        setIsLoggedIn(true);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed due to an error'
      };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    console.log(data);
    try {
      const response = await AuthService.register(data);

      if (response.status === 'success' && response.data) {
        // Store token
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);

        // Store user profile
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PROFILE,
          JSON.stringify(response.data.user)
        );

        setUser(response.data.user);
        setIsLoggedIn(true);

        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed due to an error'
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await AuthService.logout();

      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);

      // Reset state even if there's an error
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  /**
   * Refresh user profile from server
   */
  const refreshUserProfile = async () => {
    try {
      if (!user?.id) {
        console.warn('Cannot refresh profile: no user ID');
        return;
      }

      const freshUserData = await AuthService.getUserProfile(user.id);

      if (freshUserData) {
        setUser(freshUserData);
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_PROFILE,
          JSON.stringify(freshUserData)
        );
      }
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (
    data: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>
  ): Promise<AuthResult> => {
    try {
      if (!user?.id) {
        return {
          success: false,
          error: 'No user logged in'
        };
      }

      const response = await AuthService.updateProfile(user.id, data);

      if (response.status === 'success') {
        // Refresh user profile to get updated data
        await refreshUserProfile();
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Profile update failed'
        };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'Profile update failed due to an error'
      };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResult> => {
    try {
      const response = await AuthService.changePassword(oldPassword, newPassword);

      if (response.status === 'success') {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.message || 'Password change failed'
        };
      }
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'Password change failed due to an error'
      };
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
    changePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};