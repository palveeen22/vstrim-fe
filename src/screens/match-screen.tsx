// screens/MatchScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// 🎯 Static Data
const MATCH_DATA = {
  todayMatches: [
    {
      id: '1',
      name: 'Sarah Kim',
      age: 24,
      image: 'https://i.pravatar.cc/300?img=1',
      matchScore: 94,
      distance: '1.2 km',
      vibes: ['✨ Creative', '☕ Chill', '🎨 Artistic'],
      bio: 'Coffee addict, weekend artist, trying to find the best sunset spots 🌅',
      mutualInterests: ['Photography', 'Indie Music', 'Cafe Hopping'],
    },
    {
      id: '2',
      name: 'Alex Rivera',
      age: 26,
      image: 'https://i.pravatar.cc/300?img=12',
      matchScore: 89,
      distance: '2.5 km',
      vibes: ['🔥 Energetic', '🏃 Active', '🎉 Social'],
      bio: 'Gym rat by day, party starter by night. Let\'s grab bubble tea! 🧋',
      mutualInterests: ['Fitness', 'EDM', 'Food Adventures'],
    },
    {
      id: '3',
      name: 'Maya Chen',
      age: 23,
      image: 'https://i.pravatar.cc/300?img=5',
      matchScore: 87,
      distance: '0.8 km',
      vibes: ['📚 Intellectual', '🧘 Relaxed', '🌱 Cozy'],
      bio: 'Bookworm looking for library buddies and late-night philosophical talks',
      mutualInterests: ['Reading', 'Philosophy', 'Korean Dramas'],
    },
  ],
  
  communities: [
    {
      id: '1',
      name: 'Jakarta Coffee Lovers',
      members: 2847,
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400',
      matchScore: 92,
      tags: ['☕ Coffee', '📸 Photography', '🎨 Creative'],
      nextEvent: 'Sunday Coffee Cupping',
    },
    {
      id: '2',
      name: 'Weekend Warriors',
      members: 1523,
      image: 'https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=400',
      matchScore: 88,
      tags: ['🏃 Active', '🏔️ Adventure', '🌲 Outdoor'],
      nextEvent: 'Hiking Gunung Pancar',
    },
    {
      id: '3',
      name: 'Indie Music Jakarta',
      members: 3241,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      matchScore: 85,
      tags: ['🎵 Music', '🎸 Concerts', '🎤 Vibes'],
      nextEvent: 'Open Mic Night',
    },
  ],

  events: [
    {
      id: '1',
      name: 'Sunset Yoga Session',
      date: '2024-11-15',
      time: '17:00',
      location: 'Menteng Park',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
      attendees: 24,
      price: 'Free',
      matchScore: 91,
      tags: ['🧘 Wellness', '🌅 Outdoor', '✨ Chill'],
    },
    {
      id: '2',
      name: 'Local Band Night',
      date: '2024-11-16',
      time: '20:00',
      location: 'The Goods Diner',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
      attendees: 67,
      price: '150K',
      matchScore: 89,
      tags: ['🎵 Live Music', '🍻 Social', '🎉 Fun'],
    },
    {
      id: '3',
      name: 'Sunday Market & Brunch',
      date: '2024-11-17',
      time: '09:00',
      location: 'Senopati',
      image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=400',
      attendees: 142,
      price: 'Pay as you go',
      matchScore: 86,
      tags: ['🍳 Food', '🛍️ Market', '☀️ Morning'],
    },
  ],

  places: [
    {
      id: '1',
      name: 'Tanamera Coffee',
      type: 'Cafe',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
      rating: 4.8,
      distance: '0.5 km',
      matchScore: 93,
      vibes: ['☕ Cozy', '📚 Quiet', '💼 Work-friendly'],
      priceRange: '$$',
    },
    {
      id: '2',
      name: 'Vinyl Lounge',
      type: 'Bar',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400',
      rating: 4.6,
      distance: '1.8 km',
      matchScore: 88,
      vibes: ['🎵 Music', '🍸 Drinks', '✨ Trendy'],
      priceRange: '$$$',
    },
    {
      id: '3',
      name: 'The Park Social',
      type: 'Outdoor Venue',
      image: 'https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=400',
      rating: 4.9,
      distance: '2.1 km',
      matchScore: 85,
      vibes: ['🌳 Outdoor', '🌅 Sunset', '📸 Instagram-worthy'],
      priceRange: '$$',
    },
  ],

  promos: [
    {
      id: '1',
      title: 'Buy 1 Get 1 Coffee',
      place: 'Kopi Kenangan',
      validUntil: '2024-11-20',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      discount: '50%',
      matchScore: 90,
    },
    {
      id: '2',
      title: '30% Off Dinner',
      place: 'Social House',
      validUntil: '2024-11-18',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      discount: '30%',
      matchScore: 87,
    },
  ],
};

const MatchScreen = () => {
  const [activeTab, setActiveTab] = useState<'people' | 'communities' | 'events' | 'places'>('people');

  return (
    <View style={styles.container}>
      {/* ✨ Gradient Header */}
      <View
        // colors={['#667eea', '#764ba2']}
        style={styles.header}
        // start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 1 }}
      >
        <Text style={styles.headerTitle}>Your Matches ✨</Text>
        <Text style={styles.headerSubtitle}>Based on today's vibes</Text>
      </View>

      {/* 🎯 Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TabButton
            icon="👥"
            label="People"
            active={activeTab === 'people'}
            onPress={() => setActiveTab('people')}
          />
          <TabButton
            icon="🏘️"
            label="Communities"
            active={activeTab === 'communities'}
            onPress={() => setActiveTab('communities')}
          />
          <TabButton
            icon="🎉"
            label="Events"
            active={activeTab === 'events'}
            onPress={() => setActiveTab('events')}
          />
          <TabButton
            icon="📍"
            label="Places"
            active={activeTab === 'places'}
            onPress={() => setActiveTab('places')}
          />
        </ScrollView>
      </View>

      {/* 📱 Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'people' && <PeopleSection data={MATCH_DATA.todayMatches} />}
        {activeTab === 'communities' && <CommunitiesSection data={MATCH_DATA.communities} />}
        {activeTab === 'events' && <EventsSection data={MATCH_DATA.events} />}
        {activeTab === 'places' && <PlacesSection data={MATCH_DATA.places} />}

        {/* 🎁 Promos Section (Always shown) */}
        <View style={styles.promosSection}>
          <Text style={styles.sectionTitle}>🎁 Hot Deals for You</Text>
          {MATCH_DATA.promos.map(promo => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// 🎯 Tab Button Component
const TabButton = ({ icon, label, active, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tabButton, active && styles.tabButtonActive]}
  >
    <Text style={styles.tabIcon}>{icon}</Text>
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
    {active && <View style={styles.tabIndicator} />}
  </TouchableOpacity>
);

// 👥 People Section
const PeopleSection = ({ data }: any) => (
  <View>
    <Text style={styles.sectionTitle}>Today's Top Matches 🔥</Text>
    {data.map((person: any) => (
      <PersonCard key={person.id} person={person} />
    ))}
  </View>
);

// 👤 Person Card
const PersonCard = ({ person }: any) => (
  <TouchableOpacity style={styles.personCard}>
    <Image source={{ uri: person.image }} style={styles.personImage} />
    
    {/* Match Score Badge */}
    <View style={styles.matchBadge}>
      <Text style={styles.matchBadgeText}>{person.matchScore}%</Text>
      <Text style={styles.matchBadgeLabel}>Match</Text>
    </View>

    <View style={styles.personContent}>
      <View style={styles.personHeader}>
        <Text style={styles.personName}>
          {person.name}, {person.age}
        </Text>
        <Text style={styles.personDistance}>📍 {person.distance}</Text>
      </View>

      <Text style={styles.personBio}>{person.bio}</Text>

      {/* Vibes */}
      <View style={styles.vibesContainer}>
        {person.vibes.map((vibe: string, index: number) => (
          <View key={index} style={styles.vibeTag}>
            <Text style={styles.vibeText}>{vibe}</Text>
          </View>
        ))}
      </View>

      {/* Mutual Interests */}
      <View style={styles.mutualInterests}>
        <Text style={styles.mutualLabel}>Mutual Interests:</Text>
        <Text style={styles.mutualText}>
          {person.mutualInterests.join(', ')}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.passButton}>
          <Text style={styles.passButtonText}>Pass</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.connectButton}>
          <View
            // colors={['#667eea', '#764ba2']}
            style={styles.connectGradient}
            // start={{ x: 0, y: 0 }}
            // end={{ x: 1, y: 0 }}
          >
            <Text style={styles.connectButtonText}>Connect 💫</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// 🏘️ Communities Section
const CommunitiesSection = ({ data }: any) => (
  <View>
    <Text style={styles.sectionTitle}>Communities You'll Love 🏘️</Text>
    {data.map((community: any) => (
      <CommunityCard key={community.id} community={community} />
    ))}
  </View>
);

// 🏘️ Community Card
const CommunityCard = ({ community }: any) => (
  <TouchableOpacity style={styles.communityCard}>
    <Image source={{ uri: community.image }} style={styles.communityImage} />
    
    <View
      // colors={['transparent', 'rgba(0,0,0,0.8)']}
      style={styles.communityOverlay}
    >
      <View style={styles.communityBadge}>
        <Text style={styles.communityBadgeText}>{community.matchScore}% Match</Text>
      </View>

      <Text style={styles.communityName}>{community.name}</Text>
      <Text style={styles.communityMembers}>👥 {community.members.toLocaleString()} members</Text>
      
      <View style={styles.communityTags}>
        {community.tags.map((tag: string, index: number) => (
          <Text key={index} style={styles.communityTag}>{tag}</Text>
        ))}
      </View>

      <View style={styles.communityFooter}>
        <Text style={styles.communityEvent}>📅 {community.nextEvent}</Text>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

// 🎉 Events Section
const EventsSection = ({ data }: any) => (
  <View>
    <Text style={styles.sectionTitle}>Events Nearby 🎉</Text>
    {data.map((event: any) => (
      <EventCard key={event.id} event={event} />
    ))}
  </View>
);

// 🎉 Event Card
const EventCard = ({ event }: any) => (
  <TouchableOpacity style={styles.eventCard}>
    <Image source={{ uri: event.image }} style={styles.eventImage} />
    
    <View style={styles.eventBadge}>
      <Text style={styles.eventBadgeText}>{event.matchScore}%</Text>
    </View>

    <View style={styles.eventContent}>
      <Text style={styles.eventName}>{event.name}</Text>
      
      <View style={styles.eventInfo}>
        <Text style={styles.eventInfoText}>📅 {event.date}</Text>
        <Text style={styles.eventInfoText}>🕐 {event.time}</Text>
      </View>
      
      <Text style={styles.eventLocation}>📍 {event.location}</Text>
      
      <View style={styles.eventTags}>
        {event.tags.map((tag: string, index: number) => (
          <Text key={index} style={styles.eventTag}>{tag}</Text>
        ))}
      </View>

      <View style={styles.eventFooter}>
        <Text style={styles.eventAttendees}>👥 {event.attendees} going</Text>
        <View style={styles.eventPriceContainer}>
          <Text style={styles.eventPrice}>{event.price}</Text>
          <TouchableOpacity style={styles.interestedButton}>
            <Text style={styles.interestedButtonText}>I'm Interested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

// 📍 Places Section
const PlacesSection = ({ data }: any) => (
  <View>
    <Text style={styles.sectionTitle}>Places You'll Love 📍</Text>
    {data.map((place: any) => (
      <PlaceCard key={place.id} place={place} />
    ))}
  </View>
);

// 📍 Place Card
const PlaceCard = ({ place }: any) => (
  <TouchableOpacity style={styles.placeCard}>
    <Image source={{ uri: place.image }} style={styles.placeImage} />
    
    <View style={styles.placeContent}>
      <View style={styles.placeHeader}>
        <View>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeType}>{place.type} • {place.priceRange}</Text>
        </View>
        <View style={styles.placeBadge}>
          <Text style={styles.placeBadgeText}>{place.matchScore}%</Text>
        </View>
      </View>

      <View style={styles.placeInfo}>
        <Text style={styles.placeRating}>⭐ {place.rating}</Text>
        <Text style={styles.placeDistance}>📍 {place.distance}</Text>
      </View>

      <View style={styles.placeVibes}>
        {place.vibes.map((vibe: string, index: number) => (
          <Text key={index} style={styles.placeVibe}>{vibe}</Text>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

// 🎁 Promo Card
const PromoCard = ({ promo }: any) => (
  <TouchableOpacity style={styles.promoCard}>
    <Image source={{ uri: promo.image }} style={styles.promoImage} />
    
    <View style={styles.promoDiscount}>
      <Text style={styles.promoDiscountText}>{promo.discount}</Text>
      <Text style={styles.promoDiscountLabel}>OFF</Text>
    </View>

    <View style={styles.promoContent}>
      <Text style={styles.promoTitle}>{promo.title}</Text>
      <Text style={styles.promoPlace}>📍 {promo.place}</Text>
      <Text style={styles.promoValid}>Valid until {promo.validUntil}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  
  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#667eea',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },

  // Tabs
  tabContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#F0F0F0',
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#667eea',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -12,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#667eea',
    borderRadius: 2,
  },

  // Content
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 16,
    marginHorizontal: 20,
  },

  // Person Card
  personCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  personImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#E0E0E0',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  matchBadgeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  matchBadgeLabel: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
  },
  personContent: {
    padding: 16,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  personDistance: {
    fontSize: 14,
    color: '#666',
  },
  personBio: {
    fontSize: 15,
    color: '#666',
    marginBottom: 12,
    lineHeight: 22,
  },
  vibesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  vibeTag: {
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  vibeText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '600',
  },
  mutualInterests: {
    backgroundColor: '#FFF9E6',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  mutualLabel: {
    fontSize: 12,
    color: '#F59E0B',
    fontWeight: '600',
    marginBottom: 4,
  },
  mutualText: {
    fontSize: 14,
    color: '#92400E',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  passButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  passButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  connectButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  connectGradient: {
    padding: 16,
    alignItems: 'center',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // Community Card
  communityCard: {
    height: 250,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  communityImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  communityOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  communityBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  communityBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#667eea',
  },
  communityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  communityMembers: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  communityTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  communityTag: {
    fontSize: 12,
    color: '#FFFFFF',
    marginRight: 8,
    marginBottom: 4,
  },
  communityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityEvent: {
    fontSize: 13,
    color: '#FFFFFF',
    flex: 1,
  },
  joinButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },

  // Event Card
  eventCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 180,
    backgroundColor: '#E0E0E0',
  },
  eventBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  eventBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
  },
  eventContent: {
    padding: 16,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  eventInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 6,
  },
  eventInfoText: {
    fontSize: 14,
    color: '#666',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  eventTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  eventTag: {
    fontSize: 13,
    color: '#667eea',
    marginRight: 12,
    marginBottom: 4,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventAttendees: {
    fontSize: 14,
    color: '#666',
  },
  eventPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  interestedButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  interestedButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Place Card
  placeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  placeImage: {
    width: 120,
    height: 120,
    backgroundColor: '#E0E0E0',
  },
  placeContent: {
    flex: 1,
    padding: 12,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  placeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  placeType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  placeBadge: {
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  placeBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#667eea',
  },
  placeInfo: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  placeRating: {
    fontSize: 13,
    color: '#666',
  },
  placeDistance: {
    fontSize: 13,
    color: '#666',
  },
  placeVibes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeVibe: {
    fontSize: 11,
    color: '#667eea',
    marginRight: 8,
  },

  // Promo Card
  promosSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  promoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  promoImage: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
  },
  promoDiscount: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF5722',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  promoDiscountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  promoDiscountLabel: {
    fontSize: 10,
    color: '#FFFFFF',
  },
  promoContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  promoPlace: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  promoValid: {
    fontSize: 11,
    color: '#999',
  },
});

export default MatchScreen;