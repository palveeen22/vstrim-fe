// src/features/messages/components/RecentlyActiveList.tsx

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { UserAvatar } from './UserAvatar';
import { User } from '../../model/messages.types';

interface RecentlyActiveListProps {
  users: User[];
  onUserPress?: (user: User) => void;
}

export const RecentlyActiveList: React.FC<RecentlyActiveListProps> = ({
  users,
  onUserPress,
}) => {
  return (
    <FlatList
      data={users}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <UserAvatar
          avatar={item.avatar}
          username={item.username}
          isOnline={item.isOnline}
          onPress={() => onUserPress?.(item)}
        />
      )}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  separator: {
    width: 16,
  },
});