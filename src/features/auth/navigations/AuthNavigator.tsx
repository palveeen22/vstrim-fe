import { useAuth } from '../../../contexts/AuthContext';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthScreen, LoginScreen, RegisterScreen, VerificationScreen } from '../screens';
import { MainNavigator } from '../../../app/navigations/MainNavigator';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Verify: undefined;
  Main: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigation = () => {
  const {
    user,
    isLoggedIn,
  } = useAuth();

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  const needsToVerify = isLoggedIn && !user?.verificationCompleted;

  const initialRouteName: keyof AuthStackParamList =
    !isLoggedIn ? 'Welcome' : needsToVerify ? 'Verify' : 'Main';


  return (
    <AuthStack.Navigator initialRouteName={initialRouteName} screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <AuthStack.Screen name="Welcome" component={AuthScreen} />
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : needsToVerify ? (
        <>
          <AuthStack.Screen name='Verify' component={VerificationScreen} />

        </>
      ) : (
        <AuthStack.Screen name='Main' component={MainNavigator} />
      )}
    </AuthStack.Navigator>
  );
};