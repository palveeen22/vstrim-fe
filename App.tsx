import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigations/app-navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { QuizProvider } from './src/contexts/DailyQuizContext';

const App = (): React.ReactElement => {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <QuizProvider>
            <AppNavigation />
          </QuizProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
