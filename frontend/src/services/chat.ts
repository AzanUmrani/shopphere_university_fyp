import { apiService, type ApiResponse } from "./api";

export interface ChatRoom {
  id: string;
  type: "direct" | "group" | "support";
  name?: string;
  description?: string;
  createdBy: string;
  isActive: boolean;
  lastMessageAt?: Date;
  participants?: any[];
  messages?: any[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  attachments?: string[];
  isEdited: boolean;
  isDeleted: boolean;
  sender?: any;
  createdAt: Date;
}

export interface CreateRoomData {
  name?: string;
  type: "direct" | "group" | "support";
  description?: string;
  participantIds?: string[];
}

export interface SendMessageData {
  content: string;
  messageType?: "text" | "image" | "file";
  attachments?: string[];
  replyToId?: string;
}

class ChatService {
  // Create a new chat room
  async createRoom(data: CreateRoomData): Promise<ApiResponse<ChatRoom>> {
    return apiService.post<ChatRoom>("/chat/rooms", data);
  }

  // Get user's chat rooms
  async getUserRooms(
    type?: string,
  ): Promise<ApiResponse<{ rooms: ChatRoom[] }>> {
    const url = type ? `/chat/rooms?type=${type}` : "/chat/rooms";
    return apiService.get(url);
  }

  // Send a message
  async sendMessage(
    roomId: string,
    data: SendMessageData,
  ): Promise<ApiResponse<ChatMessage>> {
    return apiService.post<ChatMessage>(`/chat/rooms/${roomId}/messages`, data);
  }

  // Get room messages
  async getRoomMessages(
    roomId: string,
    page: number = 1,
    limit: number = 50,
  ): Promise<ApiResponse<{ messages: ChatMessage[]; pagination: any }>> {
    return apiService.get(
      `/chat/rooms/${roomId}/messages?page=${page}&limit=${limit}`,
    );
  }

  // AI Chatbot Methods

  /**
   * Create AI support chat
   */
  async createAISupportChat(): Promise<
    ApiResponse<{ room: ChatRoom; welcomeMessage: ChatMessage }>
  > {
    return apiService.post("/chat/ai/support", {});
  }

  /**
   * Send message and get AI response
   */
  async sendMessageWithAI(
    roomId: string,
    content: string,
  ): Promise<
    ApiResponse<{ userMessage: ChatMessage; botMessage: ChatMessage }>
  > {
    return apiService.post(`/chat/ai/rooms/${roomId}/message`, { content });
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<ApiResponse> {
    return apiService.put(`/chat/messages/${messageId}/read`, {});
  }

  // Delete message
  async deleteMessage(messageId: string): Promise<ApiResponse> {
    return apiService.delete(`/chat/messages/${messageId}`);
  }

  // Leave room
  async leaveRoom(roomId: string): Promise<ApiResponse> {
    return apiService.post(`/chat/rooms/${roomId}/leave`, {});
  }
}

export const chatService = new ChatService();
