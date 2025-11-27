import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import { useAuth } from '@/contexts/AuthContext';
import { DailsQuizScreen } from '@/features/dailyQuiz';
import MatchScreen from '@/screens/match-screen';
import { MapExploreScreen } from '@/features/explore';
import { InBoxScreen } from '@/features/message';
import { ProfileNavigator } from '@/features/profile';


// Type definitions for the bottom tab navigator
export type BottomTabParamList = {
  Quiz: undefined;
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
    Quiz: 'flash-outline',
    Match: 'flash-sharp',
    Map: 'map-outline',
    Message: 'chatbox-outline',
    Profile: 'person-circle-outline',
  };

  return (
    <Icon name={icons[name]} size={22} color={focused ? '#007BFF' : '#666'} />
  );
};

// Main bottom tab navigator
export const MainNavigator = () => {
  // ✅ Ambil data dari quiz context
  const { user } = useAuth()

  // ✅ Check apakah quiz hari ini sudah selesai
  const hasCompletedTodayQuiz = useMemo(() => {
    if (!user?.dailyQuizzes) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return user.dailyQuizzes.some(dq => {
      const quizDate = new Date(dq.createdAt);
      quizDate.setHours(0, 0, 0, 0);
      return quizDate.getTime() === today.getTime() && dq.isCompleted;
    });
  }, [user?.dailyQuizzes]);


  console.log('Has completed today quiz:', hasCompletedTodayQuiz);

  console.log(user);
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
      {!hasCompletedTodayQuiz ? (
        <Tab.Screen name="Quiz" component={DailsQuizScreen} />
      ) : (
        <Tab.Screen name="Match" component={MatchScreen} />
      )}

      <Tab.Screen name="Map" component={MapExploreScreen} />
      <Tab.Screen name="Message" component={InBoxScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};