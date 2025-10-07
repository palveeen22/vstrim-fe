import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { AuthStackParamList } from '../navigations/auth-stack';

type TProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;
};

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: TProps) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Lottie Animation - Full Screen */}
      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../assets/animations/welcome-animation.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
          resizeMode="cover"
        />
      </View>

      {/* App Title */}
      <Text style={styles.titleText}>Meet. Move. Vibe.</Text>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.loginButtonText}>Login or Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#0857a0',
    backgroundColor: '#b0e8fd',
    alignItems: 'center',
  },
  lottieContainer: {
    position: 'absolute',
    width: width,
    height: height,
    top: -30,  // Negative value moves it up

    bottom: 140,
    left: 0,
    zIndex: 1,
  },
  titleText: {
    color: '#308ce7',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 120,
    zIndex: 2,
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    width: width,
    alignItems: 'center',
    zIndex: 2,
  },
  loginButton: {
    width: width - 40,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#308ce7',
  },
});

export default WelcomeScreen;
