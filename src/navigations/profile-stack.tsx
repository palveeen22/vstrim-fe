import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/profile/profile-screen';
import MyCommunityScreen from '../screens/profile/community-screen';
import SettingScreen from '../screens/profile/setting-screen';
import ProfileDetailScreen from '../screens/profile/my-profile-screen';

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

const ProfileNavigation = () => {

  return (
    <ProfileStack.Navigator initialRouteName='Main' screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="Main" component={ProfileScreen} />
      <ProfileStack.Screen name="Profile" component={ProfileDetailScreen} />
      <ProfileStack.Screen name="MyCommunity" component={MyCommunityScreen} />
      <ProfileStack.Screen name="Settings" component={SettingScreen} />
    </ProfileStack.Navigator>
  );
};

export default ProfileNavigation;
