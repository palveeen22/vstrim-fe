// hooks/useUsernameValidation.ts
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/auth-context';

interface UsernameValidationState {
  username: string;
  isChecking: boolean;
  isAvailable: boolean | null;
  message: string;
  isValid: boolean;
}

/**
 * Custom hook for real-time username validation with debouncing
 * 
 * Think of this as a "smart gatekeeper" that:
 * 1. Waits for user to stop typing (debounce)
 * 2. Validates format locally (instant feedback)
 * 3. Checks availability with server (deferred check)
 */
export const useUsernameValidation = (
  initialUsername: string = '',
  debounceMs: number = 500
) => {
  const { checkUsernameAvailability } = useAuth();
  
  const [state, setState] = useState<UsernameValidationState>({
    username: initialUsername,
    isChecking: false,
    isAvailable: null,
    message: '',
    isValid: false
  });

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Validate username format locally
  const validateFormat = (username: string): { valid: boolean; message: string } => {
    if (username.length === 0) {
      return { valid: false, message: '' };
    }

    if (username.length < 3) {
      return { valid: false, message: 'Username must be at least 3 characters' };
    }

    if (username.length > 20) {
      return { valid: false, message: 'Username must be at most 20 characters' };
    }

    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validUsernameRegex.test(username)) {
      return { 
        valid: false, 
        message: 'Only letters, numbers, and underscores allowed' 
      };
    }

    return { valid: true, message: '' };
  };

  // Check username availability
  const checkAvailability = async (username: string) => {
    setState(prev => ({ ...prev, isChecking: true }));

    try {
      const result = await checkUsernameAvailability(username);
      
      setState(prev => ({
        ...prev,
        isChecking: false,
        isAvailable: result.available,
        message: result.available 
          ? '✓ Username is available' 
          : result.message || 'Username is already taken',
        isValid: result.available
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isChecking: false,
        isAvailable: false,
        message: 'Unable to check username availability',
        isValid: false
      }));
    }
  };

  // Handle username change with debouncing
  const handleUsernameChange = (username: string) => {
    setState(prev => ({ ...prev, username, isAvailable: null }));

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Validate format first
    const formatValidation = validateFormat(username);
    
    if (!formatValidation.valid) {
      setState(prev => ({
        ...prev,
        username,
        isChecking: false,
        isAvailable: null,
        message: formatValidation.message,
        isValid: false
      }));
      return;
    }

    // Set new timer for availability check
    debounceTimer.current = setTimeout(() => {
      checkAvailability(username);
    }, debounceMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    username: state.username,
    isChecking: state.isChecking,
    isAvailable: state.isAvailable,
    message: state.message,
    isValid: state.isValid,
    handleUsernameChange
  };
};