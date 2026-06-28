import React from "react";
import { useParams } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatRoom from "../components/chat/ChatRoom";

const ChatPage: React.FC = () => {
  const { roomId } = useParams<{ roomId?: string }>();
  const currentUserId = "current-user-id"; // This should come from auth context

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex h-screen">
          {/* Chat List Sidebar */}
          <div
            className={`${
              roomId ? "hidden lg:block" : "block"
            } w-full lg:w-80 border-r dark:border-gray-700`}
          >
            <ChatList currentUserId={currentUserId} />
          </div>

          {/* Chat Room */}
          <div className={`${roomId ? "block" : "hidden lg:block"} flex-1`}>
            {roomId ? (
              <ChatRoom
                roomId={roomId}
                currentUserId={currentUserId}
                onClose={() => window.history.back()}
              />
            ) : (
              <div className="hidden lg:flex h-full items-center justify-center bg-white dark:bg-gray-900">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose from your existing conversations or start a new one
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
