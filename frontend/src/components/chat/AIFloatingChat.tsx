import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Bot, ArrowDown } from "lucide-react";
import { chatService } from "../../services/chat";

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

const AIFloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Scroll to bottom when chat opens
  useEffect(() => {
    if (isOpen && messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [isOpen]);

  // Detect scroll position to show/hide scroll button
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;
      setShowScrollButton(!isNearBottom && messages.length > 3);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const isRecoverableRoomError = (error: any): boolean => {
    const status = Number(error?.status || error?.response?.status || 0);
    const message = (error?.message || "").toString().toLowerCase();

    if (status === 403) return true;

    return (
      message.includes("not a participant") ||
      message.includes("participant in this room") ||
      message.includes("could not identify user")
    );
  };

  const recoverRoomAndGetId = async (): Promise<string | null> => {
    try {
      const recoveryResponse = await chatService.createAISupportChat();
      if (recoveryResponse.success && recoveryResponse.data?.room?.id) {
        const recoveredRoomId = recoveryResponse.data.room.id;
        setRoomId(recoveredRoomId);
        return recoveredRoomId;
      }
    } catch (recoveryError) {
      console.error("Failed to recover AI chat room:", recoveryError);
    }

    return null;
  };

  const initializeChat = async () => {
    if (roomId) return; // Already initialized

    setIsInitializing(true);
    try {
      const response = await chatService.createAISupportChat();
      if (response.success && response.data) {
        setRoomId(response.data.room.id);

        // Add welcome message
        if (response.data.welcomeMessage) {
          setMessages([
            {
              id: response.data.welcomeMessage.id,
              content: response.data.welcomeMessage.content,
              isBot: true,
              timestamp: new Date(response.data.welcomeMessage.createdAt),
            },
          ]);
        }
      } else {
        throw new Error(response.message || "Failed to create chat");
      }
    } catch (error: any) {
      console.error("Failed to initialize AI chat:", error);

      // Extract error message
      let errorMessage = "Sorry, I couldn't start the chat. ";

      if (error?.message) {
        console.log("Error message:", error.message);
        errorMessage += error.message;
      } else {
        errorMessage += "Please refresh the page and try again.";
      }

      setMessages([
        {
          id: "error",
          content: errorMessage,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleToggleChat = async () => {
    if (!isOpen && !roomId) {
      await initializeChat();
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !roomId) return;

    const messageToSend = inputMessage.trim();

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatService.sendMessageWithAI(
        roomId,
        messageToSend,
      );

      if (response.success && response.data) {
        const botMessage: Message = {
          id: response.data.botMessage.id,
          content: response.data.botMessage.content,
          isBot: true,
          timestamp: new Date(response.data.botMessage.createdAt),
        };

        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (error: any) {
      if (isRecoverableRoomError(error)) {
        const recoveredRoomId = await recoverRoomAndGetId();

        if (recoveredRoomId) {
          try {
            const retryResponse = await chatService.sendMessageWithAI(
              recoveredRoomId,
              messageToSend,
            );

            if (retryResponse.success && retryResponse.data) {
              const botMessage: Message = {
                id: retryResponse.data.botMessage.id,
                content: retryResponse.data.botMessage.content,
                isBot: true,
                timestamp: new Date(retryResponse.data.botMessage.createdAt),
              };

              setMessages((prev) => [...prev, botMessage]);
              return;
            }
          } catch (retryError) {
            console.error("Failed to resend after room recovery:", retryError);
          }
        }
      }

      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I couldn't process your message. Please try again.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleToggleChat}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          </>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-600 to-pink-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-secondary-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  AI Shopping Assistant
                </h3>
                <p className="text-secondary-100 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 relative"
          >
            {isInitializing ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 text-secondary-600 animate-spin" />
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.isBot
                        ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md"
                        : "bg-gradient-to-r from-secondary-600 to-pink-600 text-white"
                    }`}
                  >
                    {message.isBot && (
                      <div className="flex items-center gap-2 mb-1">
                        <Bot className="w-4 h-4" />
                        <span className="text-xs font-semibold">
                          AI Assistant
                        </span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-secondary-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      AI is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />

            {/* Scroll to bottom button */}
            {showScrollButton && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-4 right-4 bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 transform hover:scale-110 z-10"
                aria-label="Scroll to bottom"
              >
                <ArrowDown className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <div className="flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || !roomId}
                className="flex-1 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 disabled:opacity-50"
                rows={1}
                style={{ maxHeight: "100px" }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading || !roomId}
                className="bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all duration-200 transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Powered by AI • Available 24/7
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIFloatingChat;
