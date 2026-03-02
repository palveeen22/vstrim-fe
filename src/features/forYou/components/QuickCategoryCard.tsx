import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export const QuickCategoryCard = ({ category }: any) => (
  <TouchableOpacity style={styles.categoryCard}>
    <Image source={{ uri: category.image }} style={styles.categoryImage} />
    <View style={styles.categoryOverlay} />

    <View style={styles.categoryContent}>
      <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
      <Text style={styles.categoryTitle}>{category.title}</Text>
      <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  categoryCard: {
    width: '48%',
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  categoryContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  categorySubtitle: {
    fontSize: 11,
    color: '#fff',
    opacity: 0.9,
  },
})