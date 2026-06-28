import { DataTypes, Model, Optional, Op } from "sequelize";
import { sequelize } from "@/config/database";

interface SubscriptionPlanAttributes {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: "monthly" | "yearly" | "weekly";
  duration: "monthly" | "yearly";
  stripePriceId?: string;
  stripeProductId?: string;
  features: string[];
  isActive: boolean;
  maxSubscribers?: number | null;
  currentSubscribers: number;
  subscriberCount: number;
  trialDays?: number;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubscriptionPlanCreationAttributes extends Optional<
  SubscriptionPlanAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class SubscriptionPlan
  extends Model<SubscriptionPlanAttributes, SubscriptionPlanCreationAttributes>
  implements SubscriptionPlanAttributes
{
  public id!: string;
  public creatorId!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public currency!: string;
  public interval!: "monthly" | "yearly" | "weekly";
  public duration!: "monthly" | "yearly";
  public stripePriceId?: string;
  public stripeProductId?: string;
  public features!: string[];
  public isActive!: boolean;
  public maxSubscribers?: number | null;
  public currentSubscribers!: number;
  public subscriberCount!: number;
  public trialDays?: number;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public hasAvailableSlots(): boolean {
    if (!this.maxSubscribers) return true;
    return this.currentSubscribers < this.maxSubscribers;
  }

  public getFormattedPrice(): string {
    const price = this.price.toFixed(2);
    const intervalMap = {
      monthly: "month",
      yearly: "year",
      weekly: "week",
    };
    return `${this.currency.toUpperCase()} ${price}/${
      intervalMap[this.interval]
    }`;
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return {
      ...values,
      formattedPrice: this.getFormattedPrice(),
      hasAvailableSlots: this.hasAvailableSlots(),
    };
  }
}

SubscriptionPlan.init(
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
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: false,
      defaultValue: "USD",
    },
    interval: {
      type: DataTypes.ENUM("monthly", "yearly", "weekly"),
      allowNull: false,
      defaultValue: "monthly",
    },
    duration: {
      type: DataTypes.ENUM("monthly", "yearly"),
      allowNull: false,
      defaultValue: "monthly",
    },
    stripePriceId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    stripeProductId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    features: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    maxSubscribers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
      },
    },
    currentSubscribers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    subscriberCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    trialDays: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 365,
      },
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "subscription_plans",
    timestamps: true,
    indexes: [
      {
        fields: ["creator_id"],
      },
      {
        fields: ["is_active"],
      },
      {
        fields: ["stripe_price_id"],
        unique: true,
      },
    ],
  },
);

export { SubscriptionPlan };
