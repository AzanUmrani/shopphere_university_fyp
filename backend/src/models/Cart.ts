import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface CartAttributes {
  id: string;
  userId?: string;
  sessionId?: string; // For guest carts
  createdAt: Date;
  updatedAt: Date;
}

interface CartCreationAttributes extends Optional<
  CartAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

export class Cart
  extends Model<CartAttributes, CartCreationAttributes>
  implements CartAttributes
{
  public id!: string;
  public userId?: string;
  public sessionId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: any;
  public readonly items?: any[];
}

Cart.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true, // Allow null for guest carts
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    sessionId: {
      type: DataTypes.STRING,
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
    modelName: "Cart",
    tableName: "carts",
    timestamps: true,
    indexes: [{ fields: ["user_id"] }, { fields: ["session_id"] }],
  },
);

// Cart Item Model
interface CartItemAttributes {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  variantData?: any; // Size, color, etc.
  createdAt: Date;
  updatedAt: Date;
}

interface CartItemCreationAttributes extends Optional<
  CartItemAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

export class CartItem
  extends Model<CartItemAttributes, CartItemCreationAttributes>
  implements CartItemAttributes
{
  public id!: string;
  public cartId!: string;
  public productId!: string;
  public quantity!: number;
  public variantData?: any;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly cart?: any;
  public readonly product?: any;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "carts",
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    variantData: {
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
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: true,
    indexes: [
      { fields: ["cart_id"] },
      { fields: ["product_id"] },
      {
        fields: ["cart_id", "product_id"],
        unique: true,
        name: "unique_cart_product",
      },
    ],
  },
);
