import apiClient from "../../../app/config/apiClient";
import { AxiosError } from "axios";

// Types based on the API response
type Coordinates = {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string | null;
  updatedAt: string;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string | null;
  dateOfBirth: string | null;
  image: string | null;
  tokens: number;
  vibes: string[];
  joinReasons: string[];
  interests: string[];
  isVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  coordinates: Coordinates;
  hangoutPlaces: HangoutPlace[];
  communities: Array<{ userId: string; communityId: string; joinedAt: string }>;
  events: any[];
};

type HangoutPlace = {
  id: string;
  userId: string;
  placeName: string;
  placeType: string;
  latitude: number;
  longitude: number;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type Promo = {
  id: string;
  placeId: string;
  title: string;
  discountCode: string;
  validUntil: string;
  createdAt: string;
};

type Place = {
  id: string;
  name: string;
  address: string;
  type: string;
  latitude: number;
  longitude: number;
  city: string;
  district: string;
  description: string | null;
  image: string | null;
  googlePlaceId: string | null;
  vibes: string[];
  rating: number | null;
  createdAt: string;
  promos: Promo[];
  events: any[];
};

type Community = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  users: Array<{ userId: string; communityId: string; joinedAt: string }>;
  events: any[];
};

type Interest = {
  id: string;
  name: string;
  slug: string;
  category: string;
  icon: string;
  order: number;
  createdAt: string;
};

type ValuesData = {
  users: User[];
  places: Place[];
  communities: Community[];
  events: any[];
  promos: Promo[];
  interests: Interest[];
};

type ApiResponse<T> = {
  status: string;
  message: string | null;
  data: T;
};

export type MarkerType = 'user' | 'place' | 'community' | 'event' | 'promo';

export type UnifiedMarker = {
  id: string;
  type: MarkerType;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  image?: string;
  memberCount?: number;
  distance?: string;
  category?: string;
  date?: string;
  metadata?: any; // Original data for detail view
};

export type FilterType = 'all' | MarkerType;

export class ExploreDataService {
  /**
   * Fetch all values (users, places, communities, events, promos, interests)
   * for the map exploration feature
   */
  static async getAllValues(): Promise<ValuesData | null> {
    try {
      console.log('🗺️ DataService: Fetching all map values...');

      const response = await apiClient.get<ApiResponse<ValuesData>>('/values');

      if (response.data.status === 'success' && response.data.data) {
        console.log('✅ DataService: Map values fetched successfully');
        console.log('📊 DataService: Stats:', {
          users: response.data.data.users.length,
          places: response.data.data.places.length,
          communities: response.data.data.communities.length,
          events: response.data.data.events.length,
          promos: response.data.data.promos.length,
          interests: response.data.data.interests.length,
        });

        return response.data.data;
      }

      console.warn('⚠️ DataService: No data in response');
      return null;
    } catch (error) {
      console.error('❌ DataService: Error fetching map values:', error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.warn('⚠️ DataService: Unauthorized - token might be invalid');
        } else if (error.response?.status === 404) {
          console.warn('⚠️ DataService: Endpoint not found');
        }
      }

      return null;
    }
  }

  /**
   * Transform API data to unified marker format for map rendering
   */
  static transformToMarkers(data: ValuesData): UnifiedMarker[] {
    const markers: UnifiedMarker[] = [];

    // Transform Users
    data.users.forEach((user) => {
      if (user.coordinates) {
        markers.push({
          id: `user-${user.id}`,
          type: 'user',
          title: user.name,
          description: user.bio || user.vibes.join(', '),
          latitude: user.coordinates.latitude,
          longitude: user.coordinates.longitude,
          image: user.image || undefined,
          category: user.joinReasons[0] || 'User',
          metadata: user,
        });
      }
    });

    // Transform Places
    data.places.forEach((place) => {
      const hasPromo = place.promos.length > 0;
      markers.push({
        id: `place-${place.id}`,
        type: hasPromo ? 'promo' : 'place',
        title: place.name,
        description: place.description || `${place.type} in ${place.district}`,
        latitude: place.latitude,
        longitude: place.longitude,
        category: place.type,
        metadata: place,
      });
    });

    // Transform Communities (use first user's location)
    data.communities.forEach((community) => {
      const communityUser = data.users.find((u) =>
        u.communities.some((c) => c.communityId === community.id)
      );

      if (communityUser?.coordinates) {
        markers.push({
          id: `community-${community.id}`,
          type: 'community',
          title: community.name,
          description: community.description,
          latitude: communityUser.coordinates.latitude,
          longitude: communityUser.coordinates.longitude,
          memberCount: community.users.length,
          category: 'Community',
          metadata: community,
        });
      }
    });

    // Transform Events (if they have location data)
    data.events.forEach((event: any) => {
      if (event.latitude && event.longitude) {
        markers.push({
          id: `event-${event.id}`,
          type: 'event',
          title: event.name || event.title,
          description: event.description || 'Event',
          latitude: event.latitude,
          longitude: event.longitude,
          date: event.date || event.startDate,
          category: event.category || 'Event',
          metadata: event,
        });
      }
    });

    console.log('🎯 DataService: Transformed markers:', {
      total: markers.length,
      users: markers.filter(m => m.type === 'user').length,
      places: markers.filter(m => m.type === 'place').length,
      promos: markers.filter(m => m.type === 'promo').length,
      communities: markers.filter(m => m.type === 'community').length,
      events: markers.filter(m => m.type === 'event').length,
    });

    return markers;
  }

  /**
   * Get markers filtered by type
   */
  static filterMarkers(
    markers: UnifiedMarker[],
    filterType: FilterType
  ): UnifiedMarker[] {
    if (filterType === 'all') {
      return markers;
    }
    return markers.filter((marker) => marker.type === filterType);
  }

  /**
   * Calculate map center based on markers
   */
  static getMapCenter(markers: UnifiedMarker[]): {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } {
    if (markers.length === 0) {
      // Default center (Saint Petersburg from the data)
      return {
        latitude: 59.9311,
        longitude: 30.3609,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    const latitudes = markers.map((m) => m.latitude);
    const longitudes = markers.map((m) => m.longitude);

    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLng = Math.min(...longitudes);
    const maxLng = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(maxLat - minLat, 0.05) * 1.5,
      longitudeDelta: Math.max(maxLng - minLng, 0.05) * 1.5,
    };
  }
}

// Export types for use in components
export type {
  User,
  Place,
  Community,
  Promo,
  Interest,
  ValuesData,
  HangoutPlace,
  Coordinates,
};