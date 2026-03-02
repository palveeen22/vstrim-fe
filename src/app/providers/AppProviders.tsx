import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '../store';
import { QueryClientConfig } from '../config/queryClient';
import { AuthProvider } from './AuthProvider';
import { QuizProvider } from './QuizProvider';

/**
 * AppProviders — wraps the app with all global providers in the correct order:
 *   Redux (global state) → QueryClient (server cache) → Auth → Quiz
 *
 * Usage in App.tsx:
 *   <AppProviders><RootNavigator /></AppProviders>
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Provider store={store}>
    <QueryClientProvider client={QueryClientConfig}>
      <AuthProvider>
        <QuizProvider>{children}</QuizProvider>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>
);
