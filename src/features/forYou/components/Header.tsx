import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
  selectedCity?: string;
  onLocationPress?: () => void;
  unreadCount: number;
  onNotificationPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity = 'Downtown',
  unreadCount = 3,
  onLocationPress,
  onNotificationPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Left */}
      <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
        <Icon name="location-outline" size={20} color="#6B7280" />
        <Text style={styles.locationText}>{selectedCity}</Text>
      </TouchableOpacity>

      {/* Center - Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/images/vstrim-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Right - Notification with Badge */}
      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
      >
        <Icon name="notifications" size={24} color="#6B7280" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  // Left - Location
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 1, // Pastikan bisa diklik
  },
  locationText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 18,
    color: '#1F2937',
  },
  // Center - Logo (ABSOLUTE POSITIONING)
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 40,
  },
  notificationButton: {
    padding: 4,
    position: 'relative',
    zIndex: 1, // Pastikan bisa diklik
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 10,
    color: '#FFFFFF',
  },
});