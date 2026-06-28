import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface ProductImageAttributes {
  id: string;
  productId: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductImageCreationAttributes
  extends Optional<
    ProductImageAttributes,
    "id" | "altText" | "isPrimary" | "sortOrder" | "createdAt" | "updatedAt"
  > {}

class ProductImage
  extends Model<ProductImageAttributes, ProductImageCreationAttributes>
  implements ProductImageAttributes
{
  public id!: string;
  public productId!: string;
  public imageUrl!: string;
  public altText?: string;
  public isPrimary!: boolean;
  public sortOrder!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    imageUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    altText: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: "product_images",
    indexes: [
      { fields: ["product_id"] },
      { fields: ["is_primary"] },
      { fields: ["sort_order"] },
    ],
  }
);

export { ProductImage, ProductImageAttributes, ProductImageCreationAttributes };
