import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { UnifiedMarker } from '../../services/exploreDataService';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface TProps {
  visible: boolean;
  marker: UnifiedMarker | null;
  onClose: () => void;
}

export const ExploreDetailsCard = ({
  visible,
  marker,
  onClose,
}: TProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 20,
          stiffness: 90,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  if (!marker) return null;

  const getMarkerTypeLabel = (type: UnifiedMarker['type']) => {
    const labels = {
      user: 'User Profile',
      place: 'Place',
      promo: 'Promotion',
      community: 'Community',
      event: 'Event',
    };
    return labels[type] || type;
  };

  const getMarkerColor = (type: UnifiedMarker['type']) => {
    const colors = {
      user: '#FF6B35',
      place: '#3B82F6',
      promo: '#8B5CF6',
      community: '#10B981',
      event: '#F59E0B',
    };
    return colors[type] || '#9CA3AF';
  };

  const getCTAText = (type: UnifiedMarker['type']) => {
    const ctas = {
      user: 'Follow',
      place: 'Visit',
      promo: 'Get Promo',
      community: 'Join',
      event: 'Register',
    };
    return ctas[type] || 'View Details';
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Image Section */}
          <View style={styles.heroContainer}>
            {marker.image ? (
              <Image
                source={{ uri: marker.image }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.heroImagePlaceholder, { backgroundColor: getMarkerColor(marker.type) }]}>
                <Icon name="image-outline" size={64} color="rgba(255,255,255,0.6)" />
              </View>
            )}

            {/* Header Buttons - Absolute positioned on image */}
            <View style={styles.headerButtons}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => {
                  // Handle menu/options
                  console.log('Menu pressed');
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="ellipsis-horizontal" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Content Section - White Card */}
          <View style={styles.contentCard}>
            {/* Title */}
            <View style={styles.headerTitle}>
              <Text style={styles.title}>{marker.title}</Text>

              <TouchableOpacity style={styles.actionButton}>
                <Image
                  source={require('../../../../assets/icons/say_hi.png')}
                  style={styles.actionButtonEmoji}
                  resizeMode="contain"
                />
              </TouchableOpacity>

            </View>

            {/* Description */}
            {marker.description && (
              <Text style={styles.description}>{marker.description}</Text>
            )}

            {/* Metadata Row */}
            <View style={styles.metadataRow}>
              {/* Members count (for community/event) */}
              {/* {marker.members && (
                <View style={styles.metadataItem}>
                  <Icon name="people" size={18} color="#111827" />
                  <Text style={styles.metadataText}>{marker.members} members</Text>
                </View>
              )} */}
              <View style={styles.metadataItem}>
                <Icon name="people" size={18} color="#111827" />
                <Text style={styles.metadataText}>35 members</Text>
              </View>

              {/* Location */}
              {/* {marker.location && (
                <View style={styles.metadataItem}>
                  <Icon name="location" size={18} color="#111827" />
                  <Text style={styles.metadataText}>{marker.location}</Text>
                </View>
              )} */}

              <View style={styles.metadataItem}>
                <Icon name="location" size={18} color="#111827" />
                <Text style={styles.metadataText}>Sevcabel Port</Text>
              </View>

              {/* Date (for events) */}
              {marker.date && (
                <View style={styles.metadataItem}>
                  <Icon name="calendar" size={18} color="#111827" />
                  <Text style={styles.metadataText}>{marker.date}</Text>
                </View>
              )}
            </View>

            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{getMarkerTypeLabel(marker.type)}</Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={[styles.ctaButton, { backgroundColor: getMarkerColor(marker.type) }]}
              activeOpacity={0.8}
              onPress={() => {
                // Handle CTA action
                console.log('CTA pressed:', marker.type);
              }}
            >
              <Text style={styles.ctaButtonText}>{getCTAText(marker.type)}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.55,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtons: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow for Android
    elevation: 5,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: "space-between",
    // alignItems: "center",
    alignContent: "center",
  },
  actionButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonEmoji: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 20,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metadataText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },
  ctaButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});