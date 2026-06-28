import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface ProductAttributes {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  sku: string;
  categoryId: string;
  creatorId?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  tags: string[];
  features: string[];
  specifications?: Record<string, string>;
  discount?: number;
  isNew: boolean;
  isFeatured: boolean;
  isActive: boolean;
  isDigital: boolean;
  downloadUrl?: string;
  digitalFileSize?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  metaTitle?: string;
  metaDescription?: string;
  viewCount: number;
  salesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, "id" | "createdAt" | "updatedAt"> {}

class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
  public id!: string;
  public name!: string;
  public description!: string;
  public price!: number;
  public originalPrice?: number;
  public sku!: string;
  public categoryId!: string;
  public creatorId?: string;
  public brand!: string;
  public rating!: number;
  public reviewCount!: number;
  public inStock!: boolean;
  public stockQuantity!: number;
  public tags!: string[];
  public features!: string[];
  public specifications?: Record<string, string>;
  public discount?: number;
  public isNew!: boolean;
  public isFeatured!: boolean;
  public isActive!: boolean;
  public isDigital!: boolean;
  public downloadUrl?: string;
  public digitalFileSize?: number;
  public weight?: number;
  public dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  public metaTitle?: string;
  public metaDescription?: string;
  public viewCount!: number;
  public salesCount!: number;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public getDiscountedPrice(): number {
    if (this.discount && this.discount > 0) {
      return this.price * (1 - this.discount / 100);
    }
    return this.price;
  }

  public incrementView(): Promise<this> {
    this.viewCount += 1;
    return this.save();
  }

  public incrementSales(quantity: number = 1): Promise<this> {
    this.salesCount += quantity;
    if (!this.isDigital) {
      this.stockQuantity = Math.max(0, this.stockQuantity - quantity);
      this.inStock = this.stockQuantity > 0;
    }
    return this.save();
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return {
      ...values,
      discountedPrice: this.getDiscountedPrice(),
    };
  }
}

Product.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    originalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "category_id", // Map to database column
      references: {
        model: "categories",
        key: "id",
      },
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: "creator_id", // Map to database column
      references: {
        model: "users",
        key: "id",
      },
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    inStock: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    stockQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    features: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    specifications: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100,
      },
    },
    isNew: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    weight: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    dimensions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isDigital: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    downloadUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    digitalFileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    salesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    tableName: "products",
    indexes: [
      { fields: ["category_id"] },
      { fields: ["creator_id"] },
      { fields: ["sku"] },
      { fields: ["brand"] },
      { fields: ["price"] },
      { fields: ["rating"] },
      { fields: ["is_active"] },
      { fields: ["is_featured"] },
      { fields: ["is_new"] },
      { fields: ["in_stock"] },
    ],
  }
);

export { Product, ProductAttributes, ProductCreationAttributes };
