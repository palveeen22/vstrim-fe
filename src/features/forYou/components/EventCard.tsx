import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  // ImageSourcePropType,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type TProps = {
  item: any
  onInterested?: () => void;
}

export const EventCard = ({
  item,
  onInterested,
}: TProps) => {
  return (
    <View style={styles.card}>
      {/* Event Image */}
      <Image
        source={{ uri: item?.image}}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={styles.content}>
        {/* Title */}
        <Text style={styles.title}>{item?.name}</Text>

        {/* Location */}
        <View style={styles.infoRow}>
          <Icon name="location-outline" size={18} color="#6B7280" />
          <Text style={styles.infoText}>{item?.location}</Text>
        </View>

        {/* Date & Time with Button */}
        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Icon name="calendar-outline" size={18} color="#6B7280" />
            <Text style={styles.dateText}>
              {item?.date}
            </Text>
          </View>

          {/* Interested Button */}
          <TouchableOpacity
            style={styles.interestedButton}
            onPress={onInterested}
            activeOpacity={0.8}
          >
            <Text style={styles.interestedButtonText}>Interested</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginVertical: 10,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 220,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 16,
    lineHeight: 34,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  infoText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 17,
    color: '#1F2937',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  dateText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 17,
    color: '#1F2937',
  },
  interestedButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  interestedButtonText: {
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 17,
    color: '#FFFFFF',
  },
});