import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../../constants';
import { AuthService } from '../../features/auth';

const API_URL = process.env.BASE_URL_API || 'http://localhost:3002/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean } | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn('⚠️ 401 Unauthorized detected, attempting token refresh...');

      const refreshResult = await AuthService.refreshToken();

      if (refreshResult.status === 'success' && refreshResult.data?.accessToken) {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, refreshResult.data.accessToken);

        // Update header and retry
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshResult.data.accessToken}`;

        return apiClient(originalRequest);
      } else {
        console.error('❌ Token refresh failed, clearing auth data...');
        await AuthService.clearAuthData();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
