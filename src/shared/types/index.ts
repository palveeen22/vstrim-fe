export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  username?: string;
  bio?: string;
  dateOfBirth?: Date;
  photoProfile?: string;
  photoVerification?: string;
  tokens?: number;
  isVerified: boolean;
  verificationCompleted: boolean;
  coordinates?: UserCoordinates;
  hangoutPlaces: UserHangoutPlace[];
  vibes: VibeType[];
  joinReasons: JoinReason[];
  interests: InterestCategory[];
  dailyQuizzes: DailyQuiz[];
  communities: UserCommunity[];
  events: UserEvent[];
  matchesAsUser1: UserMatch[];
  matchesAsUser2: UserMatch[];
  matchesGiven: Match[];
  matchesReceived: Match[];
  placeRecommendations: PlaceRecommendation[];
  eventRecommendations: EventRecommendation[];
  createdAt: Date;
}

export interface UserCoordinates {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  updatedAt: Date;
  createdAt: Date;
  user: User;
}

export interface UserHangoutPlace {
  id: string;
  userId: string;
  placeName: string;
  placeType: HangoutPlaceType;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  icon?: string;
  type: PlaceType;
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  description?: string;
  image?: string;
  googlePlaceId?: string;
  vibes: string[];
  rating?: number;
  promos: Promo[];
  createdAt: Date;
  events: Event[];
  placeRecommendations: PlaceRecommendation[];
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  date: Date;
  icon?: string;
  image?: string;
  endDate?: Date;
  placeId: string;
  communityId?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
  banner?: string;
  vibes: string[];
  capacity?: number;
  price?: number;
  isActive: boolean;
  createdAt: Date;
  place: Place;
  community?: Community;
  users: UserEvent[];
  eventRecommendations: EventRecommendation[];
}

export interface Community {
  id: string;
  name: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  district?: string;
  icon?: string;
  image?: string;
  createdAt: Date;
  communityType?: string;
  users: UserCommunity[];
  events: Event[];
}

export interface Promo {
  id: string;
  placeId: string;
  title: string;
  description?: string;
  discountCode: string;
  validUntil: Date;
  createdAt: Date;
  place: Place;
  image?: string;
}

export interface Interest {
  id: string;
  name: string;
  slug: string;
  category: InterestCategory;
  icon?: string;
  order?: number;
  createdAt: Date;
}

export interface UserCommunity {
  userId: string;
  communityId: string;
  joinedAt: Date;
  user: User;
  community: Community;
}

export interface UserEvent {
  userId: string;
  eventId: string;
  status: EventAttendanceStatus;
  createdAt: Date;
  user: User;
  event: Event;
}

export interface UserMatch {
  user1Id: string;
  user2Id: string;
  matchScore: number;
  createdAt: Date;
  user1: User;
  user2: User;
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  score: number;
  quizSessionId: string;
  distance?: number;
  breakdown: any; // Json
  status: MatchStatus;
  createdAt: Date;
  expiresAt: Date;
  respondedAt?: Date;
  user: User;
  matchedUser: User;
}

export interface PlaceRecommendation {
  id: string;
  userId: string;
  placeId: string;
  score: number;
  quizSessionId: string;
  distance: number;
  breakdown: any;
  reason?: string;
  isViewed: boolean;
  isVisited: boolean;
  createdAt: Date;
  expiresAt: Date;
  user: User;
  place: Place;
}

export interface EventRecommendation {
  id: string;
  userId: string;
  eventId: string;
  score: number;
  quizSessionId: string;
  distance: number;
  breakdown: any;
  reason?: string;
  isViewed: boolean;
  isInterested: boolean;
  createdAt: Date;
  expiresAt: Date;
  user: User;
  event: Event;
}

export interface DailyQuiz {
  id: string;
  userId: string;
  createdAt: Date;
  isCompleted: boolean;
  answers: QuizAnswer[];
  user: User;
}

export interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  createdAt: Date;
  options: QuizOption[];
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  userId: string;
  dailyQuizId: string;
  questionId: string;
  selectedIds: string[];
  answeredAt: Date;
  dailyQuiz: DailyQuiz;
  question: QuizQuestion;
}

export interface QuizOption {
  id: string;
  questionId: string;
  label: string;
  icon: string;
  question: QuizQuestion;
}

// ENUMS
export type QuestionType = 'single' | 'multiple';
export type QuizCategory = 'personality' | 'interest' | 'lifestyle' | 'values' | 'activity' | 'mood' | 'social_preference' | 'general';
export type MoodSource = 'manual' | 'quiz' | 'ai_detected';
export type MatchStatus = 'pending' | 'accepted' | 'declined' | 'expired' | 'mutual';
export type PlaceType = 'bar' | 'cafe' | 'restaurant' | 'gym' | 'club' | 'park' | 'coworking' | 'museum' | 'cinema' | 'beach' | 'mall' | 'library' | 'bookstore' | 'art_gallery' | 'studio';
export type HangoutPlaceType = 'cafe' | 'restaurant' | 'bar' | 'club' | 'gym' | 'park' | 'mall' | 'coworking' | 'library' | 'bookstore' | 'beach' | 'museum' | 'art_gallery' | 'cinema' | 'sports_venue' | 'community_center' | 'other';
export type EventType = 'party' | 'workshop' | 'meetup' | 'concert' | 'sport' | 'exhibition' | 'conference' | 'networking' | 'casual_hangout' | 'fitness_class' | 'food_tasting' | 'game_night';
export type VibeType = 'energetic' | 'chill' | 'relaxed' | 'intense' | 'social' | 'intimate' | 'crowded' | 'quiet' | 'active' | 'passive' | 'creative' | 'competitive' | 'casual' | 'formal' | 'romantic' | 'adventurous' | 'intellectual' | 'fun' | 'trendy' | 'cozy' | 'outdoor' | 'indoor' | 'calm' | 'introspective';
export type InterestCategory = 'sports' | 'arts' | 'music' | 'food' | 'tech' | 'gaming' | 'fitness' | 'reading' | 'travel' | 'wellness' | 'social' | 'learning' | 'entertainment' | 'general';
export type EventAttendanceStatus = 'interested' | 'going' | 'maybe' | 'went';
export type JoinReason = 'make_friends' | 'find_activity_partners' | 'explore_city' | 'try_new_experiences' | 'professional_networking' | 'dating_relationships' | 'new_to_area' | 'expand_social_circle' | 'find_hobby_community' | 'attend_events';
export type VisitFrequency = 'daily' | 'weekly' | 'monthly' | 'occasionally' | 'rarely';
