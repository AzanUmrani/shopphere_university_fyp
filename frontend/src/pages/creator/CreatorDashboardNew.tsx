import { useState, useEffect, useMemo } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Crown,
  Zap,
  Shield,
  CheckCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import {
  fetchCreatorProfile,
  fetchDashboardStats,
  fetchCreatorProducts,
  fetchCreatorOrders,
} from "../../store/slices/creatorSlice";

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  changeText: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "green" | "blue" | "purple" | "orange";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeText,
  icon: Icon,
  color,
}) => {
  const colorClasses = {
    green: "bg-green-500 text-white",
    blue: "bg-primary-500 text-white",
    purple: "bg-secondary-500 text-white",
    orange: "bg-orange-500 text-white",
  };

  const changeColorClasses =
    change >= 0
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between ">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {value}
          </p>
          <div className="flex items-center text-sm">
            {change >= 0 ? (
              <ArrowUpRight className="w-4 h-4 mr-1 text-green-500" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1 text-red-500" />
            )}
            <span className={changeColorClasses}>
              {Math.abs(change)}% {changeText}
            </span>
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

const CreatorDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, dashboardStats, orders, products, loading } = useAppSelector(
    (state) => state.creator,
  );

  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    // Fetch initial data
    if (!profile) {
      dispatch(fetchCreatorProfile());
    }
    dispatch(fetchDashboardStats());
    dispatch(fetchCreatorProducts());
    dispatch(fetchCreatorOrders({ limit: 5 })); // Get recent orders
  }, [dispatch, profile]);

  // Get current plan from profile or default
  const currentPlan =
    (profile?.subscriptionPlan?.type as "free" | "pro" | "enterprise") ||
    "free";

  // Show loading state if data is being fetched
  if (loading.profile && !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">
          Loading creator profile...
        </div>
      </div>
    );
  }

  // Use real data from Redux store or fallbacks
  const stats = [
    {
      title: "Total Revenue",
      value: `$${(dashboardStats?.todayRevenue ?? 0).toLocaleString()}`,
      change: 12.5, // TODO: Calculate from API data
      changeText: "from last week",
      icon: DollarSign,
      color: "green" as const,
    },
    {
      title: "Orders",
      value: (dashboardStats?.todayOrders ?? 0).toString(),
      change: 8.2, // TODO: Calculate from API data
      changeText: "from last week",
      icon: ShoppingBag,
      color: "blue" as const,
    },
    {
      title: "Products",
      value:
        currentPlan === "free"
          ? `${dashboardStats?.totalProducts ?? 0}/${
              profile?.subscriptionPlan?.maxProducts || 25
            }`
          : (dashboardStats?.totalProducts ?? 0).toString(),
      change: 5.1, // TODO: Calculate from API data
      changeText: "from last week",
      icon: Package,
      color: "purple" as const,
    },
    {
      title: "Pending Orders",
      value: (dashboardStats?.pendingOrders ?? 0).toString(),
      change: 15.3, // TODO: Calculate from API data
      changeText: "from last week",
      icon: Users,
      color: "orange" as const,
    },
  ];

  // Use real orders data or empty array
  const ordersList = Array.isArray(orders) ? orders : [];
  const recentOrders = ordersList.slice(0, 5).map((order: any) => ({
    id: `#${order.id}`,
    customer: order.user?.firstName
      ? `${order.user.firstName} ${order.user.lastName || ""}`.trim()
      : "Customer",
    amount: `$${(order.totalAmount ?? order.total ?? 0).toFixed(2)}`,
    status: order.status || "pending",
    date: order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A",
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "processing":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200";
      case "shipped":
        return "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200";
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  // Mock user plan data
  const userPlan = {
    type: currentPlan,
    name:
      currentPlan === "free"
        ? "Free"
        : currentPlan === "pro"
          ? "Professional"
          : "Enterprise",
    commission:
      currentPlan === "free" ? "15%" : currentPlan === "pro" ? "5%" : "2%",
    features: getPlanFeatures(currentPlan),
    nextBilling: "2024-09-15",
    daysLeft: 23,
  };

  function getPlanFeatures(plan: "free" | "pro" | "enterprise") {
    switch (plan) {
      case "free":
        return [
          { name: "Up to 25 products", available: true },
          { name: "Basic analytics", available: true },
          { name: "Standard support", available: true },
          { name: "Advanced analytics", available: false },
          { name: "Marketing tools", available: false },
          { name: "Priority support", available: false },
        ];
      case "pro":
        return [
          { name: "Unlimited products", available: true },
          { name: "Advanced analytics", available: true },
          { name: "Priority support", available: true },
          { name: "Marketing tools", available: true },
          { name: "SEO optimization", available: true },
          { name: "Custom domain", available: true },
        ];
      case "enterprise":
        return [
          { name: "Everything in Pro", available: true },
          { name: "Dedicated manager", available: true },
          { name: "Custom integrations", available: true },
          { name: "White-label solutions", available: true },
          { name: "Advanced security", available: true },
          { name: "24/7 phone support", available: true },
        ];
      default:
        return [];
    }
  }

  const getPlanIcon = () => {
    switch (userPlan.type) {
      case "pro":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "enterprise":
        return <Shield className="w-5 h-5 text-secondary-500" />;
      default:
        return <Zap className="w-5 h-5 text-primary-500" />;
    }
  };

  // --- Chart Data ---
  const revenueChartData = useMemo(() => {
    const days =
      timeRange === "24h"
        ? 24
        : timeRange === "7d"
          ? 7
          : timeRange === "30d"
            ? 30
            : 90;
    const ordersList = Array.isArray(orders) ? orders : [];
    const productsList = Array.isArray(products) ? products : [];
    const totalRevenue = dashboardStats?.todayRevenue ?? 0;
    const totalOrders = ordersList.length;

    if (days <= 24) {
      return Array.from({ length: 24 }, (_, i) => ({
        name: `${i}:00`,
        revenue: Math.round((totalRevenue / 24) * (0.3 + Math.random() * 1.4)),
        orders: Math.max(
          0,
          Math.round((totalOrders / 24) * (0.2 + Math.random() * 1.8)),
        ),
      }));
    }

    return Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        name: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: Math.round(
          (totalRevenue / days) * (0.3 + Math.random() * 1.4),
        ),
        orders: Math.max(
          0,
          Math.round((totalOrders / days) * (0.2 + Math.random() * 1.8)),
        ),
      };
    });
  }, [timeRange, orders, dashboardStats, products]);

  const orderStatusData = useMemo(() => {
    const ordersList = Array.isArray(orders) ? orders : [];
    const statusCounts: Record<string, number> = {};
    ordersList.forEach((o: any) => {
      const s = o.status || "pending";
      statusCounts[s] = (statusCounts[s] || 0) + 1;
    });

    const defaultStatuses = [
      { name: "Pending", color: "#f59e0b" },
      { name: "Processing", color: "#3b82f6" },
      { name: "Shipped", color: "#8b5cf6" },
      { name: "Delivered", color: "#10b981" },
      { name: "Cancelled", color: "#ef4444" },
    ];

    const data = defaultStatuses
      .map((s) => ({
        name: s.name,
        value: statusCounts[s.name.toLowerCase()] || 0,
        color: s.color,
      }))
      .filter((s) => s.value > 0);

    // If no orders, show placeholder
    if (data.length === 0) {
      return [{ name: "No Orders", value: 1, color: "#d1d5db" }];
    }
    return data;
  }, [orders]);

  const topProductsData = useMemo(() => {
    const productsList = Array.isArray(products) ? products : [];
    return productsList.slice(0, 5).map((p: any) => ({
      name:
        (p.name || "Product").length > 15
          ? (p.name || "Product").substring(0, 15) + "..."
          : p.name || "Product",
      sales: p.salesCount ?? p.totalSales ?? Math.floor(Math.random() * 50),
      revenue: p.price
        ? Number(p.price) * (p.salesCount ?? Math.floor(Math.random() * 20))
        : Math.floor(Math.random() * 500),
    }));
  }, [products]);

  const CHART_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Creator Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 dark:text-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 3 months</option>
          </select>

          {loading.dashboard && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Loading...
            </div>
          )}

          <Button className="bg-secondary-600 hover:bg-secondary-700">
            <Bell className="w-4 h-4 mr-2" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              <TrendingUp className="w-5 h-5 inline mr-2 text-secondary-600" />
              Revenue & Orders Overview
            </h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  stroke="#9ca3af"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number, name: string) => [
                    name === "revenue" ? `$${value}` : value,
                    name === "revenue" ? "Revenue" : "Orders",
                  ]}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                  name="Orders"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Pie Chart */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            <ShoppingBag className="w-5 h-5 inline mr-2 text-primary-600" />
            Order Status
          </h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.95)",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Top Products Bar Chart + Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            <Package className="w-5 h-5 inline mr-2 text-secondary-600" />
            Top Products by Sales
          </h2>
          {topProductsData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProductsData}
                  layout="vertical"
                  margin={{ left: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    tick={{ fontSize: 11 }}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `$${value}` : value,
                      name === "revenue" ? "Revenue" : "Sales",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="sales"
                    fill="#8b5cf6"
                    name="Sales"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#3b82f6"
                    name="Revenue ($)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No products yet. Add products to see analytics.
            </div>
          )}
        </Card>

        {/* Recent Orders Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {order.id}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {order.customer}
                    </p>
                  </div>
                  <div className="text-center px-3">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {order.amount}
                    </p>
                    <Badge
                      className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {order.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 dark:text-gray-500">
              No orders yet. Orders will appear here.
            </div>
          )}
        </Card>
      </div>

      {/* Plan Card + Quick Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Plan Benefits */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {getPlanIcon()}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {userPlan.name} Plan
              </h2>
            </div>
            <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              {userPlan.commission} fee
            </Badge>
          </div>

          <div className="space-y-3 mb-6">
            {userPlan.features
              .slice(0, 4)
              .map(
                (
                  feature: { name: string; available: boolean },
                  index: number,
                ) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle
                      className={`w-4 h-4 ${
                        feature.available ? "text-green-500" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        feature.available
                          ? "text-gray-700 dark:text-gray-300"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ),
              )}
            <div className="text-sm text-secondary-600 dark:text-secondary-400 font-medium">
              +
              {userPlan.features.length - 4 > 0
                ? userPlan.features.length - 4
                : 0}{" "}
              more features
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Next billing
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {userPlan.daysLeft} days
              </span>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              {userPlan.type === "free" ? "Upgrade Plan" : "Manage Billing"}
            </Button>
            {userPlan.type === "free" && (
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-secondary-600 to-pink-600 hover:from-secondary-700 hover:to-pink-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>
        </Card>

        {/* Analytics Summary */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            <TrendingUp className="w-5 h-5 inline mr-2 text-secondary-600" />
            Performance
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Conversion Rate
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  3.2%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-secondary-500 h-2 rounded-full"
                  style={{ width: "32%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Avg Order Value
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  $89.50
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: "60%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Customer Return Rate
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  24.5%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "24.5%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Customer Lifetime Value
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  $267.80
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full"
                  style={{ width: "50%" }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Traffic Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            <Eye className="w-5 h-5 inline mr-2 text-primary-600" />
            Traffic Insights
          </h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Views
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  12,847
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full"
                  style={{ width: "85%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Unique Visitors
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  8,392
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-secondary-500 h-2 rounded-full"
                  style={{ width: "65%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Bounce Rate
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  34.2%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-400 h-2 rounded-full"
                  style={{ width: "34.2%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">
                  Avg. Session
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  4m 23s
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreatorDashboard;
