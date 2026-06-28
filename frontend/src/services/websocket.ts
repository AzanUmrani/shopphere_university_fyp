// import { io, Socket } from "socket.io-client";

// export interface ChatMessage {
//   id: string;
//   chatRoomId: string;
//   senderId: string;
//   senderName: string;
//   senderAvatar?: string;
//   message: string;
//   type: "text" | "image" | "file";
//   timestamp: string;
//   readBy: string[];
// }

// export interface ChatRoom {
//   id: string;
//   name: string;
//   type: "direct" | "group" | "support";
//   participants: string[];
//   lastMessage?: ChatMessage;
//   unreadCount: number;
//   isActive: boolean;
// }

// export interface TypingStatus {
//   userId: string;
//   userName: string;
//   chatRoomId: string;
//   isTyping: boolean;
// }

// export interface OnlineStatus {
//   userId: string;
//   isOnline: boolean;
//   lastSeen?: string;
// }

// class WebSocketService {
//   private socket: Socket | null = null;
//   private isConnected = false;
//   private reconnectAttempts = 0;
//   private maxReconnectAttempts = 5;
//   private reconnectDelay = 1000;

//   // Event handlers
//   private eventHandlers: { [key: string]: Function[] } = {};

//   constructor() {
//     this.connect();
//   }

//   connect() {
//     try {
//       const token = localStorage.getItem("authToken");
//       const serverUrl =
//         import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

//       this.socket = io(serverUrl, {
//         auth: {
//           token,
//         },
//         transports: ["websocket", "polling"],
//         timeout: 20000,
//         reconnection: true,
//         reconnectionAttempts: this.maxReconnectAttempts,
//         reconnectionDelay: this.reconnectDelay,
//       });

//       this.setupEventListeners();
//     } catch (error) {
//       console.error("Failed to connect to WebSocket:", error);
//     }
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("Connected to WebSocket server");
//       this.isConnected = true;
//       this.reconnectAttempts = 0;
//       this.emit("connected");
//     });

//     this.socket.on("disconnect", (reason) => {
//       console.log("Disconnected from WebSocket server:", reason);
//       this.isConnected = false;
//       this.emit("disconnected", reason);
//     });

//     this.socket.on("connect_error", (error) => {
//       console.error("WebSocket connection error:", error);
//       this.reconnectAttempts++;
//       this.emit("connectionError", error);
//     });

//     // Chat events
//     this.socket.on("message:new", (message: ChatMessage) => {
//       this.emit("messageReceived", message);
//     });

//     this.socket.on("message:updated", (message: ChatMessage) => {
//       this.emit("messageUpdated", message);
//     });

//     this.socket.on("message:deleted", (messageId: string) => {
//       this.emit("messageDeleted", messageId);
//     });

//     this.socket.on("typing:start", (data: TypingStatus) => {
//       this.emit("typingStart", data);
//     });

//     this.socket.on("typing:stop", (data: TypingStatus) => {
//       this.emit("typingStop", data);
//     });

//     this.socket.on("user:online", (data: OnlineStatus) => {
//       this.emit("userOnline", data);
//     });

//     this.socket.on("user:offline", (data: OnlineStatus) => {
//       this.emit("userOffline", data);
//     });

//     // Chat room events
//     this.socket.on("room:joined", (roomId: string) => {
//       this.emit("roomJoined", roomId);
//     });

//     this.socket.on("room:left", (roomId: string) => {
//       this.emit("roomLeft", roomId);
//     });

//     this.socket.on("room:updated", (room: ChatRoom) => {
//       this.emit("roomUpdated", room);
//     });

//     // Notification events
//     this.socket.on("notification:new", (notification: any) => {
//       this.emit("notificationReceived", notification);
//     });

//     // Order events for real-time updates
//     this.socket.on(
//       "order:statusChanged",
//       (data: { orderId: string; status: string; message?: string }) => {
//         this.emit("orderStatusChanged", data);
//       }
//     );

//     // Product events for inventory updates
//     this.socket.on(
//       "product:stockChanged",
//       (data: { productId: string; stock: number }) => {
//         this.emit("productStockChanged", data);
//       }
//     );
//   }

//   // Event emitter methods
//   on(event: string, handler: Function) {
//     if (!this.eventHandlers[event]) {
//       this.eventHandlers[event] = [];
//     }
//     this.eventHandlers[event].push(handler);

//     // Return unsubscribe function
//     return () => {
//       this.eventHandlers[event] = this.eventHandlers[event].filter(
//         (h) => h !== handler
//       );
//     };
//   }

//   private emit(event: string, data?: any) {
//     if (this.eventHandlers[event]) {
//       this.eventHandlers[event].forEach((handler) => handler(data));
//     }
//   }

//   // Chat methods
//   sendMessage(
//     chatRoomId: string,
//     message: string,
//     type: "text" | "image" | "file" = "text"
//   ) {
//     if (!this.isConnected || !this.socket) {
//       console.warn("WebSocket not connected. Message not sent.");
//       return;
//     }

//     this.socket.emit("message:send", {
//       chatRoomId,
//       message,
//       type,
//       timestamp: new Date().toISOString(),
//     });
//   }

//   joinChatRoom(roomId: string) {
//     if (!this.isConnected || !this.socket) {
//       console.warn("WebSocket not connected. Cannot join room.");
//       return;
//     }

//     this.socket.emit("room:join", roomId);
//   }

//   leaveChatRoom(roomId: string) {
//     if (!this.isConnected || !this.socket) {
//       console.warn("WebSocket not connected. Cannot leave room.");
//       return;
//     }

//     this.socket.emit("room:leave", roomId);
//   }

//   startTyping(chatRoomId: string) {
//     if (!this.isConnected || !this.socket) return;
//     this.socket.emit("typing:start", chatRoomId);
//   }

//   stopTyping(chatRoomId: string) {
//     if (!this.isConnected || !this.socket) return;
//     this.socket.emit("typing:stop", chatRoomId);
//   }

//   markMessageAsRead(messageId: string) {
//     if (!this.isConnected || !this.socket) return;
//     this.socket.emit("message:read", messageId);
//   }

//   // Utility methods
//   getConnectionStatus(): boolean {
//     return this.isConnected;
//   }

//   disconnect() {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//       this.isConnected = false;
//     }
//   }

//   reconnect() {
//     if (this.socket && !this.isConnected) {
//       this.socket.connect();
//     } else {
//       this.connect();
//     }
//   }

//   // Update authentication token
//   updateAuthToken(token: string) {
//     if (this.socket) {
//       this.socket.auth = { token };
//       if (this.isConnected) {
//         this.socket.disconnect();
//         this.socket.connect();
//       }
//     }
//   }
// }

// // Create singleton instance
// const webSocketService = new WebSocketService();

// export default webSocketService;

import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  message: string;
  timestamp: string;
}

export interface TypingStatus {
  userId: string;
  isTyping: boolean;
  roomId: string;
}

export interface OnlineStatus {
  userId: string;
  status: "online" | "offline";
}

class WebSocketService {
  private socket: Socket | null = null;
  private eventHandlers: { [key: string]: Function[] } = {};

  private isLikelyJwt(value: string): boolean {
    const tokenParts = value.split(".");
    return (
      tokenParts.length === 3 && tokenParts.every((part) => part.length > 0)
    );
  }

  connect(identity?: string) {
    if (this.socket?.connected) return;

    const serverUrl =
      import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

    const token = identity || localStorage.getItem("authToken");

    if (!token) return;

    if (!this.isLikelyJwt(token)) {
      console.warn(
        "Skipping WebSocket connection because auth token is not a valid JWT format.",
      );
      return;
    }

    console.log("📡 WebSocket: Connecting with authenticated JWT token...");

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      withCredentials: true,
      path: "/socket.io/",
    });

    this.socket.on("connect", () => {
      console.log("🟢 WebSocket: Connected successfully!");
      this.emit("connected");
    });

    this.socket.on("disconnect", () => {
      console.log("🔴 WebSocket: Disconnected");
      this.emit("disconnected");
    });

    this.socket.on("connect_error", (err) => {
      console.error("❌ WebSocket: Auth Error ->", err.message);
      this.emit("connectionError", err.message);

      // Prevent repeated reconnect loops on known auth failures.
      if (err.message === "Authentication error") {
        this.disconnect();
      }
    });
  }

  // Helper for login/logout
  updateAuthToken(token: string) {
    if (!token) {
      this.disconnect();
      return;
    }

    this.disconnect();
    this.connect(token);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // --- RESTORED METHODS FOR CHAT FUNCTIONALITY ---

  joinChatRoom(roomId: string) {
    this.socket?.emit("join_room", { roomId });
  }

  leaveChatRoom(roomId: string) {
    this.socket?.emit("leave_room", { roomId });
  }

  sendMessage(roomId: string, message: string) {
    this.socket?.emit("send_message", { roomId, message });
  }

  startTyping(roomId: string) {
    this.socket?.emit("typing_start", { roomId });
  }

  stopTyping(roomId: string) {
    this.socket?.emit("typing_stop", { roomId });
  }

  markMessageAsRead(messageId: string, roomId: string) {
    this.socket?.emit("mark_read", { messageId, roomId });
  }

  getConnectionStatus(): boolean {
    return this.socket?.connected || false;
  }

  // --- Event System ---
  on(event: string, handler: Function) {
    if (!this.eventHandlers[event]) this.eventHandlers[event] = [];
    this.eventHandlers[event].push(handler);
    return () => {
      this.eventHandlers[event] = this.eventHandlers[event].filter(
        (h) => h !== handler,
      );
    };
  }

  private emit(event: string, data?: any) {
    this.eventHandlers[event]?.forEach((h) => h(data));
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
