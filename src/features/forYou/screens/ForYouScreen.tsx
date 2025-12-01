// screens/MatchScreen.tsx (formerly MatchScreen)
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// 🎯 Static Data - Beli Style
const EXPLORE_DATA = {
  quickCategories: [
    {
      id: '1',
      title: 'just opened',
      subtitle: 'be the first to go!',
      color: '#10B981',
      icon: '🆕',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    },
    {
      id: '2',
      title: 'trending',
      subtitle: "today's poppin' places",
      color: '#F59E0B',
      icon: '🔥',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    },
    {
      id: '3',
      title: 'lowkey',
      subtitle: '<25 google reviews',
      color: '#8B5CF6',
      icon: '🤫',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
    },
    {
      id: '4',
      title: 'popular',
      subtitle: 'all time favorites',
      color: '#EC4899',
      icon: '⭐',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
    },
  ],

  // 👋 NEW: Matched Users Section
  matchedUsers: [
    {
      id: '1',
      name: 'Sarah',
      age: 24,
      image: 'https://i.pravatar.cc/300?img=1',
      distance: '1.2 km',
      matchScore: 94,
      sharedInterests: ['Coffee', 'Art', 'Photography'],
      vibes: ['✨ Creative', '☕ Chill'],
      bio: 'Coffee addict, weekend artist',
    },
    {
      id: '2',
      name: 'Alex',
      age: 26,
      image: 'https://i.pravatar.cc/300?img=12',
      distance: '2.5 km',
      matchScore: 89,
      sharedInterests: ['Fitness', 'Food', 'Music'],
      vibes: ['🔥 Energetic', '🎉 Social'],
      bio: 'Gym rat, food explorer',
    },
    {
      id: '3',
      name: 'Maya',
      age: 23,
      image: 'https://i.pravatar.cc/300?img=5',
      distance: '0.8 km',
      matchScore: 92,
      sharedInterests: ['Reading', 'Cafes', 'Philosophy'],
      vibes: ['📚 Intellectual', '🧘 Relaxed'],
      bio: 'Bookworm & cafe hopper',
    },
    {
      id: '4',
      name: 'Jake',
      age: 25,
      image: 'https://i.pravatar.cc/300?img=33',
      distance: '1.8 km',
      matchScore: 87,
      sharedInterests: ['Music', 'Night life', 'Art'],
      vibes: ['🎵 Music lover', '🌙 Night owl'],
      bio: 'Indie music enthusiast',
    },
  ],

  pickedForYou: [
    {
      id: '1',
      name: 'The Four Horsemen',
      location: 'Brooklyn',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      tag: '🍷 vibey wine & plates',
      vibeMatch: 'Moonflower',
      savedBy: 'shreya',
      savedCount: 116,
      avatars: [
        'https://i.pravatar.cc/40?img=1',
        'https://i.pravatar.cc/40?img=5',
      ],
    },
    {
      id: '2',
      name: 'Kopitiam Jakarta',
      location: 'Senopati',
      priceRange: '$',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
      tag: '☕ cozy coffee spot',
      vibeMatch: 'Chill vibes',
      savedBy: 'alex',
      savedCount: 84,
      avatars: [
        'https://i.pravatar.cc/40?img=12',
        'https://i.pravatar.cc/40?img=8',
      ],
    },
    {
      id: '3',
      name: 'Vinyl Lounge',
      location: 'Kemang',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400',
      tag: '🎵 live music & drinks',
      vibeMatch: 'Night owl',
      savedBy: 'maya',
      savedCount: 203,
      avatars: [
        'https://i.pravatar.cc/40?img=20',
        'https://i.pravatar.cc/40?img=15',
      ],
    },
    {
      id: '4',
      name: 'Social House',
      location: 'SCBD',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      tag: '🍽️ trendy brunch spot',
      vibeMatch: 'Foodie',
      savedBy: 'kim',
      savedCount: 142,
      avatars: [
        'https://i.pravatar.cc/40?img=25',
        'https://i.pravatar.cc/40?img=30',
      ],
    },
  ],

  listsForYou: [
    {
      id: '1',
      title: 'wannabe wlv carrie brads...',
      author: '@Rachel',
      visitedDate: '1/14',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      places: 12,
    },
    {
      id: '2',
      title: 'slice to dip new york',
      author: '@insha',
      visitedDate: '2/16',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      places: 8,
    },
    {
      id: '3',
      title: 'indie cafes jakarta',
      author: '@Kim',
      visitedDate: '3/02',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
      places: 15,
    },
  ],
};

export const ForYouScreen = () => {
  const [selectedCity, setSelectedCity] = useState('NYC');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F9" />
      
      {/* 🎨 Header */}
      <View style={styles.header}>
        {/* Location Selector */}
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationText}>{selectedCity}</Text>
          <Icon name="chevron-down" size={16} color="#1A1A1A" />
        </TouchableOpacity>

        {/* Logo */}
        <Text style={styles.logo}>vstrim</Text>

        {/* Right Icons */}
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="person-circle-outline" size={28} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Icon name="notifications-outline" size={26} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 🎯 Quick Categories - 2x2 Grid */}
        <View style={styles.categoriesGrid}>
          {EXPLORE_DATA.quickCategories.map((category) => (
            <QuickCategoryCard key={category.id} category={category} />
          ))}
        </View>

        {/* 👋 NEW: Say Hi & Hangout Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>say hi & hangout</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>view all</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>people who share your interests</Text>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.usersScroll}
          >
            {EXPLORE_DATA.matchedUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </ScrollView>
        </View>

        {/* 🎨 Picked For You Section - NOW HORIZONTAL SCROLL */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>picked for you</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>view the list</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.placesScroll}
          >
            {EXPLORE_DATA.pickedForYou.map((place) => (
              <PickedPlaceCard key={place.id} place={place} />
            ))}
          </ScrollView>
        </View>

        {/* 📋 Lists For You Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>lists for you</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>view all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listsScroll}
          >
            {EXPLORE_DATA.listsForYou.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// 🎯 Quick Category Card (2x2 Grid Item)
const QuickCategoryCard = ({ category }: any) => (
  <TouchableOpacity style={styles.categoryCard}>
    <Image source={{ uri: category.image }} style={styles.categoryImage} />
    <View style={styles.categoryOverlay} />
    
    <View style={styles.categoryContent}>
      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
    </View>
  </TouchableOpacity>
);

// 👋 NEW: User Card (Horizontal Scroll)
const UserCard = ({ user }: any) => (
  <TouchableOpacity style={styles.userCard}>
    {/* Profile Image */}
    <Image source={{ uri: user.image }} style={styles.userImage} />
    
    {/* Match Badge */}
    <View style={styles.userMatchBadge}>
      <Text style={styles.userMatchText}>{user.matchScore}%</Text>
    </View>

    {/* Content */}
    <View style={styles.userContent}>
      <View style={styles.userHeader}>
        <Text style={styles.userName}>{user.name}, {user.age}</Text>
        <Text style={styles.userDistance}>📍 {user.distance}</Text>
      </View>

      <Text style={styles.userBio} numberOfLines={2}>
        {user.bio}
      </Text>

      {/* Vibes */}
      <View style={styles.userVibes}>
        {user.vibes.slice(0, 2).map((vibe: string, index: number) => (
          <Text key={index} style={styles.userVibe}>{vibe}</Text>
        ))}
      </View>

      {/* Shared Interests */}
      <View style={styles.sharedInterests}>
        <Text style={styles.sharedLabel}>shared interests:</Text>
        <Text style={styles.sharedText} numberOfLines={1}>
          {user.sharedInterests.join(', ')}
        </Text>
      </View>

      {/* Say Hi Button */}
      <TouchableOpacity style={styles.sayHiButton}>
        <Text style={styles.sayHiText}>👋 say hi</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// 🍽️ Picked Place Card - NOW VERTICAL CARD FOR HORIZONTAL SCROLL
const PickedPlaceCard = ({ place }: any) => (
  <TouchableOpacity style={styles.pickedCardHorizontal}>
    {/* Image */}
    <Image source={{ uri: place.image }} style={styles.pickedImageHorizontal} />

    {/* Content */}
    <View style={styles.pickedContentHorizontal}>
      <Text style={styles.pickedName} numberOfLines={1}>
        {place.name}
      </Text>
      <Text style={styles.pickedLocation}>
        {place.location} • {place.priceRange}
      </Text>

      {/* Tag */}
      <View style={styles.pickedTag}>
        <Text style={styles.pickedTagText} numberOfLines={1}>
          {place.tag}
        </Text>
      </View>

      {/* Vibe Match */}
      <View style={styles.vibeMatch}>
        <Text style={styles.vibeMatchIcon}>🎵</Text>
        <Text style={styles.vibeMatchText} numberOfLines={1}>
          vibe match: <Text style={styles.vibeMatchName}>{place.vibeMatch}</Text>
        </Text>
      </View>

      {/* Saved By */}
      <View style={styles.savedBySectionHorizontal}>
        <View style={styles.avatarsRow}>
          {place.avatars.slice(0, 2).map((avatar: string, index: number) => (
            <Image 
              key={index} 
              source={{ uri: avatar }} 
              style={[styles.avatarSmall, index > 0 && styles.avatarOverlap]} 
            />
          ))}
        </View>
        <Text style={styles.savedByTextSmall} numberOfLines={1}>
          {place.savedCount}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

// 📋 List Card (Horizontal Scroll)
const ListCard = ({ list }: any) => (
  <TouchableOpacity style={styles.listCard}>
    <Image source={{ uri: list.image }} style={styles.listImage} />
    
    {/* Gradient Overlay */}
    <View style={styles.listOverlay} />

    {/* Content */}
    <View style={styles.listContent}>
      <Text style={styles.listTitle} numberOfLines={2}>
        {list.title}
      </Text>
      <Text style={styles.listAuthor}>by {list.author}</Text>
      <Text style={styles.listVisited}>visited {list.visitedDate}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F9',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F0F4F9',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    padding: 4,
  },

  // Content
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },

  // Categories Grid (2x2)
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  categoryCard: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  categoryContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
  },

  // Section
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },

  // 👋 User Card (NEW)
  usersScroll: {
    paddingLeft: 20,
    gap: 12,
  },
  userCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  userImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E5E5EA',
  },
  userMatchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  userMatchText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  userContent: {
    padding: 12,
  },
  userHeader: {
    marginBottom: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  userDistance: {
    fontSize: 11,
    color: '#999',
  },
  userBio: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  userVibes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },
  userVibe: {
    fontSize: 10,
    color: '#667eea',
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sharedInterests: {
    backgroundColor: '#FFF9E6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
  sharedLabel: {
    fontSize: 9,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  sharedText: {
    fontSize: 11,
    color: '#92400E',
  },
  sayHiButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  sayHiText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },

  // Picked Place Card - Horizontal Scroll Version
  placesScroll: {
    paddingLeft: 20,
    gap: 12,
  },
  pickedCardHorizontal: {
    width: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  pickedImageHorizontal: {
    width: '100%',
    height: 140,
    backgroundColor: '#E5E5EA',
  },
  pickedContentHorizontal: {
    padding: 12,
  },
  pickedName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  pickedLocation: {
    fontSize: 11,
    color: '#666',
    marginBottom: 8,
  },
  pickedTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3F2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 6,
  },
  pickedTagText: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '600',
  },
  vibeMatch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vibeMatchIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  vibeMatchText: {
    fontSize: 10,
    color: '#666',
    flex: 1,
  },
  vibeMatchName: {
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#1A1A1A',
  },
  savedBySectionHorizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarSmall: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  savedByTextSmall: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
  },

  // Lists Horizontal Scroll
  listsScroll: {
    paddingLeft: 20,
    gap: 12,
  },
  listCard: {
    width: 200,
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  listImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  listOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  listContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 22,
  },
  listAuthor: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  listVisited: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },
});