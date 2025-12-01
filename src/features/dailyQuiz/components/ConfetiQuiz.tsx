import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export const ConfettiParticle = ({ delay, duration }: { delay: number; duration: number }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(Math.random() * width)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height + 100,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: Math.random() > 0.5 ? 360 : -360,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: duration * 0.7,
        delay: delay + duration * 0.3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration, translateY, rotate, opacity]);

  const colors = ['#FFA726', '#FF6B35', '#FFD93D', '#6BCF7F', '#4ECDC4', '#C77DFF'];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: randomColor,
          transform: [
            { translateX },
            { translateY },
            { rotate: rotate.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] }) },
          ],
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create(
  {
    confetti: {
      position: 'absolute',
      width: 10,
      height: 10,
      borderRadius: 5,
    },
  }
)