import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface CouponAttributes {
  id: string;
  creatorId?: string; // null for admin/system coupons
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed_amount" | "free_shipping";
  value: number; // percentage or fixed amount
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usageCount: number;
  perUserLimit?: number;
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  applicableProducts?: string[]; // Product IDs
  applicableCategories?: string[]; // Category IDs
  createdAt: Date;
  updatedAt: Date;
}

interface CouponCreationAttributes extends Optional<
  CouponAttributes,
  "id" | "createdAt" | "updatedAt" | "usageCount" | "isActive"
> {}

export class Coupon
  extends Model<CouponAttributes, CouponCreationAttributes>
  implements CouponAttributes
{
  public id!: string;
  public creatorId?: string;
  public code!: string;
  public name!: string;
  public description?: string;
  public type!: "percentage" | "fixed_amount" | "free_shipping";
  public value!: number;
  public minimumOrderAmount?: number;
  public maximumDiscountAmount?: number;
  public usageLimit?: number;
  public usageCount!: number;
  public perUserLimit?: number;
  public validFrom!: Date;
  public validTo!: Date;
  public isActive!: boolean;
  public applicableProducts?: string[];
  public applicableCategories?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly creator?: any;
  public readonly usages?: any[];
}

Coupon.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("percentage", "fixed_amount", "free_shipping"),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    minimumOrderAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    maximumDiscountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    usageLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    usageCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    perUserLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    applicableProducts: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    applicableCategories: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
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
    modelName: "Coupon",
    tableName: "coupons",
    timestamps: true,
    indexes: [
      { fields: ["creator_id"] },
      { fields: ["code"] },
      { fields: ["type"] },
      { fields: ["is_active"] },
      { fields: ["valid_from", "valid_to"] },
    ],
  },
);

// Coupon Usage Model
interface CouponUsageAttributes {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface CouponUsageCreationAttributes extends Optional<
  CouponUsageAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

export class CouponUsage
  extends Model<CouponUsageAttributes, CouponUsageCreationAttributes>
  implements CouponUsageAttributes
{
  public id!: string;
  public couponId!: string;
  public userId!: string;
  public orderId!: string;
  public discountAmount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly coupon?: any;
  public readonly user?: any;
  public readonly order?: any;
}

CouponUsage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    couponId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "coupons",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    discountAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    modelName: "CouponUsage",
    tableName: "coupon_usages",
    timestamps: true,
    indexes: [
      { fields: ["coupon_id"] },
      { fields: ["user_id"] },
      { fields: ["order_id"] },
    ],
  },
);
