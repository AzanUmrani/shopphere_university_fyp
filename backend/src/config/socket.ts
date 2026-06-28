import { Server } from "socket.io";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import logger from "./logger";
import { User } from "@/models/User";
import { ChatParticipant } from "@/models/ChatParticipant";
import { ChatRoom } from "@/models/ChatRoom";

interface AuthenticatedSocket {
  userId?: string;
  user?: any;
}

interface TypingUser {
  userId: string;
  userName: string;
  timestamp: number;
}

// Store active users and typing indicators
const activeUsers = new Map<string, { socketId: string; lastSeen: Date }>();
const typingUsers = new Map<string, Map<string, TypingUser>>(); // roomId -> Map<userId, TypingUser>

export const configureSocket = (io: Server): void => {
  // Authentication middleware for socket connections
  io.use(async (socket: any, next) => {
    try {
      const rawToken =
        socket.handshake.auth?.token || socket.handshake.headers.authorization;
      const token =
        typeof rawToken === "string"
          ? rawToken.replace(/^Bearer\s+/i, "").trim()
          : "";

      if (!token) {
        logger.warn("Socket connection attempt without token");
        return next(new Error("Authentication error"));
      }

      if (token.split(".").length !== 3) {
        logger.warn("Socket connection attempt with malformed JWT token");
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as any;
      const user = await User.findByPk(decoded.id);

      if (!user) {
        logger.warn("Socket connection attempt with invalid user");
        return next(new Error("User not found"));
      }

      socket.userId = user.id;
      socket.user = user;
      logger.info(`User ${user.email} connected to socket`);

      next();
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        logger.warn(`Socket authentication rejected: ${error.message}`);
      } else {
        logger.error("Socket authentication error:", error);
      }
      next(new Error("Authentication error"));
    }
  });

  // Handle connections
  io.on("connection", async (socket: any) => {
    const userId = socket.userId;
    const user = socket.user;

    logger.info(`Socket connected: ${socket.id} for user ${user.email}`);

    // Store active user
    activeUsers.set(userId, {
      socketId: socket.id,
      lastSeen: new Date(),
    });

    // Join user to their personal room
    socket.join(`user:${userId}`);

    // Join user to all their chat rooms
    try {
      const userParticipations = await ChatParticipant.findAll({
        where: { userId },
        include: [
          {
            model: ChatRoom,
            as: "room",
          },
        ],
      });

      for (const participation of userParticipations) {
        socket.join(`room:${participation.roomId}`);
        logger.info(
          `User ${user.email} joined chat room ${participation.roomId}`,
        );
      }
    } catch (error) {
      logger.error("Error joining user chat rooms:", error);
    }

    // Broadcast user online status
    socket.broadcast.emit("userOnline", {
      userId,
      userName: user.name,
      timestamp: new Date(),
    });

    // Handle joining specific chat rooms
    socket.on("joinRoom", async (roomId: string) => {
      try {
        // Verify user is participant of the room
        const participant = await ChatParticipant.findOne({
          where: { roomId, userId },
        });

        if (participant) {
          socket.join(`room:${roomId}`);
          socket.to(`room:${roomId}`).emit("userJoinedRoom", {
            userId,
            userName: user.name,
            roomId,
            timestamp: new Date(),
          });
          logger.info(`User ${user.email} joined room ${roomId}`);
        } else {
          socket.emit("error", { message: "Not authorized to join this room" });
        }
      } catch (error) {
        logger.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    });

    // Handle leaving chat rooms
    socket.on("leaveRoom", (roomId: string) => {
      socket.leave(`room:${roomId}`);
      socket.to(`room:${roomId}`).emit("userLeftRoom", {
        userId,
        userName: user.name,
        roomId,
        timestamp: new Date(),
      });
      logger.info(`User ${user.email} left room ${roomId}`);
    });

    // Handle typing indicators
    socket.on("typing", (data: { roomId: string; isTyping: boolean }) => {
      const { roomId, isTyping } = data;

      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, new Map());
      }

      const roomTypingUsers = typingUsers.get(roomId)!;

      if (isTyping) {
        roomTypingUsers.set(userId, {
          userId,
          userName: user.name,
          timestamp: Date.now(),
        });
      } else {
        roomTypingUsers.delete(userId);
      }

      // Broadcast typing status to room (excluding sender)
      socket.to(`room:${roomId}`).emit("typingUpdate", {
        roomId,
        typingUsers: Array.from(roomTypingUsers.values()),
      });
    });

    // Handle message delivery confirmations
    socket.on(
      "messageDelivered",
      (data: { messageId: string; roomId: string }) => {
        socket.to(`room:${data.roomId}`).emit("messageDeliveryConfirmed", {
          messageId: data.messageId,
          userId,
          timestamp: new Date(),
        });
      },
    );

    // Handle message read confirmations
    socket.on("messageRead", (data: { messageId: string; roomId: string }) => {
      socket.to(`room:${data.roomId}`).emit("messageReadConfirmed", {
        messageId: data.messageId,
        userId,
        timestamp: new Date(),
      });
    });

    // Handle voice/video call signaling
    socket.on(
      "callUser",
      (data: { roomId: string; signal: any; callType: "voice" | "video" }) => {
        socket.to(`room:${data.roomId}`).emit("incomingCall", {
          callerId: userId,
          callerName: user.name,
          roomId: data.roomId,
          signal: data.signal,
          callType: data.callType,
        });
      },
    );

    socket.on("answerCall", (data: { roomId: string; signal: any }) => {
      socket.to(`room:${data.roomId}`).emit("callAnswered", {
        answerId: userId,
        signal: data.signal,
      });
    });

    socket.on("rejectCall", (data: { roomId: string }) => {
      socket.to(`room:${data.roomId}`).emit("callRejected", {
        rejecterId: userId,
      });
    });

    socket.on("endCall", (data: { roomId: string }) => {
      socket.to(`room:${data.roomId}`).emit("callEnded", {
        enderId: userId,
      });
    });

    // Handle file uploads in chat
    socket.on(
      "fileUploadProgress",
      (data: { roomId: string; fileName: string; progress: number }) => {
        socket.to(`room:${data.roomId}`).emit("fileUploadProgress", {
          userId,
          userName: user.name,
          ...data,
        });
      },
    );

    // Handle user presence updates
    socket.on(
      "updatePresence",
      (status: "online" | "away" | "busy" | "offline") => {
        if (activeUsers.has(userId)) {
          activeUsers.set(userId, {
            ...activeUsers.get(userId)!,
            lastSeen: new Date(),
          });
        }

        // Broadcast presence update
        socket.broadcast.emit("presenceUpdate", {
          userId,
          status,
          timestamp: new Date(),
        });
      },
    );

    // Handle order status updates (existing functionality)
    socket.on("join_order_room", (orderId: string) => {
      socket.join(`order:${orderId}`);
      logger.info(`User ${user.email} joined order room ${orderId}`);
    });

    socket.on("leave_order_room", (orderId: string) => {
      socket.leave(`order:${orderId}`);
      logger.info(`User ${user.email} left order room ${orderId}`);
    });

    // Handle admin notifications (existing functionality)
    socket.on("join_admin", () => {
      if (user.role === "admin" || user.role === "creator") {
        socket.join("admin");
        logger.info(`Admin ${user.email} joined admin room`);
      }
    });

    // Handle support chat
    socket.on("startSupportChat", async () => {
      try {
        // Create or find existing support room for user
        let supportRoom = await ChatRoom.findOne({
          where: {
            type: "support",
          },
          include: [
            {
              model: ChatParticipant,
              as: "participants",
              where: { userId },
            },
          ],
        });

        if (!supportRoom) {
          // Create new support room
          supportRoom = await ChatRoom.create({
            name: `Support Chat - ${user.name}`,
            type: "support",
            createdBy: userId,
            isActive: true,
          });

          // Add user as participant
          await ChatParticipant.create({
            roomId: supportRoom.id,
            userId,
            role: "member",
            joinedAt: new Date(),
            isMuted: false,
            isBlocked: false,
          });
        }

        socket.join(`room:${supportRoom.id}`);
        socket.emit("supportChatReady", {
          roomId: supportRoom.id,
          room: supportRoom,
        });

        // Notify support team
        socket.to("admin").emit("newSupportRequest", {
          roomId: supportRoom.id,
          user: {
            id: userId,
            name: user.name,
            email: user.email,
          },
          timestamp: new Date(),
        });

        logger.info(`Support chat started for user ${user.email}`);
      } catch (error) {
        logger.error("Error starting support chat:", error);
        socket.emit("error", { message: "Failed to start support chat" });
      }
    });

    // Handle disconnect
    socket.on("disconnect", (reason: string) => {
      logger.info(
        `Socket disconnected: ${socket.id} for user ${user.email}, reason: ${reason}`,
      );

      // Remove from active users
      activeUsers.delete(userId);

      // Remove from all typing indicators
      for (const roomTypingUsers of typingUsers.values()) {
        roomTypingUsers.delete(userId);
      }

      // Broadcast user offline status
      socket.broadcast.emit("userOffline", {
        userId,
        userName: user.name,
        timestamp: new Date(),
      });
    });

    // Handle errors
    socket.on("error", (error: any) => {
      logger.error(`Socket error for user ${user.email}:`, error);
    });
  });

  // Clean up typing indicators periodically
  setInterval(() => {
    const now = Date.now();
    const TYPING_TIMEOUT = 3000; // 3 seconds

    for (const [roomId, roomTypingUsers] of typingUsers.entries()) {
      for (const [userId, typingUser] of roomTypingUsers.entries()) {
        if (now - typingUser.timestamp > TYPING_TIMEOUT) {
          roomTypingUsers.delete(userId);

          // Broadcast updated typing status
          io.to(`room:${roomId}`).emit("typingUpdate", {
            roomId,
            typingUsers: Array.from(roomTypingUsers.values()),
          });
        }
      }
    }
  }, 1000);

  logger.info("Socket.IO configured successfully with chat features");
};

// Utility functions to send notifications
export const sendNotificationToUser = (
  io: Server,
  userId: string,
  notification: any,
): void => {
  io.to(`user:${userId}`).emit("notification", notification);
};

export const sendNotificationToAdmins = (
  io: Server,
  notification: any,
): void => {
  io.to("admin").emit("notification", notification);
};

export const sendOrderUpdate = (
  io: Server,
  orderId: string,
  update: any,
): void => {
  io.to(`order:${orderId}`).emit("order_update", update);
};

// Chat-specific utility functions
export const sendMessageToRoom = (
  io: Server,
  roomId: string,
  message: any,
): void => {
  io.to(`room:${roomId}`).emit("newMessage", message);
};

export const notifyRoomParticipants = (
  io: Server,
  roomId: string,
  notification: any,
): void => {
  io.to(`room:${roomId}`).emit("roomNotification", notification);
};

export const updateUserPresence = (
  io: Server,
  userId: string,
  status: "online" | "away" | "busy" | "offline",
): void => {
  io.emit("presenceUpdate", {
    userId,
    status,
    timestamp: new Date(),
  });
};

// Get active users
export const getActiveUsers = (): Map<
  string,
  { socketId: string; lastSeen: Date }
> => {
  return activeUsers;
};

// Get typing users for a room
export const getTypingUsers = (roomId: string): TypingUser[] => {
  const roomTypingUsers = typingUsers.get(roomId);
  return roomTypingUsers ? Array.from(roomTypingUsers.values()) : [];
};
