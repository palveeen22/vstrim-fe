// components/CustomBottomSheet.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { UnifiedMarker } from '../services/exploreDataService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.7;
const SWIPE_THRESHOLD = 50;

interface CustomBottomSheetProps {
  visible: boolean;
  marker: UnifiedMarker | null;
  onClose: () => void;
}

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  marker,
  onClose,
}) => {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  // Pan responder untuk swipe down
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Hanya handle gesture vertical ke bawah
        return Math.abs(gestureState.dy) > 5 && gestureState.dy > 0;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > SWIPE_THRESHOLD) {
          closeSheet();
        } else {
          // Snap back
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      openSheet();
    } else {
      closeSheet();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const openSheet = () => {
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      damping: 20,
      stiffness: 90,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: SHEET_HEIGHT,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!marker) return null;

  const getMarkerTypeLabel = (type: UnifiedMarker['type']) => {
    const labels = {
      user: 'User',
      place: 'Place',
      promo: 'Promotion',
      community: 'Community',
      event: 'Event',
    };
    return labels[type] || type;
  };

  const getCategoryIcon = (type: UnifiedMarker['type']) => {
    const icons = {
      user: 'person-outline',
      place: 'location-outline',
      promo: 'pricetag-outline',
      community: 'people-outline',
      event: 'calendar-outline',
    };
    return icons[type] || 'help-outline';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={closeSheet}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={closeSheet}
      >
        <View style={StyleSheet.absoluteFill} />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <Animated.View
        style={[
          styles.sheetContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        {/* Handle bar */}
        <View {...panResponder.panHandlers} style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        {/* Close button */}
        <TouchableOpacity onPress={closeSheet} style={styles.closeButton}>
          <Icon name="close" size={24} color="#9CA3AF" />
        </TouchableOpacity>

        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            {marker.image ? (
              <Image
                source={{ uri: marker.image }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon
                  name={getCategoryIcon(marker.type)}
                  size={60}
                  color="#D1D5DB"
                />
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.title}>{marker.title}</Text>

          {/* Description */}
          <Text style={styles.description}>{marker.description}</Text>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            {/* Type badge */}
            <View style={styles.badge}>
              <Icon
                name={getCategoryIcon(marker.type)}
                size={16}
                color="#6B7280"
              />
              <Text style={styles.badgeText}>
                {marker.category || getMarkerTypeLabel(marker.type)}
              </Text>
            </View>

            {/* Location */}
            {marker.location && (
              <View style={styles.badge}>
                <Icon name="location-outline" size={16} color="#6B7280" />
                <Text style={styles.badgeText}>{marker.location}</Text>
              </View>
            )}
          </View>

          {/* Members count for community */}
          {marker.type === 'community' && marker.members && (
            <View style={styles.statsRow}>
              <Icon name="people-outline" size={20} color="#6B7280" />
              <Text style={styles.statsText}>{marker.members} members</Text>
            </View>
          )}

          {/* Date for events */}
          {marker.type === 'event' && marker.date && (
            <View style={styles.statsRow}>
              <Icon name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.statsText}>
                {new Date(marker.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>
              {marker.type === 'community'
                ? 'Join'
                : marker.type === 'event'
                ? 'RSVP'
                : marker.type === 'promo'
                ? 'View Offer'
                : 'View Details'}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    zIndex: 10,
    padding: 4,
  },
  scrollContent: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  badgeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});