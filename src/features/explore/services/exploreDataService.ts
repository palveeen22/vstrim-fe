import { UserHangoutPlace, UserCoordinates } from './../../../shared/types/index';
import { Community, Interest, Place, Promo, User } from "../../../shared/types";
import apiClient from "../../../app/config/apiClient";
import { AxiosError } from "axios";

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
  user?: User;
  initialData?: User | Place | Community | Event | Promo;
};

export type FilterType = 'all' | MarkerType;

export class ExploreDataService {
  static async getAllValues(): Promise<ValuesData | null> {
    try {
      console.log('🗺️ DataService: Fetching all map values...');

      const response = await apiClient.get<ApiResponse<ValuesData>>('/values');

      if (response.data.status === 'success' && response.data.data) {
        const data = response.data.data;


        console.log(data, "<<<NIH");

        console.log('✅ DataService: Map values fetched successfully');
        console.log('📊 DataService: Stats:', {
          users: data.users?.length || 0,
          places: data.places?.length || 0,
          communities: data.communities?.length || 0,
          events: data.events?.length || 0,
          promos: data.promos?.length || 0,
          interests: data.interests?.length || 0,
        });

        // ✅ Ensure arrays exist
        return {
          users: data.users || [],
          places: data.places || [],
          communities: data.communities || [],
          events: data.events || [],
          promos: data.promos || [],
          interests: data.interests || [],
        };
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
  // services/ExploreDataService.ts
  static transformToMarkers(data: ValuesData): UnifiedMarker[] {
    const markers: UnifiedMarker[] = [];

    console.log('🔍 Starting transformation with data:', {
      usersCount: data.users?.length || 0,
      placesCount: data.places?.length || 0,
      communitiesCount: data.communities?.length || 0,
      eventsCount: data.events?.length || 0,
      promosCount: data.promos?.length || 0,
    });

    // Transform Users
    if (data.users && Array.isArray(data.users)) {
      console.log('👥 Processing users...');
      data.users.forEach((user, index) => {
        console.log(`User ${index}:`, {
          id: user.id,
          name: user.name,
          hasCoordinates: !!user.coordinates,
          coordinates: user.coordinates,
        });

        if (user.coordinates) {
          const marker = {
            id: `user-${user.id}`,
            type: 'user' as MarkerType,
            title: user.name || user.username || 'Anonymous',
            description: user.bio || user.vibes?.join(', ') || 'No bio',
            latitude: user.coordinates.latitude,
            longitude: user.coordinates.longitude,
            image: user.photoProfile,
            category: user.joinReasons?.[0] || 'User',
            initialData: user,
          };
          console.log('✅ Created user marker:', marker);
          markers.push(marker);
        } else {
          console.log('⚠️ User has no coordinates, skipping');
        }
      });
    }

    // Transform Places
    if (data.places && Array.isArray(data.places)) {
      console.log('📍 Processing places...');
      data.places.forEach((place, index) => {
        console.log(`Place ${index}:`, {
          id: place.id,
          name: place.name,
          latitude: place.latitude,
          longitude: place.longitude,
          hasPromos: place.promos?.length > 0,
        });

        const hasPromo = place.promos && place.promos.length > 0;
        const marker = {
          id: `place-${place.id}`,
          type: (hasPromo ? 'promo' : 'place') as MarkerType,
          title: place.name,
          description: place.description || `${place.type} in ${place.district || 'Unknown'}`,
          latitude: place.latitude,
          longitude: place.longitude,
          category: place.type,
          image: place.image,
          initialData: place,
        };
        console.log('✅ Created place marker:', marker);
        markers.push(marker);
      });
    }

    // Transform Communities
    if (data.communities && Array.isArray(data.communities)) {
      console.log('🏘️ Processing communities...');
      data.communities.forEach((community, index) => {
        console.log(`Community ${index}:`, {
          id: community.id,
          name: community.name,
          usersCount: community.users?.length || 0,
        });

        // Find a user in this community who has coordinates
        const communityUser = data.users?.find((u) => {
          const isInCommunity = u.communities?.some((c) => c.communityId === community.id);
          const hasCoordinates = !!u.coordinates;
          console.log(`Checking user ${u.id}:`, { isInCommunity, hasCoordinates });
          return isInCommunity && hasCoordinates;
        });

        console.log('Found community user:', communityUser?.id);

        if (communityUser?.coordinates) {
          const marker = {
            id: `community-${community.id}`,
            type: 'community' as MarkerType,
            title: community.name,
            description: community.description || 'No description',
            latitude: communityUser.coordinates.latitude,
            longitude: communityUser.coordinates.longitude,
            memberCount: community.users?.length || 0,
            category: 'Community',
            image: community.image,
            initialData: community,
          };
          console.log('✅ Created community marker:', marker);
          markers.push(marker);
        } else {
          console.log('⚠️ No user with coordinates found for community');
        }
      });
    }

    // Transform Events
    if (data.events && Array.isArray(data.events)) {
      console.log('🎉 Processing events...');
      data.events.forEach((event: any, index) => {
        console.log(`Event ${index}:`, {
          id: event.id,
          name: event.name,
          hasPlace: !!event.place,
          placeCoordinates: event.place ? {
            lat: event.place.latitude,
            lng: event.place.longitude
          } : null,
        });

        // Events use their place's coordinates
        if (event.place?.latitude && event.place?.longitude) {
          const marker = {
            id: `event-${event.id}`,
            type: 'event' as MarkerType,
            title: event.name || 'Unnamed Event',
            description: event.description || 'Event',
            latitude: event.place.latitude,
            longitude: event.place.longitude,
            date: event.date || event.endDate,
            category: 'Event',
            image: event.image || event.banner,
            initialData: event,
          };
          console.log('✅ Created event marker:', marker);
          markers.push(marker);
        } else {
          console.log('⚠️ Event has no place coordinates, skipping');
        }
      });
    }

    console.log('🎯 Final transformation result:', {
      total: markers.length,
      breakdown: {
        users: markers.filter(m => m.type === 'user').length,
        places: markers.filter(m => m.type === 'place').length,
        promos: markers.filter(m => m.type === 'promo').length,
        communities: markers.filter(m => m.type === 'community').length,
        events: markers.filter(m => m.type === 'event').length,
      },
      markers: markers.map(m => ({
        id: m.id,
        type: m.type,
        title: m.title,
        lat: m.latitude,
        lng: m.longitude,
      })),
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
  UserHangoutPlace as HangoutPlace,
  UserCoordinates as Coordinates,
};