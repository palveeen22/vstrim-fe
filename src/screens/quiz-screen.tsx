import React, { useState, useEffect } from 'react';
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
import { useQuiz } from '../contexts/quiz-context';

const { width } = Dimensions.get('window');

const QuizScreen = ({ navigation }: any) => {
  const {
    questions,
    currentQuestionIndex,
    answers,
    isLoading,
    error,
    fetchQuiz,
    answerQuestion,
    nextQuestion,
    previousQuestion,
    getCurrentQuestion,
    getProgress,
    submitQuiz,
  } = useQuiz();

  const [slideAnim] = useState(new Animated.Value(0));

  // Fetch quiz on mount
  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

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
      // Quiz completed
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

  // Skip question
  // const handleSkip = () => {
  //   handleNext();
  // };

  // Complete quiz
  const handleComplete = async () => {
    try {
      await submitQuiz();

      // Convert Map to array for navigation
      const answersArray = Array.from(answers.entries()).map(([questionId, selectedOptions]) => ({
        questionId,
        selectedOptions,
      }));

      console.log('Quiz completed:', answersArray);
      // navigation.navigate('Match');
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
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
        {/* <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Icon name="close" size={24} color="#1F2937" />
        </TouchableOpacity> */}

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        {/* <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity> */}
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
  // closeButton: {
  //   width: 40,
  //   height: 40,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  // skipButton: {
  //   paddingHorizontal: 12,
  //   paddingVertical: 8,
  // },
  // skipText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   color: '#FF6B35',
  // },
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
});

export default QuizScreen