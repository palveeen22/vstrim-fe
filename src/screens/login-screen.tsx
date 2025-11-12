import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigations/auth-stack';
import HeaderBack from '../components/header-back';
import { useAuth } from '../contexts/auth-context';

type TProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const LoginScreen = ({ navigation }: TProps) => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const validateForm = (): boolean => {
    if (!identifier.trim()) {
      Alert.alert('Error', 'Please enter your email or username');
      return false;
    }

    // Check if it's an email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(identifier);

    // If it looks like an email, validate it properly
    if (identifier.includes('@') && !isEmail) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // If it's not an email, check username length (minimum 3 characters)
    if (!isEmail && identifier.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {

      const result = await login({
        identifier: identifier,
        password: password,
      });

      if (result.success) {
        // Success! AuthContext will handle navigation automatically
        // The app will re-render and show authenticated screens
        Alert.alert('Success', 'Welcome back!', [
          {
            text: 'OK',
            onPress: () => {
              // Navigation will be handled by your navigation logic
              // based on isLoggedIn state from AuthContext
            },
          },
        ]);
      } else {
        // Show error message from server
        Alert.alert(
          'Login Failed',
          result.error || 'Invalid email/username or password'
        );
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Error',
        'An unexpected error occurred. Please try again later.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigate to forgot password screen
   */
  const handleForgotPassword = () => {
    // TODO: Implement forgot password navigation
    navigation.navigate('ForgotPassword' as any);
    // For now, show placeholder
    // Alert.alert('Forgot Password', 'Password reset feature coming soon');
  };

  /**
   * Handle Facebook OAuth login
   */
  const handleFacebookLogin = async () => {
    try {
      setLoadingProvider('facebook');
      // TODO: Implement Facebook OAuth
      // await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Coming Soon', 'Facebook login will be implemented');
    } catch (error) {
      console.error('Facebook login error:', error);
      Alert.alert('Error', 'Failed to login with Facebook');
    } finally {
      setLoadingProvider(null);
    }
  };

  /**
   * Handle Apple OAuth login
   */
  const handleAppleLogin = async () => {
    try {
      setLoadingProvider('apple');
      // TODO: Implement Apple OAuth
      // await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Coming Soon', 'Apple login will be implemented');
    } catch (error) {
      console.error('Apple login error:', error);
      Alert.alert('Error', 'Failed to login with Apple');
    } finally {
      setLoadingProvider(null);
    }
  };

  /**
   * Navigate to register screen
   */
  const handleNavigateToRegister = () => {
    navigation.navigate('Register' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFA726" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <HeaderBack
              onBackPress={() => navigation.goBack()}
              bgColor="#FFA726"
            />
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Email/Username Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Email or Username"
                placeholderTextColor="#9CA3AF"
                value={identifier}
                onChangeText={setIdentifier}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                editable={!isLoading}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                placeholder="Password (min 6 characters)"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordContainer}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.loginButton, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Log in</Text>
              )}
            </TouchableOpacity>

            {/* Register Link */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={handleNavigateToRegister}
                disabled={isLoading}
              >
                <Text style={styles.registerLink}>Sign up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Social Login Section */}
          <View style={styles.socialSection}>
            <View style={styles.dividerContainer}>
              <View style={styles.divider} />
              <Text style={styles.socialText}>or continue with</Text>
              <View style={styles.divider} />
            </View>

            <View style={styles.socialButtonsContainer}>
              {/* Google/Facebook Login */}
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleFacebookLogin}
                disabled={loadingProvider !== null || isLoading}
              >
                {loadingProvider === 'facebook' ? (
                  <ActivityIndicator size="small" color="#4285F4" />
                ) : (
                  <Image
                    source={require('../assets/images/google-logo.png')}
                    style={styles.oauthIcon}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>

              {/* Apple Login (iOS only) */}
              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.appleButton}
                  onPress={handleAppleLogin}
                  disabled={loadingProvider !== null || isLoading}
                >
                  {loadingProvider === 'apple' ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Icon name="logo-apple" size={32} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFA726',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: 40,
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1E1E1E',
    lineHeight: 56,
  },
  subtitle: {
    fontSize: 18,
    color: '#1E1E1E',
    marginTop: 8,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 32,
  },
  inputWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  input: {
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
    borderWidth: 0,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-start',
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '600',
  },
  loginButton: {
    height: 60,
    backgroundColor: '#007BFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  registerLink: {
    fontSize: 16,
    color: '#1E40AF',
    fontWeight: '700',
  },
  socialSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#374151',
  },
  socialText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginHorizontal: 16,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  googleButton: {
    width: 140,
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  oauthIcon: {
    width: 24,
    height: 24,
  },
  appleButton: {
    width: 140,
    height: 56,
    backgroundColor: '#000',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});

export default LoginScreen;