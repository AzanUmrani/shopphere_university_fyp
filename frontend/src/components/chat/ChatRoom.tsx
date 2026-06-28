import React, { useState, useEffect, useRef } from "react";
import { Send, Paperclip, MoreVertical, Phone, Video } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  messageType: "text" | "image" | "file" | "system";
  createdAt: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: {
      firstName: string;
      lastName: string;
    };
  };
  isEdited: boolean;
}

interface ChatRoomProps {
  roomId: string;
  currentUserId: string;
  onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  currentUserId,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [typing] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock socket connection and message fetching
  useEffect(() => {
    // Simulate loading messages
    setTimeout(() => {
      setMessages([
        {
          id: "1",
          content: "Hello! How can I help you today?",
          senderId: "other-user",
          messageType: "text",
          createdAt: new Date().toISOString(),
          sender: {
            id: "other-user",
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
          },
          isEdited: false,
        },
        {
          id: "2",
          content: "Hi there! I have a question about the subscription plans.",
          senderId: currentUserId,
          messageType: "text",
          createdAt: new Date().toISOString(),
          sender: {
            id: currentUserId,
            firstName: "You",
            lastName: "",
            email: "you@example.com",
          },
          isEdited: false,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [roomId, currentUserId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUserId,
      messageType: "text",
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        firstName: "You",
        lastName: "",
        email: "you@example.com",
      },
      isEdited: false,
      replyTo: replyTo
        ? {
            id: replyTo.id,
            content: replyTo.content,
            sender: replyTo.sender,
          }
        : undefined,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    setReplyTo(null);

    // TODO: Send message via API and socket
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">JD</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              John Doe
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Online</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Video className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            } animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-md ${
                message.senderId === currentUserId
                  ? "bg-secondary-600 text-white rounded-l-2xl rounded-tr-2xl"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-r-2xl rounded-tl-2xl"
              } px-4 py-2 relative group`}
            >
              {message.replyTo && (
                <div className="mb-2 p-2 bg-black/10 rounded-lg border-l-2 border-white/30">
                  <p className="text-xs opacity-70">
                    Reply to {message.replyTo.sender.firstName}
                  </p>
                  <p className="text-sm opacity-90 truncate">
                    {message.replyTo.content}
                  </p>
                </div>
              )}

              <p className="text-sm">{message.content}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs opacity-70">
                  {formatTime(message.createdAt)}
                </span>
                {message.isEdited && (
                  <span className="text-xs opacity-50">edited</span>
                )}
              </div>

              {/* Message actions */}
              <div className="absolute top-0 right-0 -mt-2 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setReplyTo(message)}
                    className="p-1 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <span className="text-xs">↩️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {typing.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-r-2xl rounded-tl-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyTo && (
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Replying to {replyTo.sender.firstName}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {replyTo.content}
              </p>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-800 dark:text-white"
              rows={1}
              style={{
                minHeight: "40px",
                maxHeight: "120px",
              }}
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-secondary-600 hover:bg-secondary-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
