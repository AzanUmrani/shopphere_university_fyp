import { useEffect, useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SecuritySession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  browser: string;
  ip: string;
}

const UserSecurity = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState<SecuritySession[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PasswordChangeForm>();

  const currentPasswordValue = watch("currentPassword");
  const newPasswordValue = watch("newPassword");
  const confirmPasswordValue = watch("confirmPassword");

  // Check if form is complete
  const isPasswordFormComplete =
    currentPasswordValue?.trim() &&
    newPasswordValue?.trim() &&
    confirmPasswordValue?.trim() &&
    newPasswordValue === confirmPasswordValue;

  const handlePasswordChange = async (data: PasswordChangeForm) => {
    console.log("Changing password with data:", data);
    setIsChangingPassword(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Reset form and show success message
      reset();
      alert("Password changed successfully!");
    } catch (error) {
      alert("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setTwoFactorEnabled(!twoFactorEnabled);
      // Here you would integrate with your 2FA service
      alert(
        `Two-factor authentication ${
          !twoFactorEnabled ? "enabled" : "disabled"
        }`,
      );
    } catch (error) {
      alert("Failed to update two-factor authentication");
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
  };

  // Mock sessions data
  useEffect(() => {
    setSessions([
      {
        id: "1",
        device: "MacBook Pro",
        location: "New York, NY",
        lastActive: "2 minutes ago",
        current: true,
        browser: "Chrome 120.0",
        ip: "192.168.1.100",
      },
      {
        id: "2",
        device: "iPhone 15",
        location: "New York, NY",
        lastActive: "1 hour ago",
        current: false,
        browser: "Safari Mobile",
        ip: "192.168.1.101",
      },
      {
        id: "3",
        device: "Windows PC",
        location: "Los Angeles, CA",
        lastActive: "3 days ago",
        current: false,
        browser: "Firefox 118.0",
        ip: "10.0.0.50",
      },
    ]);
  }, []);

  const getPasswordStrength = (password: string) => {
    if (!password)
      return { strength: 0, label: "Enter password", color: "gray" };

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "red" },
      { strength: 1, label: "Weak", color: "red" },
      { strength: 2, label: "Fair", color: "yellow" },
      { strength: 3, label: "Good", color: "blue" },
      { strength: 4, label: "Strong", color: "green" },
      { strength: 5, label: "Very Strong", color: "green" },
    ];

    return levels[score];
  };

  const passwordStrength = getPasswordStrength(newPasswordValue || "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Security Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your account security and privacy settings
        </p>
      </div>

      {/* Password Change Section */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Change Password
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update your password to keep your account secure
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(handlePasswordChange)}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showCurrentPassword ? "text" : "password"}
                {...register("currentPassword", {
                  required: "Current password is required",
                })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {newPasswordValue && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                      style={{
                        width: `${(passwordStrength.strength / 5) * 100}%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium text-${passwordStrength.color}-600`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPasswordValue || "Passwords do not match",
                })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            {isPasswordFormComplete ? (
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-gradient-to-r from-secondary-500 to-pink-500 hover:from-secondary-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all"
              >
                {isChangingPassword
                  ? "Changing Password..."
                  : "Change Password"}
              </Button>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 py-2 animate-pulse">
                ↑ Fill all fields to continue
              </div>
            )}
          </div>
        </form>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Two-Factor Authentication
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {twoFactorEnabled ? (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Enabled</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">Disabled</span>
              </div>
            )}
            <Button
              variant={twoFactorEnabled ? "outline" : "primary"}
              onClick={handleToggle2FA}
            >
              {twoFactorEnabled ? "Disable" : "Enable"} 2FA
            </Button>
          </div>
        </div>
      </Card>

      {/* Login Sessions */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Active Sessions
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage devices that are signed into your account
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  {session.device.includes("iPhone") ||
                  session.device.includes("iPad") ? (
                    <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {session.device}
                    </h3>
                    {session.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      {session.browser} • {session.location}
                    </p>
                    <p className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Last active {session.lastActive}</span>
                    </p>
                  </div>
                </div>
              </div>
              {!session.current && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleRevokeSession(session.id)}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Security Recommendations */}
      <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Security Recommendations
            </h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Use a strong, unique password for your account</li>
              <li>• Enable two-factor authentication for extra security</li>
              <li>• Regularly review your active sessions</li>
              <li>• Don't share your login credentials with others</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserSecurity;
