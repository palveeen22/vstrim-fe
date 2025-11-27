import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from '../screens/auth-screen';
import LoginScreen from '../screens/login-screen';
import RegisterScreen from '../screens/register-screen';
import BottomTabNavigation from '../../../app/navigations/MainNavigator';
import { useAuth } from '../contexts/auth-context';
import ProfileVerificationScreen from '../screens/VerificationScreen';

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

  const needsToVerify = isLoggedIn && !user?.onboardingCompleted;

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
          <AuthStack.Screen name='Verify' component={ProfileVerificationScreen} />

        </>
      ) : (
        <AuthStack.Screen name='Main' component={BottomTabNavigation} />
      )}
    </AuthStack.Navigator>
  );
};