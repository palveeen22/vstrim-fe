// src/hooks/useSocketListeners.ts
import { useEffect } from 'react';
import { useChatStore } from '../stores/chatStore';

export const useSocketListeners = () => {
  const {
    socket,
    addMessage,
    addRoom,
    addTypingUser,
    removeTypingUser,
    incrementUnreadCount,
    currentRoomId,
  } = useChatStore();

  useEffect(() => {
    if (!socket) return;

    // New message received
    socket.on('new_message', (message) => {
      addMessage(message);
      
      // Increment unread count if not in current room
      if (message.roomId !== currentRoomId) {
        incrementUnreadCount(message.roomId);
      }
    });

    // Room created
    socket.on('room_created', (room) => {
      addRoom(room);
    });

    // Typing indicators
    socket.on('user_typing', ({ userId, roomId }) => {
      addTypingUser({ userId, roomId });
    });

    socket.on('user_stopped_typing', ({ userId, roomId }) => {
      removeTypingUser(userId, roomId);
    });

    return () => {
      socket.off('new_message');
      socket.off('room_created');
      socket.off('user_typing');
      socket.off('user_stopped_typing');
    };
  }, [socket, currentRoomId, addMessage, incrementUnreadCount, addRoom, addTypingUser, removeTypingUser]);
};