import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

interface NetworkErrorScreenProps {
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export const NetworkError = ({
  onRetry = () => {},
  onContactSupport = () => {},
}: NetworkErrorScreenProps) => {
  const [, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial connection state
    checkConnection();

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const checkConnection = async () => {
    const networkState = await NetInfo.fetch();
    setIsConnected(networkState.isConnected);
  };

  const handleRetry = () => {
    checkConnection();
    onRetry();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        <Image
          source={require('../assets/images/no-conection.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.title}>Something went wrong</Text>

        <Text style={styles.message}>
          It seems there's no internet connection. Check your network and
          reload the application — this should help
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleRetry}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Reload</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onContactSupport}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Contact us</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomIndicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333333',
  },
  message: {
    fontSize: 16,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderRadius: 30,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#DDDDDD',
    borderRadius: 2,
    marginBottom: 10,
  },
});