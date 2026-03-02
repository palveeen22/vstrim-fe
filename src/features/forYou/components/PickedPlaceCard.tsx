import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const PickedPlaceCard = ({ place }: any) => (
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

const styles = StyleSheet.create({
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
})