import React, { createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthService, LoginCredentials, RegisterData } from '../../features/auth';
import { STORAGE_KEYS } from '../../shared/config';
import { User } from '../../shared/types';
import { useAppDispatch, useAppSelector } from '../store';
import { setUser, setLoggedIn, setLoading, clearAuth } from '../store/authSlice';
import { useEffect } from 'react';

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
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<User | null | undefined>;
  updateProfile: (data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => Promise<AuthResult>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<AuthResult>;
  checkUsernameAvailability: (username: string) => Promise<UsernameCheckResult>;
  completeProfileSetup: (data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>) => Promise<AuthResult>;
};

const AuthActionsContext = createContext<AuthContextType>({
  setUser: () => {},
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  refreshUserProfile: async () => undefined,
  updateProfile: async () => ({ success: false }),
  changePassword: async () => ({ success: false }),
  checkUsernameAvailability: async () => ({ available: false }),
  completeProfileSetup: async () => ({ success: false }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      const userDataString = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (!token && refreshToken) {
        const refreshResponse = await AuthService.refreshToken();
        if (refreshResponse.status === 'success' && refreshResponse.data?.accessToken) {
          await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResponse.data.accessToken);
        } else {
          await AuthService.clearAuthData();
          dispatch(clearAuth());
          return;
        }
      }

      if (!userDataString) {
        dispatch(clearAuth());
        return;
      }

      const userData: User = JSON.parse(userDataString);
      dispatch(setUser(userData));
      dispatch(setLoggedIn(true));

      const freshUserData = await AuthService.getUserProfile(userData.id);
      if (freshUserData) {
        dispatch(setUser(freshUserData));
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(freshUserData));
      }
    } catch (error) {
      await AuthService.clearAuthData();
      dispatch(clearAuth());
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    try {
      const response = await AuthService.login(credentials);

      if (response.status === 'success' && response.data) {
        const { accessToken, user: userData, refreshToken, requiresProfileSetup } = response.data;

        await AuthService.saveAuthData(accessToken, userData, refreshToken);

        const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (!savedToken || !savedUser) {
          return { success: false, error: 'Failed to save login session' };
        }

        dispatch(setUser(userData));
        dispatch(setLoggedIn(true));

        return { success: true, requiresProfileSetup };
      }

      return { success: false, error: response.message || 'Login failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed due to an error',
      };
    }
  };

  const register = async (data: RegisterData): Promise<AuthResult> => {
    try {
      const response = await AuthService.register(data);

      if (response.status === 'success' && response.data) {
        const { accessToken, user: userData, refreshToken } = response.data;

        await AuthService.saveAuthData(accessToken, userData, refreshToken);

        const savedToken = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const savedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

        if (!savedToken || !savedUser) {
          return { success: false, error: 'Failed to save registration session' };
        }

        dispatch(setUser(userData));
        dispatch(setLoggedIn(true));

        return { success: true, requiresProfileSetup: true };
      }

      return { success: false, error: response.message || 'Registration failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed due to an error',
      };
    }
  };

  const completeProfileSetup = async (data: any): Promise<AuthResult> => {
    if (!user?.id) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const response = await AuthService.completeProfileSetup(user.id, data);

      if (response.status === 'success') {
        if (response.data) {
          dispatch(setUser(response.data as unknown as User));
          await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
          return { success: true };
        }
        return { success: false, error: 'No user data returned' };
      }

      return { success: false, error: response.message || 'Profile setup failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unexpected error',
      };
    }
  };

  const updateProfile = async (
    data: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
  ): Promise<AuthResult> => {
    if (!user?.id) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const response = await AuthService.updateProfile(user.id, data);

      if (response.status === 'success') {
        await refreshUserProfile();
        return { success: true };
      }

      return { success: false, error: response.message || 'Profile update failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Profile update failed due to an error',
      };
    }
  };

  const refreshUserProfile = async () => {
    if (!user?.id) return undefined;

    try {
      const freshUserData = await AuthService.getUserProfile(user.id);
      if (freshUserData) {
        dispatch(setUser(freshUserData));
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(freshUserData));
        return freshUserData;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const changePassword = async (
    oldPassword: string,
    newPassword: string
  ): Promise<AuthResult> => {
    try {
      const response = await AuthService.changePassword(oldPassword, newPassword);
      if (response.status === 'success') {
        return { success: true };
      }
      return { success: false, error: response.message || 'Password change failed' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Password change failed due to an error',
      };
    }
  };

  const checkUsernameAvailability = async (
    username: string
  ): Promise<UsernameCheckResult> => {
    if (!username || username.length < 3) {
      return { available: false, message: 'Username must be at least 3 characters' };
    }
    if (username.length > 20) {
      return { available: false, message: 'Username must be at most 20 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { available: false, message: 'Username can only contain letters, numbers, and underscores' };
    }

    try {
      return await AuthService.checkUsernameAvailability(username);
    } catch (error) {
      return { available: false, message: 'Unable to verify username availability' };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
    } finally {
      dispatch(clearAuth());
    }
  };

  const setUserAction: React.Dispatch<React.SetStateAction<User | null>> = (value) => {
    const next = typeof value === 'function' ? value(user) : value;
    dispatch(setUser(next));
  };

  return (
    <AuthActionsContext.Provider
      value={{
        setUser: setUserAction,
        login,
        register,
        logout,
        refreshUserProfile,
        updateProfile,
        completeProfileSetup,
        changePassword,
        checkUsernameAvailability,
      }}
    >
      {children}
    </AuthActionsContext.Provider>
  );
};

/**
 * useAuth — returns Redux-backed state + action functions from context.
 * State (user, isLoggedIn, isLoading) comes from Redux store.
 * Actions (login, logout, etc.) come from AuthProvider context.
 */
export const useAuth = () => {
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  const actions = useContext(AuthActionsContext);
  return { user, isLoggedIn, isLoading, ...actions };
};
