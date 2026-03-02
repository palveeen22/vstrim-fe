import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

const { height } = Dimensions.get('window');


interface IProps {
  visible: boolean;
  onClose: () => void;
  onSendMessage: (message: string, attachmentUrl?: string) => void;
  recipientName: string;
  recipientPhoto?: string;
  isLoading?: boolean;
}

export const ChatStartModal = ({
  visible,
  onClose,
  onSendMessage,
  recipientName,
  recipientPhoto,
  isLoading = false,
}: IProps) => {
  const [message, setMessage] = useState<string>('');
  const [attachmentUri, setAttachmentUri] = useState<string | undefined>();
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage && !attachmentUri) {
      Alert.alert('Empty Message', 'Please type a message or attach an image.');
      return;
    }

    onSendMessage(trimmedMessage, attachmentUri);
    setMessage('');
    setAttachmentUri(undefined);
  };

  const handleClose = () => {
    setMessage('');
    setAttachmentUri(undefined);
    onClose();
  };

  const handleAttachImage = () => {
    Alert.alert('Coming Soon', 'Image attachment will be available soon!');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.dragIndicator} />

            <View style={styles.headerContent}>
              {recipientPhoto && (
                <Image
                  source={{ uri: recipientPhoto }}
                  style={styles.recipientPhoto}
                />
              )}
              <View style={styles.headerText}>
                <Text style={styles.headerTitle}>Send message to</Text>
                <Text style={styles.recipientName}>{recipientName}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Message Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              placeholderTextColor="#9ca3af"
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
              autoFocus
              editable={!isLoading}
            />

            {/* Attachment Preview (if any) */}
            {attachmentUri && (
              <View style={styles.attachmentPreview}>
                <Image
                  source={{ uri: attachmentUri }}
                  style={styles.attachmentImage}
                />
                <TouchableOpacity
                  style={styles.removeAttachment}
                  onPress={() => setAttachmentUri(undefined)}
                >
                  <Text style={styles.removeAttachmentText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Character count */}
            <Text style={styles.charCount}>{message.length}/500</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={handleAttachImage}
              disabled={isLoading}
            >
              <Text style={styles.attachButtonText}>📎</Text>
              <Text style={styles.attachButtonLabel}>Attach</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sendButton,
                (isLoading || (!message.trim() && !attachmentUri)) && styles.sendButtonDisabled,
              ]}
              onPress={handleSend}
              disabled={isLoading || (!message.trim() && !attachmentUri)}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Text style={styles.sendButtonText}>Send</Text>
                  <Text style={styles.sendButtonIcon}>✈️</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Quick Templates (Optional) */}
          <View style={styles.quickTemplates}>
            <Text style={styles.quickTemplatesTitle}>Quick messages:</Text>
            <View style={styles.templateButtons}>
              {['👋 Hey!', '😊 Nice to meet you', '💬 Let\'s chat'].map((template) => (
                <TouchableOpacity
                  key={template}
                  style={styles.templateButton}
                  onPress={() => setMessage(template)}
                  disabled={isLoading}
                >
                  <Text style={styles.templateButtonText}>{template}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: height * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipientPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e5e7eb',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  recipientName: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#1f2937',
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: '600',
  },
  inputContainer: {
    padding: 20,
    paddingTop: 16,
  },
  input: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    maxHeight: 200,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  charCount: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'right',
    marginTop: 8,
  },
  attachmentPreview: {
    marginTop: 12,
    position: 'relative',
    alignSelf: 'flex-start',
  },
  attachmentImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  removeAttachment: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeAttachmentText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 8,
  },
  attachButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  attachButtonText: {
    fontSize: 20,
  },
  attachButtonLabel: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '600',
  },
  sendButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 12,
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d5db',
    opacity: 0.6,
  },
  sendButtonText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  sendButtonIcon: {
    fontSize: 18,
  },
  quickTemplates: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  quickTemplatesTitle: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    fontWeight: '600',
  },
  templateButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  templateButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  templateButtonText: {
    fontFamily: 'Urbanist-Medium',
    fontSize: 14,
    color: '#4b5563',
  },
});