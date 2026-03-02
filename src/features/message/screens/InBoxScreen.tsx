export interface User {
  id: string;
  name: string;
  username: string;
  photoProfile: string;
}

export interface ChatMember {
  id: string;
  roomId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  lastReadMessageId: string | null;
  lastReadAt: string | null;
  user: User;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  attachmentUrl: string | null;
  attachmentType: 'image' | 'video' | 'file' | null;
  sender: {
    id: string;
    name: string;
    photoProfile: string | null;
  };
}

export interface Chat {
  chatId: string;
  type: 'DIRECT' | 'GROUP';
  name: string | null | undefined;
  image: string | null | undefined;
  members: ChatMember[];
  lastMessage: ChatMessage | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatRoomsResponse {
  status: 'success' | 'error';
  data: Chat[];
  meta?: {
    total: number;
  };
}

interface RecentSection {
  type: 'recent';
  data: [];
}

interface ChatsSection {
  type: 'chats';
  title: string;
  data: ChatRoom[];
}

type Section = RecentSection | ChatsSection;

import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  SectionList,
  StatusBar,
  Alert,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { ChatListItem } from '../components/Inbox/ChatListItem';
import { MessageHeader } from '../components/Inbox/MessageHeader';
import { InboxStackParamList } from '../navigations/InboxNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useChatRooms } from '../hooks/useChatQueries';
import { useAuth } from '../../../app/providers/AuthProvider';
import { ChatRoom } from '../services/chatService';

type Props = NativeStackScreenProps<InboxStackParamList, 'MessagesList'>;

// // Recently Active Section Component
// const RecentlyActiveSection: React.FC<{
//   users: User[];
//   onUserPress: (user: User) => void;
// }> = ({ users, onUserPress }) => (
//   <View>
//     <View style={styles.sectionHeaderWrapper}>
//       <SectionHeader title="Recently Active" />
//     </View>
//     <RecentlyActiveList users={users} onUserPress={onUserPress} />
//   </View>
// );

// Loading Component


const LoadingState = () => (
  <View style={styles.centerContainer}>
    <ActivityIndicator size="large" color="#007AFF" />
    <Text style={styles.loadingText}>Loading chats...</Text>
  </View>
);

// Empty State Component
const EmptyState = () => (
  <View style={styles.centerContainer}>
    <Text style={styles.emptyText}>No chats yet</Text>
    <Text style={styles.emptySubtext}>Start a conversation!</Text>
  </View>
);

// Error State Component
const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <View style={styles.centerContainer}>
    <Text style={styles.errorText}>❌ {message}</Text>
    <Text style={styles.retryButton} onPress={onRetry}>
      Tap to retry
    </Text>
  </View>
);

export const InboxScreen = ({ navigation }: Props) => {
  const { user } = useAuth();

  // Fetch chat rooms
  const {
    data: chats,
    isLoading,
    isError,
    error,
    refetch
  } = useChatRooms(user?.id || '');

  // Memoize sections untuk optimasi performa
  const sections = useMemo<Section[]>(() => {
    const recentSection: Section = {
      type: 'recent',
      data: []
    };

    const chatsSection: Section = {
      type: 'chats',
      title: 'Chats',
      data: chats || []
    };

    return [recentSection, chatsSection];
  }, [chats]);


  // ✅ Handler: Chat press
  const handleChatPress = (chat: Chat) => {
    navigation.navigate('Chat', {
      roomId: chat.chatId,
    });
  };

  // ✅ Handler: Search
  const handleSearchPress = () => {
    Alert.alert('Search', 'Search messages feature');
  };

  // ✅ Handler: Filter
  const handleFilterPress = () => {
    Alert.alert('Filter', 'Filter messages feature');
  };

  // ✅ Render Section Header
  const renderSectionHeader = ({ section }: { section: Section }) => {
    if (section.type === 'chats' && section.title) {
      return (
        <View style={styles.sectionHeaderWrapper}>
          <SectionHeader />
        </View>
      );
    }

    return null;
  };

  // ✅ Render Chat Item
  const renderItem = ({ item, section }: { item: Chat; section: Section }) => {
    if (section.type === 'recent') return null;

    if (section.type === 'chats') {
      const otherMember = item.members.find(
        (m) => m.userId !== user?.id
      );

      if (!otherMember) {
        console.warn(`No other member found for chat ${item.chatId}`);
        return null;
      }


      console.log(otherMember);

      // Format last message
      const lastMessage = item.lastMessage;
      const isMe = lastMessage?.senderId === user?.id;

      let lastMessageText = 'No messages yet';
      if (lastMessage?.content) {
        lastMessageText = isMe
          ? `You: ${lastMessage.content}`
          : lastMessage.content;
      } else if (lastMessage?.attachmentType) {
        const attachmentLabel = {
          image: '📷 Photo',
          video: '🎥 Video',
          file: '📎 File',
        }[lastMessage.attachmentType] || '📎 Attachment';

        lastMessageText = isMe
          ? `You: ${attachmentLabel}`
          : attachmentLabel;
      }

      // // ✅ Format waktu
      // const lastMessageTime = lastMessage
      //   ? formatMessageTime(lastMessage.createdAt)
      //   : '';

      return (
        <ChatListItem
          name={otherMember?.user?.name}
          photoProfile={otherMember.user.photoProfile}
          message={lastMessageText}
          // time={lastMessageTime}
          // isOnline={false} // TODO: Implement online status
          onPress={() => handleChatPress(item)}
        />
      );
    }

    return null;
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <MessageHeader
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
        />
        <LoadingState />
      </SafeAreaView>
    );
  }

  // ✅ Error State
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <MessageHeader
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
        />
        <ErrorState
          message={error?.message || 'Failed to load chats'}
          onRetry={() => refetch()}
        />
      </SafeAreaView>
    );
  }

  // Empty State
  if (!chats || chats.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <MessageHeader
          onSearchPress={handleSearchPress}
          onFilterPress={handleFilterPress}
        />
        <EmptyState />
      </SafeAreaView>
    );
  }

  // Main Content
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <MessageHeader
        onSearchPress={handleSearchPress}
        onFilterPress={handleFilterPress}
      />

      <SectionList<Chat, Section>
        sections={sections}
        keyExtractor={(item) => item.chatId}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        stickySectionHeadersEnabled={false}
        style={styles.list}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        windowSize={21}
      />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  list: {
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  contentContainer: {
    paddingBottom: 20
  },
  sectionHeaderWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 4
  },

  // Loading, Empty, Error States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});