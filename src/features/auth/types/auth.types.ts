export interface CompleteUserProfile {
  // Basic info
  user: {
    id: string;
    name: string;
    username: string | null;
    email: string;
    bio: string | null;
    dateOfBirth: Date | null;
    image: string | null;
    vibes: any[];
    joinReasons: any[];
    isVerified: boolean;
    onboardingCompleted: boolean;
  };

  // Location
  location: {
    city: string | null;
    district: string | null;
    province: string | null;
    coordinates: {
      latitude: number;
      longitude: number;
    } | null;
  };

  // Statistics
  stats: {
    hangoutPlaces: number;
    communities: number;
    upcomingEvents: number;
    interests: number;
    totalMatches: number;
    pendingMatches: number;
  };

  // Collections
  hangoutPlaces: any[];
  communities: any[];
  upcomingEvents: any[];
  interests: any[];
  matches: any[];
  recommendations: {
    places: any[];
    events: any[];
  };
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface DailyQuiz {
  createdAt: Date;
  id: string;
  isCompleted: boolean;
  userId: string;
}

interface UserComunity {
  createdAt: Date;
  description: string;
  id: string;
  name: string;
}

export interface UserProfile {
  id: string;
  name: string;
  tokens?: number;
  email: string;
  username: string;
  bio?: string | null;
  dateOfBirth?: Date | null;
  image?: string | null;
  joinReasons?: string[];
  isVerified?: boolean;
  onboardingCompleted?: boolean;
  createdAt?: Date;
  dailyQuizzes: DailyQuiz[];
  communities: {
    comunity: UserComunity[]
  }
}