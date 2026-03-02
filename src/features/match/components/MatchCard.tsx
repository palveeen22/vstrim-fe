import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IChatRoom, useChatStore } from '../../../features/message/stores/chatStore';
import { useGetOrCreateDirectRoom } from '../../../features/message/hooks/useChatQueries';
import { useSendMessage } from '../../../features/message/hooks/useChatQueries';
import { ChatStartModal } from '../../../features/message/components/chat/ChatStartModal';

type TMatchCardProps = {
  item: any;
  onPress?: (match: any) => void;
  currentUserId: string;
  currentUserName: string;
  currentUserPhoto: string;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export const MatchCard = React.memo(({ 
  item, 
  onPress,
  currentUserId,
  currentUserName,
  currentUserPhoto
}: TMatchCardProps) => {
  const navigation = useNavigation<any>();
  const { addRoom } = useChatStore();
  const [showChatModal, setShowChatModal] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  const {
    bio,
    name,
    photoProfile,
    username,
    id: userId,
  } = item;

  // Hooks
  const { mutate: createRoom, isPending: isCreatingRoom } = useGetOrCreateDirectRoom(currentUserId);
  const sendMessageMutation = useSendMessage(
    currentUserId, 
    currentUserName, 
    currentUserPhoto
  );

  // Handler untuk membuka modal
// components/match/MatchCard.tsx

const handleChatClick = (e?: any) => {
  if (e) e.stopPropagation();

  // Create/get room terlebih dahulu
  createRoom(userId, {
    onSuccess: (response) => {
      console.log('Room created:', response);

      if (response.status === 'success' && response.data) {
        const apiRoom = response.data;
        console.log(apiRoom, "Room data");
        
        // ✅ Simpan roomId - gunakan 'id' bukan 'chatId'
        setCreatedRoomId(apiRoom.id);

        // ✅ Convert lastMessage jika ada
        const lastMessage = apiRoom.lastMessage
          ? {
              ...apiRoom.lastMessage,
              createdAt: apiRoom.lastMessage.createdAt 
                ? new Date(apiRoom.lastMessage.createdAt) 
                : new Date(),
            }
          : undefined;

        // ✅ Cari other member (yang bukan current user)
        const otherMember = apiRoom.members.find(
          (m) => m.userId !== currentUserId
        )?.user;

        const roomToAdd: IChatRoom = {
          id: apiRoom.id,
          type: apiRoom.type,
          name: apiRoom.name || otherMember?.name || 'Direct Chat',
          photoProfile: apiRoom.image || otherMember?.photoProfile, // ✅ 'image' bukan 'photoProfile'
          members: apiRoom.members.map((m) => ({
            userId: m.userId,
            user: {
              id: m.user.id,
              name: m.user.name,
              photoProfile: m.user.photoProfile,
            },
          })),
          lastMessage,
          unreadCount: 0,
        };

        // Add to store
        addRoom(roomToAdd);

        // Show modal untuk input message
        setShowChatModal(true);
      } else {
        Alert.alert('Error', 'Failed to create chat room');
      }
    },
    onError: (error: any) => {
      console.error('Failed to create room:', error);
      Alert.alert('Error', error.message || 'Failed to create chat room');
    },
  });
};

  // Handler untuk send message dari modal
const handleSendMessage = (message: string, attachmentUrl?: string) => {
    console.log('Sending message:', message, attachmentUrl);

    if (!createdRoomId) {
      Alert.alert('Error', 'Chat room not ready');
      return;
    }

    console.log('Room ID:', createdRoomId);
    console.log('Sender ID:', currentUserId);

    sendMessageMutation.mutate(
      {
        chatId: createdRoomId,
        senderId: currentUserId,
        text: message,
        otherUserId: item.id,
        otherUserIsAdmin: false,
        attachmentUrl,
      },
      {
        onSuccess: (response) => {
          console.log('Message sent successfully:', response);
          
          // Close modal
          setShowChatModal(false);

          // Navigate to chat screen
          navigation.navigate('Message', {
            screen: 'Chat',
            params: {
              roomId: createdRoomId,
            },
          });
        },
        onError: (error: any) => {
          console.error('Failed to send message:', error);
          Alert.alert('Error', error.message || 'Failed to send message');
        },
      }
    );
  };

  
  const handleCardPress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handleCardPress}
        activeOpacity={0.8}
        disabled={isCreatingRoom}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: photoProfile }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.content}>
          <View style={styles.userInfo}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.username} numberOfLines={1}>
              @{username}
            </Text>
          </View>

          {bio && (
            <Text style={styles.bio} numberOfLines={2}>
              {bio}
            </Text>
          )}

          {/* Chat button */}
          <TouchableOpacity
            style={[
              styles.chatButton,
              isCreatingRoom && styles.chatButtonDisabled,
            ]}
            onPress={handleChatClick}
            disabled={isCreatingRoom}
            activeOpacity={0.7}
          >
            {isCreatingRoom ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.chatButtonText}>Loading...</Text>
              </View>
            ) : (
              <Text style={styles.chatButtonText}>💬 Start Chat</Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Chat Start Modal */}
      <ChatStartModal
        visible={showChatModal}
        onClose={() => setShowChatModal(false)}
        onSendMessage={handleSendMessage}
        recipientName={name}
        recipientPhoto={photoProfile}
        isLoading={sendMessageMutation.isPending}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    width: CARD_WIDTH,
  },
  imageContainer: {
    position: 'relative',
    height: 240,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e5e7eb',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  content: {
    padding: 16,
  },
  userInfo: {
    marginBottom: 12,
  },
  name: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  username: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  bio: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 16,
    lineHeight: 20,
  },
  chatButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  chatButtonDisabled: {
    backgroundColor: '#A0A0A0',
    opacity: 0.7,
  },
  chatButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

MatchCard.displayName = 'MatchCard';