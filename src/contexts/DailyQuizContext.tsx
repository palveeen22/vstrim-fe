import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizService, QuizQuestion, ApiResponse, SubmitQuizPayload } from '../features/dailyQuiz/services/quizService';
import { getQuizCompletionKey } from '../app/utility/format';
import { STORAGE_KEYS } from '../constants';
import { useAuth } from './AuthContext';

// Context State Interface
interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Map<string, string[]>;
  isLoading: boolean;
  error: string | null;
  isCompleted: boolean;
  completedAt: Date | null;
  dailyQuizId: string | null;
}

// Untuk persist ke AsyncStorage
interface QuizCompletionData {
  isCompleted: boolean;
  completedAt: Date;
  dailyQuizId: string | null;
}

// Context Actions Interface
interface QuizContextValue extends QuizState {
  fetchQuiz: () => Promise<void>;
  answerQuestion: (questionId: string, optionIds: string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  resetQuiz: () => void;
  submitQuiz: () => Promise<boolean>;
  getCurrentQuestion: () => QuizQuestion | null;
  getProgress: () => number;
}

// Create Context
const QuizContext = createContext<QuizContextValue | undefined>(undefined);

// Initial State
const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  answers: new Map(),
  isLoading: false,
  error: null,
  isCompleted: false,
  completedAt: null,
  dailyQuizId: null,
};

// Provider Props
interface QuizProviderProps {
  children: ReactNode;
}

// Provider Component
export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const { user: whoLogin } = useAuth()
  const [state, setState] = useState<QuizState>(initialState);

  // ✅ Load completion data saat app start
  useEffect(() => {
    loadCompletionData();
  }, []);


  const loadCompletionData = async () => {
    try {
      const userData = await AsyncStorage.getItem('@vstrim_user_data');
      if (!userData) {
        console.log('⚠️ No user data found, skipping quiz completion load');
        return;
      }

      const user = JSON.parse(userData);
      const key = getQuizCompletionKey(user.id);

      const data = await AsyncStorage.getItem(key);

      if (data) {
        const parsed: QuizCompletionData = JSON.parse(data);
        const completedDate = new Date(parsed.completedAt);
        const today = new Date();
        completedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        if (completedDate.getTime() === today.getTime()) {
          setState(prev => ({
            ...prev,
            isCompleted: parsed.isCompleted,
            completedAt: new Date(parsed.completedAt),
            dailyQuizId: parsed.dailyQuizId,
          }));
          console.log(`✅ Quiz completion restored for user ${user.id}`);
        } else {
          await AsyncStorage.removeItem(key);
          console.log(`🗑️ Old quiz completion cleared for user ${user.id}`);
        }
      } else {
        console.log(`📭 No saved quiz completion found for user ${user.id}`);
      }
    } catch (error) {
      console.error('❌ Failed to load completion data:', error);
    }
  };


  const saveCompletionData = async (data: QuizCompletionData) => {
    try {
      const userData = await AsyncStorage.getItem('@vstrim_user_data');
      if (!userData) return;
      const user = JSON.parse(userData);
      const key = getQuizCompletionKey(user.id);

      await AsyncStorage.setItem(key, JSON.stringify(data));
      console.log(`💾 Quiz completion saved for user ${user.id}`);
    } catch (error) {
      console.error('❌ Failed to save completion data:', error);
    }
  };


  const fetchQuiz = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response: ApiResponse = await QuizService.fetchDailyQuiz();

      console.log(response, "<<<<");

      if (response.status === 'success' && response.data) {
        // Safely handle the data - ensure it's always a valid array
        const questions: QuizQuestion[] = Array.isArray(response.data?.questions)
          ? response.data.questions
          : [response.data.questions];

        setState(prev => ({
          ...prev,
          questions,
          isLoading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response.message || 'Failed to fetch quiz',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'An unexpected error occurred while fetching quiz',
      }));
    }
  }, []);

  const answerQuestion = useCallback((questionId: string, optionIds: string[]) => {
    setState(prev => {
      const newAnswers = new Map(prev.answers);
      newAnswers.set(questionId, optionIds);

      return {
        ...prev,
        answers: newAnswers,
      };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex < prev.questions.length - 1) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1,
        };
      }
      return prev;
    });
  }, []);

  const previousQuestion = useCallback(() => {
    setState(prev => {
      if (prev.currentQuestionIndex > 0) {
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex - 1,
        };
      }
      return prev;
    });
  }, []);

  const resetQuiz = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem('@vstrim_user_data');
      if (userData) {
        const user = JSON.parse(userData);
        const key = getQuizCompletionKey(user.id);
        await AsyncStorage.removeItem(key);
        console.log(`🔄 Quiz reset for user ${user.id}`);
      }
      setState(initialState);
    } catch (error) {
      console.error('❌ Failed to reset quiz:', error);
    }
  }, []);


  // Di DailyQuizContext - submitQuiz function
  const submitQuiz = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const answersArray = Array.from(state.answers.entries()).map(
        ([questionId, selectedOptions]) => ({ questionId, selectedOptions })
      );

      const payload: SubmitQuizPayload = { answers: answersArray };
      const response = await QuizService.submitQuiz(payload);

      if (response?.status === 'success' && response.data) {
        const {
          isCompleted,
          dailyQuizId,
          completedAt,
          user: updatedUser,
        } = response.data;

        // Save completion data ke AsyncStorage
        const completionData: QuizCompletionData = {
          isCompleted,
          completedAt,
          dailyQuizId,
        };
        await saveCompletionData(completionData);

        // Update state quiz
        setState(prev => ({
          ...prev,
          isLoading: false,
          isCompleted,
          completedAt: completedAt ? new Date(completedAt) : null,
          dailyQuizId,
          error: null,
        }));

        // ❌ JANGAN update user di sini!
        // ✅ Return user data untuk di-update nanti
        // Store updated user temporarily
        if (updatedUser) {
          // Save ke AsyncStorage dulu
          await AsyncStorage.setItem(
            STORAGE_KEYS.USER_DATA,
            JSON.stringify(updatedUser)
          );
        }

        console.log('✅ Quiz completed and saved');

        return true;
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response?.message || 'Failed to submit quiz',
        }));

        return false;
      }
    } catch (error) {
      console.error('❌ Submit quiz error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to submit quiz',
      }));

      return false;
    }
  }, [state.answers]); // ⚠️ Remove setUser dari dependencies!

  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (state.questions.length === 0) return null;
    return state.questions[state.currentQuestionIndex] || null;
  }, [state.questions, state.currentQuestionIndex]);

  const getProgress = useCallback((): number => {
    if (state.questions.length === 0) return 0;
    return Math.round((state.answers.size / state.questions.length) * 100);
  }, [state.questions.length, state.answers.size]);

  useEffect(() => {
    if (whoLogin?.id) {
      resetQuiz();
    }
  }, [whoLogin?.id, resetQuiz]);

  const value: QuizContextValue = {
    ...state,
    fetchQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    resetQuiz,
    submitQuiz,
    getCurrentQuestion,
    getProgress,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

// Custom Hook to use Quiz Context
export const useQuiz = (): QuizContextValue => {
  const context = useContext(QuizContext);

  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }

  return context;
};

// Export types for convenience
export type { QuizState, QuizContextValue };