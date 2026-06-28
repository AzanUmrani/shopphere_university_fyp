import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import {
  fetchCreatorProfile,
  fetchDashboardStats,
  fetchCreatorEarnings,
  fetchCreatorOrders,
} from "../../store/slices/creatorSlice";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  ResponsiveContainer,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts";

// Mock analytics data
const revenueData = [
  { month: "Jan", revenue: 15000, orders: 120, customers: 89 },
  { month: "Feb", revenue: 18000, orders: 145, customers: 105 },
  { month: "Mar", revenue: 22000, orders: 180, customers: 134 },
  { month: "Apr", revenue: 19000, orders: 155, customers: 121 },
  { month: "May", revenue: 25000, orders: 200, customers: 156 },
  { month: "Jun", revenue: 28000, orders: 220, customers: 178 },
  { month: "Jul", revenue: 32000, orders: 250, customers: 201 },
  { month: "Aug", revenue: 29000, orders: 235, customers: 189 },
  { month: "Sep", revenue: 35000, orders: 280, customers: 225 },
  { month: "Oct", revenue: 38000, orders: 300, customers: 241 },
  { month: "Nov", revenue: 42000, orders: 320, customers: 256 },
  { month: "Dec", revenue: 45000, orders: 350, customers: 278 },
];

const categoryPerformance = [
  {
    name: "Electronics",
    revenue: 185000,
    orders: 890,
    growth: 15.5,
    color: "#8b5cf6",
  },
  {
    name: "Accessories",
    revenue: 78000,
    orders: 456,
    growth: 8.2,
    color: "#ec4899",
  },
  {
    name: "Home & Kitchen",
    revenue: 45000,
    orders: 234,
    growth: -3.1,
    color: "#06b6d4",
  },
  {
    name: "Clothing",
    revenue: 32000,
    orders: 167,
    growth: 22.7,
    color: "#10b981",
  },
];

const topProducts = [
  {
    name: "Premium Headphones",
    revenue: 45000,
    units: 150,
    growth: 18.5,
    rating: 4.8,
  },
  {
    name: "Smart Watch",
    revenue: 38000,
    units: 190,
    growth: 12.3,
    rating: 4.6,
  },
  {
    name: "Bluetooth Speaker",
    revenue: 28000,
    units: 311,
    growth: 8.7,
    rating: 4.9,
  },
  {
    name: "Wireless Charger",
    revenue: 15000,
    units: 600,
    growth: -2.1,
    rating: 4.4,
  },
  {
    name: "Laptop Stand",
    revenue: 12000,
    units: 240,
    growth: 25.4,
    rating: 4.2,
  },
];

const trafficSources = [
  {
    source: "Direct",
    visitors: 45,
    conversions: 12,
    revenue: 15600,
    color: "#8b5cf6",
  },
  {
    source: "Google Search",
    visitors: 30,
    conversions: 18,
    revenue: 22400,
    color: "#06b6d4",
  },
  {
    source: "Social Media",
    visitors: 15,
    conversions: 8,
    revenue: 8900,
    color: "#ec4899",
  },
  {
    source: "Email",
    visitors: 10,
    conversions: 15,
    revenue: 12100,
    color: "#10b981",
  },
];

const customerDemographics = {
  ageGroups: [
    { name: "18-24", value: 18, color: "#8b5cf6" },
    { name: "25-34", value: 35, color: "#ec4899" },
    { name: "35-44", value: 28, color: "#06b6d4" },
    { name: "45-54", value: 12, color: "#10b981" },
    { name: "55+", value: 7, color: "#f59e0b" },
  ],
  topLocations: [
    { city: "New York, NY", customers: 145, revenue: 28500 },
    { city: "Los Angeles, CA", customers: 132, revenue: 25200 },
    { city: "Chicago, IL", customers: 98, revenue: 18900 },
    { city: "Houston, TX", customers: 87, revenue: 16200 },
    { city: "Miami, FL", customers: 76, revenue: 14800 },
  ],
};

const CreatorAnalytics = () => {
  const dispatch = useAppDispatch();
  const { profile, dashboardStats, loading } = useAppSelector(
    (state) => state.creator
  );

  const [selectedPeriod, setSelectedPeriod] = useState("12months");

  useEffect(() => {
    if (!profile) {
      dispatch(fetchCreatorProfile());
    }
    dispatch(fetchDashboardStats());
    dispatch(fetchCreatorEarnings());
    dispatch(fetchCreatorOrders({ limit: 10 }));
  }, [dispatch, profile]);

  // Show loading state while fetching data
  if (loading.dashboard || loading.profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // Calculate period-over-period changes (mock calculations for now)
  const calculateChange = (current: number, previous?: number) => {
    if (!previous || previous === 0) return "+0%";
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  };

  const kpiCards = [
    {
      title: "Total Revenue",
      value: `$${dashboardStats.todayRevenue.toLocaleString()}`,
      change: calculateChange(dashboardStats.todayRevenue),
      isPositive: true,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      description: "vs last period",
    },
    {
      title: "Total Orders",
      value: dashboardStats.todayOrders.toString(),
      change: calculateChange(dashboardStats.todayOrders),
      isPositive: true,
      icon: ShoppingBag,
      color: "from-primary-500 to-cyan-500",
      description: "vs last period",
    },
    {
      title: "Total Products",
      value: dashboardStats.totalProducts.toString(),
      change: "+0%", // No historical data for products yet
      isPositive: true,
      icon: Package,
      color: "from-secondary-500 to-pink-500",
      description: "active products",
    },
    {
      title: "Pending Orders",
      value: dashboardStats.pendingOrders.toString(),
      change: calculateChange(dashboardStats.pendingOrders),
      isPositive: false,
      icon: Clock,
      color: "from-orange-500 to-red-500",
      description: "need attention",
    },
    {
      title: "Low Stock Items",
      value: dashboardStats.lowStockProducts.toString(),
      change: "+0%", // No historical data yet
      isPositive: false,
      icon: TrendingDown,
      color: "from-yellow-500 to-orange-500",
      description: "need restocking",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your store's performance and growth insights
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="12months">Last 12 Months</option>
            <option value="alltime">All Time</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card
            key={index}
            className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${kpi.color} flex items-center justify-center`}
              >
                <kpi.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                {kpi.isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    kpi.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {kpi.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {kpi.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">{kpi.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Revenue & Orders Trend
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                Revenue
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                Orders
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis yAxisId="left" stroke="#6b7280" />
                <YAxis yAxisId="right" orientation="right" stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    border: "none",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  fill="url(#colorRevenue)"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  fill="#3b82f6"
                  opacity={0.8}
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Customer Demographics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={customerDemographics.ageGroups}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerDemographics.ageGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {customerDemographics.ageGroups.map((group, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: group.color }}
                  ></div>
                  <span className="text-gray-600 dark:text-gray-400">
                    {group.name}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {group.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Category Performance */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Category Performance
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryPerformance.map((category, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {category.name}
                </h4>
                <div className="flex items-center">
                  {category.growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      category.growth >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {category.growth > 0 ? "+" : ""}
                    {category.growth}%
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Revenue:
                  </span>
                  <span className="font-medium">
                    ${category.revenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Orders:
                  </span>
                  <span className="font-medium">{category.orders}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Products & Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Top Performing Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <div className="flex items-center">
                      {product.growth >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          product.growth >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {product.units} units • $
                      {product.revenue.toLocaleString()} revenue
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {product.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Traffic Sources
          </h3>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: source.color }}
                    ></div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {source.source}
                    </h4>
                  </div>
                  <span className="text-sm font-medium text-green-600">
                    {((source.conversions / source.visitors) * 100).toFixed(1)}%
                    CVR
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Visitors</p>
                    <p className="font-medium">{source.visitors}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Conversions
                    </p>
                    <p className="font-medium">{source.conversions}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Revenue</p>
                    <p className="font-medium">
                      ${source.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Customer Locations */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Top Customer Locations
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="text-left p-3 font-medium text-gray-600 dark:text-gray-400">
                  Location
                </th>
                <th className="text-left p-3 font-medium text-gray-600 dark:text-gray-400">
                  Customers
                </th>
                <th className="text-left p-3 font-medium text-gray-600 dark:text-gray-400">
                  Revenue
                </th>
                <th className="text-left p-3 font-medium text-gray-600 dark:text-gray-400">
                  Avg. Order Value
                </th>
              </tr>
            </thead>
            <tbody>
              {customerDemographics.topLocations.map((location, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-100 dark:border-gray-800"
                >
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    {location.city}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    {location.customers}
                  </td>
                  <td className="p-3 font-medium text-gray-900 dark:text-white">
                    ${location.revenue.toLocaleString()}
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">
                    ${(location.revenue / location.customers).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default CreatorAnalytics;
