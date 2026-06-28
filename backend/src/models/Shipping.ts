import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

interface ShippingZoneAttributes {
  id: string;
  creatorId: string;
  name: string;
  regions: string[]; // Array of country codes or regions
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ShippingZoneCreationAttributes extends Optional<
  ShippingZoneAttributes,
  "id" | "createdAt" | "updatedAt" | "isActive"
> {}

export class ShippingZone
  extends Model<ShippingZoneAttributes, ShippingZoneCreationAttributes>
  implements ShippingZoneAttributes
{
  public id!: string;
  public creatorId!: string;
  public name!: string;
  public regions!: string[];
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly creator?: any;
  public readonly rates?: any[];
}

ShippingZone.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    regions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "ShippingZone",
    tableName: "shipping_zones",
    timestamps: true,
    indexes: [{ fields: ["creator_id"] }, { fields: ["is_active"] }],
  },
);

// Shipping Rate Model
interface ShippingRateAttributes {
  id: string;
  zoneId: string;
  name: string;
  description?: string;
  type: "flat_rate" | "weight_based" | "price_based";
  basePrice: number;
  freeShippingThreshold?: number;
  estimatedDays: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ShippingRateCreationAttributes extends Optional<
  ShippingRateAttributes,
  "id" | "createdAt" | "updatedAt" | "isActive"
> {}

export class ShippingRate
  extends Model<ShippingRateAttributes, ShippingRateCreationAttributes>
  implements ShippingRateAttributes
{
  public id!: string;
  public zoneId!: string;
  public name!: string;
  public description?: string;
  public type!: "flat_rate" | "weight_based" | "price_based";
  public basePrice!: number;
  public freeShippingThreshold?: number;
  public estimatedDays!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public readonly zone?: any;
}

ShippingRate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    zoneId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "shipping_zones",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
      type: DataTypes.ENUM("flat_rate", "weight_based", "price_based"),
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    freeShippingThreshold: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    estimatedDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    modelName: "ShippingRate",
    tableName: "shipping_rates",
    timestamps: true,
    indexes: [
      { fields: ["zone_id"] },
      { fields: ["type"] },
      { fields: ["is_active"] },
    ],
  },
);
