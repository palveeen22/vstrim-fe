import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  // TextInput,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';

type MarkerType = 'user' | 'club' | 'bar' | 'community' | 'sport' | 'event';

type MapMarkerData = {
  id: string;
  type: MarkerType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  image?: string;
  memberCount?: number;
  distance?: string;
  category?: string;
  date?: string;
};

type FilterType = 'all' | MarkerType;

const MapExploreScreen = ({ navigation }: any) => {
  const mapRef = useRef<MapView>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  // const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Mock data - replace with real API data
  const markers: MapMarkerData[] = [
    // Users
    {
      id: 'u1',
      type: 'user',
      title: 'Sarah Johnson',
      description: 'Tech enthusiast, loves hiking',
      latitude: -6.2088,
      longitude: 106.8456,
      image: 'https://i.pravatar.cc/150?img=5',
      distance: '0.5 km',
    },
    {
      id: 'u2',
      type: 'user',
      title: 'Mike Chen',
      description: 'Foodie & photographer',
      latitude: -6.2108,
      longitude: 106.8476,
      image: 'https://i.pravatar.cc/150?img=12',
      distance: '1.2 km',
    },
    // Clubs
    {
      id: 'c1',
      type: 'club',
      title: 'Tech Innovators Club',
      description: 'Weekly meetups for tech enthusiasts',
      latitude: -6.2078,
      longitude: 106.8496,
      memberCount: 234,
      category: 'Technology',
    },
    {
      id: 'c2',
      type: 'club',
      title: 'Book Readers Society',
      description: 'Monthly book discussions',
      latitude: -6.2128,
      longitude: 106.8436,
      memberCount: 156,
      category: 'Literature',
    },
    // Bars
    {
      id: 'b1',
      type: 'bar',
      title: 'The Social Hub',
      description: 'Craft beers & live music',
      latitude: -6.2098,
      longitude: 106.8516,
      distance: '2.1 km',
      category: 'Bar & Lounge',
    },
    {
      id: 'b2',
      type: 'bar',
      title: 'Rooftop Lounge',
      description: 'Premium cocktails with city view',
      latitude: -6.2148,
      longitude: 106.8396,
      distance: '3.5 km',
      category: 'Rooftop Bar',
    },
    // Communities
    {
      id: 'co1',
      type: 'community',
      title: 'Green Living Jakarta',
      description: 'Environmental awareness community',
      latitude: -6.2058,
      longitude: 106.8416,
      memberCount: 892,
      category: 'Environment',
    },
    {
      id: 'co2',
      type: 'community',
      title: 'Local Artists Collective',
      description: 'Supporting local artists',
      latitude: -6.2138,
      longitude: 106.8486,
      memberCount: 445,
      category: 'Arts',
    },
    // Sport Clubs
    {
      id: 's1',
      type: 'sport',
      title: 'Morning Runners Club',
      description: 'Daily morning runs in the park',
      latitude: -6.2118,
      longitude: 106.8506,
      memberCount: 178,
      category: 'Running',
    },
    {
      id: 's2',
      type: 'sport',
      title: 'Badminton League',
      description: 'Weekly badminton matches',
      latitude: -6.2068,
      longitude: 106.8446,
      memberCount: 223,
      category: 'Badminton',
    },
    // Events
    {
      id: 'e1',
      type: 'event',
      title: 'Street Food Festival',
      description: 'Annual food festival',
      latitude: -6.2158,
      longitude: 106.8456,
      date: 'Oct 15, 2025',
      category: 'Food & Drink',
    },
    {
      id: 'e2',
      type: 'event',
      title: 'Tech Conference 2025',
      description: 'Innovation & Startup Summit',
      latitude: -6.2048,
      longitude: 106.8526,
      date: 'Oct 20, 2025',
      category: 'Technology',
    },
  ];

  const filters = [
    { id: 'all', label: 'All', icon: 'apps-outline' },
    { id: 'user', label: 'Users', icon: 'person-outline' },
    { id: 'club', label: 'Clubs', icon: 'people-outline' },
    { id: 'bar', label: 'Bars', icon: 'wine-outline' },
    { id: 'community', label: 'Communities', icon: 'earth-outline' },
    { id: 'sport', label: 'Sports', icon: 'football-outline' },
    { id: 'event', label: 'Events', icon: 'calendar-outline' },
  ];

  // Filter markers based on active filter
  const filteredMarkers = markers.filter(marker => {
    if (activeFilter === 'all') return true;
    return marker.type === activeFilter;
  });

  // Get marker color based on type
  const getMarkerColor = (type: MarkerType): string => {
    const colors = {
      user: '#FF6B35',
      club: '#3B82F6',
      bar: '#8B5CF6',
      community: '#10B981',
      sport: '#F59E0B',
      event: '#EF4444',
    };
    return colors[type];
  };

  // Get marker icon based on type
  const getMarkerIcon = (type: MarkerType): string => {
    const icons = {
      user: 'person',
      club: 'people',
      bar: 'wine',
      community: 'earth',
      sport: 'football',
      event: 'calendar',
    };
    return icons[type];
  };

  // Handle marker press
  const handleMarkerPress = (marker: MapMarkerData) => {
    setSelectedMarker(marker);
    
    // Animate card slide up
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    // Center map on marker
    mapRef.current?.animateToRegion({
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  // Close detail card
  const closeDetailCard = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedMarker(null));
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    closeDetailCard();
  };

  // Navigate to detail screen
  const handleViewDetails = () => {
    if (!selectedMarker) return;
    
    const routes: Record<MarkerType, string> = {
      user: 'UserProfile',
      club: 'ClubDetail',
      bar: 'BarDetail',
      community: 'CommunityDetail',
      sport: 'SportClubDetail',
      event: 'EventDetail',
    };

    navigation.navigate(routes[selectedMarker.type], { id: selectedMarker.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Map View */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={{
          latitude: -6.2088,
          longitude: 106.8456,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filteredMarkers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            onPress={() => handleMarkerPress(marker)}
          >
            <View
              style={[
                styles.customMarker,
                { backgroundColor: getMarkerColor(marker.type) },
              ]}
            >
              <Icon
                name={getMarkerIcon(marker.type)}
                size={20}
                color="#fff"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search Bar */}
      {/* <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search locations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View> */}

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.filterTabActive,
              ]}
              onPress={() => handleFilterChange(filter.id as FilterType)}
            >
              <Icon
                name={filter.icon}
                size={18}
                color={activeFilter === filter.id ? '#fff' : '#6B7280'}
              />
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter.id && styles.filterTabTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* My Location Button */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={() => {
          mapRef.current?.animateToRegion({
            latitude: -6.2088,
            longitude: 106.8456,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          });
        }}
      >
        <Icon name="navigate" size={24} color="#FF6B35" />
      </TouchableOpacity>

      {/* List View Toggle */}
      <TouchableOpacity
        style={styles.listViewButton}
        onPress={() => navigation.navigate('ListView', { markers: filteredMarkers })}
      >
        <Icon name="list" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Detail Card */}
      {selectedMarker && (
        <Animated.View
          style={[
            styles.detailCard,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.detailCardHandle} />
          
          <View style={styles.detailCardHeader}>
            <View style={styles.detailCardTitleContainer}>
              <View
                style={[
                  styles.detailCardIcon,
                  { backgroundColor: getMarkerColor(selectedMarker.type) + '20' },
                ]}
              >
                <Icon
                  name={getMarkerIcon(selectedMarker.type)}
                  size={24}
                  color={getMarkerColor(selectedMarker.type)}
                />
              </View>
              <View style={styles.detailCardTitleText}>
                <Text style={styles.detailCardTitle}>{selectedMarker.title}</Text>
                <Text style={styles.detailCardSubtitle}>
                  {selectedMarker.category || selectedMarker.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeDetailCard}>
              <Icon name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailCardContent}>
            <Text style={styles.detailCardDescription}>
              {selectedMarker.description}
            </Text>

            {/* Meta Info */}
            <View style={styles.detailCardMeta}>
              {selectedMarker.memberCount && (
                <View style={styles.metaItem}>
                  <Icon name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>
                    {selectedMarker.memberCount} members
                  </Text>
                </View>
              )}
              {selectedMarker.distance && (
                <View style={styles.metaItem}>
                  <Icon name="location-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{selectedMarker.distance}</Text>
                </View>
              )}
              {selectedMarker.date && (
                <View style={styles.metaItem}>
                  <Icon name="calendar-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{selectedMarker.date}</Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.detailCardActions}>
              <TouchableOpacity
                style={styles.detailCardButton}
                onPress={handleViewDetails}
              >
                <Text style={styles.detailCardButtonText}>View Details</Text>
              </TouchableOpacity>
              
              {selectedMarker.type !== 'user' && (
                <TouchableOpacity
                  style={styles.detailCardButtonSecondary}
                  onPress={() => console.log('Get directions')}
                >
                  <Icon name="navigate-outline" size={18} color="#FF6B35" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  customMarker: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // searchContainer: {
  //   position: 'absolute',
  //   top: 16,
  //   left: 16,
  //   right: 16,
  // },
  // searchBar: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   paddingHorizontal: 16,
  //   paddingVertical: 12,
  //   borderRadius: 12,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 8,
  //   elevation: 4,
  //   gap: 12,
  // },
  // searchInput: {
  //   flex: 1,
  //   fontSize: 16,
  //   color: '#1F2937',
  // },
  filterContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterTabActive: {
    backgroundColor: '#FF6B35',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  listViewButton: {
    position: 'absolute',
    bottom: 40,
    left: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  detailCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  detailCardHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  detailCardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailCardTitleText: {
    flex: 1,
  },
  detailCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailCardContent: {
    paddingHorizontal: 20,
  },
  detailCardDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  detailCardMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailCardButton: {
    flex: 1,
    backgroundColor: '#FF6B35',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailCardButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  detailCardButtonSecondary: {
    width: 48,
    height: 48,
    backgroundColor: '#FFF7ED',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapExploreScreen;