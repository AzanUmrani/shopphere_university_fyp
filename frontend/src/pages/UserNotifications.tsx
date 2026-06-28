import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  Heart,
  Tag,
  MessageCircle,
  Check,
  Trash2,
  Filter,
  Clock,
  Star,
  AlertCircle,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Simple time ago helper
const timeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { name: "year", seconds: 31536000 },
    { name: "month", seconds: 2592000 },
    { name: "week", seconds: 604800 },
    { name: "day", seconds: 86400 },
    { name: "hour", seconds: 3600 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const interval = Math.floor(diffInSeconds / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.name}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

interface Notification {
  id: string;
  type: "order" | "wishlist" | "promotion" | "message" | "review" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  priority: "low" | "medium" | "high";
}

const UserNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<
    "all" | "unread" | "order" | "promotion"
  >("all");
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );

  useEffect(() => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "order",
        title: "Order Shipped",
        message:
          "Your order #ORD-2025-001234 has been shipped and is on its way!",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionUrl: "/user/orders/1",
        actionText: "Track Order",
        priority: "high",
      },
      {
        id: "2",
        type: "wishlist",
        title: "Price Drop Alert",
        message:
          "Great news! The Premium Headphones in your wishlist is now 20% off.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: false,
        actionUrl: "/products/123",
        actionText: "View Product",
        priority: "medium",
      },
      {
        id: "3",
        type: "promotion",
        title: "Weekend Sale",
        message:
          "Don't miss our weekend flash sale! Up to 50% off on selected items.",
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        read: true,
        actionUrl: "/products?sale=true",
        actionText: "Shop Now",
        priority: "medium",
      },
      {
        id: "4",
        type: "message",
        title: "New Message",
        message:
          "You have a new message from the seller about your recent purchase.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: false,
        actionUrl: "/user/messages",
        actionText: "Read Message",
        priority: "medium",
      },
      {
        id: "5",
        type: "review",
        title: "Review Reminder",
        message:
          "How was your recent purchase? Share your experience with other customers.",
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
        read: true,
        actionUrl: "/user/reviews",
        actionText: "Write Review",
        priority: "low",
      },
      {
        id: "6",
        type: "system",
        title: "Security Alert",
        message: "New login detected from Windows PC in Los Angeles, CA.",
        timestamp: new Date(Date.now() - 72 * 60 * 60 * 1000), // 3 days ago
        read: true,
        actionUrl: "/user/security",
        actionText: "Review Activity",
        priority: "high",
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getFilteredNotifications = () => {
    let filtered = notifications;

    switch (filter) {
      case "unread":
        filtered = notifications.filter((n) => !n.read);
        break;
      case "order":
        filtered = notifications.filter((n) => n.type === "order");
        break;
      case "promotion":
        filtered = notifications.filter((n) => n.type === "promotion");
        break;
      default:
        break;
    }

    return filtered.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    setSelectedNotifications(
      selectedNotifications.filter((id) => id !== notificationId)
    );
  };

  const handleBulkDelete = () => {
    setNotifications(
      notifications.filter((n) => !selectedNotifications.includes(n.id))
    );
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(notificationId)
        ? prev.filter((id) => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-primary-600" />;
      case "wishlist":
        return <Heart className="w-5 h-5 text-pink-600" />;
      case "promotion":
        return <Tag className="w-5 h-5 text-green-600" />;
      case "message":
        return <MessageCircle className="w-5 h-5 text-secondary-600" />;
      case "review":
        return <Star className="w-5 h-5 text-yellow-600" />;
      case "system":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Notification["priority"]) => {
    switch (priority) {
      case "high":
        return "border-l-red-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-gray-300";
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${
                  unreadCount > 1 ? "s" : ""
                }`
              : "You're all caught up!"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          {selectedNotifications.length > 0 && (
            <Button variant="outline" onClick={handleBulkDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected ({selectedNotifications.length})
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter:
            </span>
            <div className="flex space-x-2">
              {[
                { key: "all", label: "All" },
                { key: "unread", label: "Unread" },
                { key: "order", label: "Orders" },
                { key: "promotion", label: "Promotions" },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setFilter(item.key as typeof filter)}
                  className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                    filter === item.key
                      ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {filteredNotifications.length} notification
            {filteredNotifications.length > 1 ? "s" : ""}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === "all"
                ? "You don't have any notifications yet."
                : `No ${filter} notifications found.`}
            </p>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all duration-200 border-l-4 ${getPriorityColor(
                notification.priority
              )} ${
                notification.read
                  ? "bg-white dark:bg-gray-800"
                  : "bg-primary-50 dark:bg-primary-900/20"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedNotifications.includes(notification.id)}
                    onChange={() => handleSelectNotification(notification.id)}
                    className="w-4 h-4 text-secondary-600 rounded focus:ring-secondary-500"
                  />
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3
                          className={`font-semibold ${
                            notification.read
                              ? "text-gray-900 dark:text-white"
                              : "text-primary-900 dark:text-primary-100"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{timeAgo(notification.timestamp)}</span>
                        </span>
                        <span className="capitalize">{notification.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {notification.actionUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (!notification.read) {
                              handleMarkAsRead(notification.id);
                            }
                            // Navigate to actionUrl
                            window.location.href = notification.actionUrl!;
                          }}
                        >
                          {notification.actionText}
                        </Button>
                      )}

                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(notification.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Empty State for filtered results */}
      {filteredNotifications.length === 0 && filter !== "all" && (
        <div className="text-center py-8">
          <Button variant="outline" onClick={() => setFilter("all")}>
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
