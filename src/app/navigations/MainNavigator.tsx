import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import { useAuth } from '../../contexts/AuthContext';
import { DailsQuizScreen } from '../../features/dailyQuiz';
import { ForYouScreen } from '../../features/forYou/screens/ForYouScreen';
import { MapExploreScreen } from '../../features/explore';
import { InBoxScreen } from '../../features/message';
import { ProfileNavigator } from '../../features/profile';


export type BottomTabParamList = {
  Quiz: undefined;
  Match: undefined;
  Map: undefined;
  Message: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

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

export const MainNavigator = () => {
  const { user } = useAuth()

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
        <Tab.Screen name="Match" component={ForYouScreen} />
      )}

      <Tab.Screen name="Map" component={MapExploreScreen} />
      <Tab.Screen name="Message" component={InBoxScreen} />
      <Tab.Screen name="Profile" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};