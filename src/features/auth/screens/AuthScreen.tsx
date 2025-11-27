import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigations/AuthNavigator';

type TProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const AuthScreen = ({ navigation }: TProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('google');

      // TODO: Implement Google OAuth
      // const result = await GoogleSignin.signIn();
      // Handle the result

      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Coming Soon', 'Google login will be implemented');

    } catch (error) {
      console.error('Google login error:', error);
      Alert.alert('Error', 'Failed to login with Google');
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  const handleAppleLogin = async () => {
    try {
      setIsLoading(true);
      setLoadingProvider('apple');

      // TODO: Implement Apple OAuth
      // const appleAuthRequestResponse = await appleAuth.performRequest({...});
      // Handle the result

      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      Alert.alert('Coming Soon', 'Apple login will be implemented');

    } catch (error) {
      console.error('Apple login error:', error);
      Alert.alert('Error', 'Failed to login with Apple');
    } finally {
      setIsLoading(false);
      setLoadingProvider(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo/Illustration */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/vstrim.png')}
            style={styles.loginIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>Let's Get Started</Text>
          <Text style={styles.subtitle}>
            Join thousands of users and experience seamless delivery
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          {/* Email/Phone Actions - Moved to top */}
          <View style={styles.emailActionsContainer}>
            <Text style={styles.sectionLabel}>Get Started</Text>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Log in</Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.divider} />
          </View>

          {/* OAuth Buttons */}
          <View style={styles.oauthContainer}>
            {/* Google OAuth */}
            <TouchableOpacity
              style={[
                styles.oauthButton,
                isLoading && loadingProvider === 'google' && styles.buttonDisabled
              ]}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              {isLoading && loadingProvider === 'google' ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <>
                  <Image
                    source={require('../assets/images/google-logo.png')}
                    style={styles.oauthIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.oauthButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Apple OAuth */}
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[
                  styles.oauthButton,
                  isLoading && loadingProvider === 'apple' && styles.buttonDisabled
                ]}
                onPress={handleAppleLogin}
                disabled={isLoading}
              >
                {isLoading && loadingProvider === 'apple' ? (
                  <ActivityIndicator size="small" color="#666" />
                ) : (
                  <>
                    <Image
                      source={require('../assets/images/apple-logo.png')}
                      style={styles.oauthIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.oauthButtonText}>Continue with Apple</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our{' '}
            <Text style={styles.footerLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#007BFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: Platform.OS === 'android' ? 16 : 8,
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
  loginIcon: {
    width: 180,
    height: 140,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
  },
  actionsContainer: {
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#fff',
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emailActionsContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    backgroundColor: '#ffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#007BFF',
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#fff',
    paddingHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  oauthContainer: {
    marginBottom: 24,
  },
  oauthButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 54,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  oauthIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  oauthButtonText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 24,
    paddingHorizontal: 8,
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
  },
  footerLink: {
    color: '#1e1e1e',
    fontWeight: '600',
  },
});