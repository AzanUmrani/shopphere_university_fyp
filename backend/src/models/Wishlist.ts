import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface WishlistAttributes {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface WishlistCreationAttributes extends Optional<
  WishlistAttributes,
  "id" | "createdAt" | "updatedAt" | "addedAt"
> {}

export class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
  public id!: string;
  public userId!: string;
  public productId!: string;
  public addedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly user?: any;
  public readonly product?: any;
}

Wishlist.init(
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
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
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
    modelName: "Wishlist",
    tableName: "wishlists",
    timestamps: true,
    indexes: [
      { fields: ["user_id"] },
      { fields: ["product_id"] },
      { fields: ["added_at"] },
      {
        fields: ["user_id", "product_id"],
        unique: true,
        name: "unique_user_product_wishlist",
      },
    ],
  },
);
