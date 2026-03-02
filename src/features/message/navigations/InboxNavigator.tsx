import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InboxScreen } from '../screens/InboxScreen';
import { ChatDetailScreen } from '../screens/ChatDetailScreen';

export type InboxStackParamList = {
  MessagesList: undefined;
  // ChatDetail: {
  //   chatId: string;
  //   participantId: string;
  //   participantName: string;
  //   participantAvatar: string;
  //   isOnline?: boolean;
  //   isGroup?: boolean;
  // };
  Chat: {
    roomId: string;
  };
};

const InboxStack = createNativeStackNavigator<InboxStackParamList>();

export const InboxNavigator = () => {
  return (
    <InboxStack.Navigator
      initialRouteName="MessagesList"
      screenOptions={{ headerShown: false }}
    >
      <InboxStack.Screen name="MessagesList" component={InboxScreen} />
      <InboxStack.Screen
        name="Chat"
        component={ChatDetailScreen}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          presentation: 'card',
        }}
      />
    </InboxStack.Navigator>
  );
};