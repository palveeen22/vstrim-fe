// src/features/messages/components/UserAvatar.tsx

import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface UserAvatarProps {
  avatar: string;
  username: string;
  isOnline?: boolean;
  size?: number;
  onPress?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  avatar,
  username,
  isOnline,
  size = 70,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View>
        <Image
          source={{ uri: avatar }}
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        />
        {isOnline && <View style={styles.onlineBadge} />}
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {username}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 80,
  },
  avatar: {
    backgroundColor: '#E5E7EB',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  username: {
    marginTop: 8,
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    textAlign: 'center',
  },
});