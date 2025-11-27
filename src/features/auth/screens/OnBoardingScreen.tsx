import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/app/navigations/RootNavigator';

const { width, height } = Dimensions.get('window');

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  image: any;
}

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    title: 'Welcome to Vstrim',
    description: 'Discover your city’s vibe — join communities, explore events, and connect with people who share your passions.',
    image: require('../assets/images/on-boarding.jpg'),
  },
  {
    id: '2',
    title: 'Find Events & Communities',
    description: 'From sports and language meetups to nightlife hangouts — explore what’s happening around you and never miss the moment.',
    image: require('../assets/images/on-boarding2.jpg'),
  },
  {
    id: '3',
    title: 'Meet. Match. Connect.',
    description: 'Find new friends or teammates through shared interests, event participation, or spontaneous local matches.',
    image: require('../assets/images/on-boarding3.jpg'),
  },
  {
    id: '4',
    title: 'Enjoy Local Perks',
    description: 'Earn promo coupons, get exclusive deals, and stay updated with real-time events from your favorite spots.',
    image: require('../assets/images/on-boarding.jpg'),
  },
];


export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index });
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@vstrim_onboarding_complete', 'true');
      // Check if user is authenticated before deciding where to navigate
      const userToken = await AsyncStorage.getItem('@vstrim_user_token');
      if (userToken) {
        navigation.navigate('MainApp');
      } else {
        navigation.navigate('LoginRegistration');
      }
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.navigate('LoginRegistration');
    }
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slide}>
        <Image source={item?.image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => (
            <TouchableOpacity
              key={index.toString()}
              style={index === currentIndex ? styles.dotActive : styles.dot}
              onPress={() => scrollTo(index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.circleButton}
          onPress={handleNext}
        >
          <Icon name="arrow-forward" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 50,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    width: 30,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#007BFF',
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 3,
  },
});