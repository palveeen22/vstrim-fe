import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

interface FormData {
  username: string;
  mood: string;
  location: string;
  reason: string;
}

const ProfileVerificationScreen = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    username: '',
    mood: '',
    location: '',
    reason: '',
  });

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😎', label: 'Confident', value: 'confident' },
    { emoji: '🤔', label: 'Curious', value: 'curious' },
    { emoji: '😌', label: 'Relaxed', value: 'relaxed' },
    { emoji: '🎉', label: 'Excited', value: 'excited' },
    { emoji: '💪', label: 'Motivated', value: 'motivated' },
  ];

  const reasons = [
    {
      icon: '🎥',
      title: 'Content Creator',
      description: 'Share my creativity and build an audience',
      value: 'content_creator',
    },
    {
      icon: '👥',
      title: 'Connect with Others',
      description: 'Meet new people and make friends',
      value: 'connect',
    },
    {
      icon: '🎓',
      title: 'Learn & Grow',
      description: 'Discover new content and expand my knowledge',
      value: 'learn',
    },
    {
      icon: '🎬',
      title: 'Entertainment',
      description: 'Watch and enjoy interesting videos',
      value: 'entertainment',
    },
    {
      icon: '💼',
      title: 'Business & Networking',
      description: 'Grow my brand and connect professionally',
      value: 'business',
    },
    {
      icon: '✨',
      title: 'Just Exploring',
      description: 'Curious to see what Vstrim is all about',
      value: 'exploring',
    },
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // API call to save profile data
    console.log('Profile Data:', formData);
    // Navigate to main app or show success
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 1:
        return formData.username.length >= 3;
      case 2:
        return formData.mood !== '';
      case 3:
        return formData.location.length >= 2;
      case 4:
        return formData.reason !== '';
      default:
        return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map((s) => (
              <View key={s} style={styles.progressStepContainer}>
                <View
                  style={[
                    styles.progressCircle,
                    step >= s && styles.progressCircleActive,
                    step > s && styles.progressCircleCompleted,
                  ]}>
                  <Text
                    style={[
                      styles.progressText,
                      step >= s && styles.progressTextActive,
                    ]}>
                    {s}
                  </Text>
                </View>
                {s < 4 && (
                  <View
                    style={[
                      styles.progressLine,
                      step > s && styles.progressLineActive,
                    ]}
                  />
                )}
              </View>
            ))}
          </View>

          {/* Step Content */}
          <View style={styles.contentContainer}>
            {/* Step 1: Username */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Choose your username</Text>
                <Text style={styles.subtitle}>
                  This is how others will see you on Vstrim
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.username}
                    onChangeText={(text) =>
                      setFormData({ ...formData, username: text })
                    }
                    placeholder="Enter your username"
                    placeholderTextColor="#9CA3AF"
                    maxLength={20}
                    autoCapitalize="none"
                  />
                  <Text style={styles.helperText}>
                    {formData.username.length}/20 characters
                  </Text>
                </View>
              </View>
            )}

            {/* Step 2: Mood */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>How are you feeling?</Text>
                <Text style={styles.subtitle}>Choose your current mood</Text>

                <View style={styles.moodGrid}>
                  {moods.map((mood) => (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.moodCard,
                        formData.mood === mood.value && styles.moodCardActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, mood: mood.value })
                      }>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabel}>{mood.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Where are you from?</Text>
                <Text style={styles.subtitle}>
                  Let others know your location
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Location</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.location}
                    onChangeText={(text) =>
                      setFormData({ ...formData, location: text })
                    }
                    placeholder="e.g., Jakarta, Indonesia"
                    placeholderTextColor="#9CA3AF"
                    maxLength={50}
                  />
                </View>
              </View>
            )}

            {/* Step 4: Reason */}
            {step === 4 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Why join Vstrim?</Text>
                <Text style={styles.subtitle}>
                  Choose the main reason you want to join our community
                </Text>

                <View style={styles.reasonContainer}>
                  {reasons.map((reason) => (
                    <TouchableOpacity
                      key={reason.value}
                      style={[
                        styles.reasonCard,
                        formData.reason === reason.value &&
                          styles.reasonCardActive,
                      ]}
                      onPress={() =>
                        setFormData({ ...formData, reason: reason.value })
                      }>
                      <View style={styles.reasonIconContainer}>
                        <Text style={styles.reasonIcon}>{reason.icon}</Text>
                      </View>
                      <View style={styles.reasonContent}>
                        <Text style={styles.reasonTitle}>{reason.title}</Text>
                        <Text style={styles.reasonDescription}>
                          {reason.description}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          formData.reason === reason.value &&
                            styles.radioCircleActive,
                        ]}>
                        {formData.reason === reason.value && (
                          <View style={styles.radioDot} />
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              !isStepValid() && styles.nextButtonDisabled,
              step === 1 && styles.nextButtonFull,
            ]}
            onPress={step === 4 ? handleSubmit : handleNext}
            disabled={!isStepValid()}>
            <Text style={styles.nextButtonText}>
              {step === 4 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#8B5CF6',
  },
  progressCircleCompleted: {
    backgroundColor: '#10B981',
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  progressTextActive: {
    color: '#FFFFFF',
  },
  progressLine: {
    width: 40,
    height: 3,
    backgroundColor: '#E5E7EB',
  },
  progressLineActive: {
    backgroundColor: '#10B981',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 20,
  },
  stepContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 6,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  moodCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  moodCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F9F5FF',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  reasonContainer: {
    gap: 12,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  reasonCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F9F5FF',
  },
  reasonIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reasonIcon: {
    fontSize: 24,
  },
  reasonContent: {
    flex: 1,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  reasonDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#8B5CF6',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  backButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  nextButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#FFFFFF',
  },
});

export default ProfileVerificationScreen;