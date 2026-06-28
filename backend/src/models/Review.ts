import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ReviewAttributes {
  id: string;
  userId: string;
  productId: string;
  orderId?: string;
  rating: number;
  title: string;
  content: string;
  comment?: string;
  images?: string[];
  verified: boolean;
  isVerifiedPurchase: boolean;
  helpful: number;
  notHelpful: number;
  helpfulCount: number;
  status: "pending" | "approved" | "rejected" | "reported";
  moderatorNote?: string;
  moderatedBy?: string;
  moderatedAt?: Date;
  reportReason?: string;
  reportDetails?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ReviewCreationAttributes
  extends Optional<
    ReviewAttributes,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "helpful"
    | "notHelpful"
    | "verified"
    | "isVerifiedPurchase"
    | "status"
    | "helpfulCount"
    | "moderatedAt"
    | "reportReason"
    | "reportDetails"
  > {}

export class Review
  extends Model<ReviewAttributes, ReviewCreationAttributes>
  implements ReviewAttributes
{
  public id!: string;
  public userId!: string;
  public productId!: string;
  public orderId?: string;
  public rating!: number;
  public title!: string;
  public content!: string;
  public comment?: string;
  public images?: string[];
  public verified!: boolean;
  public isVerifiedPurchase!: boolean;
  public helpful!: number;
  public notHelpful!: number;
  public helpfulCount!: number;
  public status!: "pending" | "approved" | "rejected" | "reported";
  public moderatorNote?: string;
  public moderatedBy?: string;
  public moderatedAt?: Date;
  public reportReason?: string;
  public reportDetails?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: any;
  public readonly product?: any;
  public readonly order?: any;
}

Review.init(
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
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "orders",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 200],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 5000],
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    images: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isVerifiedPurchase: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    helpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    notHelpful: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    helpfulCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected", "reported"),
      defaultValue: "pending",
    },
    moderatorNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    moderatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    moderatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reportReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reportDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
    timestamps: true,
    indexes: [
      { fields: ["productId"] },
      { fields: ["userId"] },
      { fields: ["rating"] },
      { fields: ["status"] },
      { fields: ["verified"] },
      { fields: ["createdAt"] },
    ],
  }
);
