import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface ChatParticipantAttributes {
  id: string;
  roomId: string;
  userId: string;
  role: "member" | "admin" | "moderator";
  joinedAt: Date;
  lastReadAt?: Date;
  isMuted: boolean;
  isBlocked: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatParticipantCreationAttributes extends Optional<
  ChatParticipantAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class ChatParticipant
  extends Model<ChatParticipantAttributes, ChatParticipantCreationAttributes>
  implements ChatParticipantAttributes
{
  public id!: string;
  public roomId!: string;
  public userId!: string;
  public role!: "member" | "admin" | "moderator";
  public joinedAt!: Date;
  public lastReadAt?: Date;
  public isMuted!: boolean;
  public isBlocked!: boolean;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public canModerate(): boolean {
    return this.role === "admin" || this.role === "moderator";
  }

  public updateLastRead(): Promise<this> {
    this.lastReadAt = new Date();
    return this.save();
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return {
      ...values,
      canModerate: this.canModerate(),
    };
  }
}

ChatParticipant.init(
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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    role: {
      type: DataTypes.ENUM("member", "admin", "moderator"),
      allowNull: false,
      defaultValue: "member",
    },
    joinedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastReadAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isMuted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "chat_participants",
    timestamps: true,
    indexes: [
      {
        fields: ["room_id", "user_id"],
        unique: true,
      },
      {
        fields: ["user_id"],
      },
      {
        fields: ["role"],
      },
    ],
  },
);

export { ChatParticipant };
