import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChatMessage, ChatRoom, ChatService, DeleteMessageParams, EditMessageParams, ReadMessageParams, SendEmojiParams, SendMessageParams } from '../services/chatService';

// ============================================
// Query Keys
// ============================================

export const chatKeys = {
  all: ['chat'] as const,
  chats: (userId: string) => [...chatKeys.all, 'chats', userId] as const,
  messages: (chatId: string) => [...chatKeys.all, 'messages', chatId] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch all chats for current user
 */
export const useChatRooms = (userId: string) => {
  return useQuery({
    queryKey: chatKeys.chats(userId),
    queryFn: () => ChatService.fetchChats(userId),
    enabled: !!userId,
    staleTime: 1000 * 30, // 30 seconds
  });
};

/**
 * Fetch messages for a specific chat
 */
export const useChatMessages = (chatId: string | null, userId: string) => {
  return useQuery({
    queryKey: chatKeys.messages(chatId || ''),
    queryFn: () => ChatService.fetchMessages(chatId!, userId),
    enabled: !!chatId && !!userId,
    staleTime: 0, // Always fresh
  });
};

// ============================================
// Mutations
// ============================================

/**
 * Get or create direct room
 */
export const useGetOrCreateDirectRoom = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (otherUserId: string) =>
      ChatService.getOrCreateDirectRoom(otherUserId),
    onSuccess: (response) => {
      if (response.status === 'success') {
        // Invalidate chats list
        queryClient.invalidateQueries({
          queryKey: chatKeys.chats(userId)
        });
      }
    },
  });
};

/**
 * Send message with optimistic update
 */
export const useSendMessage = (userId: string, userName: string, userPhoto?: string) => {
  console.log(userId, userName, userPhoto);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SendMessageParams) => ChatService.sendMessage(params),

    // Optimistic update
    onMutate: async (variables) => {
      const { chatId, text, senderId } = variables;

      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData<ChatMessage[]>(
        chatKeys.messages(chatId)
      );

      // Optimistically update
      const optimisticMessage: ChatMessage = {
        _id: `temp-${Date.now()}`,
        chatId,
        senderId,
        text,
        timestamp: new Date().toISOString(),
        sender: {
          id: senderId,
          name: userName,
          photoProfile: userPhoto,
        },
      };

      queryClient.setQueryData<ChatMessage[]>(
        chatKeys.messages(chatId),
        (old) => [...(old || []), optimisticMessage]
      );

      return { previousMessages, optimisticMessage };
    },

    onSuccess: (response, variables) => {
      const { chatId } = variables;

      // Replace optimistic message with real one
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(chatId)
      });

      // Update chats list (for lastMessage)
      queryClient.invalidateQueries({
        queryKey: chatKeys.chats(userId)
      });
    },

    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
  });
};

/**
 * Delete message
 */
export const useDeleteMessage = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteMessageParams) =>
      ChatService.deleteMessage(params),

    onMutate: async (variables) => {
      const { chatId, messageId } = variables;

      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      });

      const previousMessages = queryClient.getQueryData<ChatMessage[]>(
        chatKeys.messages(chatId)
      );

      // Mark as deleted optimistically
      queryClient.setQueryData<ChatMessage[]>(
        chatKeys.messages(chatId),
        (old) =>
          old?.map((msg) =>
            msg._id === messageId
              ? { ...msg, isDeleted: true, text: undefined, content: undefined }
              : msg
          ) || []
      );

      return { previousMessages };
    },

    onSuccess: (_, variables) => {
      const { chatId } = variables;

      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(chatId)
      });
      queryClient.invalidateQueries({
        queryKey: chatKeys.chats(userId)
      });
    },

    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
  });
};

/**
 * Delete/leave chat
 */
export const useDeleteChat = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, userName }: { chatId: string; userName: string }) =>
      ChatService.deleteChat(chatId, userName),

    onMutate: async (variables) => {
      const { chatId } = variables;

      await queryClient.cancelQueries({
        queryKey: chatKeys.chats(userId)
      });

      const previousChats = queryClient.getQueryData<ChatRoom[]>(
        chatKeys.chats(userId)
      );

      // Optimistically remove chat
      queryClient.setQueryData<ChatRoom[]>(
        chatKeys.chats(userId),
        (old) => old?.filter((chat) => chat.chatId !== chatId) || []
      );

      return { previousChats };
    },

    onSuccess: (_, variables) => {
      const { chatId } = variables;

      // Remove messages cache
      queryClient.removeQueries({
        queryKey: chatKeys.messages(chatId)
      });

      // Refresh chats list
      queryClient.invalidateQueries({
        queryKey: chatKeys.chats(userId)
      });
    },

    onError: (error, variables, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(
          chatKeys.chats(userId),
          context.previousChats
        );
      }
    },
  });
};

/**
 * Edit message
 */
export const useEditMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: EditMessageParams) =>
      ChatService.editMessage(params),

    onMutate: async (variables) => {
      const { chatId, messageId, text } = variables;

      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      });

      const previousMessages = queryClient.getQueryData<ChatMessage[]>(
        chatKeys.messages(chatId)
      );

      // Optimistically update
      queryClient.setQueryData<ChatMessage[]>(
        chatKeys.messages(chatId),
        (old) =>
          old?.map((msg) =>
            msg._id === messageId
              ? { ...msg, text, content: text, isEdited: true }
              : msg
          ) || []
      );

      return { previousMessages };
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(variables.chatId)
      });
    },

    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
  });
};

/**
 * Mark message as read
 */
export const useReadMessage = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ReadMessageParams) =>
      ChatService.readMessage(params),

    onMutate: async (variables) => {
      const { chatId, messageId } = variables;

      const previousMessages = queryClient.getQueryData<ChatMessage[]>(
        chatKeys.messages(chatId)
      );

      // Optimistically mark as read
      queryClient.setQueryData<ChatMessage[]>(
        chatKeys.messages(chatId),
        (old) =>
          old?.map((msg) =>
            msg._id === messageId
              ? { ...msg, readAt: new Date().toISOString() }
              : msg
          ) || []
      );

      return { previousMessages };
    },

    onSuccess: (_,) => {
      // Update chats list to remove unread indicator
      queryClient.invalidateQueries({
        queryKey: chatKeys.chats(userId)
      });
    },

    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
  });
};

/**
 * Send emoji reaction
 */
export const useSendEmoji = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SendEmojiParams) =>
      ChatService.sendEmoji(params),

    onMutate: async (variables) => {
      const { chatId, messageId, emoji, field } = variables;

      await queryClient.cancelQueries({
        queryKey: chatKeys.messages(chatId)
      });

      const previousMessages = queryClient.getQueryData<ChatMessage[]>(
        chatKeys.messages(chatId)
      );

      // Optimistically add/toggle emoji
      queryClient.setQueryData<ChatMessage[]>(
        chatKeys.messages(chatId),
        (old) =>
          old?.map((msg) => {
            if (msg._id === messageId) {
              // Check if emoji already exists, if yes remove it (toggle)
              const currentEmoji = msg[field];
              return {
                ...msg,
                [field]: currentEmoji === emoji ? undefined : emoji,
              };
            }
            return msg;
          }) || []
      );

      return { previousMessages };
    },

    onSuccess: (response, variables) => {
      const { chatId } = variables;

      // Invalidate to get the actual state from server
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages(chatId)
      });
    },

    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          chatKeys.messages(variables.chatId),
          context.previousMessages
        );
      }
    },
  });
};

/**
 * Upload attachment
 */
export const useUploadAttachment = () => {
  return useMutation({
    mutationFn: (file: FormData) => ChatService.uploadAttachment(file),
  });
};