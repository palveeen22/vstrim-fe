/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Region } from "react-native-maps";
import Icon from "react-native-vector-icons/Ionicons";
import {
  ExploreDataService,
  FilterType,
  UnifiedMarker,
} from "../services/exploreDataService";

// 🔒 Batas Area Saint Petersburg
const PETERBURG_BOUNDS = {
  north: 60.10,
  south: 59.70,
  east: 30.50,
  west: 30.10,
};

// 🔒 Fungsi untuk mengunci map agar tetap di SPB + batasi zoom
const clampRegionToSPB = (r: Region): Region => {
  const latitude = Math.min(Math.max(r.latitude, PETERBURG_BOUNDS.south), PETERBURG_BOUNDS.north);
  const longitude = Math.min(Math.max(r.longitude, PETERBURG_BOUNDS.west), PETERBURG_BOUNDS.east);

  const minDelta = 0.02; // Zoom paling dekat
  const maxDelta = 0.20; // Zoom paling jauh

  const latitudeDelta = Math.min(Math.max(r.latitudeDelta, minDelta), maxDelta);
  const longitudeDelta = Math.min(Math.max(r.longitudeDelta, minDelta), maxDelta);

  return { latitude, longitude, latitudeDelta, longitudeDelta };
};

export const MapExploreScreen = () => {
  const mapRef = useRef<MapView>(null);
  const [markers, setMarkers] = useState<UnifiedMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<UnifiedMarker | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const slideAnim = useRef(new Animated.Value(300)).current;

  // 🌍 Region default — Saint Petersburg center
  const [region, setRegion] = useState<Region>({
    latitude: 59.93,
    longitude: 30.33,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  // 🚀 Load data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await ExploreDataService.getAllValues();
      if (data) {
        const transformed = ExploreDataService.transformToMarkers(data);
        setMarkers(transformed);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredMarkers = ExploreDataService.filterMarkers(markers, activeFilter);

  const getMarkerColor = (type: UnifiedMarker["type"]) => {
    const colors = {
      user: "#FF6B35",
      place: "#3B82F6",
      promo: "#8B5CF6",
      community: "#10B981",
      event: "#F59E0B",
    };
    return colors[type] || "#9CA3AF";
  };

  const getMarkerIcon = (type: UnifiedMarker["type"]) => {
    const icons = {
      user: "person",
      place: "location",
      promo: "pricetag",
      community: "earth",
      event: "calendar",
    };
    return icons[type] || "help";
  };

  const handleMarkerPress = (marker: UnifiedMarker) => {
    setSelectedMarker(marker);

    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    const newRegion = clampRegionToSPB({
      latitude: marker.latitude,
      longitude: marker.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 200);
  };

  const closeDetailCard = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedMarker(null));
  };

  // 🔍 Zoom control
  const zoomIn = () => {
    const newRegion = clampRegionToSPB({
      ...region,
      latitudeDelta: Math.max(region.latitudeDelta / 2, 0.02),
      longitudeDelta: Math.max(region.longitudeDelta / 2, 0.02),
    });

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 200);
  };

  const zoomOut = () => {
    const newRegion = clampRegionToSPB({
      ...region,
      latitudeDelta: Math.min(region.latitudeDelta * 2, 0.20),
      longitudeDelta: Math.min(region.longitudeDelta * 2, 0.20),
    });

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 200);
  };

  const filters = [
    { id: "all", label: "All", icon: "apps-outline" },
    { id: "user", label: "Users", icon: "person-outline" },
    { id: "place", label: "Places", icon: "location-outline" },
    { id: "promo", label: "Promos", icon: "pricetag-outline" },
    { id: "community", label: "Communities", icon: "earth-outline" },
    { id: "event", label: "Events", icon: "calendar-outline" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={{ marginTop: 10, color: "#6B7280" }}>
            Loading map data...
          </Text>
        </View>
      ) : (
        <>
          {/* 🗺️ MAP */}
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            region={region}
            onRegionChangeComplete={(r) => {
              const fixed = clampRegionToSPB(r);
              setRegion(fixed);
              mapRef.current?.animateToRegion(fixed, 50);
            }}
            showsUserLocation
            zoomEnabled={true}
            zoomControlEnabled={true}
            scrollEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
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
                  <Icon name={getMarkerIcon(marker.type)} size={20} color="#fff" />
                </View>
              </Marker>
            ))}
          </MapView>

          {/* FILTERS */}
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
                  onPress={() => {
                    setActiveFilter(filter.id as FilterType);
                    closeDetailCard();
                  }}
                >
                  <Icon
                    name={filter.icon}
                    size={18}
                    color={activeFilter === filter.id ? "#fff" : "#6B7280"}
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

          {/* ZOOM BUTTONS */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomIn}>
              <Icon name="add" size={22} color="#111827" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={zoomOut}>
              <Icon name="remove" size={22} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* DETAIL CARD */}
          {selectedMarker && (
            <Animated.View
              style={[
                styles.detailCard,
                { transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.detailCardHandle} />
              <View style={styles.detailCardHeader}>
                <Text style={styles.detailCardTitle}>
                  {selectedMarker.title}
                </Text>
                <TouchableOpacity onPress={closeDetailCard}>
                  <Icon name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.detailCardDescription}>
                {selectedMarker.description}
              </Text>
              <Text style={styles.metaText}>
                {selectedMarker.category || selectedMarker.type}
              </Text>
            </Animated.View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1 },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  filterContainer: {
    position: "absolute",
    top: 80,
    left: 0,
    right: 0,
  },
  filterScroll: { paddingHorizontal: 16, gap: 8 },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  filterTabActive: { backgroundColor: "#FF6B35" },
  filterTabText: { marginLeft: 6, fontWeight: "600", color: "#6B7280" },
  filterTabTextActive: { color: "#fff" },
  zoomControls: {
    position: "absolute",
    right: 16,
    bottom: 140,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  zoomButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  detailCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    elevation: 8,
  },
  detailCardHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  detailCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailCardTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  detailCardDescription: {
    fontSize: 14,
    color: "#4B5563",
    marginTop: 8,
    marginBottom: 12,
  },
  metaText: { color: "#6B7280", fontSize: 13 },
});