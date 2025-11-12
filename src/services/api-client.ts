// services/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

const API_URL = process.env.BASE_URL_API || 'http://localhost:3002/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor with better logging
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      console.log('🔍 Attempting to read token from storage...');
      
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token attached to request');
        console.log('📍 Token preview:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ No token found in AsyncStorage');
        console.warn('📍 Storage key used:', STORAGE_KEYS.AUTH_TOKEN);
      }
      
      return config;
    } catch (error) {
      console.error('❌ Error reading token from storage:', error);
      // Continue without token rather than failing
      return config;
    }
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('⚠️ 401 Unauthorized - Token might be invalid or expired');
      
      // Optional: Clear invalid token
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      
      // Optional: Trigger logout or token refresh
      // You can emit an event here to trigger logout in your auth context
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;