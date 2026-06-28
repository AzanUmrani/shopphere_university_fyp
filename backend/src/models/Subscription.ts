import { DataTypes, Model, Optional, Op } from "sequelize";
import { sequelize } from "@/config/database";

interface SubscriptionAttributes {
  id: string;
  userId: string;
  creatorId: string;
  planId: string;
  status: "active" | "inactive" | "cancelled" | "expired" | "pending";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  amount: number;
  currency: string;
  interval: "monthly" | "yearly" | "weekly";
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  cancelledAt?: Date;
  cancelAtPeriodEnd: boolean;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SubscriptionCreationAttributes extends Optional<
  SubscriptionAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionCreationAttributes>
  implements SubscriptionAttributes
{
  public id!: string;
  public userId!: string;
  public creatorId!: string;
  public planId!: string;
  public status!: "active" | "inactive" | "cancelled" | "expired" | "pending";
  public currentPeriodStart!: Date;
  public currentPeriodEnd!: Date;
  public amount!: number;
  public currency!: string;
  public interval!: "monthly" | "yearly" | "weekly";
  public stripeSubscriptionId?: string;
  public stripeCustomerId?: string;
  public cancelledAt?: Date;
  public cancelAtPeriodEnd!: boolean;
  public metadata?: Record<string, any>;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public isActive(): boolean {
    return this.status === "active" && new Date() < this.currentPeriodEnd;
  }

  public daysRemaining(): number {
    const now = new Date();
    const diff = this.currentPeriodEnd.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  public toJSON(): object {
    const values = Object.assign({}, this.get());
    return {
      ...values,
      isActive: this.isActive(),
      daysRemaining: this.daysRemaining(),
    };
  }
}

Subscription.init(
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
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    planId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "subscription_plans",
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM(
        "active",
        "inactive",
        "cancelled",
        "expired",
        "pending",
      ),
      allowNull: false,
      defaultValue: "pending",
    },
    currentPeriodStart: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    currentPeriodEnd: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
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
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cancelAtPeriodEnd: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "subscriptions",
    timestamps: true,
    indexes: [
      {
        fields: ["user_id"],
      },
      {
        fields: ["creator_id"],
      },
      {
        fields: ["status"],
      },
      {
        fields: ["stripe_subscription_id"],
        unique: true,
      },
    ],
  },
);

export { Subscription };
