import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { QuizProvider } from './src/contexts/DailyQuizContext';
import { RootNavigator } from "./src/app/navigations/RootNavigator"
import { useWidgetSync } from "./src/app/hooks/useWidgetSync"
import { QueryClientConfig } from "./src/app/config/queryClient"
import { QueryClientProvider } from '@tanstack/react-query';

const App = (): React.ReactElement => {
  // call bridge to native
  useWidgetSync();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
            <QueryClientProvider client={QueryClientConfig}>
        <AuthProvider>
          <QuizProvider>
            <RootNavigator />
          </QuizProvider>
        </AuthProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
