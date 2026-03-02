// components/match/MatchListSkeleton.tsx (Loading placeholder)
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

/**
 * Skeleton loader untuk better UX saat loading
 * Analogi: Seperti skeleton di Facebook/Instagram feed
 */
export const MatchCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageSkeleton} />
      <View style={styles.content}>
        <View style={styles.nameSkeleton} />
        <View style={styles.usernameSkeleton} />
        <View style={styles.bioSkeleton} />
        <View style={styles.breakdownSkeleton}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.barSkeleton} />
          ))}
        </View>
      </View>
    </View>
  );
};

export const MatchListSkeleton: React.FC = () => {
  return (
    <View style={styles.listContainer}>
      {[1, 2, 3].map((i) => (
        <MatchCardSkeleton key={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    width: CARD_WIDTH,
  },
  imageSkeleton: {
    height: 240,
    backgroundColor: '#e5e7eb',
  },
  content: {
    padding: 16,
  },
  nameSkeleton: {
    height: 24,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
    width: '60%',
  },
  usernameSkeleton: {
    height: 16,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 12,
    width: '40%',
  },
  bioSkeleton: {
    height: 40,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 16,
  },
  breakdownSkeleton: {
    gap: 12,
  },
  barSkeleton: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
});