import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ConfettiParticle } from './ConfetiQuiz';


// Success overlay component with fire animation
export const SuccessOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fireScale = useRef(new Animated.Value(0.8)).current;
  const fireOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Scale up animation
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Fire animation - pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fireScale, {
            toValue: 1.2,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(fireOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fireScale, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(fireOpacity, {
            toValue: 0.8,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onComplete());
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, fireScale, fireOpacity, onComplete]);

  return (
    <Animated.View
      style={[
        styles.successOverlay,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {/* Confetti particles */}
      {[...Array(30)].map((_, index) => (
        <ConfettiParticle
          key={index}
          delay={index * 50}
          duration={2000 + Math.random() * 1000}
        />
      ))}

      {/* Success content */}
      <Animated.View
        style={[
          styles.successContent,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Fire animation */}
        <Animated.View
          style={[
            styles.fireContainer,
            {
              transform: [{ scale: fireScale }],
              opacity: fireOpacity,
            },
          ]}
        >
          <View style={styles.fireBase}>
            <Icon name="flame" size={120} color="#FF6B35" />
          </View>
          {/* Fire glow effect */}
          <View style={styles.fireGlow} />
        </Animated.View>

        {/* Success text */}
        <View style={styles.successTextContainer}>
          <Text style={styles.successTitle}>🎉 Amazing!</Text>
          <Text style={styles.successSubtitle}>Quiz completed successfully!</Text>
          <Text style={styles.successMessage}>You're on fire! Keep it up! 🔥</Text>
        </View>

        {/* Streak counter (optional - can be dynamic) */}
        <View style={styles.streakContainer}>
          <Icon name="flame" size={24} color="#FFA726" />
          <Text style={styles.streakText}>+1 Day Streak!</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // Success overlay styles
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  successContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  fireContainer: {
    position: 'relative',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireBase: {
    zIndex: 2,
  },
  fireGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#FF6B35',
    opacity: 0.3,
    zIndex: 1,
  },
  successTextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFA726',
    marginBottom: 8,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 24,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 167, 38, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    gap: 8,
    borderWidth: 2,
    borderColor: '#FFA726',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA726',
  },
})