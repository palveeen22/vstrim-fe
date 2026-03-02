import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const UserCard = ({ user }: any) => (
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

const styles = StyleSheet.create({
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
})