import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyProfileScreen, ProfileComunityScreen, ProfileScreen, ProfileSettingScreen } from '../index';


export type ProfileStackParamList = {
  Main: undefined;
  Profile: undefined;
  MyCommunity: undefined;
  Settings: undefined;
  Account: undefined;
  Charity: undefined;
  FAQ: undefined;
  TnC: undefined;
  Support: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {

  return (
    <ProfileStack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Main" component={ProfileScreen} />
      <ProfileStack.Screen name="Profile" component={MyProfileScreen} />
      <ProfileStack.Screen name="MyCommunity" component={ProfileComunityScreen} />
      <ProfileStack.Screen name="Settings" component={ProfileSettingScreen} />
    </ProfileStack.Navigator>
  );
};