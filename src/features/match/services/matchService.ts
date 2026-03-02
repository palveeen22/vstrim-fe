import axios from 'axios';
import apiClient from '../../../app/config/apiClient';
import { MatchResponse } from '../model/content';


export interface MatchFilters {
  limit?: number;
  minMatchPercentage?: number;
  excludeIds?: string[];
}

export class MatchService {
  static async getMatchedUsers(
    userId: string,
    params?: {
      limit?: number;
      minMatchPercentage?: number;
      excludeIds?: string[];
    }
  ): Promise<MatchResponse> {
    try {
      const response = await apiClient.get<MatchResponse>(`/match/${userId}`, {
        params: {
          limit: params?.limit || 20,
          minMatchPercentage: params?.minMatchPercentage || 30,
          excludeIds: params?.excludeIds || [],
        },
      });

      console.log('📊 Quiz data received:', response.data);
      return response.data;
    } catch (error) {
      return MatchService.handleError(error);
    }
  }

  static async getMatchScore(userId1: string, userId2: string):Promise<any>{
    try {
      const response = await apiClient.get<any>(`/match/${userId1}/${userId2}`);
      console.log('📊 Quiz data received:', response.data);
      return response.data;
    } catch (error) {
      return MatchService.handleError(error);
    }
  }


  private static handleError(error: unknown): any {
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
  }
}



// interface AxiosRequestConfigWithRetry extends InternalAxiosRequestConfig {
//   _retry?: boolean;
// }

// // Axios instance
// const apiClient = axios.create({
//   baseURL: API_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// // ✅ Request interceptor to attach access token
// apiClient.interceptors.request.use(
//   async (config: InternalAxiosRequestConfig) => {
//     try {
//       const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
//       if (token) {
//         config.headers = config.headers ?? {};
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.error('❌ Failed to read token from storage', error);
//       return config;
//     }
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError & { config?: AxiosRequestConfigWithRetry }) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       originalRequest &&
//       !originalRequest._retry
//     ) {
//       console.warn('⚠️ 401 Unauthorized, attempting token refresh...');
//       originalRequest._retry = true;

//       const refreshResponse = await AuthService.refreshToken();

//       const newToken = refreshResponse.data?.accessToken;
//       if (refreshResponse.status === 'success' && newToken) {
//         // Update AsyncStorage
//         await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);

//         // Update header dan ulangi request
//         if (error.config) {
//           error.config.headers.Authorization = `Bearer ${newToken}`;
//           return apiClient(error.config);
//         }
//       }


//       // Jika refresh gagal → logout user
//       await AuthService.clearAuthData();
//       return Promise.reject(error);
//     }

//     return Promise.reject(error);
//   }
// );