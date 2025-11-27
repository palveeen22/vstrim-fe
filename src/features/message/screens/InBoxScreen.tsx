import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type Message = {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  online: boolean;
  productImage?: string;
  productName?: string;
};

export const InBoxScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real data from API
  const [conversations, setConversations] = useState<Message[]>([
    {
      id: '1',
      userId: 'user1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://i.pravatar.cc/150?img=1',
      lastMessage: 'Halo, barangnya masih available?',
      timestamp: '10:30',
      unreadCount: 2,
      online: true,
      productImage: 'https://via.placeholder.com/60',
      productName: 'Kemeja Flanel Kotak',
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Michael Chen',
      userAvatar: 'https://i.pravatar.cc/150?img=2',
      lastMessage: 'Oke siap, terima kasih!',
      timestamp: '09:15',
      unreadCount: 0,
      online: false,
      productImage: 'https://via.placeholder.com/60',
      productName: 'Jaket Denim Vintage',
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Emma Davis',
      userAvatar: 'https://i.pravatar.cc/150?img=3',
      lastMessage: 'Bisa nego lagi nggak kak?',
      timestamp: 'Kemarin',
      unreadCount: 5,
      online: true,
      productImage: 'https://via.placeholder.com/60',
      productName: 'Dress Floral Pattern',
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'David Wilson',
      userAvatar: 'https://i.pravatar.cc/150?img=4',
      lastMessage: 'Sudah transfer ya',
      timestamp: 'Kemarin',
      unreadCount: 0,
      online: false,
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'Lisa Anderson',
      userAvatar: 'https://i.pravatar.cc/150?img=5',
      lastMessage: 'Lokasi dimana kak?',
      timestamp: '2 hari lalu',
      unreadCount: 1,
      online: true,
      productImage: 'https://via.placeholder.com/60',
      productName: 'Celana Jeans Slim Fit',
    },
  ]);

  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatPress = (conversation: Message) => {
    navigation.navigate('ChatDetail', { 
      conversationId: conversation.id,
      userName: conversation.userName,
      userAvatar: conversation.userAvatar,
      online: conversation.online,
    });
  };

  const renderConversationItem = ({ item }: { item: Message }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar with Online Indicator */}
      <View style={styles.avatarContainer}>
        {item.userAvatar ? (
          <Image source={{ uri: item.userAvatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      {/* Message Content */}
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>

        {/* Product Info (if exists) */}
        {item.productImage && (
          <View style={styles.productInfo}>
            <Image 
              source={{ uri: item.productImage }} 
              style={styles.productThumbnail}
            />
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName}
            </Text>
          </View>
        )}

        <View style={styles.lastMessageContainer}>
          <Text 
            style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]} 
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name="create-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari pesan..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat List */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="chatbubbles-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateTitle}>
            {searchQuery ? 'Tidak ada hasil' : 'Belum ada pesan'}
          </Text>
          <Text style={styles.emptyStateText}>
            {searchQuery 
              ? 'Coba dengan kata kunci lain'
              : 'Pesan Anda akan muncul di sini'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0,
  },
  listContent: {
    paddingBottom: 16,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 8,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  productThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
    marginRight: 6,
    backgroundColor: '#E5E7EB',
  },
  productName: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: '#000',
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});