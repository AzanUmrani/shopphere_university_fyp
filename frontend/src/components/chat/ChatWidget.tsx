import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import ChatList from "./ChatList";

interface ChatWidgetProps {
  currentUserId: string;
  position?: "bottom-right" | "bottom-left";
}

const ChatWidget: React.FC<ChatWidgetProps> = ({
  currentUserId,
  position = "bottom-right",
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
  };

  return (
    <>
      {/* Chat Button */}
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-secondary-600 hover:bg-secondary-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${positionClasses[position]} mb-16 z-40`}>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border dark:border-gray-700 w-80 h-96 overflow-hidden">
            <ChatList currentUserId={currentUserId} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
