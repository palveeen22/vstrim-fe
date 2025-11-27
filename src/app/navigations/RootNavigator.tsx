import { createStackNavigator } from "@react-navigation/stack";
import { Image, StyleSheet, View } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNetwork } from "../hooks/use-networks";
import { AuthNavigation, OnboardingScreen } from "../../features/auth";
import { NetworkError } from "../../shared/components";

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  LoginRegistration: undefined;
  MainApp: undefined;
};

const AppStack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  let isLoggedIn
  const { isConnected, isInternetReachable, checkConnection } = useNetwork();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);

  useEffect(() => {
    checkInitialStatus();
  }, []);

  const checkInitialStatus = async () => {
    try {
      // Check if onboarding has been completed
      const onboardingComplete = await AsyncStorage.getItem('@vstrim_onboarding_complete');
      setIsOnboardingComplete(onboardingComplete === 'true');

    } catch (error) {
      console.error('Error checking initial status:', error);
    } finally {
      // Simulate splash screen for 2 seconds (adjust as needed)
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const getInitialRouteName = (): keyof RootStackParamList => {
    if (!isOnboardingComplete) {
      return 'Onboarding';
    } else if (!isLoggedIn) {
      return 'LoginRegistration';
    } else {
      return 'LoginRegistration';
    }
  };


  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../../assets/images/splashscreen.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  // Handle retrying connection
  const handleRetry = () => {
    checkConnection();
  };

  // Handle contact support
  const handleContactSupport = () => {
    // Implement your contact support logic here
    // This could open an email client, navigate to a support page, etc.
    console.log('Contact support pressed');
  };

  // Show network error screen when there's no connection
  if (!isLoading && (!isConnected || isInternetReachable === false)) {
    return (
      <NetworkError
        onRetry={handleRetry}
        onContactSupport={handleContactSupport}
      />
    );
  }

  return (
    <AppStack.Navigator
      initialRouteName={getInitialRouteName()}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {/* Onboarding Flow */}
      <AppStack.Screen name="Onboarding" component={OnboardingScreen} />

      {/* Authentication Flow */}
      <AppStack.Screen name="LoginRegistration" component={AuthNavigation} />


      {/* <AppStack.Screen
        name="MessageNavigator"
        component={MessageNavigator}
        options={{
          gestureEnabled: true,
        }}
      /> */}
    </AppStack.Navigator>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: '100%',
    height: '100%',
  },
});