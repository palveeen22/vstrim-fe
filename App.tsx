import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { QuizProvider } from './src/contexts/DailyQuizContext';
import { RootNavigator } from "./src/app/navigations/RootNavigator"

const App = (): React.ReactElement => {

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
