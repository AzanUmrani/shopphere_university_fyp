import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { Server as SocketIOServer } from "socket.io";
import { ChatRoom } from "@/models/ChatRoom";
import { ChatMessage } from "@/models/ChatMessage";
import { ChatParticipant } from "@/models/ChatParticipant";
import { User } from "@/models/User";
import { aiChatbot } from "@/services/aiChatbot.service";
import logger from "@/config/logger";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class ChatController {
  private static io: SocketIOServer;

  static setSocketIO(io: SocketIOServer) {
    ChatController.io = io;
  }

  // Create a new chat room
  static async createRoom(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { name, type, description, participantIds = [] } = req.body;
      const creatorId = req.user?.id;

      if (!creatorId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Validate room type
      if (!["direct", "group", "support"].includes(type)) {
        res.status(400).json({ message: "Invalid room type" });
        return;
      }

      // For direct messages, ensure only 2 participants
      if (type === "direct") {
        if (participantIds.length !== 1) {
          res.status(400).json({
            message: "Direct messages require exactly one other participant",
          });
          return;
        }

        // Check if direct room already exists
        const existingRoom = await ChatRoom.findOne({
          where: {
            type: "direct",
          },
          include: [
            {
              model: ChatParticipant,
              as: "participants",
              where: {
                userId: {
                  [Op.in]: [creatorId, participantIds[0]],
                },
              },
            },
          ],
        });

        if (existingRoom) {
          const participantCount = await ChatParticipant.count({
            where: { roomId: existingRoom.id },
          });

          if (participantCount === 2) {
            res.status(400).json({
              message: "Direct message room already exists",
              room: existingRoom,
            });
            return;
          }
        }
      }

      // Create chat room
      const room = await ChatRoom.create({
        name: name || (type === "direct" ? undefined : `Room ${Date.now()}`),
        type,
        description,
        createdBy: creatorId,
        isActive: true,
      });

      // Add creator as participant
      await ChatParticipant.create({
        roomId: room.id,
        userId: creatorId,
        role: "admin",
        joinedAt: new Date(),
        isMuted: false,
        isBlocked: false,
      });

      // Add other participants
      for (const participantId of participantIds) {
        await ChatParticipant.create({
          roomId: room.id,
          userId: participantId,
          role: "member",
          joinedAt: new Date(),
          isMuted: false,
          isBlocked: false,
        });
      }

      // Emit room created event
      if (ChatController.io) {
        ChatController.io.to(room.id).emit("roomCreated", room);
      }

      res.status(201).json({
        message: "Chat room created successfully",
        room,
      });
    } catch (error: any) {
      console.error("Create room error:", error);
      res
        .status(500)
        .json({ message: "Failed to create room", error: error.message });
    }
  }

  // Get user's chat rooms
  static async getUserRooms(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const userParticipations = await ChatParticipant.findAll({
        where: { userId },
        include: [
          {
            model: ChatRoom,
            as: "room",
            include: [
              {
                model: ChatParticipant,
                as: "participants",
                include: [
                  {
                    model: User,
                    as: "user",
                    attributes: ["id", "email", "firstName", "lastName"],
                  },
                ],
              },
              {
                model: ChatMessage,
                as: "messages",
                limit: 1,
                order: [["createdAt", "DESC"]],
                include: [
                  {
                    model: User,
                    as: "sender",
                    attributes: ["id", "email", "firstName", "lastName"],
                  },
                ],
              },
            ],
          },
        ],
      });

      const rooms = userParticipations.map((participation) => ({
        ...participation.dataValues,
        userRole: participation.role,
        lastReadAt: participation.lastReadAt,
      }));

      res.status(200).json({ rooms });
    } catch (error: any) {
      console.error("Get user rooms error:", error);
      res
        .status(500)
        .json({ message: "Failed to get rooms", error: error.message });
    }
  }

  // Send a message
  static async sendMessage(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const {
        content,
        messageType = "text",
        attachments = [],
        replyToId,
      } = req.body;
      const senderId = req.user?.id;

      if (!senderId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Check if user is participant in the room
      const participation = await ChatParticipant.findOne({
        where: { roomId, userId: senderId },
      });

      if (!participation) {
        res
          .status(403)
          .json({ message: "You are not a participant in this room" });
        return;
      }

      if (participation.isMuted) {
        res.status(403).json({ message: "You are muted in this room" });
        return;
      }

      // Create message
      const message = await ChatMessage.create({
        roomId,
        senderId,
        content,
        messageType,
        attachments,
        replyToId,
        isEdited: false,
        isDeleted: false,
      });

      // Update room's last message timestamp
      await ChatRoom.update(
        { lastMessageAt: new Date() },
        { where: { id: roomId } },
      );

      // Emit message to room participants
      if (ChatController.io) {
        ChatController.io.to(roomId).emit("newMessage", {
          ...message.toJSON(),
          sender: {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          },
        });
      }

      res.status(201).json({
        message: "Message sent successfully",
        data: message,
      });
    } catch (error: any) {
      console.error("Send message error:", error);
      res
        .status(500)
        .json({ message: "Failed to send message", error: error.message });
    }
  }

  // Get room messages
  static async getRoomMessages(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Check if user is participant in the room
      const participation = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (!participation) {
        res
          .status(403)
          .json({ message: "You are not a participant in this room" });
        return;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const messages = await ChatMessage.findAndCountAll({
        where: {
          roomId,
          isDeleted: false,
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "email", "firstName", "lastName"],
          },
          {
            model: ChatMessage,
            as: "replyTo",
            include: [
              {
                model: User,
                as: "sender",
                attributes: ["id", "email", "firstName", "lastName"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset,
      });

      res.status(200).json({
        messages: messages.rows.reverse(), // Reverse to show oldest first
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: messages.count,
          totalPages: Math.ceil(messages.count / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error("Get room messages error:", error);
      res
        .status(500)
        .json({ message: "Failed to get messages", error: error.message });
    }
  }

  // Join a room
  static async joinRoom(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const room = await ChatRoom.findByPk(roomId);
      if (!room) {
        res.status(404).json({ message: "Room not found" });
        return;
      }

      // Check if room is private and user has permission
      if (room.type === "group") {
        // For group rooms, check if user is already invited or if room is open
        const existingParticipation = await ChatParticipant.findOne({
          where: { roomId, userId },
        });

        if (existingParticipation) {
          res
            .status(400)
            .json({ message: "You are already a participant in this room" });
          return;
        }
      }

      // Add user as participant
      const [participant] = await ChatParticipant.findOrCreate({
        where: { roomId, userId },
        defaults: {
          roomId,
          userId,
          role: "member",
          joinedAt: new Date(),
          isMuted: false,
          isBlocked: false,
        },
      });

      // Emit user joined event
      if (ChatController.io) {
        ChatController.io.to(roomId).emit("userJoined", {
          userId,
          roomId,
          user: {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          },
        });
      }

      res.status(200).json({
        message: "Successfully joined room",
        participant,
      });
    } catch (error: any) {
      console.error("Join room error:", error);
      res
        .status(500)
        .json({ message: "Failed to join room", error: error.message });
    }
  }

  // Leave a room
  static async leaveRoom(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const participation = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (!participation) {
        res
          .status(404)
          .json({ message: "You are not a participant in this room" });
        return;
      }

      // Remove participation
      await participation.destroy();

      // Check if room should be deleted (no participants left)
      const remainingParticipants = await ChatParticipant.count({
        where: { roomId },
      });

      if (remainingParticipants === 0) {
        await ChatRoom.update({ isActive: false }, { where: { id: roomId } });
      }

      // Emit user left event
      if (ChatController.io) {
        ChatController.io.to(roomId).emit("userLeft", {
          userId,
          roomId,
        });
      }

      res.status(200).json({ message: "Successfully left room" });
    } catch (error: any) {
      console.error("Leave room error:", error);
      res
        .status(500)
        .json({ message: "Failed to leave room", error: error.message });
    }
  }

  // Update a message
  static async updateMessage(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { messageId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const message = await ChatMessage.findByPk(messageId);
      if (!message) {
        res.status(404).json({ message: "Message not found" });
        return;
      }

      if (message.senderId !== userId) {
        res
          .status(403)
          .json({ message: "You can only edit your own messages" });
        return;
      }

      if (message.isDeleted) {
        res.status(400).json({ message: "Cannot edit deleted message" });
        return;
      }

      // Update message
      await message.update({
        content,
        isEdited: true,
        editedAt: new Date(),
      });

      // Emit message updated event
      if (ChatController.io) {
        ChatController.io.to(message.roomId).emit("messageUpdated", message);
      }

      res.status(200).json({
        message: "Message updated successfully",
        data: message,
      });
    } catch (error: any) {
      console.error("Update message error:", error);
      res
        .status(500)
        .json({ message: "Failed to update message", error: error.message });
    }
  }

  // Get room participants
  static async getRoomParticipants(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Check if user is participant in the room
      const userParticipation = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (!userParticipation) {
        res
          .status(403)
          .json({ message: "You are not a participant in this room" });
        return;
      }

      const participants = await ChatParticipant.findAll({
        where: { roomId },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "email", "firstName", "lastName"],
          },
        ],
      });

      res.status(200).json({ participants });
    } catch (error: any) {
      console.error("Get room participants error:", error);
      res
        .status(500)
        .json({ message: "Failed to get participants", error: error.message });
    }
  }

  // Add participants to room
  static async addParticipants(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const { userIds } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Check if user has admin/moderator role
      const userParticipation = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (
        !userParticipation ||
        !["admin", "moderator"].includes(userParticipation.role)
      ) {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
      }

      const addedParticipants = [];
      for (const newUserId of userIds) {
        const [participant, created] = await ChatParticipant.findOrCreate({
          where: { roomId, userId: newUserId },
          defaults: {
            roomId,
            userId: newUserId,
            role: "member",
            joinedAt: new Date(),
            isMuted: false,
            isBlocked: false,
          },
        });

        if (created) {
          addedParticipants.push(participant);
        }
      }

      // Emit participants added event
      if (ChatController.io && addedParticipants.length > 0) {
        ChatController.io.to(roomId).emit("participantsAdded", {
          roomId,
          participants: addedParticipants,
        });
      }

      res.status(200).json({
        message: "Participants added successfully",
        addedParticipants,
      });
    } catch (error: any) {
      console.error("Add participants error:", error);
      res
        .status(500)
        .json({ message: "Failed to add participants", error: error.message });
    }
  }

  // Remove participant from room
  static async removeParticipant(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId, participantId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Check if user has admin/moderator role
      const userParticipation = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (
        !userParticipation ||
        !["admin", "moderator"].includes(userParticipation.role)
      ) {
        res.status(403).json({ message: "Insufficient permissions" });
        return;
      }

      const participantToRemove = await ChatParticipant.findOne({
        where: { roomId, userId: participantId },
      });

      if (!participantToRemove) {
        res.status(404).json({ message: "Participant not found in this room" });
        return;
      }

      // Cannot remove room creator unless transferring ownership
      const room = await ChatRoom.findByPk(roomId);
      if (room && room.createdBy === participantId) {
        res.status(400).json({ message: "Cannot remove room creator" });
        return;
      }

      await participantToRemove.destroy();

      // Emit participant removed event
      if (ChatController.io) {
        ChatController.io.to(roomId).emit("participantRemoved", {
          roomId,
          userId: participantId,
        });
      }

      res.status(200).json({ message: "Participant removed successfully" });
    } catch (error: any) {
      console.error("Remove participant error:", error);
      res.status(500).json({
        message: "Failed to remove participant",
        error: error.message,
      });
    }
  }

  // Search messages in a room
  static async searchMessages(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const { query, page = 1, limit = 20 } = req.query as any;
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Check if user is participant in the room
      const participation = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (!participation) {
        res
          .status(403)
          .json({ message: "You are not a participant in this room" });
        return;
      }

      const offset = (Number(page) - 1) * Number(limit);

      const messages = await ChatMessage.findAndCountAll({
        where: {
          roomId,
          content: {
            [Op.iLike]: `%${query}%`,
          },
          isDeleted: false,
        },
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "email", "firstName", "lastName"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset,
      });

      res.status(200).json({
        messages: messages.rows,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: messages.count,
          totalPages: Math.ceil(messages.count / Number(limit)),
        },
      });
    } catch (error: any) {
      console.error("Search messages error:", error);
      res
        .status(500)
        .json({ message: "Failed to search messages", error: error.message });
    }
  }

  // AI Chatbot Methods

  /**
   * Create support chat room with AI bot
   */
  static async createAISupportChat(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const userId = req.user?.id;
      logger.info(`Creating AI support chat for user: ${userId || "guest"}`);

      // For guest users (not authenticated), create an actual guest user in DB
      let effectiveUserId = userId;
      if (!userId) {
        // Create a guest user identifier
        const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        logger.info(`Creating guest user: ${guestId}`);
        const guestUser = await ChatController.getOrCreateGuestUser(guestId);
        effectiveUserId = guestUser.id;
        logger.info(`Guest user created with ID: ${effectiveUserId}`);
      }

      // Find or create AI bot user
      const botUser = await ChatController.getOrCreateBotUser();
      logger.info(`Bot user found/created: ${botUser.id}`);

      // Check if user already has an active support chat with bot
      const existingSupportParticipation = await ChatParticipant.findOne({
        where: {
          userId: effectiveUserId,
        },
        include: [
          {
            model: ChatRoom,
            as: "room",
            where: {
              type: "support",
              isActive: true,
            },
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      if (existingSupportParticipation) {
        const existingRoomId = existingSupportParticipation.roomId;
        const [existingRoom, botParticipation, participantCount] =
          await Promise.all([
            ChatRoom.findByPk(existingRoomId),
            ChatParticipant.findOne({
              where: {
                roomId: existingRoomId,
                userId: botUser.id,
              },
            }),
            ChatParticipant.count({
              where: { roomId: existingRoomId },
            }),
          ]);

        if (!existingRoom || !botParticipation) {
          logger.warn(
            `Support room consistency check failed for room ${existingRoomId}. Creating a new support room.`,
          );
        }

        if (existingRoom && botParticipation && participantCount === 2) {
          // Get welcome message
          const welcomeMessage = await ChatMessage.findOne({
            where: { roomId: existingRoomId, senderId: botUser.id },
            order: [["createdAt", "ASC"]],
          });

          res.status(200).json({
            success: true,
            message: "Support chat already exists",
            data: {
              room: existingRoom,
              welcomeMessage,
            },
          });
          return;
        }
      }

      // Create new support room
      const room = await ChatRoom.create({
        name: "AI Support Chat",
        type: "support",
        description: "Chat with our AI shopping assistant",
        createdBy: botUser.id, // Bot creates the support chat
        isActive: true,
      });

      // Add user as participant
      await ChatParticipant.create({
        roomId: room.id,
        userId: effectiveUserId,
        role: "member",
        joinedAt: new Date(),
        isMuted: false,
        isBlocked: false,
      });

      // Add bot as participant
      await ChatParticipant.create({
        roomId: room.id,
        userId: botUser.id,
        role: "admin",
        joinedAt: new Date(),
        isMuted: false,
        isBlocked: false,
      });

      // Send welcome message from bot
      const welcomeMessage = await ChatMessage.create({
        roomId: room.id,
        senderId: botUser.id,
        content: `Hello! 👋 I'm your ElegantShop AI assistant. ${userId ? `Welcome back!` : `Welcome! Feel free to ask me anything even without logging in.`}

I'm here to help you with:

🔍 Finding products
📦 Order tracking${userId ? "" : " (after login)"}
💳 Payment questions
🚚 Shipping information
🔄 Returns & refunds
💡 General shopping help

How can I assist you today?`,
        messageType: "text",
        isEdited: false,
        isDeleted: false,
      });

      // Emit to socket
      if (ChatController.io) {
        ChatController.io.to(room.id).emit("newMessage", {
          ...welcomeMessage.toJSON(),
          sender: botUser,
        });
      }

      logger.info(`AI support chat created successfully. Room ID: ${room.id}`);

      res.status(201).json({
        success: true,
        message: "AI support chat created successfully",
        data: {
          room,
          welcomeMessage,
        },
      });
    } catch (error: any) {
      logger.error("Create AI support chat error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create AI support chat",
        error: error.message,
      });
    }
  }

  /**
   * Send message and get AI response
   */
  static async sendMessageWithAI(
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> {
    try {
      const { roomId } = req.params;
      const { content } = req.body;
      const userId = req.user?.id;

      // For guest users, extract userId from room participants
      let effectiveUserId = userId;
      if (!userId) {
        // Find the participant that's not the bot
        const botUser = await ChatController.getOrCreateBotUser();
        const participant = await ChatParticipant.findOne({
          where: {
            roomId,
            userId: { [Op.ne]: botUser.id },
          },
        });

        if (!participant) {
          res.status(403).json({
            success: false,
            message: "Could not identify user in this chat room",
          });
          return;
        }

        effectiveUserId = participant.userId;
      }

      // Check if room is a support room
      const room = await ChatRoom.findByPk(roomId);
      if (!room || room.type !== "support") {
        res.status(400).json({
          success: false,
          message: "AI responses are only available in support chats",
        });
        return;
      }

      // Check participation
      const participation = await ChatParticipant.findOne({
        where: { roomId, userId: effectiveUserId },
      });

      if (!participation) {
        res.status(403).json({
          success: false,
          message: "You are not a participant in this room",
        });
        return;
      }

      // Create user message
      const userMessage = await ChatMessage.create({
        roomId,
        senderId: effectiveUserId,
        content,
        messageType: "text",
        isEdited: false,
        isDeleted: false,
      });

      // Emit user message
      if (ChatController.io) {
        // Get user details for socket emit
        let senderInfo;
        if (req.user) {
          senderInfo = {
            id: req.user.id,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
          };
        } else {
          // For guest users, fetch their details from DB
          const guestUser = await User.findByPk(effectiveUserId);
          senderInfo = {
            id: guestUser?.id || effectiveUserId,
            email: guestUser?.email || "guest@elegantshop.com",
            firstName: guestUser?.firstName || "Guest",
            lastName: guestUser?.lastName || "User",
          };
        }

        ChatController.io.to(roomId).emit("newMessage", {
          ...userMessage.toJSON(),
          sender: senderInfo,
        });
      }

      // Generate AI response
      const botUser = await ChatController.getOrCreateBotUser();

      // Get recent messages for context
      const recentMessages = await ChatMessage.findAll({
        where: { roomId },
        order: [["createdAt", "DESC"]],
        limit: 8,
      });

      const chronologicalMessages = [...recentMessages].reverse();
      const recentConversation = chronologicalMessages.map((message) => {
        const speaker = message.senderId === botUser.id ? "Assistant" : "User";
        return `${speaker}: ${message.content}`;
      });

      const aiResponse = await aiChatbot.generateResponse(content, {
        userId: userId || undefined,
        userName: req.user?.firstName || "Guest",
        recentMessages: recentConversation,
      });

      // Create bot message
      const botMessage = await ChatMessage.create({
        roomId,
        senderId: botUser.id,
        content: aiResponse,
        messageType: "text",
        isEdited: false,
        isDeleted: false,
      });

      // Update room timestamp
      await ChatRoom.update(
        { lastMessageAt: new Date() },
        { where: { id: roomId } },
      );

      // Emit bot message
      if (ChatController.io) {
        ChatController.io.to(roomId).emit("newMessage", {
          ...botMessage.toJSON(),
          sender: botUser,
        });
      }

      res.status(201).json({
        success: true,
        message: "Message sent and AI responded",
        data: {
          userMessage,
          botMessage,
        },
      });
    } catch (error: any) {
      logger.error("Send message with AI error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to send message with AI",
        error: error.message,
      });
    }
  }

  /**
   * Get or create bot user
   */
  private static async getOrCreateBotUser(): Promise<any> {
    const botEmail = "aibot@elegantshop.com";

    let botUser = await User.findOne({ where: { email: botEmail } });

    if (!botUser) {
      // Create bot user with a secure random password (will be hashed automatically)
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(32).toString("hex");

      logger.info("Creating AI Bot user...");

      botUser = await User.create({
        email: botEmail,
        password: randomPassword,
        firstName: "ElegantShop",
        lastName: "Assistant",
        role: "user",
        isActive: true,
        isEmailVerified: true,
      });

      logger.info("AI Bot user created successfully");
    }

    return botUser;
  }

  private static async getOrCreateGuestUser(guestId: string): Promise<any> {
    const guestEmail = `${guestId}@guest.elegantshop.com`;

    let guestUser = await User.findOne({ where: { email: guestEmail } });

    if (!guestUser) {
      // Create guest user with a secure random password
      const crypto = require("crypto");
      const randomPassword = crypto.randomBytes(32).toString("hex");

      logger.info(`Creating guest user: ${guestId}`);

      guestUser = await User.create({
        email: guestEmail,
        password: randomPassword,
        firstName: "Guest",
        lastName: "User",
        role: "user",
        isActive: true,
        isEmailVerified: false,
      });

      logger.info(`Guest user created: ${guestId} with ID: ${guestUser.id}`);
    }

    return guestUser;
  }
}
