import React, { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useUsernameValidation } from '../hooks/use-username-validation';
import { useAuth } from '../contexts/auth-context';
import { useLocation } from '../hooks/use-location';
import { HangoutPlacePicker } from '../components/hangout-place-picker';
import { JOIN_REASONS, MOCK_INTERESTS, VIBES } from '../constants';

interface FormData {
  name: string;
  username: string;
  vibes: string[];
  interests: string[];
  joinReasons: string[];
  coordinates: {
    latitude: number;
    longitude: number;
    city?: string;
    district?: string;
  } | null;
  hangoutPlaces: Array<{
    placeName: string;
    placeType: string;
    latitude: number;
    longitude: number;
    address?: string;
  }>;
}

const ProfileVerificationScreen = () => {
  const { completeProfileSetup } = useAuth();

  // Location hook
  const {
    coordinates,
    isLoading: isLoadingLocation,
    hasPermission,
    getCurrentLocation,
  } = useLocation();

  const [step, setStep] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    vibes: [],
    interests: [],
    joinReasons: [],
    coordinates: null,
    hangoutPlaces: [],
  });

  // Use custom hook for username validation
  const {
    username,
    isChecking,
    isAvailable,
    message: usernameMessage,
    isValid: isUsernameValid,
    handleUsernameChange
  } = useUsernameValidation();

  // Update form when location is obtained
  useEffect(() => {
    if (coordinates) {
      setFormData(prev => ({
        ...prev,
        coordinates,
      }));
    }
  }, [coordinates]);

  // Request location on mount
  useEffect(() => {
    handleGetLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      console.log('Location obtained:', location);
    }
  };

  // ✅ Toggle interest selection
  const toggleInterest = (interestCategory: string) => {
    setFormData(prev => {
      const currentInterests = prev.interests;
      const isSelected = currentInterests.includes(interestCategory);

      if (isSelected) {
        return {
          ...prev,
          interests: currentInterests.filter(cat => cat !== interestCategory)
        };
      } else {
        if (currentInterests.length >= 10) {
          Alert.alert('Maximum Reached', 'You can select up to 10 interests');
          return prev;
        }
        return {
          ...prev,
          interests: [...currentInterests, interestCategory]
        };
      }
    });
  };


  const toggleVibe = (vibeValue: string) => {
    setFormData(prev => {
      const currentVibes = prev.vibes;
      const isSelected = currentVibes.includes(vibeValue);

      if (isSelected) {
        return { ...prev, vibes: currentVibes.filter(v => v !== vibeValue) };
      } else {
        return { ...prev, vibes: [...currentVibes, vibeValue] };
      }
    });
  };


  // ✅ Toggle join reason selection
  const toggleJoinReason = (reasonValue: string) => {
    setFormData(prev => {
      const currentReasons = prev.joinReasons;
      const isSelected = currentReasons.includes(reasonValue);

      if (isSelected) {
        return {
          ...prev,
          joinReasons: currentReasons.filter(r => r !== reasonValue)
        };
      } else {
        if (currentReasons.length >= 3) {
          Alert.alert('Maximum Reached', 'You can select up to 3 reasons');
          return prev;
        }
        return {
          ...prev,
          joinReasons: [...currentReasons, reasonValue]
        };
      }
    });
  };

  const handleAddHangoutPlace = (place: any) => {
    setFormData(prev => ({
      ...prev,
      hangoutPlaces: [...prev.hangoutPlaces, place],
    }));
  };

  const handleRemoveHangoutPlace = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hangoutPlaces: prev.hangoutPlaces.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      if (isSubmitting) return;
      setIsSubmitting(true);

      if (!formData.name.trim()) {
        Alert.alert('Missing Information', 'Please enter your full name');
        setIsSubmitting(false);
        return;
      }


      // ✅ Validate all required data
      if (!isUsernameValid) {
        Alert.alert('Invalid Username', 'Please choose a valid username');
        setIsSubmitting(false);
        return;
      }

      if (!formData.vibes) {
        Alert.alert('Missing Information', 'Please select your Vibe');
        setIsSubmitting(false);
        return;
      }

      if (formData.interests.length < 3) {
        Alert.alert('Missing Information', 'Please select at least 3 interests');
        setIsSubmitting(false);
        return;
      }

      if (formData.joinReasons.length === 0) {
        Alert.alert('Missing Information', 'Please select at least 1 reason');
        setIsSubmitting(false);
        return;
      }

      if (!formData.coordinates) {
        Alert.alert('Location Required', 'Please allow location access');
        setIsSubmitting(false);
        return;
      }

      // ✅ Prepare data matching backend schema
      const profileData = {
        name: formData.name.trim(),
        username: username.trim(),
        vibes: formData.vibes,
        interests: formData.interests,
        joinReasons: formData.joinReasons,
        coordinates: {
          latitude: formData.coordinates.latitude,
          longitude: formData.coordinates.longitude,
          city: formData.coordinates.city,
          district: formData.coordinates.district,
        },
        hangoutPlaces: formData.hangoutPlaces.length > 0
          ? formData.hangoutPlaces
          : [
            // Default hangout place if none selected
            {
              placeName: 'My Location',
              placeType: 'other',
              latitude: formData.coordinates.latitude,
              longitude: formData.coordinates.longitude,
              address: `${formData.coordinates.district}, ${formData.coordinates.city}`,
            }
          ]
      };

      console.log('Submitting profile data:', profileData);

      const result = await completeProfileSetup(profileData);

      if (result.success) {
        Alert.alert(
          'Success! 🎉',
          'Your profile has been completed successfully'
        );
        // Navigation handled by auth state change
      } else {
        Alert.alert(
          'Update Failed',
          result.error || 'Failed to update profile. Please try again.'
        );
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 0:
        return formData.name.trim().length >= 3;
      case 1:
        return isUsernameValid;
      case 2:
        return formData.vibes.length >= 1;
      case 3:
        return formData.interests.length >= 3;
      case 4:
        return formData.joinReasons.length >= 1;
      case 5:
        return formData.coordinates !== null;
      default:
        return false;
    }
  };



  const getInputBorderColor = () => {
    if (username.length === 0) return '#E5E7EB';
    if (isChecking) return '#8B5CF6';
    if (isAvailable === true) return '#10B981';
    if (isAvailable === false) return '#EF4444';
    return '#E5E7EB';
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
            {[1, 2, 3, 4, 5, 6].map((s, index) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.dot,
                  index === step && styles.dotActive
                ]}
                onPress={() => {
                  setStep(index);
                  // scrollTo(index);
                }}
              />
            ))}
          </View>
          {/* Step Content */}
          <View style={styles.contentContainer}>
            {/* Step 0 name */}
            {step === 0 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>What’s your full name?</Text>
                <Text style={styles.subtitle}>This is how others will see you</Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={[styles.input, { borderColor: formData.name ? '#10B981' : '#E5E7EB' }]}
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            {/* ✅ Step 1: Username */}
            {step === 1 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Choose your username</Text>
                <Text style={styles.subtitle}>
                  This is how others will see you
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Username</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[
                        styles.input,
                        { borderColor: getInputBorderColor() }
                      ]}
                      value={username}
                      onChangeText={handleUsernameChange}
                      placeholder="Enter your username"
                      placeholderTextColor="#9CA3AF"
                      maxLength={20}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {isChecking && (
                      <ActivityIndicator
                        size="small"
                        color="#8B5CF6"
                        style={styles.inputIcon}
                      />
                    )}
                    {!isChecking && isAvailable === true && (
                      <Text style={[styles.inputIcon, styles.successIcon]}>
                        ✓
                      </Text>
                    )}
                    {!isChecking && isAvailable === false && username.length >= 3 && (
                      <Text style={[styles.inputIcon, styles.errorIcon]}>
                        ✕
                      </Text>
                    )}
                  </View>

                  {usernameMessage && (
                    <Text
                      style={[
                        styles.validationText,
                        isAvailable === true && styles.successText,
                        isAvailable === false && styles.errorText,
                      ]}>
                      {usernameMessage}
                    </Text>
                  )}

                  <Text style={styles.helperText}>
                    {username.length}/20 characters
                  </Text>
                </View>
              </View>
            )}

            {/* ✅ Step 2: Mood */}
            {step === 2 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>How are you feeling?</Text>
                <Text style={styles.subtitle}>Choose your current vibe</Text>

                <View style={styles.moodGrid}>
                  {VIBES.map((vibe) => (
                    <TouchableOpacity
                      key={vibe.value}
                      style={[
                        styles.moodCard,
                        formData.vibes.includes(vibe.value) && styles.moodCardActive
                      ]}
                      onPress={() => toggleVibe(vibe.value)}>
                      <Text style={styles.moodEmoji}>{vibe.emoji}</Text>
                      <Text style={styles.moodLabel}>{vibe.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ✅ Step 3: Interests (Multi-Select, 3-10) */}
            {step === 3 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>What are you into?</Text>
                <Text style={styles.subtitle}>
                  Select 3-10 interests to help us match you
                </Text>

                <View style={styles.selectionCounter}>
                  <Text style={styles.selectionCounterText}>
                    {formData.interests.length}/10 selected
                    {formData.interests.length < 3 && ' (min 3)'}
                  </Text>
                </View>

                <View style={styles.interestGrid}>
                  {MOCK_INTERESTS.map((interest) => {
                    const selected = formData.interests.includes(interest.category);
                    const isMaxReached = formData.interests.length >= 10 && !selected;

                    return (
                      <TouchableOpacity
                        key={interest.id}
                        style={[
                          styles.interestCard,
                          selected && styles.interestCardActive,
                          isMaxReached && styles.interestCardDisabled,
                        ]}
                        onPress={() => toggleInterest(interest.category)}
                        disabled={isMaxReached}
                      >
                        <Text style={styles.interestIcon}>{interest.icon}</Text>
                        <Text
                          style={[
                            styles.interestLabel,
                            isMaxReached && styles.interestTextDisabled,
                          ]}
                        >
                          {interest.name}
                        </Text>
                        {selected && (
                          <View style={styles.selectedBadge}>
                            <Text style={styles.selectedBadgeText}>✓</Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    );
                  })}

                </View>
              </View>
            )}

            {/* ✅ Step 4: Join Reasons (Multi-Select, 1-3) */}
            {step === 4 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Why join us?</Text>
                <Text style={styles.subtitle}>
                  Choose 1-3 reasons for joining
                </Text>

                <View style={styles.selectionCounter}>
                  <Text style={styles.selectionCounterText}>
                    {formData.joinReasons.length}/3 selected
                  </Text>
                </View>

                <View style={styles.reasonContainer}>
                  {JOIN_REASONS.map((reason) => {
                    const selected = formData.joinReasons.includes(reason.value);
                    const isMaxReached = formData.joinReasons.length >= 3 && !selected;

                    return (
                      <TouchableOpacity
                        key={reason.value}
                        style={[
                          styles.reasonCard,
                          selected && styles.reasonCardActive,
                          isMaxReached && styles.reasonCardDisabled,
                        ]}
                        onPress={() => toggleJoinReason(reason.value)}
                        disabled={isMaxReached}>
                        <View style={styles.reasonIconContainer}>
                          <Text style={styles.reasonIcon}>{reason.icon}</Text>
                        </View>
                        <View style={styles.reasonContent}>
                          <Text style={[
                            styles.reasonTitle,
                            isMaxReached && styles.reasonTextDisabled
                          ]}>
                            {reason.title}
                          </Text>
                          <Text style={[
                            styles.reasonDescription,
                            isMaxReached && styles.reasonTextDisabled
                          ]}>
                            {reason.description}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.checkbox,
                            selected && styles.checkboxActive,
                            isMaxReached && styles.checkboxDisabled,
                          ]}>
                          {selected && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* ✅ Step 5: Location & Hangout Places */}
            {step === 5 && (
              <View style={styles.stepContainer}>
                <Text style={styles.title}>Where do you hang out?</Text>
                <Text style={styles.subtitle}>
                  Share your location and favorite places
                </Text>

                {/* Current Location Section */}
                <View style={styles.locationSection}>
                  <Text style={styles.sectionLabel}>Your Location</Text>

                  {formData.coordinates ? (
                    <View style={styles.locationCard}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <View style={styles.locationInfo}>
                        <Text style={styles.locationCity}>
                          {formData.coordinates.city || 'Unknown City'}
                        </Text>
                        {formData.coordinates.district && (
                          <Text style={styles.locationDistrict}>
                            {formData.coordinates.district}
                          </Text>
                        )}
                        <Text style={styles.locationCoords}>
                          {formData.coordinates.latitude.toFixed(4)}, {formData.coordinates.longitude.toFixed(4)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={handleGetLocation}
                        disabled={isLoadingLocation}>
                        {isLoadingLocation ? (
                          <ActivityIndicator size="small" color="#8B5CF6" />
                        ) : (
                          <Text style={styles.refreshIcon}>🔄</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.enableLocationButton}
                      onPress={handleGetLocation}
                      disabled={isLoadingLocation}>
                      {isLoadingLocation ? (
                        <>
                          <ActivityIndicator size="small" color="#8B5CF6" />
                          <Text style={styles.enableLocationText}>
                            Getting your location...
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.enableLocationIcon}>📍</Text>
                          <Text style={styles.enableLocationText}>
                            {hasPermission === false
                              ? 'Enable Location Access'
                              : 'Get Current Location'}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  )}
                </View>

                {/* Hangout Places Section */}
                {formData.coordinates && (
                  <View style={styles.hangoutSection}>
                    <Text style={styles.sectionLabel}>
                      Favorite Hangout Places (Optional)
                    </Text>
                    <Text style={styles.sectionHelp}>
                      Add up to 5 places where you like to hang out
                    </Text>

                    <HangoutPlacePicker
                      places={formData.hangoutPlaces}
                      onAddPlace={handleAddHangoutPlace}
                      onRemovePlace={handleRemoveHangoutPlace}
                      maxPlaces={5}
                      userLocation={formData.coordinates}
                    />
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {step > 0 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}


          <TouchableOpacity
            style={[
              styles.nextButton,
              !isStepValid() && styles.nextButtonDisabled,
              step === 1 && styles.nextButtonFull,
              isSubmitting && styles.nextButtonDisabled,
            ]}
            onPress={step === 5 ? handleSubmit : handleNext}
            disabled={!isStepValid() || isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.nextButtonText}>
                {step === 5 ? 'Complete Profile' : 'Next'}
              </Text>
            )}
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
    paddingHorizontal: 20,
    gap: 8,
  },
  dot: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007BFF',
  },
  progressStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
    flex: 1,
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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 48,
    fontSize: 16,
    color: '#111827',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
    fontSize: 18,
  },
  successIcon: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  errorIcon: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  validationText: {
    fontSize: 13,
    marginTop: 6,
    color: '#6B7280',
  },
  successText: {
    color: '#10B981',
  },
  errorText: {
    color: '#EF4444',
  },
  helperText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
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
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    position: 'relative',
  },
  interestCardActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F9F5FF',
  },
  interestCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F9FAFB',
  },
  interestIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  interestLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  interestTextDisabled: {
    color: '#9CA3AF',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  selectionCounter: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  selectionCounterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
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
  reasonCardDisabled: {
    opacity: 0.5,
    backgroundColor: '#F9FAFB',
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
  reasonTextDisabled: {
    color: '#9CA3AF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF6',
  },
  checkboxDisabled: {
    borderColor: '#E5E7EB',
    backgroundColor: '#F3F4F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // ✅ Location Section Styles
  locationSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionHelp: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  locationIcon: {
    fontSize: 28,
  },
  locationInfo: {
    flex: 1,
  },
  locationCity: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  locationDistrict: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 11,
    color: '#9CA3AF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 20,
  },
  enableLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F5FF',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  enableLocationIcon: {
    fontSize: 24,
  },
  enableLocationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  hangoutSection: {
    marginTop: 16,
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