// Root response
export interface MatchResponse {
  status: "success" | "error" | string;
  data?: MatchData;
  message?: string;
}

// Main data
export interface MatchData {
  stats: Stats;
  matches: MatchItem[];
  grouped: GroupedResults;
}

export interface Stats {
  total: number;
  byType: {
    users: number;
    communities: number;
    events: number;
    places: number;
    // jika ada tipe lain, tambahkan optional index signature:
    [key: string]: number;
  };
  avgMatchPercentage: number;
}

// Each match item
export interface MatchItem {
  entity: Entity;
  matchPercentage: number; // 0 - 100
  breakdown: Breakdown;
  relevanceReason?: string;
}

export interface Breakdown {
  interests: number;
  vibes: number;
  joinReasons: number;
  dailyQuiz: number;
  // jika ada metrik tambahan:
  [key: string]: number;
}

// Grouped results (same shape as matches but grouped)
export interface GroupedResults {
  users: MatchItem[];
  communities: MatchItem[];
  events: MatchItem[];
  places: MatchItem[];
  // jika ada grup tambahan:
  [key: string]: MatchItem[];
}

/**
 * Entity union: bisa USER, EVENT, COMMUNITY, PLACE, dll.
 * Setiap tipe mempunyai fields spesifik (optional where appropriate).
 */
export type Entity = UserEntity | EventEntity | CommunityEntity | PlaceEntity | GenericEntity;

export interface EntityBase {
  id: string;
  type: EntityType;
  name?: string;
  image?: string;
  description?: string;
}

export type EntityType = "USER" | "EVENT" | "COMMUNITY" | "PLACE" | string;

// USER
export interface UserEntity extends EntityBase {
  type: "USER";
  username?: string;
  photoProfile?: string;
  bio?: string;
  // fields lain yg mungkin ada pada user:
  [key: string]: unknown;
}

// EVENT
export interface EventEntity extends EntityBase {
  type: "EVENT";
  date?: string; // ISO date string
  icon?: string;
  location?: string;
  isActive?: boolean;
  attendeeCount?: number;
  // fields lain:
  [key: string]: unknown;
}

// COMMUNITY (contoh struktur, kosong jika tidak ada in sample)
export interface CommunityEntity extends EntityBase {
  type: "COMMUNITY";
  // tambahkan properti komunitas jika diperlukan
  [key: string]: unknown;
}

// PLACE (contoh)
export interface PlaceEntity extends EntityBase {
  type: "PLACE";
  address?: string;
  coords?: { lat: number; lng: number };
  [key: string]: unknown;
}

// Fallback generic entity
export interface GenericEntity extends EntityBase {
  type: string;
  [key: string]: unknown;
}
