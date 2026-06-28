import { Router, Request, Response } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authenticate, optionalAuth } from "../middleware/auth";
import { body, param, query } from "express-validator";
import { validate } from "../middleware/validation";
import { Op } from "sequelize";
import { ChatParticipant } from "../models/ChatParticipant";
import { ChatRoom } from "../models/ChatRoom";
import { User } from "../models/User";
import { ChatMessage } from "../models/ChatMessage";

const router = Router();

// Validation middleware
const createRoomValidation = [
  body("name")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Room name must be between 1 and 100 characters"),
  body("type")
    .isIn(["direct", "group", "support"])
    .withMessage("Room type must be direct, group, or support"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must not exceed 500 characters"),
  body("isPrivate")
    .optional()
    .isBoolean()
    .withMessage("isPrivate must be a boolean"),
  body("participantIds")
    .optional()
    .isArray()
    .withMessage("participantIds must be an array"),
  body("participantIds.*")
    .optional()
    .isUUID()
    .withMessage("Each participant ID must be a valid UUID"),
];

const sendMessageValidation = [
  param("roomId").isUUID().withMessage("Invalid room ID"),
  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ min: 1, max: 4000 })
    .withMessage("Message content must be between 1 and 4000 characters"),
  body("type")
    .optional()
    .isIn(["text", "image", "file", "audio", "video"])
    .withMessage("Invalid message type"),
  body("replyToId").optional().isUUID().withMessage("Invalid reply message ID"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
];

const updateMessageValidation = [
  param("messageId").isUUID().withMessage("Invalid message ID"),
  body("content")
    .optional()
    .isLength({ min: 1, max: 4000 })
    .withMessage("Message content must be between 1 and 4000 characters"),
  body("isDeleted")
    .optional()
    .isBoolean()
    .withMessage("isDeleted must be a boolean"),
];

const roomParamValidation = [
  param("roomId").isUUID().withMessage("Invalid room ID"),
];

const addParticipantsValidation = [
  param("roomId").isUUID().withMessage("Invalid room ID"),
  body("userIds")
    .isArray({ min: 1 })
    .withMessage("userIds must be a non-empty array"),
  body("userIds.*").isUUID().withMessage("Each user ID must be a valid UUID"),
];

const removeParticipantValidation = [
  param("roomId").isUUID().withMessage("Invalid room ID"),
  param("participantUserId")
    .isUUID()
    .withMessage("Invalid participant user ID"),
];

const paginationValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),
];

const searchValidation = [
  param("roomId").isUUID().withMessage("Invalid room ID"),
  query("query")
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
];

// Routes

// Create a new chat room
router.post(
  "/rooms",
  authenticate,
  createRoomValidation,
  validate,
  ChatController.createRoom,
);

// Get user's chat rooms
router.get(
  "/rooms",
  authenticate,
  query("type")
    .optional()
    .isIn(["direct", "group", "support"])
    .withMessage("Invalid room type"),
  paginationValidation,
  validate,
  ChatController.getUserRooms,
);

// Join a room
router.post(
  "/rooms/:roomId/join",
  authenticate,
  roomParamValidation,
  validate,
  ChatController.joinRoom,
);

// Leave a room
router.post(
  "/rooms/:roomId/leave",
  authenticate,
  roomParamValidation,
  validate,
  ChatController.leaveRoom,
);

// Send a message
router.post(
  "/rooms/:roomId/messages",
  authenticate,
  sendMessageValidation,
  validate,
  ChatController.sendMessage,
);

// Get room messages
router.get(
  "/rooms/:roomId/messages",
  authenticate,
  roomParamValidation,
  paginationValidation,
  validate,
  ChatController.getRoomMessages,
);

// Update a message (edit or delete)
router.put(
  "/messages/:messageId",
  authenticate,
  updateMessageValidation,
  validate,
  ChatController.updateMessage,
);

// Get room participants
router.get(
  "/rooms/:roomId/participants",
  authenticate,
  roomParamValidation,
  validate,
  ChatController.getRoomParticipants,
);

// Add participants to room (admin only)
router.post(
  "/rooms/:roomId/participants",
  authenticate,
  addParticipantsValidation,
  validate,
  ChatController.addParticipants,
);

// Remove participant from room (admin only)
router.delete(
  "/rooms/:roomId/participants/:participantUserId",
  authenticate,
  removeParticipantValidation,
  validate,
  ChatController.removeParticipant,
);

// Search messages in a room
router.get(
  "/rooms/:roomId/search",
  authenticate,
  searchValidation,
  paginationValidation,
  validate,
  ChatController.searchMessages,
);

// Get room details
router.get(
  "/rooms/:roomId",
  authenticate,
  roomParamValidation,
  validate,
  async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Verify user is participant of the room
      const participant = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (!participant) {
        return res
          .status(403)
          .json({ message: "Not a participant of this room" });
      }

      // Get room details
      const room = await ChatRoom.findByPk(roomId, {
        include: [
          {
            model: ChatParticipant,
            as: "participants",
            include: [
              {
                model: User,
                as: "user",
                attributes: ["id", "name", "email"],
              },
            ],
          },
          {
            model: User,
            as: "creator",
            attributes: ["id", "name", "email"],
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
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      return res.json({
        message: "Room details retrieved successfully",
        room,
      });
    } catch (error) {
      console.error("Error fetching room details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Mark messages as read
router.put(
  "/rooms/:roomId/read",
  authenticate,
  roomParamValidation,
  validate,
  async (req: Request, res: Response) => {
    try {
      const { roomId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Find participant
      const participant = await ChatParticipant.findOne({
        where: { roomId, userId },
      });

      if (!participant) {
        return res
          .status(403)
          .json({ message: "Not a participant of this room" });
      }

      // Update last read timestamp
      await participant.update({ lastReadAt: new Date() });

      return res.json({
        message: "Messages marked as read",
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Get unread message count for user
router.get(
  "/unread-count",
  authenticate,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get all rooms where user is a participant
      const participants = await ChatParticipant.findAll({
        where: { userId },
        attributes: ["roomId", "lastReadAt"],
      });

      let totalUnreadCount = 0;
      const roomUnreadCounts = [];

      for (const participant of participants) {
        const unreadCount = await ChatMessage.count({
          where: {
            roomId: participant.roomId,
            senderId: { [Op.ne]: userId }, // Exclude own messages
            createdAt: {
              [Op.gt]: participant.lastReadAt || new Date(0),
            },
          },
        });

        totalUnreadCount += unreadCount;
        roomUnreadCounts.push({
          roomId: participant.roomId,
          unreadCount,
        });
      }

      return res.json({
        message: "Unread count retrieved successfully",
        totalUnreadCount,
        roomUnreadCounts,
      });
    } catch (error) {
      console.error("Error fetching unread count:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

// Get message details
router.get(
  "/messages/:messageId",
  authenticate,
  param("messageId").isUUID().withMessage("Invalid message ID"),
  validate,
  async (req: Request, res: Response) => {
    try {
      const { messageId } = req.params;
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // Get message
      const message = await ChatMessage.findByPk(messageId, {
        include: [
          {
            model: User,
            as: "sender",
            attributes: ["id", "name", "email"],
          },
          {
            model: ChatMessage,
            as: "replyTo",
            include: [
              {
                model: User,
                as: "sender",
                attributes: ["id", "name"],
              },
            ],
          },
        ],
      });

      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }

      // Verify user is participant of the room
      const participant = await ChatParticipant.findOne({
        where: { roomId: message.roomId, userId },
      });

      if (!participant) {
        return res
          .status(403)
          .json({ message: "Not a participant of this room" });
      }

      return res.json({
        message: "Message details retrieved successfully",
        data: message,
      });
    } catch (error) {
      console.error("Error fetching message details:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

// AI Chatbot Routes

// Create AI support chat room (works for both authenticated and guest users)
router.post("/ai/support", optionalAuth, ChatController.createAISupportChat);

// Send message and get AI response (works for both authenticated and guest users)
router.post(
  "/ai/rooms/:roomId/message",
  optionalAuth,
  body("content")
    .notEmpty()
    .withMessage("Message content is required")
    .isLength({ min: 1, max: 4000 })
    .withMessage("Message content must be between 1 and 4000 characters"),
  validate,
  ChatController.sendMessageWithAI,
);

export default router;
