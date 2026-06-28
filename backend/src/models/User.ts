import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "@/config/database";
import bcrypt from "bcrypt";

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: "user" | "admin" | "creator";
  isActive: boolean;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  lastLoginAt?: Date;
  stripeCustomerId?: string;
  tempOnboardingData?: any;
  // OAuth fields
  googleId?: string | null;
  googleEmail?: string | null;
  googleName?: string | null;
  googleAvatar?: string | null;
  oauthProvider?: "google" | "local" | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<
  UserAttributes,
  "id" | "createdAt" | "updatedAt"
> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public phone?: string;
  public avatar?: string;
  public role!: "user" | "admin" | "creator";
  public isActive!: boolean;
  public isEmailVerified!: boolean;
  public emailVerificationToken?: string | null;
  public passwordResetToken?: string | null;
  public passwordResetExpires?: Date | null;
  public lastLoginAt?: Date;
  public stripeCustomerId?: string;
  public tempOnboardingData?: any;
  // OAuth fields
  public googleId?: string | null;
  public googleEmail?: string | null;
  public googleName?: string | null;
  public googleAvatar?: string | null;
  public oauthProvider?: "google" | "local" | null;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance methods
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public toJSON(): any {
    const values = { ...this.get() } as any;
    delete values.password;
    delete values.emailVerificationToken;
    delete values.passwordResetToken;
    delete values.passwordResetExpires;
    return values;
  }

  // Static methods
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || "12");
    return bcrypt.hash(password, saltRounds);
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 100],
      },
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "creator"),
      allowNull: false,
      defaultValue: "user",
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    tempOnboardingData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    // OAuth fields
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true,
    },
    googleEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    googleName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    googleAvatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    oauthProvider: {
      type: DataTypes.ENUM("google", "local"),
      allowNull: true,
      defaultValue: "local",
    },
  },
  {
    sequelize,
    tableName: "users",
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          user.password = await User.hashPassword(user.password);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password") && user.password) {
          user.password = await User.hashPassword(user.password);
        }
      },
    },
  },
);

export { User, UserAttributes, UserCreationAttributes };
