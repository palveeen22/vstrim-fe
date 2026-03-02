
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ChatListItemProps {
  name: string;
  photoProfile: string;
  message: string;
  // time: string;
  onPress?: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
  name,
  photoProfile,
  message,
  onPress,
}) => {
  // const displayName = chat.isGroup ? chat.groupName : chat.user?.username;
  // const avatarUri = chat.isGroup ? chat.avatar : chat.user?.avatar;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: photoProfile }} style={styles.avatar} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          {/* {chat.isGroup && (
            <View style={styles.groupBadge}>
              <Text style={styles.groupBadgeText}>Group</Text>
            </View>
          )} */}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {/* {chat.lastMessage} */}
          {message}
        </Text>
      </View>

      {/* {chat.unreadCount && chat.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{chat.unreadCount}</Text>
        </View>
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E5E7EB',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#1F2937',
  },
  groupBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#D1FAE5',
    borderRadius: 12,
  },
  groupBadgeText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 12,
    color: '#059669',
  },
  lastMessage: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#9CA3AF',
  },
  unreadBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
});