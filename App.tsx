import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { QuizProvider } from './src/contexts/DailyQuizContext';
import { RootNavigator } from "./src/app/navigations/RootNavigator"
import { useWidgetSync } from "./src/app/hooks/useWidgetSync"

const App = (): React.ReactElement => {
  // call bridge to native
  useWidgetSync();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <QuizProvider>
            <RootNavigator />
          </QuizProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
