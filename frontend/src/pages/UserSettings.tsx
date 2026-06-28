import { useState, useRef } from "react";
import {
  Settings,
  Bell,
  Mail,
  Globe,
  Moon,
  Sun,
  Monitor,
  Shield,
  Eye,
  Package,
  Heart,
  Star,
} from "lucide-react";
// import { useTheme } from "../contexts/ThemeContext";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

interface NotificationSettings {
  emailMarketing: boolean;
  orderUpdates: boolean;
  priceAlerts: boolean;
  newProducts: boolean;
  securityAlerts: boolean;
  newsletter: boolean;
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends";
  showPurchases: boolean;
  showWishlist: boolean;
  allowMessages: boolean;
  allowReviews: boolean;
}

interface CommunicationSettings {
  preferredLanguage: string;
  currency: string;
  timezone: string;
}

const UserSettings = () => {
  // const { theme, setTheme } = useTheme();
  const defaultNotifications: NotificationSettings = {
    emailMarketing: false,
    orderUpdates: true,
    priceAlerts: true,
    newProducts: false,
    securityAlerts: true,
    newsletter: false,
  };

  const defaultPrivacy: PrivacySettings = {
    profileVisibility: "private",
    showPurchases: false,
    showWishlist: true,
    allowMessages: true,
    allowReviews: true,
  };

  const defaultCommunication: CommunicationSettings = {
    preferredLanguage: "en",
    currency: "USD",
    timezone: "America/New_York",
  };

  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy);
  const [communication, setCommunication] = useState<CommunicationSettings>(defaultCommunication);

  // Refs to track saved settings (simulate persisted state)
  const savedNotificationsRef = useRef<NotificationSettings>(defaultNotifications);
  const savedPrivacyRef = useRef<PrivacySettings>(defaultPrivacy);
  const savedCommunicationRef = useRef<CommunicationSettings>(defaultCommunication);

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacy((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCommunicationChange = (
    key: keyof CommunicationSettings,
    value: string
  ) => {
    setCommunication((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Determine if any settings have changed compared to saved values
  const isSettingsDirty =
    JSON.stringify(notifications) !== JSON.stringify(savedNotificationsRef.current) ||
    JSON.stringify(privacy) !== JSON.stringify(savedPrivacyRef.current) ||
    JSON.stringify(communication) !== JSON.stringify(savedCommunicationRef.current);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your account preferences and privacy settings
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-secondary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Customize how the interface looks and feels
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                // onClick={() => setTheme(option.value as any)}
                // className={`flex flex-col items-center p-4 border-2 rounded-lg transition-colors ${
                //   // theme === option.value
                //   //   ? "border-secondary-500 bg-secondary-50 dark:bg-secondary-900/20"
                //   //   : "border-gray-200 hover:border-gray-300 dark:border-gray-700"
                // }`}
                className="flex flex-col items-center p-4 border-2 rounded-lg transition-colors"
              >
                <option.icon
                  // className={`w-6 h-6 mb-2 
                  //   ${theme === option.value ? "text-secondary-600" : "text-gray-600"}`}
                  className="w-6 h-6 mb-2"
                />
                <span
                  // className={`text-sm font-medium ${
                  //   theme === option.value
                  //     ? "text-secondary-600 dark:text-secondary-400"
                  //     : "text-gray-700 dark:text-gray-300"
                  // }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Choose what notifications you want to receive
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            {
              key: "orderUpdates" as keyof NotificationSettings,
              label: "Order Updates",
              description: "Get notified about your order status changes",
              icon: Package,
            },
            {
              key: "priceAlerts" as keyof NotificationSettings,
              label: "Price Alerts",
              description:
                "Receive alerts when items in your wishlist go on sale",
              icon: Heart,
            },
            {
              key: "newProducts" as keyof NotificationSettings,
              label: "New Products",
              description: "Be the first to know about new product launches",
              icon: Star,
            },
            {
              key: "securityAlerts" as keyof NotificationSettings,
              label: "Security Alerts",
              description:
                "Important security notifications about your account",
              icon: Shield,
            },
            {
              key: "emailMarketing" as keyof NotificationSettings,
              label: "Marketing Emails",
              description: "Promotional offers, deals, and marketing content",
              icon: Mail,
            },
            {
              key: "newsletter" as keyof NotificationSettings,
              label: "Newsletter",
              description: "Weekly newsletter with trending products and tips",
              icon: Mail,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationChange(item.key)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 dark:peer-focus:ring-secondary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Privacy & Visibility
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Control who can see your information and activities
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Visibility
            </label>
            <select
              value={privacy.profileVisibility}
              onChange={(e) =>
                handlePrivacyChange("profileVisibility", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="public">
                Public - Anyone can view your profile
              </option>
              <option value="private">
                Private - Only you can see your profile
              </option>
              <option value="friends">
                Friends - Only your connections can see
              </option>
            </select>
          </div>

          <div className="space-y-4">
            {[
              {
                key: "showPurchases" as keyof PrivacySettings,
                label: "Show Purchase History",
                description: "Allow others to see what you've purchased",
              },
              {
                key: "showWishlist" as keyof PrivacySettings,
                label: "Show Wishlist",
                description: "Make your wishlist visible to others",
              },
              {
                key: "allowMessages" as keyof PrivacySettings,
                label: "Allow Messages",
                description: "Let other users send you messages",
              },
              {
                key: "allowReviews" as keyof PrivacySettings,
                label: "Show My Reviews",
                description: "Display reviews you've written publicly",
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[item.key] as boolean}
                    onChange={(e) =>
                      handlePrivacyChange(item.key, e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary-300 dark:peer-focus:ring-secondary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-secondary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Communication Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <Globe className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Language & Region
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set your preferred language, currency, and timezone
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={communication.preferredLanguage}
              onChange={(e) =>
                handleCommunicationChange("preferredLanguage", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={communication.currency}
              onChange={(e) =>
                handleCommunicationChange("currency", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={communication.timezone}
              onChange={(e) =>
                handleCommunicationChange("timezone", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
              <option value="Asia/Shanghai">Shanghai (CST)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Save Settings */}
      <div className="flex justify-end">
        {isSettingsDirty ? (
          <Button
            onClick={() => {
              // Simulate save: update saved refs and show feedback
              savedNotificationsRef.current = { ...notifications };
              savedPrivacyRef.current = { ...privacy };
              savedCommunicationRef.current = { ...communication };
              alert("Settings saved successfully!");
            }}
          >
            Save Changes
          </Button>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 py-2 animate-pulse">
            ↑ Make changes to enable Save
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSettings;
