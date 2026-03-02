import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type Tab = 'Events' | 'Friends' | 'Activities';

type TProps = {
  onTabChange?: (tab: Tab) => void;
}

export const SegmentedControl = ({ onTabChange }: TProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('Events');
  const [slideAnim] = useState(new Animated.Value(0));

  const tabs: Tab[] = ['Events', 'Friends', 'Activities'];

  const handleTabPress = (tab: Tab, index: number) => {
    setActiveTab(tab);
    onTabChange?.(tab);

    // Animate slider
    Animated.spring(slideAnim, {
      toValue: index,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const tabWidth = (width - 120) / 3;

  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        {/* Animated Slider Background */}
        <Animated.View
          style={[
            styles.sliderBackground,
            {
              width: tabWidth,
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1, 2],
                    outputRange: [0, tabWidth, tabWidth * 2],
                  }),
                },
              ],
            },
          ]}
        />

        {/* Tabs */}
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, { width: tabWidth }]}
            onPress={() => handleTabPress(tab, index)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
        <Icon name="options-outline" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  segmentedControl: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E5E5EA',
    borderRadius: 50,
    padding: 4,
    position: 'relative',
    // Glass effect
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  sliderBackground: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    top: 4,
    left: 4,
    bottom: 0,
    // Slider shadow
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabText: {
    fontFamily: 'Urbanist-Regular',
    fontSize: 15,
    color: '#9CA3AF', // Inactive color
  },
  tabTextActive: {
    color: '#1F2937', // Active color
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#E5E5EA',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
});