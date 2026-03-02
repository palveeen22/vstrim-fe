import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AppProviders } from './src/app/providers/AppProviders';
import { RootNavigator } from './src/app/navigations/RootNavigator';
import { useWidgetSync } from './src/app/hooks/useWidgetSync';

const App = (): React.ReactElement => {
  useWidgetSync();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppProviders>
          <RootNavigator />
        </AppProviders>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
