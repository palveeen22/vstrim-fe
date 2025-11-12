import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizService, QuizQuestion, ApiResponse, SubmitQuizPayload } from '../services/quiz-service';

// Storage key
const QUIZ_COMPLETION_KEY = '@quiz_completion';

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
  submitQuiz: () => Promise<void>;
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
  const [state, setState] = useState<QuizState>(initialState);

  // ✅ Load completion data saat app start
  useEffect(() => {
    loadCompletionData();
  }, []);

  // 📦 Load & Validate dari AsyncStorage
  const loadCompletionData = async () => {
    try {
      const data = await AsyncStorage.getItem(QUIZ_COMPLETION_KEY);
      
      if (data) {
        const parsed: QuizCompletionData = JSON.parse(data);
        const completedDate = new Date(parsed.completedAt);
        const today = new Date();
        
        // Reset time to compare dates only
        completedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        // ✅ Check if completion is from today
        if (completedDate.getTime() === today.getTime()) {
          // Still valid - restore state
          setState(prev => ({
            ...prev,
            isCompleted: parsed.isCompleted,
            completedAt: new Date(parsed.completedAt),
            dailyQuizId: parsed.dailyQuizId,
          }));
          
          console.log('✅ Quiz completion restored from storage (today)');
        } else {
          // Different day - clear storage
          await AsyncStorage.removeItem(QUIZ_COMPLETION_KEY);
          console.log('🗑️ Old quiz completion cleared (different day)');
        }
      } else {
        console.log('📭 No saved quiz completion found');
      }
    } catch (error) {
      console.error('❌ Failed to load completion data:', error);
    }
  };

  // 💾 Save completion data ke AsyncStorage
  const saveCompletionData = async (data: QuizCompletionData) => {
    try {
      await AsyncStorage.setItem(QUIZ_COMPLETION_KEY, JSON.stringify(data));
      console.log('💾 Quiz completion saved to storage');
    } catch (error) {
      console.error('❌ Failed to save completion data:', error);
    }
  };

  // Fetch daily quiz
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

  // Answer a question
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

  // Navigate to next question
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

  // Navigate to previous question
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

  // Reset quiz to initial state
  const resetQuiz = useCallback(async () => {
    setState(initialState);
    await AsyncStorage.removeItem(QUIZ_COMPLETION_KEY);
    console.log('🔄 Quiz reset');
  }, []);

  // ✅ Submit quiz - Save to AsyncStorage immediately
  const submitQuiz = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert Map to array of objects for API submission
      const answersArray = Array.from(state.answers.entries()).map(
        ([questionId, selectedOptions]) => ({
          questionId,
          selectedOptions,
        })
      );

      const payload: SubmitQuizPayload = { answers: answersArray };

      console.log('Submitting quiz answers:', payload);

      const response = await QuizService.submitQuiz(payload);

      console.log('Submit response:', response);

      if (response?.status === 'success' && response.data) {
        const { 
          isCompleted, 
          dailyQuizId, 
          completedAt,
          totalQuestions,
          answeredQuestions 
        } = response.data;

        // ✅ Prepare data untuk AsyncStorage
        const completionData: QuizCompletionData = {
          isCompleted,
          completedAt,
          dailyQuizId,
        };

        // ✅ Save to AsyncStorage IMMEDIATELY
        await saveCompletionData(completionData);

        // ✅ Update state
        setState(prev => ({
          ...prev,
          isLoading: false,
          isCompleted,
          completedAt: completedAt ? new Date(completedAt) : null,
          dailyQuizId,
          error: null,
        }));

        console.log('✅ Quiz completed and saved:', {
          dailyQuizId,
          answeredQuestions,
          totalQuestions,
          completedAt,
        });
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: response?.message || 'Failed to submit quiz',
        }));
      }
    } catch (error) {
      console.error('❌ Submit quiz error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to submit quiz',
      }));
    }
  }, [state.answers]);

  // Get current question
  const getCurrentQuestion = useCallback((): QuizQuestion | null => {
    if (state.questions.length === 0) return null;
    return state.questions[state.currentQuestionIndex] || null;
  }, [state.questions, state.currentQuestionIndex]);

  // Calculate progress percentage
  const getProgress = useCallback((): number => {
    if (state.questions.length === 0) return 0;
    return Math.round((state.answers.size / state.questions.length) * 100);
  }, [state.questions.length, state.answers.size]);

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