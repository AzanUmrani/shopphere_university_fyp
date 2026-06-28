import React, { useState, useEffect } from "react";
import { MessageCircle, Users, Plus } from "lucide-react";
import ChatRoom from "./ChatRoom";

interface ChatRoomData {
  id: string;
  name?: string;
  type: "direct" | "group" | "support";
  lastMessage?: {
    content: string;
    timestamp: string;
  };
  participants: Array<{
    id: string;
    firstName: string;
    lastName: string;
    isOnline: boolean;
  }>;
  unreadCount: number;
}

interface ChatListProps {
  currentUserId: string;
}

const ChatList: React.FC<ChatListProps> = ({ currentUserId }) => {
  const [rooms, setRooms] = useState<ChatRoomData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setRooms([
        {
          id: "1",
          type: "direct",
          lastMessage: {
            content: "Hello! How can I help you today?",
            timestamp: new Date().toISOString(),
          },
          participants: [
            {
              id: "user1",
              firstName: "John",
              lastName: "Doe",
              isOnline: true,
            },
          ],
          unreadCount: 2,
        },
        {
          id: "2",
          name: "Product Support",
          type: "support",
          lastMessage: {
            content: "Thank you for contacting support",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          participants: [
            {
              id: "support1",
              firstName: "Sarah",
              lastName: "Wilson",
              isOnline: false,
            },
          ],
          unreadCount: 0,
        },
        {
          id: "3",
          name: "Creator Group",
          type: "group",
          lastMessage: {
            content: "Let's discuss the new features",
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
          participants: [
            {
              id: "creator1",
              firstName: "Mike",
              lastName: "Johnson",
              isOnline: true,
            },
            {
              id: "creator2",
              firstName: "Emma",
              lastName: "Davis",
              isOnline: false,
            },
          ],
          unreadCount: 5,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) {
      return "now";
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getRoomDisplayName = (room: ChatRoomData) => {
    if (room.name) return room.name;
    if (room.type === "direct") {
      const otherParticipant = room.participants.find(
        (p) => p.id !== currentUserId
      );
      return otherParticipant
        ? `${otherParticipant.firstName} ${otherParticipant.lastName}`
        : "Direct Message";
    }
    return "Chat Room";
  };

  const getRoomIcon = (room: ChatRoomData) => {
    switch (room.type) {
      case "group":
        return <Users className="w-5 h-5" />;
      case "support":
        return <MessageCircle className="w-5 h-5" />;
      default:
        return (
          <div className="w-8 h-8 bg-secondary-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {room.participants[0]?.firstName?.charAt(0) || "U"}
            </span>
          </div>
        );
    }
  };

  if (selectedRoom) {
    return (
      <div className="h-full">
        <ChatRoom
          roomId={selectedRoom}
          currentUserId={currentUserId}
          onClose={() => setSelectedRoom(null)}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Messages
          </h2>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center p-8">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No conversations yet
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Start a conversation with a creator or support
            </p>
          </div>
        ) : (
          <div className="divide-y dark:divide-gray-700">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {getRoomIcon(room)}
                    {room.participants.some((p) => p.isOnline) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {getRoomDisplayName(room)}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {room.lastMessage && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTimestamp(room.lastMessage.timestamp)}
                          </span>
                        )}
                        {room.unreadCount > 0 && (
                          <div className="bg-secondary-600 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] h-5 flex items-center justify-center">
                            {room.unreadCount > 99 ? "99+" : room.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>

                    {room.lastMessage && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                        {room.lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
