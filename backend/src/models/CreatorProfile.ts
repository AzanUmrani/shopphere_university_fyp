import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface CreatorProfileAttributes {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string;
  businessType: string;
  businessEmail?: string;
  businessPhone?: string;
  businessWebsite?: string;
  businessLogo?: string;
  businessBanner?: string;
  businessAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  taxId?: string;
  bankAccount?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  isVerified: boolean;
  isActive: boolean;
  rating: number;
  totalSales: number;
  totalProducts: number;
  totalEarnings: number;
  commissionRate: number;
  joinedAt: Date;
  lastActiveAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CreatorProfileCreationAttributes
  extends Optional<
    CreatorProfileAttributes,
    | "id"
    | "businessDescription"
    | "businessEmail"
    | "businessPhone"
    | "businessWebsite"
    | "businessLogo"
    | "businessBanner"
    | "businessAddress"
    | "taxId"
    | "bankAccount"
    | "socialMedia"
    | "isVerified"
    | "isActive"
    | "rating"
    | "totalSales"
    | "totalProducts"
    | "totalEarnings"
    | "lastActiveAt"
    | "createdAt"
    | "updatedAt"
  > {}

class CreatorProfile
  extends Model<CreatorProfileAttributes, CreatorProfileCreationAttributes>
  implements CreatorProfileAttributes
{
  public id!: string;
  public userId!: string;
  public businessName!: string;
  public businessDescription?: string;
  public businessType!: string;
  public businessEmail?: string;
  public businessPhone?: string;
  public businessWebsite?: string;
  public businessLogo?: string;
  public businessBanner?: string;
  public businessAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  public taxId?: string;
  public bankAccount?: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    routingNumber: string;
  };
  public socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
  };
  public isVerified!: boolean;
  public isActive!: boolean;
  public rating!: number;
  public totalSales!: number;
  public totalProducts!: number;
  public totalEarnings!: number;
  public commissionRate!: number;
  public joinedAt!: Date;
  public lastActiveAt?: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

CreatorProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    businessName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    businessDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    businessType: {
      type: DataTypes.ENUM(
        "individual",
        "small_business",
        "corporation",
        "non_profit",
        "other"
      ),
      allowNull: false,
    },
    businessEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    businessPhone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    businessWebsite: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    businessLogo: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    businessBanner: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    businessAddress: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    taxId: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bankAccount: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    socialMedia: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate: {
        min: 0,
        max: 5,
      },
    },
    totalSales: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    totalProducts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    totalEarnings: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 15.0, // Default 15% commission
      validate: {
        min: 0,
        max: 100,
      },
    },
    joinedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "creator_profiles",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["is_verified"] },
      { fields: ["is_active"] },
      { fields: ["business_type"] },
      { fields: ["rating"] },
      { fields: ["total_sales"] },
      { fields: ["joined_at"] },
    ],
  }
);

export {
  CreatorProfile,
  CreatorProfileAttributes,
  CreatorProfileCreationAttributes,
};
