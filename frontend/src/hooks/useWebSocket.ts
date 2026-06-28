import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import webSocketService from '../services/websocket';

export const useWebSocket = () => {
  const isConnected = useSelector((state: RootState) => state.socket.isConnected);

  return {
    isConnected,
    // Methods
    joinChatRoom: (roomId: string) => webSocketService.joinChatRoom(roomId),
    leaveChatRoom: (roomId: string) => webSocketService.leaveChatRoom(roomId),
    sendMessage: (roomId: string, message: string) => webSocketService.sendMessage(roomId, message),
    startTyping: (roomId: string) => webSocketService.startTyping(roomId),
    stopTyping: (roomId: string) => webSocketService.stopTyping(roomId),
    markMessageAsRead: (messageId: string, roomId: string) => webSocketService.markMessageAsRead(messageId, roomId),
    // State (Mocking these for now, usually they come from a chatSlice)
    messages: [], 
    typingUsers: []
  };
};

// This alias fixes the "No exported member useChat" error
export const useChat = useWebSocket;