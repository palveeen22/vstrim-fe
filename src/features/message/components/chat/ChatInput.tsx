import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useChatStore } from '../../stores/chatStore';
import { useSendMessage } from '../../hooks/useChatQueries';
import { useAuth } from '../../../../app/providers/AuthProvider';

export const ChatInput = ({ roomId }: { roomId: string }) => {
  const { user } = useAuth();
  const { socket } = useChatStore();

  const [message, setMessage] = useState('');
  const [attachmentUri, setAttachmentUri] = useState<string | undefined>();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // mimic ChatStartModal onSendMessage → direct mutate
  const sendMessageMutation = useSendMessage(
    user?.id || '',
    user?.name || '',
    user?.photoProfile
  );


  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !attachmentUri) {
      Alert.alert('Empty Message', 'Please type a message or attach an image.');
      return;
    }

    // ---- BACKEND SEND ----
    sendMessageMutation.mutate({
      chatId: roomId,
      senderId: user?.id || '',
      text: trimmedMessage,
    });

    // ---- SOCKET SEND ----
    socket?.emit('send_message', {
      roomId,
      content: trimmedMessage,
      senderId: user?.id,
    });

    // ---- RESET ----
    setMessage('');
    setAttachmentUri(undefined);
    setIsTyping(false);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket?.emit('typing_stop', { roomId });
  };

  const handleTyping = (text: string) => {
    setMessage(text);

    if (!isTyping && text.length > 0) {
      setIsTyping(true);
      socket?.emit('typing_start', { roomId });
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('typing_stop', { roomId });
    }, 2000);
  };

  const handleAttachPress = () => {
    Alert.alert('Coming Soon', 'Image attachment will be available soon!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.attachButton} onPress={handleAttachPress}>
          <Icon name="add-circle" size={28} color="#9CA3AF" />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={handleTyping}
            multiline={false}
            maxLength={500}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />

        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (message.trim() || attachmentUri) && styles.sendButtonActive,
          ]}
          onPress={handleSend}
          disabled={!message.trim() && !attachmentUri}
        >
          <Icon
            name="send"
            size={20}
            color={message.trim() ? '#3B82F6' : '#9CA3AF'}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  attachButton: {
    padding: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    color: '#1F2937',
    minHeight: 36,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
});
