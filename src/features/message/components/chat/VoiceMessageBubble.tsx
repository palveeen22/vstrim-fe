// src/features/messages/components/VoiceMessageBubble.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface VoiceMessageBubbleProps {
  duration: number;
  timestamp: string;
  isMe: boolean;
  isRead?: boolean;
  onPlay?: () => void;
}

export const VoiceMessageBubble: React.FC<VoiceMessageBubbleProps> = ({
  duration,
  timestamp,
  isMe,
  isRead,
  onPlay,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    onPlay?.();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.container, isMe && styles.containerMe]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
          <Icon
            name={isPlaying ? 'pause' : 'play'}
            size={20}
            color={isMe ? '#FFFFFF' : '#3B82F6'}
          />
        </TouchableOpacity>

        <View style={styles.waveformContainer}>
          {/* Waveform bars */}
          {Array.from({ length: 20 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.waveBar,
                {
                  height: Math.random() * 20 + 8,
                  backgroundColor: isMe ? '#FFFFFF' : '#3B82F6',
                  opacity: isPlaying && index < 10 ? 1 : 0.5,
                },
              ]}
            />
          ))}
        </View>

        <Text style={[styles.duration, isMe && styles.durationMe]}>
          {formatDuration(duration)}
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
  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    minWidth: 200,
  },
  bubbleOther: {
    backgroundColor: '#F3F4F6',
  },
  bubbleMe: {
    backgroundColor: '#3B82F6',
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  waveformContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 28,
  },
  waveBar: {
    width: 2,
    borderRadius: 1,
  },
  duration: {
    marginLeft: 12,
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 13,
    color: '#6B7280',
  },
  durationMe: {
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