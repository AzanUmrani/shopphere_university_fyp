import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface PaymentMethodAttributes {
  id: string;
  userId: string;
  type: "card" | "paypal" | "bank_transfer" | "wallet";
  provider: string; // Stripe, PayPal, etc.
  providerPaymentMethodId: string; // External payment method ID
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  isDefault: boolean;
  isActive: boolean;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentMethodCreationAttributes extends Optional<
  PaymentMethodAttributes,
  "id" | "createdAt" | "updatedAt" | "isDefault" | "isActive"
> {}

export class PaymentMethod
  extends Model<PaymentMethodAttributes, PaymentMethodCreationAttributes>
  implements PaymentMethodAttributes
{
  public id!: string;
  public userId!: string;
  public type!: "card" | "paypal" | "bank_transfer" | "wallet";
  public provider!: string;
  public providerPaymentMethodId!: string;
  public cardLast4?: string;
  public cardBrand?: string;
  public cardExpMonth?: number;
  public cardExpYear?: number;
  public isDefault!: boolean;
  public isActive!: boolean;
  public metadata?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: any;
}

PaymentMethod.init(
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
      type: DataTypes.ENUM("card", "paypal", "bank_transfer", "wallet"),
      allowNull: false,
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    providerPaymentMethodId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cardLast4: {
      type: DataTypes.STRING(4),
      allowNull: true,
    },
    cardBrand: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cardExpMonth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 12,
      },
    },
    cardExpYear: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    metadata: {
      type: DataTypes.JSON,
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
    modelName: "PaymentMethod",
    tableName: "payment_methods",
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["type"] },
      { fields: ["provider"] },
      { fields: ["is_default"] },
      { fields: ["is_active"] },
    ],
  },
);
