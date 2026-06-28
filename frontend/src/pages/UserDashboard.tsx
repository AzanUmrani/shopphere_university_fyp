import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Heart,
  Star,
  MessageCircle,
  ArrowRight,
  Calendar,
  DollarSign,
  Clock,
} from "lucide-react";
import { useAppSelector } from "../hooks/redux";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  wishlistItems: number;
  totalSpent: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    date: string;
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    items: number;
  }>;
  recommendations: Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
  }>;
}

const UserDashboard = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    activeOrders: 0,
    wishlistItems: 0,
    totalSpent: 0,
    recentOrders: [],
    recommendations: [],
  });

  useEffect(() => {
    // Mock data - replace with actual API calls
    setStats({
      totalOrders: 24,
      activeOrders: 3,
      wishlistItems: 12,
      totalSpent: 2849.99,
      recentOrders: [
        {
          id: "1",
          orderNumber: "ORD-2024-001",
          date: "2024-01-15",
          total: 299.99,
          status: "shipped",
          items: 3,
        },
        {
          id: "2",
          orderNumber: "ORD-2024-002",
          date: "2024-01-20",
          total: 149.99,
          status: "delivered",
          items: 2,
        },
        {
          id: "3",
          orderNumber: "ORD-2024-003",
          date: "2024-01-22",
          total: 89.99,
          status: "processing",
          items: 1,
        },
      ],
      recommendations: [
        {
          id: "1",
          name: "Wireless Bluetooth Headphones",
          price: 199.99,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
          rating: 4.5,
        },
        {
          id: "2",
          name: "Premium Cotton T-Shirt",
          price: 29.99,
          image:
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
          rating: 4.8,
        },
        {
          id: "3",
          name: "Smart Watch Series X",
          price: 399.99,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
          rating: 4.7,
        },
      ],
    });
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      processing: { color: "bg-primary-100 text-primary-800", text: "Processing" },
      shipped: { color: "bg-secondary-100 text-secondary-800", text: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", text: "Delivered" },
      cancelled: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

  const quickActions = [
    {
      label: "Browse Products",
      href: "/products",
      icon: ShoppingBag,
      color: "bg-secondary-500 hover:bg-secondary-600",
    },
    {
      label: "Track Orders",
      href: "/user/orders",
      icon: Package,
      color: "bg-primary-500 hover:bg-primary-600",
    },
    {
      label: "View Wishlist",
      href: "/user/wishlist",
      icon: Heart,
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      label: "Contact Support",
      href: "/user/help",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome back, {user?.firstName || "User"}!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Here's what's happening with your account today.
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-2 text-gray-400 dark:text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeOrders}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Wishlist Items
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.wishlistItems}
              </p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spent
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className={`
                flex flex-col items-center justify-center p-4 rounded-lg text-white transition-colors
                ${action.color}
              `}
            >
              <action.icon className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Recent Orders and Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h3>
            <Link
              to="/user/orders"
              className="text-secondary-600 hover:text-secondary-700 text-sm font-medium flex items-center"
            >
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </h4>
                  {getStatusBadge(order.status)}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{new Date(order.date).toLocaleDateString()}</span>
                  <span className="font-medium">${order.total}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {order.items} item{order.items > 1 ? "s" : ""}
                </div>
              </div>
            ))}
          </div>
          {stats.recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No orders yet</p>
              <Link
                to="/products"
                className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
              >
                Start shopping
              </Link>
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommended for You
            </h3>
            <Link
              to="/products"
              className="text-secondary-600 hover:text-secondary-700 text-sm font-medium flex items-center"
            >
              View More
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recommendations.map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {product.name}
                  </h4>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.rating})
                    </span>
                  </div>
                  <p className="font-semibold text-secondary-600 text-sm mt-1">
                    ${product.price}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  Add to Cart
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
