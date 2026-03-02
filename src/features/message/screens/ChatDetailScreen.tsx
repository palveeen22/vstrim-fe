import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Alert,
  Text,
} from 'react-native';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ImageMessageBubble } from '../components/chat/ImageMessageBubble';
import { VoiceMessageBubble } from '../components/chat/VoiceMessageBubble';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatInput } from '../components/chat/ChatInput';
import { InboxStackParamList } from '../navigations/InboxNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useChatMessages } from '../hooks/useChatQueries';
import { useAuth } from '../../../contexts/AuthContext';
import { ChatMessage } from '../services/chatService';

type Props = NativeStackScreenProps<InboxStackParamList, 'Chat'>;

interface DateSeparatorProps {
  date: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ date }) => (
  <View style={styles.dateSeparator}>
    <Text style={styles.dateText}>{date}</Text>
  </View>
);

export const ChatDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { roomId } = route.params;
  const flatListRef = useRef<FlatList<any>>(null);

  // ✅ Properly typed state
  const [listMessage, setListMessage] = useState<ChatMessage[]>([]);

  const {
    data: messages,
    isLoading: loadingMessages,
    error: messagesError,
  } = useChatMessages(roomId, user?.id || '');

  // Update list when messages change
  useEffect(() => {
    if (messages) {
      setListMessage(messages);
    }
  }, [messages]);

  // 🔧 Helper: Format timestamp
  const formatTime = (dateString?: string): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  // 🔧 Helper: Format date for separator
  const formatDate = (dateString?: string): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit',
        });
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };

  const isSameDay = (date1?: string, date2?: string): boolean => {
    if (!date1 || !date2) return false;

    try {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.toDateString() === d2.toDateString();
    } catch (error) {
      console.error('Error comparing dates:', error);
      return false;
    }
  };

  // 🔧 Group messages by date
  const getMessageGroups = () => {
    const groups: Array<{ type: 'date' | 'message'; data: any }> = [];

    listMessage.forEach((message, index) => {
      // Add date separator if it's first message or different day
      if (index === 0 || !isSameDay(message.createdAt, listMessage[index - 1].createdAt)) {
        groups.push({
          type: 'date',
          data: formatDate(message.createdAt),
        });
      }

      groups.push({
        type: 'message',
        data: message,
      });
    });

    return groups;
  };

  // 📝 Handlers
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Show chat options');
  };

  const handleSendMessage = (content: string) => {
    // TODO: Implement send message with API
    console.log('Send message:', content);
  };

  const handleAttachPress = () => {
    Alert.alert(
      'Attach',
      'Choose attachment type',
      [
        { text: 'Photo', onPress: () => console.log('Photo') },
        { text: 'Voice', onPress: () => console.log('Voice') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleImagePress = (imageUrl: string) => {
    Alert.alert('Image', `View full image: ${imageUrl}`);
  };

  const handleVoicePlay = () => {
    console.log('Play voice message');
  };

  // 🎨 Render Item
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    // Render date separator
    if (item.type === 'date') {
      return <DateSeparator date={item.data} />;
    }

    const message: ChatMessage = item.data;
    const isMe = message.senderId === user?.id;

    // Check if previous message is from same sender
    const prevMessage = index > 0 && listMessage[index - 1];
    const showLabel = isMe && (!prevMessage || prevMessage.senderId !== user?.id);

    // Handle different message types based on attachmentType
    if (message.attachmentType === 'image' && message.attachmentUrl) {
      return (
        <ImageMessageBubble
          imageUrl={message.attachmentUrl}
          content={message.content}
          timestamp={formatTime(message.createdAt)}
          isMe={isMe}
          onImagePress={() => handleImagePress(message.attachmentUrl!)}
        />
      );
    }

    if (message.attachmentType === 'audio' && message.attachmentUrl) {
      return (
        <VoiceMessageBubble
          duration={0} // TODO: Add duration field to API
          timestamp={formatTime(message.createdAt)}
          isMe={isMe}
          isRead={true} // TODO: Add read status logic
          onPlay={handleVoicePlay}
        />
      );
    }

    // Default: Text message
    return (
      <MessageBubble
        content={message.content || ''}
        timestamp={formatTime(message.createdAt)}
        isMe={isMe}
        isRead={true} // TODO: Add read status logic
        showLabel={showLabel}
      />
    );
  };

  // 🎨 Loading state
  if (loadingMessages) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 🎨 Error state
  if (messagesError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text>Error loading messages</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 🎨 Header */}
      <ChatHeader
        user={listMessage[0]?.sender}
        isOnline={false} // TODO: Add online status logic
        onBackPress={handleBackPress}
        onMenuPress={handleMenuPress}
      />

      {/* 💬 Messages List */}
      <FlatList
        ref={flatListRef}
        data={getMessageGroups()}
        keyExtractor={(item, index) =>
          item.type === 'date' ? `date-${index}` : item.data.id
        }
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        inverted={true}   // ⬅️ Penting
        onContentSizeChange={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
        onLayout={() => flatListRef.current?.scrollToOffset({ offset: 0, animated: true })}
      />


      {/* ⌨️ Input */}
      <ChatInput
        roomId={roomId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  messagesList: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 13,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});