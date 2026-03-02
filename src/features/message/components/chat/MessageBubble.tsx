// src/features/messages/components/MessageBubble.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  content: string;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
  showLabel?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  content,
  timestamp,
  isMe,
  isRead,
  showLabel,
}) => {
  return (
    <View style={[styles.container, isMe && styles.containerMe]}>
      {showLabel && isMe && <Text style={styles.label}>You</Text>}
      
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <Text style={[styles.content, isMe && styles.contentMe]}>
          {content}
        </Text>
      </View>

      <View style={[styles.footer, isMe && styles.footerMe]}>
        <Text style={styles.timestamp}>{timestamp}</Text>
        {isMe && isRead && (
          <Text style={styles.readStatus}> · Read</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  containerMe: {
    alignItems: 'flex-end',
  },
  label: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  bubbleOther: {
    backgroundColor: '#F3F4F6',
    borderTopLeftRadius: 4,
  },
  bubbleMe: {
    backgroundColor: '#3B82F6',
    borderTopRightRadius: 4,
  },
  content: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  contentMe: {
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    paddingHorizontal: 4,
  },
  footerMe: {
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  readStatus: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
});