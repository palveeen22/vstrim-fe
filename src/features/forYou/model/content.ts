// 🎯 Static Data - Beli Style
const EXPLORE_DATA = {
  quickCategories: [
    {
      id: '1',
      title: 'just opened',
      subtitle: 'be the first to go!',
      color: '#10B981',
      icon: '🆕',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    },
    {
      id: '2',
      title: 'trending',
      subtitle: "today's poppin' places",
      color: '#F59E0B',
      icon: '🔥',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    },
    {
      id: '3',
      title: 'lowkey',
      subtitle: '<25 google reviews',
      color: '#8B5CF6',
      icon: '🤫',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
    },
    {
      id: '4',
      title: 'popular',
      subtitle: 'all time favorites',
      color: '#EC4899',
      icon: '⭐',
      image: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=400',
    },
  ],

  // 👋 NEW: Matched Users Section
  matchedUsers: [
    {
      id: '1',
      name: 'Sarah',
      age: 24,
      image: 'https://i.pravatar.cc/300?img=1',
      distance: '1.2 km',
      matchScore: 94,
      sharedInterests: ['Coffee', 'Art', 'Photography'],
      vibes: ['✨ Creative', '☕ Chill'],
      bio: 'Coffee addict, weekend artist',
    },
    {
      id: '2',
      name: 'Alex',
      age: 26,
      image: 'https://i.pravatar.cc/300?img=12',
      distance: '2.5 km',
      matchScore: 89,
      sharedInterests: ['Fitness', 'Food', 'Music'],
      vibes: ['🔥 Energetic', '🎉 Social'],
      bio: 'Gym rat, food explorer',
    },
    {
      id: '3',
      name: 'Maya',
      age: 23,
      image: 'https://i.pravatar.cc/300?img=5',
      distance: '0.8 km',
      matchScore: 92,
      sharedInterests: ['Reading', 'Cafes', 'Philosophy'],
      vibes: ['📚 Intellectual', '🧘 Relaxed'],
      bio: 'Bookworm & cafe hopper',
    },
    {
      id: '4',
      name: 'Jake',
      age: 25,
      image: 'https://i.pravatar.cc/300?img=33',
      distance: '1.8 km',
      matchScore: 87,
      sharedInterests: ['Music', 'Night life', 'Art'],
      vibes: ['🎵 Music lover', '🌙 Night owl'],
      bio: 'Indie music enthusiast',
    },
  ],

  pickedForYou: [
    {
      id: '1',
      name: 'The Four Horsemen',
      location: 'Brooklyn',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      tag: '🍷 vibey wine & plates',
      vibeMatch: 'Moonflower',
      savedBy: 'shreya',
      savedCount: 116,
      avatars: [
        'https://i.pravatar.cc/40?img=1',
        'https://i.pravatar.cc/40?img=5',
      ],
    },
    {
      id: '2',
      name: 'Kopitiam Jakarta',
      location: 'Senopati',
      priceRange: '$',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
      tag: '☕ cozy coffee spot',
      vibeMatch: 'Chill vibes',
      savedBy: 'alex',
      savedCount: 84,
      avatars: [
        'https://i.pravatar.cc/40?img=12',
        'https://i.pravatar.cc/40?img=8',
      ],
    },
    {
      id: '3',
      name: 'Vinyl Lounge',
      location: 'Kemang',
      priceRange: '$$$',
      image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400',
      tag: '🎵 live music & drinks',
      vibeMatch: 'Night owl',
      savedBy: 'maya',
      savedCount: 203,
      avatars: [
        'https://i.pravatar.cc/40?img=20',
        'https://i.pravatar.cc/40?img=15',
      ],
    },
    {
      id: '4',
      name: 'Social House',
      location: 'SCBD',
      priceRange: '$$',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
      tag: '🍽️ trendy brunch spot',
      vibeMatch: 'Foodie',
      savedBy: 'kim',
      savedCount: 142,
      avatars: [
        'https://i.pravatar.cc/40?img=25',
        'https://i.pravatar.cc/40?img=30',
      ],
    },
  ],

  listsForYou: [
    {
      id: '1',
      title: 'wannabe wlv carrie brads...',
      author: '@Rachel',
      visitedDate: '1/14',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      places: 12,
    },
    {
      id: '2',
      title: 'slice to dip new york',
      author: '@insha',
      visitedDate: '2/16',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      places: 8,
    },
    {
      id: '3',
      title: 'indie cafes jakarta',
      author: '@Kim',
      visitedDate: '3/02',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
      places: 15,
    },
  ],
};

const EVENTS_DATA = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    title: 'Finding a Hiking Buddy',
    location: 'Mt. Tamalpais State Park',
    date: 'Sat, May 25',
    time: '7:00 PM',
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    title: 'Summer Music Festival',
    location: 'Golden Gate Park',
    date: 'Sun, Jun 15',
    time: '3:00 PM',
  },
];

export {
  EVENTS_DATA,
  EXPLORE_DATA
}