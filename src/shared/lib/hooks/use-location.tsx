import { useState, useEffect } from 'react';
import { Platform, Alert, Linking, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

interface Coordinates {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
}

interface LocationState {
  coordinates: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  hasPermission: boolean | null;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    isLoading: false,
    error: null,
    hasPermission: null,
  });

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (Platform.OS === 'ios') {
      setState(prev => ({ ...prev, hasPermission: true }));
    } else {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setState(prev => ({ ...prev, hasPermission: granted }));
      } catch (error) {
        console.error('❌ Error checking permission:', error);
        setState(prev => ({ ...prev, hasPermission: false }));
      }
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to help you find nearby hangout spots and connect with people around you.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        setState(prev => ({ ...prev, hasPermission: isGranted }));
        return isGranted;
      }
      return true;
    } catch (error) {
      console.error('❌ Permission request error:', error);
      return false;
    }
  };

  /**
   * ✅ FREE Reverse Geocoding using Nominatim (OpenStreetMap)
   * No API key required!
   * Rate limit: 1 request per second (fair use)
   */
  const reverseGeocode = async (
    latitude: number,
    longitude: number
  ): Promise<{ city?: string; district?: string }> => {
    try {
      console.log('🌍 Reverse geocoding with Nominatim (FREE):', { latitude, longitude });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `format=json&` +
        `lat=${latitude}&` +
        `lon=${longitude}&` +
        `zoom=18&` +
        `addressdetails=1`,
        {
          headers: {
            'User-Agent': 'HangoutApp/1.0', // ✅ Required by Nominatim
            'Accept-Language': 'en', // Get results in English
          },
        }
      );

      if (!response.ok) {
        console.error('❌ Nominatim API HTTP error:', response.status);
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📍 Nominatim raw response:', JSON.stringify(data, null, 2));

      if (data && data.address) {
        const address = data.address;
        
        // ✅ Try multiple fields for CITY (in priority order)
        const city = 
          address.city ||           // Most common
          address.town ||           // Smaller cities
          address.village ||        // Villages
          address.municipality ||   // Municipalities
          address.county ||         // Counties
          address.state_district || // State districts
          address.state ||          // Fallback to state/province
          address.region ||         // Region
          undefined;

        // ✅ Try multiple fields for DISTRICT/NEIGHBORHOOD
        const district = 
          address.suburb ||         // Suburbs
          address.neighbourhood ||  // British spelling
          address.neighborhood ||   // American spelling
          address.quarter ||        // Quarters
          address.district ||       // Districts
          address.city_district ||  // City districts
          address.borough ||        // Boroughs
          undefined;

        console.log('✅ Parsed location:', { 
          city, 
          district,
          fullAddress: data.display_name 
        });

        return { 
          city: city || undefined, 
          district: district || undefined 
        };
      }

      console.warn('⚠️ No address data in Nominatim response');
      return { city: undefined, district: undefined };

    } catch (error) {
      console.error('❌ Nominatim geocoding error:', error);
      
      // ✅ Fallback: Use coordinate-based approximation
      console.log('🔄 Using coordinate-based approximation as fallback');
      const approximateCity = getApproximateCityFromCoordinates(latitude, longitude);
      
      return { 
        city: approximateCity || undefined, 
        district: undefined 
      };
    }
  };

  /**
   * ✅ Get approximate city based on coordinate ranges
   * This is a fallback when API fails
   */
  const getApproximateCityFromCoordinates = (
    latitude: number,
    longitude: number
  ): string | undefined => {
    
    // ========== NORTH AMERICA ==========
    
    // San Francisco Bay Area
    if (latitude >= 37.7 && latitude <= 37.85 && longitude >= -122.52 && longitude <= -122.35) {
      return 'San Francisco';
    }
    
    // Los Angeles Area
    if (latitude >= 33.7 && latitude <= 34.35 && longitude >= -118.67 && longitude <= -118.15) {
      return 'Los Angeles';
    }
    
    // New York City Area
    if (latitude >= 40.5 && latitude <= 40.92 && longitude >= -74.26 && longitude <= -73.7) {
      return 'New York';
    }
    
    // Chicago Area
    if (latitude >= 41.64 && latitude <= 42.02 && longitude >= -87.94 && longitude <= -87.52) {
      return 'Chicago';
    }
    
    // ========== ASIA - INDONESIA ==========
    
    // Jakarta Area
    if (latitude >= -6.37 && latitude <= -6.08 && longitude >= 106.65 && longitude <= 106.98) {
      return 'Jakarta';
    }
    
    // Surabaya Area
    if (latitude >= -7.43 && latitude <= -7.15 && longitude >= 112.62 && longitude <= 112.8) {
      return 'Surabaya';
    }
    
    // Bandung Area
    if (latitude >= -7.06 && latitude <= -6.82 && longitude >= 107.52 && longitude <= 107.73) {
      return 'Bandung';
    }
    
    // Medan Area
    if (latitude >= 3.48 && latitude <= 3.67 && longitude >= 98.59 && longitude <= 98.73) {
      return 'Medan';
    }
    
    // Bali (Denpasar) Area
    if (latitude >= -8.75 && latitude <= -8.6 && longitude >= 115.17 && longitude <= 115.27) {
      return 'Denpasar';
    }
    
    // ========== ASIA - OTHER ==========
    
    // Singapore
    if (latitude >= 1.22 && latitude <= 1.47 && longitude >= 103.6 && longitude <= 104.0) {
      return 'Singapore';
    }
    
    // Kuala Lumpur Area
    if (latitude >= 3.0 && latitude <= 3.25 && longitude >= 101.6 && longitude <= 101.77) {
      return 'Kuala Lumpur';
    }
    
    // Bangkok Area
    if (latitude >= 13.65 && latitude <= 13.95 && longitude >= 100.4 && longitude <= 100.65) {
      return 'Bangkok';
    }
    
    // Tokyo Area
    if (latitude >= 35.52 && latitude <= 35.82 && longitude >= 139.5 && longitude <= 139.92) {
      return 'Tokyo';
    }
    
    // Seoul Area
    if (latitude >= 37.42 && latitude <= 37.7 && longitude >= 126.76 && longitude <= 127.18) {
      return 'Seoul';
    }
    
    // Hong Kong
    if (latitude >= 22.15 && latitude <= 22.57 && longitude >= 113.83 && longitude <= 114.41) {
      return 'Hong Kong';
    }
    
    // ========== EUROPE ==========
    
    // London Area
    if (latitude >= 51.28 && latitude <= 51.69 && longitude >= -0.51 && longitude <= 0.33) {
      return 'London';
    }
    
    // Paris Area
    if (latitude >= 48.81 && latitude <= 48.9 && longitude >= 2.22 && longitude <= 2.47) {
      return 'Paris';
    }
    
    // Berlin Area
    if (latitude >= 52.34 && latitude <= 52.67 && longitude >= 13.09 && longitude <= 13.76) {
      return 'Berlin';
    }
    
    // Amsterdam Area
    if (latitude >= 52.28 && latitude <= 52.43 && longitude >= 4.73 && longitude <= 5.07) {
      return 'Amsterdam';
    }
    
    // ========== AUSTRALIA ==========
    
    // Sydney Area
    if (latitude >= -34.12 && latitude <= -33.58 && longitude >= 150.52 && longitude <= 151.34) {
      return 'Sydney';
    }
    
    // Melbourne Area
    if (latitude >= -38.0 && latitude <= -37.6 && longitude >= 144.75 && longitude <= 145.14) {
      return 'Melbourne';
    }
    
    console.log('⚠️ Coordinates not in known city ranges:', { latitude, longitude });
    return undefined;
  };

  /**
   * ✅ Get current location with city name
   */
  const getCurrentLocation = async (): Promise<Coordinates | null> => {
    try {
      console.log('📍 Starting location fetch...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Check permission
      if (!state.hasPermission) {
        console.log('🔐 Requesting location permission...');
        const granted = await requestPermission();
        if (!granted) {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature. Please enable it in settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { 
                text: 'Open Settings', 
                onPress: () => Linking.openSettings() 
              }
            ]
          );
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'Permission denied' 
          }));
          return null;
        }
      }

      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            console.log('✅ Got GPS coordinates:', { 
              latitude: latitude.toFixed(6), 
              longitude: longitude.toFixed(6) 
            });

            // Get city name from coordinates (with retry)
            let address = await reverseGeocode(latitude, longitude);
            
            // If first attempt failed, retry once after 1 second (Nominatim rate limit)
            if (!address.city) {
              console.log('🔄 First geocoding attempt failed, retrying in 1 second...');
              // eslint-disable-next-line @typescript-eslint/no-shadow
              await new Promise(resolve => setTimeout(resolve, 1000));
              address = await reverseGeocode(latitude, longitude);
            }

            const coordinates: Coordinates = {
              latitude,
              longitude,
              city: address.city || 'Unknown Location',
              district: address.district,
            };

            console.log('✅ Final coordinates with address:', coordinates);

            setState(prev => ({ 
              ...prev, 
              coordinates, 
              isLoading: false 
            }));

            resolve(coordinates);
          },
          (error) => {
            console.error('❌ Geolocation error:', error);
            let errorMessage = 'Failed to get location';
            
            switch (error.code) {
              case 1:
                errorMessage = 'Location permission denied';
                break;
              case 2:
                errorMessage = 'Location unavailable. Please check if GPS is enabled.';
                break;
              case 3:
                errorMessage = 'Location request timeout. Please try again.';
                break;
            }

            setState(prev => ({ 
              ...prev, 
              isLoading: false, 
              error: errorMessage 
            }));

            Alert.alert('Location Error', errorMessage);
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000,
          }
        );
      });
    } catch (error) {
      console.error('❌ Get location error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get location';
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: errorMessage 
      }));
      return null;
    }
  };

  return {
    ...state,
    getCurrentLocation,
    requestPermission,
  };
};