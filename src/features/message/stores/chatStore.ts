// src/stores/chatStore.ts
import { create } from 'zustand';
import { Socket } from 'socket.io-client';

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'file';
  createdAt: Date;
  sender: {
    id: string;
    name: string;
    photoProfile?: string;
  };
}

export interface IChatRoom {
  id: string;
  type: 'DIRECT' | 'GROUP';
  name?: string;
  photoProfile?: string;
  members: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
      photoProfile?: string;
    };
  }>;
  lastMessage?: any;
  unreadCount: number;
}

interface TypingUser {
  userId: string;
  roomId: string;
}

interface ChatStore {
  rooms: Record<string, IChatRoom>;
  messages: Record<string, ChatMessage[]>; // roomId -> messages
  typingUsers: TypingUser[];
  currentRoomId: string | null;
  socket: Socket | null;

  // Actions
  setSocket: (socket: Socket) => void;
  setCurrentRoom: (roomId: string | null) => void;
  addRoom: (room: IChatRoom) => void;
  updateRoom: (roomId: string, update: Partial<IChatRoom>) => void;
  addMessage: (message: ChatMessage) => void;
  setMessages: (roomId: string, messages: ChatMessage[]) => void;
  addTypingUser: (user: TypingUser) => void;
  removeTypingUser: (userId: string, roomId: string) => void;
  markAsRead: (roomId: string, messageId: string) => void;
  incrementUnreadCount: (roomId: string) => void;
  resetUnreadCount: (roomId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  rooms: {},
  messages: {},
  typingUsers: [],
  currentRoomId: null,
  socket: null,

  setSocket: (socket) => set({ socket }),

  setCurrentRoom: (roomId) => set({ currentRoomId: roomId }),

  addRoom: (room) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [room.id]: { ...room, unreadCount: 0 },
      },
    })),

  updateRoom: (roomId, update) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: { ...state.rooms[roomId], ...update },
      },
    })),

  addMessage: (message) =>
    set((state) => {
      const roomMessages = state.messages[message.roomId] || [];
      return {
        messages: {
          ...state.messages,
          [message.roomId]: [...roomMessages, message],
        },
        rooms: {
          ...state.rooms,
          [message.roomId]: {
            ...state.rooms[message.roomId],
            lastMessage: message,
          },
        },
      };
    }),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: messages,
      },
    })),

  addTypingUser: (user) =>
    set((state) => ({
      typingUsers: [...state.typingUsers, user],
    })),

  removeTypingUser: (userId, roomId) =>
    set((state) => ({
      typingUsers: state.typingUsers.filter(
        (u) => !(u.userId === userId && u.roomId === roomId)
      ),
    })),

  markAsRead: (roomId, messageId) => {
    get().socket?.emit('mark_as_read', { roomId, messageId });
  },

  incrementUnreadCount: (roomId) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...state.rooms[roomId],
          unreadCount: (state.rooms[roomId]?.unreadCount || 0) + 1,
        },
      },
    })),

  resetUnreadCount: (roomId) =>
    set((state) => ({
      rooms: {
        ...state.rooms,
        [roomId]: {
          ...state.rooms[roomId],
          unreadCount: 0,
        },
      },
    })),
}));