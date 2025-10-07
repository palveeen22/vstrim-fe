import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

type QuestionType = 'single' | 'multiple' | 'interests';

type Option = {
  id: string;
  label: string;
  icon?: string;
};

type Question = {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  options: Option[];
};

type Answer = {
  questionId: string;
  selectedOptions: string[];
};

const MatchingQuizScreen = ({ navigation }: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [slideAnim] = useState(new Animated.Value(0));

  // Quiz Questions Data
  const questions: Question[] = [
    {
      id: 'q1',
      title: 'What are your main interests?',
      description: 'Select all that apply - this helps us find your community',
      type: 'multiple',
      options: [
        { id: 'tech', label: 'Technology & Innovation', icon: 'laptop-outline' },
        { id: 'sports', label: 'Sports & Fitness', icon: 'football-outline' },
        { id: 'arts', label: 'Arts & Culture', icon: 'color-palette-outline' },
        { id: 'food', label: 'Food & Cooking', icon: 'restaurant-outline' },
        { id: 'nature', label: 'Nature & Environment', icon: 'leaf-outline' },
        { id: 'music', label: 'Music & Entertainment', icon: 'musical-notes-outline' },
      ],
    },
    {
      id: 'q2',
      title: 'How active do you want to be?',
      description: 'Choose your preferred level of community involvement',
      type: 'single',
      options: [
        { id: 'very_active', label: 'Very Active', icon: 'flame-outline' },
        { id: 'moderately', label: 'Moderately Active', icon: 'walk-outline' },
        { id: 'casual', label: 'Casual Observer', icon: 'eye-outline' },
      ],
    },
    {
      id: 'q3',
      title: 'What brings you here?',
      description: 'Your main goal helps us personalize your experience',
      type: 'single',
      options: [
        { id: 'connect', label: 'Connect with neighbors', icon: 'people-outline' },
        { id: 'learn', label: 'Learn new skills', icon: 'school-outline' },
        { id: 'volunteer', label: 'Volunteer & give back', icon: 'heart-outline' },
        { id: 'explore', label: 'Explore local events', icon: 'compass-outline' },
      ],
    },
    {
      id: 'q4',
      title: 'When are you most available?',
      description: 'This helps match you with events at convenient times',
      type: 'multiple',
      options: [
        { id: 'weekday_morning', label: 'Weekday Mornings', icon: 'sunny-outline' },
        { id: 'weekday_evening', label: 'Weekday Evenings', icon: 'moon-outline' },
        { id: 'weekend', label: 'Weekends', icon: 'calendar-outline' },
        { id: 'flexible', label: 'Flexible Schedule', icon: 'time-outline' },
      ],
    },
    {
      id: 'q5',
      title: 'Your experience level?',
      description: 'Are you new to community involvement or experienced?',
      type: 'single',
      options: [
        { id: 'beginner', label: 'Just Starting Out', icon: 'seedling-outline' },
        { id: 'intermediate', label: 'Some Experience', icon: 'trending-up-outline' },
        { id: 'expert', label: 'Very Experienced', icon: 'trophy-outline' },
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Get current answers for the question
  const getCurrentAnswer = (): string[] => {
    const answer = answers.find(a => a.questionId === currentQuestion.id);
    return answer?.selectedOptions || [];
  };

  // Handle option selection
  const handleSelectOption = (optionId: string) => {
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

    // Update answers
    setAnswers(prev => {
      const filtered = prev.filter(a => a.questionId !== currentQuestion.id);
      return [
        ...filtered,
        { questionId: currentQuestion.id, selectedOptions: newSelectedOptions },
      ];
    });
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

      setCurrentQuestionIndex(prev => prev + 1);
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

      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Skip question
  const handleSkip = () => {
    handleNext();
  };

  // Complete quiz
  const handleComplete = () => {
    // Calculate matching score and navigate to results
    console.log('Quiz completed:', answers);
    navigation.navigate('MatchingResults', { answers });
  };

  const isAnswered = getCurrentAnswer().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Icon name="close" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} of {questions.length}
          </Text>
        </View>

        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
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
            {currentQuestion.options.map((option) => {
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
                        color={isSelected ? '#FF6B35' : '#6B7280'}
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
          disabled={!isAnswered}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
          </Text>
          <Icon name="arrow-forward" size={20} color="#fff" />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
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
    backgroundColor: '#FF6B35',
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
    borderColor: '#FF6B35',
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
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
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
    backgroundColor: '#FF6B35',
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

export default MatchingQuizScreen;