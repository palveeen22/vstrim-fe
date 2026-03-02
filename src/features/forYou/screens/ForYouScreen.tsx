import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  SafeAreaView,
  SectionList,
} from 'react-native';
import { SegmentedControl } from '../components/SegmentedControl';
import { QuickCategoryCard } from '../components/QuickCategoryCard';
import { SectionHeader } from '../../../shared/ui/SectionHeader';
import { EventCard } from '../components/EventCard';
import { MatchCard } from '../../../features/match/components/MatchCard'; // 👈 Import MatchCard
import { Header } from '../components/Header';
import { EVENTS_DATA, EXPLORE_DATA } from '../model/content';
import { useAuth } from '../../../app/providers/AuthProvider';
import { useMatchUsers } from '../../../features/match/hooks/useMatchUsers';
import { useMatchStore } from '../../../features/match/hooks/matchStore';
import { MatchCardSkeleton } from '../../../features/match/components/MatchListSkeleton';
import { NetworkError } from '../../../shared/ui';

// 🎯 Type untuk Section
type SectionType = 'categories' | 'events' | 'friends' | 'activities';
type Tab = 'Events' | 'Friends' | 'Activities';

interface Section {
  type: SectionType;
  title?: string;
  data: any[];
}

// 🎨 Categories Grid Component
interface CategoriesGridProps {
  categories: typeof EXPLORE_DATA.quickCategories;
}

const CategoriesGrid: React.FC<CategoriesGridProps> = ({ categories }) => (
  <View style={styles.categoriesGrid}>
    {categories.map((category) => (
      <QuickCategoryCard key={category.id} category={category} />
    ))}
  </View>
);

// 🎨 List Header Component
interface ListHeaderProps {
  onTabChange: (tab: Tab) => void;
}

const ListHeader: React.FC<ListHeaderProps> = ({ onTabChange }) => (
  <SegmentedControl onTabChange={onTabChange} />
);

export const ForYouScreen = () => {
  const { user } = useAuth();
  const { filters } = useMatchStore();
  const [selectedCity, setSelectedCity] = useState('St Peter');
  const [activeTab, setActiveTab] = useState<Tab>('Events');

  const {
    data: matchData,
    isLoading,
    isError,
  } = useMatchUsers(user.id, filters);

  // 🎯 Dynamic Sections based on active tab
  const sections: Section[] = useMemo(() => {
    // Always show categories first
    const baseSections: Section[] = [
      {
        type: 'categories',
        data: [],
      },
    ];

    // Add content based on active tab
    switch (activeTab) {
      case 'Events':
        return [
          ...baseSections,
          {
            type: 'events',
            title: 'Happening Near You',
            data: matchData?.data?.grouped?.events || EVENTS_DATA,
          },
        ];

      case 'Friends':
        return [
          ...baseSections,
          {
            type: 'friends',
            title: 'People You Might Like',
            data: matchData?.data?.grouped?.users || [],
          },
        ];

      case 'Activities':
        return [
          ...baseSections,
          {
            type: 'activities',
            title: 'Activities For You',
            data: [
              ...(matchData?.data?.grouped?.places || []),
              ...(matchData?.data?.grouped?.communities || []),
            ],
          },
        ];

      default:
        return baseSections;
    }
  }, [activeTab, matchData]);

  // Render loading state
  if (isLoading && !matchData) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <MatchCardSkeleton />
      </SafeAreaView>
    );
  }

  // Render error state
  if (isError) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <NetworkError />
      </SafeAreaView>
    );
  }

  // 👇 Handle tab change
  const handleTabChange = (tab: Tab) => {
    console.log('Active tab:', tab);
    setActiveTab(tab);
  };

  const handleInterested = (eventId: string) => {
    console.log('Interested in event:', eventId);
  };

  const handleMatchPress = (match: any) => {
    console.log('Match pressed:', match);
    // Navigate to match detail
  };

  const handleLocationPress = () => {
    Alert.alert('Select Location', 'Choose your city', [
      { text: 'Downtown', onPress: () => setSelectedCity('Downtown') },
      { text: 'Brooklyn', onPress: () => setSelectedCity('Brooklyn') },
      { text: 'Manhattan', onPress: () => setSelectedCity('Manhattan') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // 🎨 Render Section Header
  const renderSectionHeader = ({ section }: { section: Section }) => {
    if (section.type === 'categories') {
      return <CategoriesGrid categories={EXPLORE_DATA.quickCategories} />;
    }

    if (section.title) {
      return (
        <View style={styles.sectionHeaderWrapper}>
          <SectionHeader title={section.title} />
        </View>
      );
    }

    return null;
  };

  // 🎨 Render Item based on type
  const renderItem = ({ item, section }: { item: any; section: Section }) => {
    console.log(item, "?");
    if (section.type === 'categories') {
      return null;
    }

    if (section.type === 'events') {
      return (
        <EventCard
          item={item.entity}
          onInterested={() => handleInterested(item.id)}
        />
      );
    }

    // Friends tab
    if (section.type === 'friends') {
      return (
        <View style={styles.matchCardWrapper}>
          <MatchCard
            currentUserId={item?.entity?.id}
            currentUserName={item?.entity?.name}
            currentUserPhoto={item?.entity?.photoProfile}
            item={item.entity}
            onPress={handleMatchPress}
          />
        </View>
      );
    }

    // Activities tab
    if (section.type === 'activities') {
      return (
        <View style={styles.matchCardWrapper}>
          <MatchCard
            currentUserId={item?.entity?.id}
            currentUserName={item?.entity?.name}
            currentUserPhoto={item?.entity?.photoProfile}
            item={item.entity}
            onPress={handleMatchPress} />
        </View>
      );
    }

    return null;
  };

  // Key extractor with better handling
  const keyExtractor = (item: any, index: number) => {
    if (item.entity) {
      return `${item.entity.type}-${item.entity.id}`;
    }
    return item.id || `item-${index}`;
  };

  console.log('Active tab:', activeTab);
  console.log('Current sections:', sections);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F9" />

      <Header
        selectedCity={selectedCity}
        onLocationPress={handleLocationPress}
        onNotificationPress={handleLocationPress}
        unreadCount={3}
      />

      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={<ListHeader onTabChange={handleTabChange} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        stickySectionHeadersEnabled={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  sectionHeaderWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  matchCardWrapper: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
});