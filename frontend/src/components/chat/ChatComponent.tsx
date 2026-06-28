import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useWebSocket';
import type { ChatMessage, TypingStatus } from '../../services/websocket';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

interface ChatComponentProps {
  roomId: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ roomId }) => {
  const [inputText, setInputText] = useState('');
  const { user } = useSelector((state: RootState) => state.auth);
  const scrollRef = useRef<HTMLDivElement>(null);

  // We destructure leaveChatRoom here
  const { 
    isConnected, 
    messages, 
    typingUsers, 
    sendMessage, 
    joinChatRoom, 
    leaveChatRoom, 
    startTyping, 
    stopTyping 
  } = useChat();

  useEffect(() => {
    if (roomId) {
      joinChatRoom(roomId);
      
      // FIX: Use leaveChatRoom instead of leaveRoom
      return () => {
        leaveChatRoom(roomId);
      };
    }
  }, [roomId, joinChatRoom, leaveChatRoom]); // Added dependencies for best practice

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(roomId, inputText);
      setInputText('');
      stopTyping(roomId);
    }
  };

  // Types for 'u' are now explicitly defined to fix the 'any' error
  const isUserTyping = typingUsers.some((u: TypingStatus) => u.roomId === roomId && u.isTyping);

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md border rounded-lg bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-secondary-600 text-white flex justify-between items-center">
        <h3 className="font-bold">Chat Room</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((message: ChatMessage) => (
          <div key={message.id} className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${message.senderId === user?.id ? 'bg-secondary-500 text-white' : 'bg-white border text-gray-800'}`}>
              <p className="text-sm">{message.message}</p>
              <span className="text-[10px] opacity-70 block mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Typing Indicator */}
      {isUserTyping && (
        <div className="px-4 py-1 text-xs text-gray-500 italic">
          Someone is typing...
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value) {
                startTyping(roomId);
            } else {
                stopTyping(roomId);
            }
          }}
          placeholder="Write a message..."
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:border-secondary-500 text-sm"
        />
        <button 
          type="submit" 
          disabled={!isConnected || !inputText.trim()}
          className="bg-secondary-600 text-white p-2 rounded-full disabled:bg-gray-300 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatComponent;
