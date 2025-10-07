import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileNavigation from './profile-stack';
import ChatListScreen from '../screens/chat-screen';
import MatchingQuizScreen from '../screens/quiz-scree';
import MapExploreScreen from '../screens/map-screen';


// Type definitions for the bottom tab navigator
export type BottomTabParamList = {
  Match: undefined;
  Map: undefined;
  Message: undefined;
  Profile: undefined;
};

// Create navigators
const Tab = createBottomTabNavigator<BottomTabParamList>();

// Custom tab bar icon component
const TabBarIcon = ({ name, focused }: { name: string; focused: boolean }) => {
  const icons: { [key: string]: string } = {
    Match: 'flash-outline',
    Map: 'map-outline',
    Message: 'chatbox-outline',
    Profile: 'person-circle-outline',
  };

  return (
    <Icon name={icons[name]} size={22} color={focused ? '#007BFF' : '#666'} />
  );
};

// Main bottom tab navigator
const BottomTabNavigation = () => {
  // const {
  //   user,
  //   isLoading,
  // } = useAuth();

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({ focused }) => (
          <TabBarIcon name={route.name} focused={focused} />
        ),
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#000',
        tabBarStyle: {
          height: 68,
          padding: 5,
          backgroundColor: '#FFFFFF',
          // borderTopWidth: 1,
          // borderTopColor: '#E0E0E0',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Match" component={MatchingQuizScreen} />
      <Tab.Screen name="Map" component={MapExploreScreen} />
      <Tab.Screen name="Message" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigation} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
