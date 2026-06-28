import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";

interface UserPreferencesAttributes {
  id: string;
  userId: string;
  newsletter: boolean;
  smsNotifications: boolean;
  emailNotifications: boolean;
  theme: "light" | "dark" | "auto";
  currency: string;
  language: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserPreferencesCreationAttributes
  extends Optional<
    UserPreferencesAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

class UserPreferences
  extends Model<UserPreferencesAttributes, UserPreferencesCreationAttributes>
  implements UserPreferencesAttributes
{
  public id!: string;
  public userId!: string;
  public newsletter!: boolean;
  public smsNotifications!: boolean;
  public emailNotifications!: boolean;
  public theme!: "light" | "dark" | "auto";
  public currency!: string;
  public language!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

UserPreferences.init(
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
    newsletter: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    smsNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    emailNotifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    theme: {
      type: DataTypes.ENUM("light", "dark", "auto"),
      defaultValue: "light",
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
    language: {
      type: DataTypes.STRING(2),
      defaultValue: "en",
    },
  },
  {
    sequelize,
    tableName: "user_preferences",
  }
);

export {
  UserPreferences,
  UserPreferencesAttributes,
  UserPreferencesCreationAttributes,
};
