// src/features/messages/model/messages.types.ts

export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
}

export interface Chat {
  id: string;
  user?: User;
  groupName?: string;
  lastMessage: string;
  timestamp: string;
  isGroup: boolean;
  unreadCount?: number;
  avatar: string;
}

export const MOCK_RECENT_USERS: User[] = [
  {
    id: '1',
    username: 'sabanok...',
    avatar: 'https://picsum.photos/200/200?random=1',
    isOnline: true,
  },
  {
    id: '2',
    username: 'blue_bouy',
    avatar: 'https://picsum.photos/200/200?random=2',
    isOnline: true,
  },
  {
    id: '3',
    username: 'waggles',
    avatar: 'https://picsum.photos/200/200?random=3',
    isOnline: true,
  },
  {
    id: '4',
    username: 'steve.loves',
    avatar: 'https://picsum.photos/200/200?random=4',
    isOnline: false,
  },
  {
    id: '5',
    username: 'steve.2',
    avatar: 'https://picsum.photos/200/200?random=5',
    isOnline: false,
  },
];

// src/features/messages/model/messages.types.ts

export type MessageType = 'text' | 'image' | 'voice';

export interface Message {
  id: string;
  type: MessageType;
  senderId: string;
  content?: string;
  imageUrl?: string;
  voiceDuration?: number; // in seconds
  voiceUrl?: string;
  timestamp: string;
  isRead?: boolean;
  isSent?: boolean;
}

export interface ChatDetail {
  id: string;
  participant: {
    id: string;
    name: string;
    avatar: string;
    isOnline?: boolean;
  };
  messages: Message[];
}