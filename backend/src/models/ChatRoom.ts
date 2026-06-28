import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface ChatRoomAttributes {
  id: string;
  type: "direct" | "group" | "support";
  name?: string;
  description?: string;
  createdBy: string;
  isActive: boolean;
  lastMessageAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChatRoomCreationAttributes extends Optional<
  ChatRoomAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class ChatRoom
  extends Model<ChatRoomAttributes, ChatRoomCreationAttributes>
  implements ChatRoomAttributes
{
  public id!: string;
  public type!: "direct" | "group" | "support";
  public name?: string;
  public description?: string;
  public createdBy!: string;
  public isActive!: boolean;
  public lastMessageAt?: Date;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public getDisplayName(userId: string): string {
    if (this.name) return this.name;
    if (this.type === "support") return "Customer Support";
    return `Chat Room ${this.id.slice(-6)}`;
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return values;
  }
}

ChatRoom.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("direct", "group", "support"),
      allowNull: false,
      defaultValue: "direct",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "chat_rooms",
    timestamps: true,
    indexes: [
      {
        fields: ["created_by"],
      },
      {
        fields: ["type"],
      },
      {
        fields: ["is_active"],
      },
      {
        fields: ["last_message_at"],
      },
    ],
  },
);

export { ChatRoom };
