import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './src/navigations/app-navigation';
import { AuthProvider } from './src/contexts/auth-context';

const App = (): React.ReactElement => {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>

  );
};

export default App;
