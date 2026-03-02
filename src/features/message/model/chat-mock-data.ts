// src/features/messages/model/chat-mock-data.ts

import { ChatDetail } from './messages.types';

export const MOCK_CHAT_DETAIL: ChatDetail = {
  id: '1',
  participant: {
    id: 'sheena-123',
    name: 'Sheena Ringo',
    avatar: 'https://picsum.photos/200/200?random=10',
    isOnline: true,
  },
  messages: [
    {
      id: 'm1',
      type: 'image',
      senderId: 'sheena-123',
      imageUrl: 'https://picsum.photos/400/300?random=20',
      content: 'Look at how chocho sleep in my arms!',
      timestamp: '16:46',
      isRead: true,
    },
    {
      id: 'm2',
      type: 'text',
      senderId: 'me',
      content: 'Can I come over?',
      timestamp: '16:46',
      isRead: true,
      isSent: true,
    },
    {
      id: 'm3',
      type: 'text',
      senderId: 'sheena-123',
      content: "Of course, let me know if you're on your way",
      timestamp: '16:46',
      isRead: true,
    },
    {
      id: 'm4',
      type: 'text',
      senderId: 'me',
      content: "K, I'm on my way",
      timestamp: '16:50',
      isRead: true,
      isSent: true,
    },
    {
      id: 'm5',
      type: 'voice',
      senderId: 'me',
      voiceDuration: 20,
      voiceUrl: 'mock-voice-url',
      timestamp: '09:13',
      isRead: true,
      isSent: true,
    },
    {
      id: 'm6',
      type: 'text',
      senderId: 'sheena-123',
      content: 'Good morning, did you sleep well?',
      timestamp: '09:45',
      isRead: false,
    },
  ],
};