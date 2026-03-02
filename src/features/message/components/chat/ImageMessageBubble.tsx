// src/features/messages/components/ImageMessageBubble.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface ImageMessageBubbleProps {
  imageUrl: string;
  content?: string;
  timestamp: string;
  isMe: boolean;
  onImagePress?: () => void;
}

export const ImageMessageBubble: React.FC<ImageMessageBubbleProps> = ({
  imageUrl,
  content,
  timestamp,
  isMe,
  onImagePress,
}) => {
  return (
    <View style={[styles.container, isMe && styles.containerMe]}>
      <TouchableOpacity 
        style={styles.imageContainer} 
        onPress={onImagePress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {content && (
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>{content}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={[styles.timestamp, isMe && styles.timestampMe]}>
        {timestamp}
      </Text>
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
  imageContainer: {
    maxWidth: '75%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: 280,
    height: 200,
    resizeMode: 'cover',
  },
  captionContainer: {
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  caption: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    color: '#1F2937',
    lineHeight: 22,
  },
  timestamp: {
    marginTop: 4,
    paddingHorizontal: 4,
    fontFamily: 'Urbanist-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  timestampMe: {
    textAlign: 'right',
  },
});