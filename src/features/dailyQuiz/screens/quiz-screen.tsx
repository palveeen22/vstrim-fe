import { useQuiz } from '@/contexts/DailyQuizContext';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Confetti particle component
const ConfettiParticle = ({ delay, duration }: { delay: number; duration: number }) => {
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

// Success overlay component with fire animation
const SuccessOverlay = ({ onComplete }: { onComplete: () => void }) => {
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

export const DailsQuizScreen = ({ navigation }: any) => {
  const {
    questions,
    currentQuestionIndex,
    answers,
    isLoading,
    error,
    fetchQuiz,
    resetQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    getCurrentQuestion,
    getProgress,
    submitQuiz,
  } = useQuiz();

  const [slideAnim] = useState(new Animated.Value(0));
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch quiz on mount
  useEffect(() => {
    resetQuiz();
    fetchQuiz();
  }, [fetchQuiz, resetQuiz]);

  const currentQuestion = getCurrentQuestion();
  const progress = getProgress();

  // Get current answers for the question
  const getCurrentAnswer = (): string[] => {
    if (!currentQuestion) return [];
    return answers.get(currentQuestion.id) || [];
  };

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
    if (!currentQuestion) return;

    const currentAnswer = getCurrentAnswer();
    let newSelectedOptions: string[];

    if (currentQuestion.type === 'single') {
      newSelectedOptions = [optionId];
    } else {
      // Multiple selection
      if (currentAnswer.includes(optionId)) {
        newSelectedOptions = currentAnswer.filter(id => id !== optionId);
      } else {
        newSelectedOptions = [...currentAnswer, optionId];
      }
    }

    // Update answers via context
    answerQuestion(currentQuestion.id, newSelectedOptions);
  };

  // Navigate to next question with animation
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();

      nextQuestion();
    } else {
      // Quiz completed - show success animation
      handleComplete();
    }
  };

  // Navigate to previous question
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();

      previousQuestion();
    }
  };

  // Complete quiz
  const handleComplete = async () => {
    try {
      await submitQuiz();

      // Show success animation
      setShowSuccess(true);

      // Convert Map to array for navigation
      const answersArray = Array.from(answers.entries()).map(([questionId, selectedOptions]) => ({
        questionId,
        selectedOptions,
      }));

      console.log('Quiz completed:', answersArray);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  };

  // Handle success animation completion
  const handleSuccessComplete = () => {
    setShowSuccess(false);
    // Navigate to next screen or back
    // navigation.navigate('Match');
    navigation.goBack();
  };

  // Loading state
  if (isLoading && questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#FFA726" />
          <Text style={styles.loadingText}>Loading daily quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Icon name="alert-circle-outline" size={64} color="#EF4444" />
          <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchQuiz}>
            <Icon name="refresh" size={20} color="#fff" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // No questions state
  if (!currentQuestion || questions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Icon name="file-tray-outline" size={64} color="#9CA3AF" />
          <Text style={styles.emptyTitle}>No Quiz Available</Text>
          <Text style={styles.emptyMessage}>
            There are no questions available at the moment. Please try again later.
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isAnswered = getCurrentAnswer().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* Question Content */}
      <Animated.View
        style={[
          styles.content,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Question Title */}
          <View style={styles.questionHeader}>
            <Text style={styles.questionTitle}>{currentQuestion.title}</Text>
            {currentQuestion.description && (
              <Text style={styles.questionDescription}>
                {currentQuestion.description}
              </Text>
            )}
          </View>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {Array.isArray(currentQuestion.options) && currentQuestion.options.map((option) => {
              const isSelected = getCurrentAnswer().includes(option.id);

              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => handleSelectOption(option.id)}
                  activeOpacity={0.7}
                >
                  {option.icon && (
                    <View
                      style={[
                        styles.optionIconContainer,
                        isSelected && styles.optionIconContainerSelected,
                      ]}
                    >
                      <Icon
                        name={option.icon}
                        size={24}
                        color={isSelected ? '#FFA726' : '#6B7280'}
                      />
                    </View>
                  )}

                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>

                  {/* Selection Indicator */}
                  <View
                    style={[
                      styles.selectionIndicator,
                      isSelected && styles.selectionIndicatorSelected,
                    ]}
                  >
                    {isSelected && (
                      <Icon name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Helper Text */}
          {currentQuestion.type === 'multiple' && (
            <View style={styles.helperContainer}>
              <Icon name="information-circle-outline" size={16} color="#9CA3AF" />
              <Text style={styles.helperText}>
                You can select multiple options
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {currentQuestionIndex > 0 && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Icon name="arrow-back" size={20} color="#6B7280" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            !isAnswered && styles.nextButtonDisabled,
            currentQuestionIndex === 0 && styles.nextButtonFull,
          ]}
          onPress={handleNext}
          disabled={!isAnswered || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
              </Text>
              <Icon name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Success Overlay */}
      {showSuccess && <SuccessOverlay onComplete={handleSuccessComplete} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  errorTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptyMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA726',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFA726',
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  questionHeader: {
    marginBottom: 32,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 36,
  },
  questionDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  optionCardSelected: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFA726',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionIconContainerSelected: {
    backgroundColor: '#FFF7ED',
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
  },
  optionLabelSelected: {
    color: '#1F2937',
    fontWeight: '600',
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionIndicatorSelected: {
    backgroundColor: '#FFA726',
    borderColor: '#FFA726',
  },
  helperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA726',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  // Success overlay styles
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
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
});