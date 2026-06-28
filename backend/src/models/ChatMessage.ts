import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface ChatMessageAttributes {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  messageType: "text" | "image" | "file" | "system";
  attachments?: string[];
  isEdited: boolean;
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  replyToId?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatMessageCreationAttributes extends Optional<
  ChatMessageAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class ChatMessage
  extends Model<ChatMessageAttributes, ChatMessageCreationAttributes>
  implements ChatMessageAttributes
{
  public id!: string;
  public roomId!: string;
  public senderId!: string;
  public content!: string;
  public messageType!: "text" | "image" | "file" | "system";
  public attachments?: string[];
  public isEdited!: boolean;
  public editedAt?: Date;
  public isDeleted!: boolean;
  public deletedAt?: Date;
  public replyToId?: string;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public getDisplayContent(): string {
    if (this.isDeleted) return "[Message deleted]";
    if (this.messageType === "image") return "[Image]";
    if (this.messageType === "file") return "[File]";
    return this.content;
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return {
      ...values,
      displayContent: this.getDisplayContent(),
    };
  }
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "chat_rooms",
        key: "id",
      },
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    messageType: {
      type: DataTypes.ENUM("text", "image", "file", "system"),
      allowNull: false,
      defaultValue: "text",
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    editedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    replyToId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "chat_messages",
        key: "id",
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "chat_messages",
    timestamps: true,
    indexes: [
      {
        fields: ["room_id"],
      },
      {
        fields: ["sender_id"],
      },
      {
        fields: ["created_at"],
      },
      {
        fields: ["reply_to_id"],
      },
    ],
  },
);

export { ChatMessage };
