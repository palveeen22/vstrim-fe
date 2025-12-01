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
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigations/AuthNavigator';

type TProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export const AuthScreen = ({ navigation }: TProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            source={require('../../../assets/images/vstrim.png')}
            style={styles.loginIcon}
            resizeMode="contain"
          />
          <Text style={styles.title}>Let's Get Started</Text>
          <Text style={styles.subtitle}>
            Meets people IRL and touch the grass!
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          {/* Email/Phone Actions - Moved to top */}
          <View style={styles.emailActionsContainer}>
            {/* Login Button */}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Register')}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
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
  buttonText: {
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