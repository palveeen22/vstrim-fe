import axios from 'axios';
import apiClient from '../../../app/config/apiClient';

// ============================================
// Types & Interfaces
// ============================================

export interface ChatRoom {
  chatId: string;
  type: 'DIRECT' | 'GROUP';
  name?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  members: ChatRoomMember[];
  lastMessage?: ChatMessage;
  id: string
}

export interface ChatRoomMember {
  id: string;
  roomId: string;
  userId: string;
  role: 'admin' | 'member';
  joinedAt: string;
  lastReadMessageId?: string;
  lastReadAt?: string;
  user: {
    id: string;
    name: string;
    username?: string;
    photoProfile?: string;
  };
}

export interface ChatMessage {
  _id: string;
  roomId?: string;
  chatId?: string;
  senderId: string;
  text?: string;
  content?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'audio' | 'file';
  createdAt?: string;
  timestamp?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  readAt?: string;
  sender: {
    id: string;
    name: string;
    photoProfile?: string;
  };
  reactions?: MessageReaction[];
  sender_emoji?: string;
  recipient_emoji?: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    photoProfile?: string;
  };
}

export interface SendMessageParams {
  chatId: string;
  senderId: string;
  text: string;
  otherUserId?: string;
  otherUserIsAdmin?: boolean;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'audio' | 'file';
}

export interface SendMessageResponse {
  success: boolean;
  messageId: string;
  users: string[];
  timestamp: string;
}

export interface DeleteMessageParams {
  messageId: string;
  chatId: string;
}

export interface DeleteMessageResponse {
  success: boolean;
  users: string[];
}

export interface EditMessageParams {
  messageId: string;
  chatId: string;
  text: string;
}

export interface ReadMessageParams {
  messageId: string;
  chatId: string;
}

export interface SendEmojiParams {
  messageId: string;
  chatId: string;
  emoji: string;
  field: 'sender_emoji' | 'recipient_emoji';
  userId: string;
}

export interface SendEmojiResponse {
  success: boolean;
  action: 'added' | 'removed';
  users: string[];
  message: {
    _id: string;
    senderId: string;
  };
}

// ============================================
// ChatService Class
// ============================================

export class ChatService {
  /**
   * Get or create direct chat room
   */
  static async getOrCreateDirectRoom(
    otherUserId: string
  ): Promise<{ status: string; data: ChatRoom }> {
    try {
      const response = await apiClient.post('/chat/direct', { otherUserId });

      console.log('💬 Direct room created/fetched:', response.data);
      return response.data;
    } catch (error) {
      return ChatService.handleError(error);
    }
  }

  /**
   * Fetch all chats for current user
   */
  static async fetchChats(userId: string): Promise<ChatRoom[]> {
    console.log(userId);
    try {
      const response = await apiClient.post(`/chat/fetchChats/${userId}`);

      console.log('💬 Chats fetched:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Fetch messages for a specific chat
   */
  static async fetchMessages(
    chatId: string,
    userId: string
  ): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.post('/chat/fetchMessages', {
        chatId,
        userId,
      });

      console.log('💬 Messages fetched:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Send message
   */
  static async sendMessage(
    params: SendMessageParams
  ): Promise<SendMessageResponse> {
    try {
      const response = await apiClient.post<SendMessageResponse>(
        '/chat/sendMessage',
        params
      );

      console.log('💬 Message sent:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Delete message (soft delete)
   */
  static async deleteMessage(
    params: DeleteMessageParams
  ): Promise<DeleteMessageResponse> {
    try {
      const response = await apiClient.delete<DeleteMessageResponse>(
        '/chat/deleteMessage',
        { data: params }
      );

      console.log('🗑️ Message deleted:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Delete/leave chat
   */
  static async deleteChat(
    chatId: string,
    userName: string
  ): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/chat/deletechat', {
        chatId,
        userName,
      });

      console.log('👋 Chat deleted:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Edit message
   */
  static async editMessage(
    params: EditMessageParams
  ): Promise<{ success: boolean; message: ChatMessage }> {
    try {
      const response = await apiClient.put('/chat/editMessage', params);

      console.log('✏️ Message edited:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Mark message as read
   */
  static async readMessage(
    params: ReadMessageParams
  ): Promise<{ success: boolean; recipient_id?: string }> {
    try {
      const response = await apiClient.put('/chat/readMessage', params);

      console.log('✅ Message marked as read:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Send emoji reaction (toggle)
   */
  static async sendEmoji(
    params: SendEmojiParams
  ): Promise<SendEmojiResponse> {
    try {
      const response = await apiClient.put<SendEmojiResponse>(
        '/chat/emojiMessage',
        params
      );

      console.log('😀 Emoji sent:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Upload attachment (for future use)
   */
  static async uploadAttachment(
    file: FormData
  ): Promise<{ status: string; data: { url: string; type: string } }> {
    try {
      const response = await apiClient.post('/chat/upload', file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('📎 Attachment uploaded:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  /**
   * Search messages in room (optional - if needed later)
   */
  static async searchMessages(
    roomId: string,
    query: string
  ): Promise<ChatMessage[]> {
    try {
      const response = await apiClient.get(`/chat/rooms/${roomId}/search`, {
        params: { q: query },
      });

      console.log('🔍 Search results:', response.data);
      return response.data;
    } catch (error) {
      throw ChatService.handleError(error);
    }
  }

  // ============================================
  // Error Handling
  // ============================================

  private static handleError(error: unknown): any {
    if (axios.isAxiosError(error)) {
      const axiosError = error as any;

      // Network / Timeout
      if (axiosError.message === 'Network Error') {
        throw new Error('Network error. Check your connection.');
      }
      if (axiosError.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please try again.');
      }

      // Server response
      if (axiosError.response?.data) {
        const message =
          axiosError.response.data.message || 'An error occurred';
        switch (axiosError.response.status) {
          case 400:
            throw new Error('Invalid request.');
          case 401:
            throw new Error('Authentication required. Login again.');
          case 403:
            throw new Error('Access denied.');
          case 404:
            throw new Error('Chat room not found.');
          case 409:
            throw new Error('Conflict error.');
          case 429:
            throw new Error('Too many requests. Try later.');
          case 500:
            throw new Error('Server error. Try again later.');
          default:
            throw new Error(message);
        }
      }
    }

    // Unknown error
    throw new Error('An unexpected error occurred.');
  }
}