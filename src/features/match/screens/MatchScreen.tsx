import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMatchStore } from '../hooks/matchStore';
import { useMatchUsers } from '../hooks/useMatchUsers';
import { MatchCard } from '../components/MatchCard';
import { MatchCardSkeleton } from '../components/MatchListSkeleton';
import { useAuth } from '../../../app/providers/AuthProvider';

interface MatchScreenProps {
  navigation: any;
  route: {
    params: {
      userId: string;
    };
  };
}

export const MatchScreen: React.FC<MatchScreenProps> = ({ navigation }) => {
  const { user } = useAuth()
  const { filters, updateFilters } = useMatchStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch matches with React Query
  const {
    data: matchData,
    isLoading,
    isError,
    error,
    refetch,
  } = useMatchUsers(user.id, filters);

  // Handle refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  console.log(error);

  // Handle card press - navigate to detail
  const handleMatchPress = useCallback(
    (match: MatchResult) => {
      navigation.navigate('MatchDetail', { 
        matchData: match,
        userId: user.id,
      });
    },
    [navigation, user.id]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (minPercentage: number) => {
      updateFilters({ minMatchPercentage: minPercentage });
    },
    [updateFilters]
  );

  const matches = useMemo(() => matchData?.data.matches || [], [matchData]);

  // Render item with optimization
  const renderItem = useCallback(
    ({ item }: { item: MatchResult }) => (
      <MatchCard match={item} onPress={handleMatchPress} />
    ),
    [handleMatchPress]
  );

  // Key extractor
  const keyExtractor = useCallback(
    (item: MatchResult) => item.user.id,
    []
  );

  // Render loading state
  if (isLoading && !matchData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
       <MatchCardSkeleton/>
      </SafeAreaView>
    );
  }

  // Render error state
  if (isError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>
          {error?.message || 'Failed to load matches'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Render empty state
  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyTitle}>No matches found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your filters or{'\n'}check back later for new matches
        </Text>
        {filters.minMatchPercentage! > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => handleFilterChange(0)}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Your Matches</Text>
          <Text style={styles.subtitle}>
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
          </Text>
        </View>
      </View>

      {/* Filter buttons */}
      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          active={filters.minMatchPercentage === 0}
          onPress={() => handleFilterChange(0)}
        />
        <FilterButton
          label="30%+"
          active={filters.minMatchPercentage === 30}
          onPress={() => handleFilterChange(30)}
        />
        <FilterButton
          label="50%+"
          active={filters.minMatchPercentage === 50}
          onPress={() => handleFilterChange(50)}
        />
        <FilterButton
          label="70%+"
          active={filters.minMatchPercentage === 70}
          onPress={() => handleFilterChange(70)}
        />
      </View>

      {/* Match list */}
      <FlatList
        data={matches}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={10}
        initialNumToRender={5}
        // Add list separator
        ItemSeparatorComponent={null}
        // Empty list component (backup)
        ListEmptyComponent={null}
      />
    </SafeAreaView>
  );
};

// Filter button component
interface FilterButtonProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

const FilterButton: React.FC<FilterButtonProps> = React.memo(({ 
  label, 
  active, 
  onPress 
}) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.filterButtonActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
      {label}
    </Text>
  </TouchableOpacity>
));

FilterButton.displayName = 'FilterButton';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: '#ffffff',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  resetButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '700',
  },
});