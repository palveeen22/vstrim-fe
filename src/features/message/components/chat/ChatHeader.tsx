// src/features/messages/components/ChatHeader.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface IProps {
  user: any;
  isOnline?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
}

export const ChatHeader = ({
  user,
  isOnline,
  onBackPress,
  onMenuPress,
}: IProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <Icon name="chevron-back" size={28} color="#1F2937" />
      </TouchableOpacity>

      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user?.photoProfile }} style={styles.avatar} />
          {isOnline && <View style={styles.onlineBadge} />}
        </View>
        <Text style={styles.name}>{user?.name}</Text>
      </View>

      <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
        <Icon name="ellipsis-horizontal" size={24} color="#1F2937" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: {
    marginLeft: 12,
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  menuButton: {
    padding: 4,
  },
});