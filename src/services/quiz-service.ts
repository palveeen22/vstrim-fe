import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';
import { AuthService } from './auth-service';

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
    isCompleted: boolean;
    dailyQuizId: string;
    totalQuestions: number;
    answeredQuestions: number;
    completedAt: Date;
    message: string;
    user: any
  };
}

interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Request interceptor to attach access token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('❌ Failed to read token from storage', error);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: AxiosRequestConfigWithRetry }) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      console.warn('⚠️ 401 Unauthorized, attempting token refresh...');
      originalRequest._retry = true;

      const refreshResponse = await AuthService.refreshToken();

      const newToken = refreshResponse.data?.accessToken;
      if (refreshResponse.status === 'success' && newToken) {
        // Update AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);

        // Update header dan ulangi request
        if (error.config) {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(error.config);
        }
      }


      // Jika refresh gagal → logout user
      await AuthService.clearAuthData();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);


export class QuizService {
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
      const response = await apiClient.get<QuizCompletionStatus>('/daily-quiz/completion');
      return response.data;
    } catch (error) {
      console.error('Check completion error:', error);
      throw error;
    }
  }

  static async submitQuiz(payload: SubmitQuizPayload): Promise<SubmitQuizResponse> {
    try {
      const response = await apiClient.post<SubmitQuizResponse>('/daily-quiz/submit', payload);
      return response.data;
    } catch (error) {
      return QuizService.handleError(error) as SubmitQuizResponse;
    }
  }

  static async forceRefreshQuiz(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>('/daily-quiz/refresh-quiz');
      return response.data;
    } catch (error) {
      return QuizService.handleError(error);
    }
  }

  private static handleError(error: unknown): ApiResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as any;

      // Network / Timeout
      if (axiosError.message === 'Network Error') {
        return { status: 'error', message: 'Network error. Check your connection.' };
      }
      if (axiosError.code === 'ECONNABORTED') {
        return { status: 'error', message: 'Request timeout. Please try again.' };
      }

      // Server response
      if (axiosError.response?.data) {
        const message = axiosError.response.data.message || 'An error occurred';
        switch (axiosError.response.status) {
          case 401: return { status: 'error', message: 'Authentication required. Login again.' };
          case 403: return { status: 'error', message: 'Access denied.' };
          case 404: return { status: 'error', message: 'Quiz not found.' };
          case 429: return { status: 'error', message: 'Too many requests. Try later.' };
          case 500: return { status: 'error', message: 'Server error. Try again later.' };
          default: return { status: 'error', message };
        }
      }
    }

    return { status: 'error', message: 'Unexpected error occurred.' };
  }
}
