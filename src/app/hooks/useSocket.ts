import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '../../features/message/stores/chatStore';
import { useAuth } from '../providers/AuthProvider';
import { ChatMessage } from '../../features/message/screens/InboxScreen';

export const useChatSocket = (roomId: string) => {
  const queryClient = useQueryClient();
  const { socket } = useChatStore();
  const { user } = useAuth();

  useEffect(() => {
    if (!socket || !roomId) {
      console.log('⚠️ Socket or roomId not available');
      return;
    }

    console.log(`👂 Setting up socket listeners for room: ${roomId}`);

    // ✅ Listen for new messages
    const handleNewMessage = (message: ChatMessage) => {
      console.log('📩 New message received:', message.id);

      // Skip if message is from current user (already added optimistically)
      if (message.senderId === user?.id) {
        console.log('⏭️ Skipping own message');
        return;
      }

      // Add message to cache
      queryClient.setQueryData(['chatMessages', roomId], (old: any) => {
        if (!old) return [message];

        // Check for duplicates
        const exists = old.some((m: any) => m.id === message.id);
        if (exists) {
          console.log('⚠️ Duplicate message, skipping');
          return old;
        }

        console.log('✅ Adding new message to cache');
        return [...old, message];
      });

      // Invalidate chat list to update last message
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
    };

    // ✅ Listen for typing indicators
    const handleTypingStart = ({ userId, name }: any) => {
      if (userId === user?.id) return; // Ignore own typing
      console.log(`⌨️ ${name} is typing...`);
      // TODO: Update UI to show typing indicator
    };

    const handleTypingStop = ({ userId }: any) => {
      if (userId === user?.id) return;
      console.log(`⌨️ User ${userId} stopped typing`);
      // TODO: Hide typing indicator
    };

    // ✅ Listen for message deletion
    const handleMessageDeleted = ({ messageId, roomId: deletedRoomId }: any) => {
      if (deletedRoomId !== roomId) return;
      
      console.log(`🗑️ Message ${messageId} deleted`);
      
      queryClient.setQueryData(['chatMessages', roomId], (old: any) => {
        if (!old) return old;
        return old.filter((m: any) => m.id !== messageId);
      });
    };

    // ✅ Listen for message edits
    const handleMessageEdited = ({ messageId, content, roomId: editedRoomId }: any) => {
      if (editedRoomId !== roomId) return;
      
      console.log(`✏️ Message ${messageId} edited`);
      
      queryClient.setQueryData(['chatMessages', roomId], (old: any) => {
        if (!old) return old;
        return old.map((m: any) => 
          m.id === messageId 
            ? { ...m, content, updatedAt: new Date().toISOString() }
            : m
        );
      });
    };

    // // ✅ Listen for reactions
    // const handleMessageReaction = ({ messageId, userId: reactUserId, emoji, action }: any) => {
    //   console.log(`${action === 'added' ? '➕' : '➖'} Reaction ${emoji} on message ${messageId}`);
      
    //   // Refresh messages to get updated reactions
    //   queryClient.invalidateQueries({ queryKey: ['chatMessages', roomId] });
    // };

    // // ✅ Listen for read receipts
    // const handleMessageRead = ({ messageId, userId: readUserId, readAt }: any) => {
    //   if (readUserId === user?.id) return; // Ignore own read receipts
      
    //   console.log(`✅ Message ${messageId} read by ${readUserId}`);
    //   // TODO: Update UI to show read status
    // };

    // Register all listeners
    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTypingStart);
    socket.on('user_stopped_typing', handleTypingStop);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('message_edited', handleMessageEdited);
    // socket.on('message_reaction', handleMessageReaction);
    // socket.on('message_read', handleMessageRead);

    // Cleanup
    return () => {
      console.log(`🔇 Cleaning up socket listeners for room: ${roomId}`);
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTypingStart);
      socket.off('user_stopped_typing', handleTypingStop);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('message_edited', handleMessageEdited);
      // socket.off('message_reaction', handleMessageReaction);
      // socket.off('message_read', handleMessageRead);
    };
  }, [socket, roomId, queryClient, user?.id]);
};