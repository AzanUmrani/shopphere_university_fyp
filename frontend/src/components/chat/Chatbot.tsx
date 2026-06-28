import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Phone } from "lucide-react";
import Button from "../ui/Button";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  options?: string[];
}

const chatFlowData = {
  welcome: {
    message:
      "Hello! 👋 I'm your ShopSphere assistant. How can I help you today?",
    options: [
      "Track my order",
      "Product questions",
      "Shipping & returns",
      "Account support",
      "Other",
    ],
  },
  responses: {
    "Track my order": {
      message:
        "I'd be happy to help you track your order! Please provide your order number (format: ELG-xxxxxxxxx) or email address.",
      followUp: "order_tracking",
    },
    "Product questions": {
      message: "What would you like to know about our products?",
      options: [
        "Product availability",
        "Product specifications",
        "Size/color options",
        "Product recommendations",
        "Pricing information",
      ],
    },
    "Shipping & returns": {
      message: "How can I assist with shipping or returns?",
      options: [
        "Shipping times & costs",
        "Return policy",
        "Exchange process",
        "Delivery issues",
        "International shipping",
      ],
    },
    "Account support": {
      message: "What account assistance do you need?",
      options: [
        "Login issues",
        "Password reset",
        "Update profile",
        "Order history",
        "Delete account",
      ],
    },
    "Product availability": {
      message:
        "Please tell me which product you're looking for, and I'll check its availability for you.",
    },
    "Shipping times & costs": {
      message:
        "📦 **Shipping Information:**\n\n• **Standard (FREE)**: 5-7 business days\n• **Express ($15)**: 2-3 business days\n• **Overnight ($35)**: Next business day\n\nFree shipping on orders over $100!",
    },
    "Return policy": {
      message:
        "🔄 **Our Return Policy:**\n\n• 30-day return window\n• Items must be unused & in original packaging\n• Free return shipping for defective items\n• Refunds processed within 3-5 business days\n\nWould you like to start a return?",
    },
  },
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Send welcome message when chat opens
      setTimeout(() => {
        addBotMessage(
          chatFlowData.welcome.message,
          chatFlowData.welcome.options
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: "bot",
        timestamp: new Date(),
        options,
      };
      setMessages((prev) => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);

    const response =
      chatFlowData.responses[option as keyof typeof chatFlowData.responses];
    if (response) {
      if ("options" in response) {
        addBotMessage(response.message, response.options);
      } else {
        addBotMessage(response.message);
      }
    } else {
      // Default response for unhandled options
      addBotMessage(
        "I understand you need help with that. Let me connect you with a human agent for personalized assistance.",
        ["Connect to agent"]
      );
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const userInput = inputValue.toLowerCase();
    setInputValue("");

    // Simple keyword matching for responses
    setTimeout(() => {
      if (userInput.includes("order") && userInput.includes("track")) {
        addBotMessage(
          "Please provide your order number or email address, and I'll help you track your order."
        );
      } else if (userInput.includes("refund") || userInput.includes("return")) {
        addBotMessage(
          "I can help you with returns. Our return policy allows 30 days for unused items. Would you like me to start a return request?",
          ["Yes, start return", "No, just asking"]
        );
      } else if (
        userInput.includes("shipping") ||
        userInput.includes("delivery")
      ) {
        addBotMessage(
          "📦 We offer:\n• Standard shipping (5-7 days) - FREE\n• Express shipping (2-3 days) - $15\n• Overnight (next day) - $35\n\nWhat would you like to know specifically?"
        );
      } else if (userInput.includes("price") || userInput.includes("cost")) {
        addBotMessage(
          "I can help you with pricing information! Which product are you interested in? You can also browse our current deals and promotions."
        );
      } else if (userInput.includes("account") || userInput.includes("login")) {
        addBotMessage(
          "For account issues, I can help with:\n• Password reset\n• Profile updates\n• Order history\n• Login problems\n\nWhat specific issue are you experiencing?"
        );
      } else {
        // Fallback to human agent
        addBotMessage(
          "I want to make sure you get the best help possible. Let me connect you with one of our human specialists who can assist you better.",
          ["Connect me to agent", "Try chatbot again"]
        );
      }
    }, 1000);
  };

  const handleConnectAgent = () => {
    addBotMessage(
      "🎧 Connecting you to a live agent... Please hold while I find the next available representative. Average wait time is 2-3 minutes.",
      ["Call instead"]
    );
  };

  const formatMessage = (text: string) => {
    return text.split("\n").map((line, index) => (
      <div key={index} className="mb-1">
        {line.includes("**") ? (
          <strong>{line.replace(/\*\*/g, "")}</strong>
        ) : (
          line
        )}
      </div>
    ));
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen
              ? "bg-red-500 hover:bg-red-600"
              : "bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700 animate-pulse"
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </Button>

        {/* {!isOpen && (
          <div className="absolute -top-12 -left-20 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap animate-bounce">
            Need help? Chat with us!
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        )} */}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-secondary-600 to-pink-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">ShopSphere Assistant</h3>
                <p className="text-xs text-secondary-100">
                  🟢 Online - Instant replies
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="flex items-start space-x-2 max-w-[80%]">
                  {message.sender === "bot" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-secondary-600 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-secondary-600 text-white ml-auto"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="text-sm">{formatMessage(message.text)}</div>

                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleOptionClick(option)}
                            className="block w-full text-left px-3 py-2 bg-gradient-to-r from-secondary-50 to-pink-50 hover:from-secondary-100 hover:to-pink-100 text-secondary-700 rounded-lg text-sm transition-all border border-secondary-200"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.sender === "user" && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-secondary-600 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary-500 focus:border-transparent text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700 px-4 py-2 rounded-xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>💬 Ask me anything about your order or products</span>
              <button
                onClick={handleConnectAgent}
                className="flex items-center space-x-1 text-secondary-600 hover:text-secondary-700"
              >
                <Phone className="w-3 h-3" />
                <span>Talk to human</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
