import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

interface HangoutPlace {
  placeName: string;
  placeType: string;
  latitude: number;
  longitude: number;
  address?: string;
}

interface Props {
  places: HangoutPlace[];
  onAddPlace: (place: HangoutPlace) => void;
  onRemovePlace: (index: number) => void;
  maxPlaces?: number;
  userLocation?: { latitude: number; longitude: number } | null;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  name?: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

const PLACE_TYPES = [
  { label: 'Café', value: 'cafe', icon: '☕' },
  { label: 'Restaurant', value: 'restaurant', icon: '🍽️' },
  { label: 'Bar', value: 'bar', icon: '🍺' },
  { label: 'Park', value: 'park', icon: '🌳' },
  { label: 'Gym', value: 'gym', icon: '💪' },
  { label: 'Library', value: 'library', icon: '📚' },
  { label: 'Mall', value: 'mall', icon: '🛍️' },
  { label: 'Other', value: 'other', icon: '📍' },
];

export const HangoutPlacePicker: React.FC<Props> = ({
  places,
  onAddPlace,
  onRemovePlace,
  maxPlaces = 5,
  userLocation,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('cafe');
  const [manualEntry, setManualEntry] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  } | null>(null);

  // ✅ Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const mapRef = useRef<MapView>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * ✅ Search places using Nominatim (OpenStreetMap) - FREE!
   */
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      setIsSearching(true);
      console.log('🔍 Searching for:', query);

      // Build search URL with user location bias if available
      let url = `https://nominatim.openstreetmap.org/search?` +
        `format=json&` +
        `q=${encodeURIComponent(query)}&` +
        `addressdetails=1&` +
        `limit=10`;

      // Add location bias if user location is available
      if (userLocation) {
        url += `&viewbox=${userLocation.longitude - 0.1},${userLocation.latitude - 0.1},` +
          `${userLocation.longitude + 0.1},${userLocation.latitude + 0.1}&` +
          `bounded=1`;
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HangoutApp/1.0',
          'Accept-Language': 'en',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: SearchResult[] = await response.json();
      console.log('✅ Found', data.length, 'results');

      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('❌ Search error:', error);
      Alert.alert('Search Error', 'Unable to search places. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * ✅ Handle search input with debounce
   */
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 500);
  };

  /**
   * ✅ Handle search result selection
   */
  const handleSearchResultSelect = (result: SearchResult) => {
    const latitude = parseFloat(result.lat);
    const longitude = parseFloat(result.lon);

    // Format address
    let formattedAddress = result.display_name;
    if (result.address) {
      const parts = [
        result.address.road,
        result.address.suburb,
        result.address.city,
        result.address.state,
      ].filter(Boolean);

      if (parts.length > 0) {
        formattedAddress = parts.join(', ');
      }
    }

    const location = {
      latitude,
      longitude,
      name: result.name || result.display_name.split(',')[0],
      address: formattedAddress,
    };

    setSelectedLocation(location);
    setShowResults(false);
    setSearchQuery('');

    // Animate map to selected location
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  const handleMapPress = (event: any) => {
    if (manualEntry) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setSelectedLocation({
        latitude,
        longitude,
        name: 'Custom Location',
        address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
      });
    }
  };

  const handleAddPlace = () => {
    if (!selectedLocation) {
      Alert.alert('Select Location', 'Please select a location on the map or search for a place');
      return;
    }

    const place: HangoutPlace = {
      placeName: selectedLocation.name || 'Selected Place',
      placeType: selectedType,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      address: selectedLocation.address,
    };

    onAddPlace(place);
    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedType('cafe');
    setManualEntry(false);
    setSelectedLocation(null);
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const getPlaceTypeIcon = (type: string) => {
    return PLACE_TYPES.find(t => t.value === type)?.icon || '📍';
  };

  const initialRegion = userLocation ? {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  } : {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      {/* Added Places List */}
      {places.length > 0 && (
        <View style={styles.placesList}>
          {places.map((place, index) => (
            <View key={index} style={styles.placeItem}>
              <Text style={styles.placeIcon}>{getPlaceTypeIcon(place.placeType)}</Text>
              <View style={styles.placeInfo}>
                <Text style={styles.placeName}>{place.placeName}</Text>
                {place.address && (
                  <Text style={styles.placeAddress} numberOfLines={1}>
                    {place.address}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => onRemovePlace(index)}
                style={styles.removeButton}>
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Add Place Button */}
      {places.length < maxPlaces && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonIcon}>+</Text>
          <Text style={styles.addButtonText}>
            Add Hangout Place ({places.length}/{maxPlaces})
          </Text>
        </TouchableOpacity>
      )}

      {/* Add Place Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
                style={styles.headerButton}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Add Hangout Place</Text>
              <TouchableOpacity
                onPress={handleAddPlace}
                style={styles.headerButton}
                disabled={!selectedLocation}>
                <Text style={[
                  styles.saveButton,
                  !selectedLocation && styles.saveButtonDisabled
                ]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
              <MapView
                ref={mapRef}
                provider={PROVIDER_DEFAULT}
                style={styles.map}
                initialRegion={initialRegion}
                onPress={handleMapPress}
                showsUserLocation
                showsMyLocationButton>

                {/* User Location Marker */}
                {userLocation && (
                  <Marker
                    coordinate={userLocation}
                    title="Your Location"
                    pinColor="blue"
                  />
                )}

                {/* Selected Location Marker */}
                {selectedLocation && (
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title={selectedLocation.name}
                    description={selectedLocation.address}
                    pinColor="red"
                  />
                )}

                {/* Existing Places Markers */}
                {places.map((place, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: place.latitude,
                      longitude: place.longitude,
                    }}
                    title={place.placeName}
                    description={place.address}
                    pinColor="green"
                  />
                ))}
              </MapView>

              {/* Search Overlay */}
              <View style={styles.searchOverlay}>
                {/* Place Type Selection */}
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.typeScrollView}
                  contentContainerStyle={styles.typeScrollContent}>
                  {PLACE_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeChip,
                        selectedType === type.value && styles.typeChipActive,
                      ]}
                      onPress={() => setSelectedType(type.value)}>
                      <Text style={styles.typeChipIcon}>{type.icon}</Text>
                      <Text style={[
                        styles.typeChipLabel,
                        selectedType === type.value && styles.typeChipLabelActive,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* Search Method Toggle */}
                <View style={styles.methodToggle}>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      !manualEntry && styles.methodButtonActive,
                    ]}
                    onPress={() => {
                      setManualEntry(false);
                      setShowResults(false);
                    }}>
                    <Text
                      style={[
                        styles.methodButtonText,
                        !manualEntry && styles.methodButtonTextActive,
                      ]}>
                      🔍 Search
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.methodButton,
                      manualEntry && styles.methodButtonActive,
                    ]}
                    onPress={() => {
                      setManualEntry(true);
                      setShowResults(false);
                      setSearchQuery('');
                    }}>
                    <Text
                      style={[
                        styles.methodButtonText,
                        manualEntry && styles.methodButtonTextActive,
                      ]}>
                      📍 Pin on Map
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* ✅ Custom Search Input (Nominatim) */}
                {!manualEntry && (
                  <View style={styles.searchContainer}>
                    <View style={styles.searchInputContainer}>
                      <Text style={styles.searchIcon}>🔍</Text>
                      <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a place..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {isSearching && (
                        <ActivityIndicator size="small" color="#8B5CF6" />
                      )}
                      {searchQuery.length > 0 && !isSearching && (
                        <TouchableOpacity
                          onPress={() => {
                            setSearchQuery('');
                            setSearchResults([]);
                            setShowResults(false);
                          }}
                          style={styles.clearButton}>
                          <Text style={styles.clearButtonText}>✕</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    {/* ✅ Search Results List */}
                    {showResults && searchResults.length > 0 && (
                      <View style={styles.searchResults}>
                        <FlatList
                          data={searchResults}
                          keyExtractor={(item) => item.place_id}
                          renderItem={({ item }) => (
                            <TouchableOpacity
                              style={styles.searchResultItem}
                              onPress={() => handleSearchResultSelect(item)}>
                              <Text style={styles.resultIcon}>📍</Text>
                              <View style={styles.resultText}>
                                <Text style={styles.resultName} numberOfLines={1}>
                                  {item.name || item.display_name.split(',')[0]}
                                </Text>
                                <Text style={styles.resultAddress} numberOfLines={2}>
                                  {item.display_name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                          style={styles.resultsList}
                          keyboardShouldPersistTaps="handled"
                        />
                      </View>
                    )}

                    {/* No results message */}
                    {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 3 && (
                      <View style={styles.noResults}>
                        <Text style={styles.noResultsText}>
                          No places found for "{searchQuery}"
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Manual Entry Hint */}
                {manualEntry && (
                  <View style={styles.manualHint}>
                    <Text style={styles.manualHintText}>
                      📍 Tap anywhere on the map to select a location
                    </Text>
                  </View>
                )}
              </View>

              {/* Selected Location Info */}
              {selectedLocation && (
                <View style={styles.selectedInfoCard}>
                  <View style={styles.selectedInfoContent}>
                    <Text style={styles.selectedInfoIcon}>
                      {getPlaceTypeIcon(selectedType)}
                    </Text>
                    <View style={styles.selectedInfoText}>
                      <Text style={styles.selectedInfoName}>
                        {selectedLocation.name || 'Selected Location'}
                      </Text>
                      {selectedLocation.address && (
                        <Text style={styles.selectedInfoAddress} numberOfLines={2}>
                          {selectedLocation.address}
                        </Text>
                      )}
                      <Text style={styles.selectedInfoCoords}>
                        {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  placesList: {
    gap: 12,
    marginBottom: 16,
  },
  placeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  placeIcon: {
    fontSize: 24,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 13,
    color: '#6B7280',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F5FF',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  addButtonIcon: {
    fontSize: 20,
    color: '#8B5CF6',
    fontWeight: 'bold',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    minWidth: 60,
  },
  cancelButton: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    textAlign: 'right',
  },
  saveButtonDisabled: {
    color: '#D1D5DB',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  typeScrollView: {
    maxHeight: 50,
  },
  typeScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeChipActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F9F5FF',
  },
  typeChipIcon: {
    fontSize: 16,
  },
  typeChipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  typeChipLabelActive: {
    color: '#8B5CF6',
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  methodButtonTextActive: {
    color: '#FFFFFF',
  },
  // ✅ NEW: Custom Search Styles
  searchContainer: {
    backgroundColor: 'transparent',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  searchResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  resultsList: {
    maxHeight: 250,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  resultIcon: {
    fontSize: 20,
  },
  resultText: {
    flex: 1,
  },
  resultName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  resultAddress: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  noResults: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  manualHint: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  manualHintText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedInfoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedInfoIcon: {
    fontSize: 32,
  },
  selectedInfoText: {
    flex: 1,
  },
  selectedInfoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  selectedInfoAddress: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  selectedInfoCoords: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});