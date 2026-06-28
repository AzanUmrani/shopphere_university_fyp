import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface NotificationAttributes {
  id: string;
  userId: string;
  type:
    | "order_update"
    | "payment_success"
    | "product_review"
    | "creator_message"
    | "system_announcement"
    | "promotion";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface NotificationCreationAttributes extends Optional<
  NotificationAttributes,
  "id" | "createdAt" | "updatedAt" | "isRead" | "readAt"
> {}

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public type!:
    | "order_update"
    | "payment_success"
    | "product_review"
    | "creator_message"
    | "system_announcement"
    | "promotion";
  public title!: string;
  public message!: string;
  public data?: any;
  public isRead!: boolean;
  public readAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: any;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    type: {
      type: DataTypes.ENUM(
        "order_update",
        "payment_success",
        "product_review",
        "creator_message",
        "system_announcement",
        "promotion",
      ),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["type"] },
      { fields: ["is_read"] },
      { fields: ["created_at"] },
    ],
  },
);
