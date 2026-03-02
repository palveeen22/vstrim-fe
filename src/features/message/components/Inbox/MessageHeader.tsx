// src/features/messages/components/MessageHeader.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface MessageHeaderProps {
  onSearchPress?: () => void;
  onFilterPress?: () => void;
}

export const MessageHeader: React.FC<MessageHeaderProps> = ({
  onSearchPress,
  onFilterPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
          <Icon name="search-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={onFilterPress}>
          <Icon name="filter-outline" size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 28,
    color: '#1F2937',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});