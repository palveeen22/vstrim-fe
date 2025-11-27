import React, { useState, useRef, useEffect } from 'react';
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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type ChatMessage = {
  id: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  image?: string;
};

type ProductInfo = {
  id: string;
  name: string;
  price: string;
  image: string;
  condition: string;
};

export const MessageScreen = ({ navigation, route }: any) => {
  const { userName, userAvatar, online } = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Halo, barangnya masih available?',
      timestamp: '10:30',
      isMine: false,
      status: 'read',
    },
    {
      id: '2',
      text: 'Halo! Iya masih available kok',
      timestamp: '10:31',
      isMine: true,
      status: 'read',
    },
    {
      id: '3',
      text: 'Boleh minta foto detail lagi?',
      timestamp: '10:32',
      isMine: false,
      status: 'read',
    },
    {
      id: '4',
      text: 'Tentu, aku kirim sekarang ya',
      timestamp: '10:33',
      isMine: true,
      status: 'read',
    },
    {
      id: '5',
      text: 'https://via.placeholder.com/300',
      timestamp: '10:33',
      isMine: true,
      status: 'read',
      image: 'https://via.placeholder.com/300',
    },
    {
      id: '6',
      text: 'Oke sip, mau aku ambil kapan bisa?',
      timestamp: '10:35',
      isMine: false,
      status: 'read',
    },
  ]);

  const flatListRef = useRef<FlatList>(null);

  // Product info card (optional)
  const productInfo: ProductInfo = {
    id: 'prod1',
    name: 'Kemeja Flanel Kotak-kotak',
    price: 'Rp 75.000',
    image: 'https://via.placeholder.com/80',
    condition: 'Seperti Baru',
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isMine: true,
        status: 'sent',
      };

      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      Keyboard.dismiss();
    }
  };

  const handleImagePick = () => {
    // TODO: Implement image picker
    console.log('Image picker');
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.isMine ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        {!item.isMine && (
          <Image
            source={{ uri: userAvatar }}
            style={styles.messageAvatar}
          />
        )}

        <View
          style={[
            styles.messageBubble,
            item.isMine ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          {item.image ? (
            <TouchableOpacity activeOpacity={0.9}>
              <Image
                source={{ uri: item.image }}
                style={styles.messageImage}
              />
            </TouchableOpacity>
          ) : (
            <Text
              style={[
                styles.messageText,
                item.isMine ? styles.myMessageText : styles.theirMessageText,
              ]}
            >
              {item.text}
            </Text>
          )}

          <View style={styles.messageFooter}>
            <Text
              style={[
                styles.messageTime,
                item.isMine && styles.myMessageTime,
              ]}
            >
              {item.timestamp}
            </Text>
            {item.isMine && (
              <Icon
                name={
                  item.status === 'read'
                    ? 'checkmark-done'
                    : item.status === 'delivered'
                    ? 'checkmark-done'
                    : 'checkmark'
                }
                size={14}
                color={item.status === 'read' ? '#3B82F6' : '#9CA3AF'}
                style={styles.statusIcon}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => {
            // Navigate to user profile
            console.log('Navigate to user profile');
          }}
        >
          <View style={styles.headerAvatarContainer}>
            <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
            {online && <View style={styles.headerOnlineIndicator} />}
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{userName}</Text>
            <Text style={styles.headerStatus}>
              {online ? 'Online' : 'Offline'}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="call-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="ellipsis-vertical" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product Card (Optional) */}
      <View style={styles.productCard}>
        <Image source={{ uri: productInfo.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName} numberOfLines={1}>
            {productInfo.name}
          </Text>
          <View style={styles.productMeta}>
            <Text style={styles.productPrice}>{productInfo.price}</Text>
            <Text style={styles.productSeparator}>•</Text>
            <Text style={styles.productCondition}>{productInfo.condition}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.productButton}>
          <Icon name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleImagePick}
          >
            <Icon name="add-circle-outline" size={28} color="#6B7280" />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Tulis pesan..."
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              message.trim() && styles.sendButtonActive,
            ]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Icon
              name="send"
              size={20}
              color={message.trim() ? '#fff' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  headerOnlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#EF4444',
  },
  productSeparator: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 6,
  },
  productCondition: {
    fontSize: 12,
    color: '#6B7280',
  },
  productButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    maxWidth: '80%',
  },
  myMessageContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  theirMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F3F4F6',
  },
  messageBubble: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxWidth: '100%',
  },
  myMessageBubble: {
    backgroundColor: '#007BFF',
    borderBottomRightRadius: 4,
  },
  theirMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#fff',
  },
  theirMessageText: {
    color: '#000',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: '#6B7280',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIcon: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  attachButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: '#000',
    padding: 0,
    maxHeight: 80,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#007BFF',
  },
});