import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type TProps = {
  // title: string;
  subTitle?: string;
}

export const SectionHeader = ({
  // title,
  subTitle
}: TProps) => {
  return (
    <View style={styles.sectionHeader}>
      {/* <Text style={styles.sectionTitle}>{title}</Text> */}
      {subTitle ? (
        <TouchableOpacity>
          <Text style={styles.viewAllText}>{subTitle}</Text>
        </TouchableOpacity>
      ) : null
      }
    </View>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    fontFamily: 'Urbanist-Regular'
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
})