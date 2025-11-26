export const STORAGE_KEYS = {
  AUTH_TOKEN: '@vstrim_auth_token',
  REFRESH_TOKEN: '@vstrim_refresh_token',
  USER_DATA: '@vstrim_user_data',
} as const;

export const JOIN_REASONS = [
  {
    icon: '👥',
    title: 'Make Friends',
    description: 'Connect with new people and build friendships',
    value: 'MAKE_FRIENDS',
  },
  {
    icon: '🏃',
    title: 'Find Activity Partners',
    description: 'Meet people to do activities together',
    value: 'FIND_ACTIVITY_PARTNERS',
  },
  {
    icon: '🗺️',
    title: 'Explore City',
    description: 'Discover new places in my city',
    value: 'EXPLORE_CITY',
  },
  {
    icon: '✨',
    title: 'Try New Experiences',
    description: 'Step out of comfort zone and try new things',
    value: 'TRY_NEW_EXPERIENCES',
  },
  {
    icon: '💼',
    title: 'Professional Networking',
    description: 'Build professional connections',
    value: 'PROFESSIONAL_NETWORKING',
  },
  {
    icon: '💕',
    title: 'Dating & Relationships',
    description: 'Meet potential romantic partners',
    value: 'DATING_RELATIONSHIPS',
  },
  {
    icon: '🏠',
    title: 'New to Area',
    description: 'Just moved and want to meet locals',
    value: 'NEW_TO_AREA',
  },
  {
    icon: '🌟',
    title: 'Expand Social Circle',
    description: 'Grow my social network',
    value: 'EXPAND_SOCIAL_CIRCLE',
  },
  {
    icon: '🎯',
    title: 'Find Hobby Community',
    description: 'Connect with people who share my interests',
    value: 'FIND_HOBBY_COMMUNITY',
  },
  {
    icon: '🎉',
    title: 'Attend Events',
    description: 'Find and join local events',
    value: 'ATTEND_EVENTS',
  },
];

export const VIBES = [
  { emoji: '⚡', label: 'Energetic', value: 'energetic' },
  { emoji: '😎', label: 'Chill', value: 'chill' },
  { emoji: '😌', label: 'Relaxed', value: 'relaxed' },
  { emoji: '🔥', label: 'Intense', value: 'intense' },
  { emoji: '🎉', label: 'Social', value: 'social' },
  { emoji: '💕', label: 'Intimate', value: 'intimate' },
  { emoji: '👥', label: 'Crowded', value: 'crowded' },
  { emoji: '🤫', label: 'Quiet', value: 'quiet' },
  { emoji: '🏃', label: 'Active', value: 'active' },
  { emoji: '🛋️', label: 'Passive', value: 'passive' },
  { emoji: '🎨', label: 'Creative', value: 'creative' },
  { emoji: '🏆', label: 'Competitive', value: 'competitive' },
  { emoji: '👕', label: 'Casual', value: 'casual' },
  { emoji: '👔', label: 'Formal', value: 'formal' },
  { emoji: '💖', label: 'Romantic', value: 'romantic' },
  { emoji: '🚀', label: 'Adventurous', value: 'adventurous' },
  { emoji: '📚', label: 'Intellectual', value: 'intellectual' },
  { emoji: '🎊', label: 'Fun', value: 'fun' },
  { emoji: '✨', label: 'Trendy', value: 'trendy' },
  { emoji: '🏠', label: 'Cozy', value: 'cozy' },
  { emoji: '🌳', label: 'Outdoor', value: 'outdoor' },
  { emoji: '🏢', label: 'Indoor', value: 'indoor' },
  { emoji: '🧘', label: 'Calm', value: 'calm' },
  { emoji: '🤔', label: 'Introspective', value: 'introspective' },
];

export const MOCK_INTERESTS = [
  { id: '1', name: 'Sports', category: 'sports', icon: '⚽' },
  { id: '2', name: 'Music', category: 'music', icon: '🎵' },
  { id: '3', name: 'Art', category: 'arts', icon: '🎨' },
  { id: '4', name: 'Technology', category: 'tech', icon: '💻' },
  { id: '5', name: 'Cooking', category: 'food', icon: '👨‍🍳' },
  { id: '6', name: 'Travel', category: 'travel', icon: '✈️' },
  { id: '7', name: 'Fitness', category: 'fitness', icon: '💪' },
  { id: '8', name: 'Reading', category: 'reading', icon: '📚' },
  { id: '9', name: 'Gaming', category: 'gaming', icon: '🎮' },
  { id: '10', name: 'Photography', category: 'arts', icon: '📷' },
  { id: '11', name: 'Wellness', category: 'wellness', icon: '🧘‍♂️' },
  { id: '12', name: 'Socializing', category: 'social', icon: '🗣️' },
  { id: '13', name: 'Learning', category: 'learning', icon: '📖' },
  { id: '14', name: 'Entertainment', category: 'entertainment', icon: '🎬' },
  { id: '15', name: 'General', category: 'general', icon: '✨' }
];