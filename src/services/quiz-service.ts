import axios, { InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

const API_URL = process.env.BASE_URL_API || 'http://localhost:3002/api';

export interface QuizQuestion {
  id: string;
  title: string;
  description: string;
  type: 'single' | 'multiple';
  options: QuizOption[];
  createdAt?: Date;
}

export interface QuizOption {
  id: string;
  label: string;
  icon: string;
  questionId: string;
}

interface QuizCompletionStatus {
  isCompleted: boolean;
  completedAt: string | null;
  dailyQuizId: string | null;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface DailyQuizResponse {
  questions: QuizQuestion[];
  refreshAt: Date;
  expiresAt: Date;
}

export interface ApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: DailyQuizResponse;
}

export interface SubmitQuizPayload {
  answers: {
    questionId: string;
    selectedOptions: string[];
  }[];
}


export interface SubmitQuizResponse {
  status: 'success' | 'error';
  message?: string;
  data?: {
    // score: number;
    // totalQuestions: number;
    // matches?: any[];
    // isCompleted? : boolean;
    isCompleted: boolean;
    dailyQuizId: string;
    totalQuestions: number;
    answeredQuestions: number;
    completedAt: Date;
    message: string;
  };
}

// Axios instance with interceptor
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Bearer token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // ✅ Gunakan konstanta TOKEN_KEY yang sama
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

      if (token) {
        // Add Bearer token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token added to request:', token.substring(0, 20) + '...'); // Log sebagian token untuk debugging
      } else {
        console.warn('⚠️ No token found in storage');
      }

      return config;
    } catch (error) {
      console.error('❌ Error reading token from storage:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export class QuizService {
  /**
   * Fetch daily quiz questions
   */
  static async fetchDailyQuiz(): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>('/daily-quiz');
      console.log('📊 Quiz data received:', response.data);
      return response.data;
    } catch (error) {
      return QuizService.handleError(error);
    }
  }

   static async checkTodayCompletion(): Promise<QuizCompletionStatus> {
    try {
      const response = await apiClient.get('/daily-quiz/completion');
      return response.data;
    } catch (error) {
      console.error('Check completion error:', error);
      throw error;
    }
  }

  /**
   * Submit quiz answers
   */
  static async submitQuiz(payload: SubmitQuizPayload): Promise<SubmitQuizResponse> {
    try {
      const response = await apiClient.post<SubmitQuizResponse>(
        '/daily-quiz/submit',
        payload
      );
      return response.data;
    } catch (error) {
      return QuizService.handleError(error) as SubmitQuizResponse;
    }
  }

  /**
   * Force refresh daily quiz (admin only)
   */
  static async forceRefreshQuiz(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/daily-quiz/refresh-quiz');
      return response.data;
    } catch (error) {
      return QuizService.handleError(error);
    }
  }

  /**
   * Handle API errors consistently
   */
  private static handleError(error: unknown): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as any;

      // Network error
      if (axiosError.message === 'Network Error') {
        return {
          status: 'error',
          message: 'Network error. Please check your connection.',
        };
      }

      // Timeout error
      if (axiosError.code === 'ECONNABORTED') {
        return {
          status: 'error',
          message: 'Request timeout. Please try again.',
        };
      }

      // Server responded with error
      if (axiosError.response?.data) {
        const errorMessage = axiosError.response.data.message || 'An error occurred';

        // Handle specific status codes
        switch (axiosError.response.status) {
          case 401:
            return {
              status: 'error',
              message: 'Authentication required. Please login again.',
            };
          case 403:
            return {
              status: 'error',
              message: 'Access denied. You do not have permission.',
            };
          case 404:
            return {
              status: 'error',
              message: 'Quiz not found. Please try again later.',
            };
          case 429:
            return {
              status: 'error',
              message: 'Too many requests. Please wait a moment.',
            };
          case 500:
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
    }

    return {
      status: 'error',
      message: 'An unexpected error occurred',
    };
  }

  /**
   * Set authentication token manually (useful for testing)
   */
  static async setAuthToken(token: string): Promise<void> {
    // ✅ Gunakan konstanta TOKEN_KEY yang sama
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
    console.log('💾 Token saved successfully');
  }

  /**
   * Clear authentication token
   */
  static async clearAuthToken(): Promise<void> {
    // ✅ Gunakan konstanta TOKEN_KEY yang sama
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    console.log('🗑️ Token cleared successfully');
  }

  /**
   * Get current authentication token
   */
  static async getAuthToken(): Promise<string | null> {
    // ✅ Gunakan konstanta TOKEN_KEY yang sama
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
}