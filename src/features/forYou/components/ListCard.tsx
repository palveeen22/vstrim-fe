import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const ListCard = ({ list }: any) => (
  <TouchableOpacity style={styles.listCard}>
    <Image source={{ uri: list.image }} style={styles.listImage} />

    {/* Gradient Overlay */}
    <View style={styles.listOverlay} />

    {/* Content */}
    <View style={styles.listContent}>
      <Text style={styles.listTitle} numberOfLines={2}>
        {list.title}
      </Text>
      <Text style={styles.listAuthor}>by {list.author}</Text>
      <Text style={styles.listVisited}>visited {list.visitedDate}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listCard: {
    width: 200,
    height: 260,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  listImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  listOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  listContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-end',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 22,
  },
  listAuthor: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 2,
  },
  listVisited: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.8,
  },
})