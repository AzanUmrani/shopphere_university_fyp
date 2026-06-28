import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Eye,
  MousePointer,
  Percent,
  Download,
  Crown,
  RefreshCw,
  Target,
  Clock,
  Globe,
  Activity,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
    daily: { date: string; value: number }[];
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
    daily: { date: string; value: number }[];
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
    new: number;
    returning: number;
  };
  traffic: {
    sessions: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    sources: { source: string; sessions: number; percentage: number }[];
  };
  conversion: {
    rate: number;
    funnel: {
      stage: string;
      visitors: number;
      conversion: number;
    }[];
  };
  products: {
    topSelling: {
      id: string;
      name: string;
      sales: number;
      revenue: number;
      growth: number;
    }[];
    categories: {
      name: string;
      revenue: number;
      percentage: number;
    }[];
  };
  geography: {
    countries: {
      name: string;
      code: string;
      revenue: number;
      orders: number;
      percentage: number;
    }[];
  };
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

interface TimeFilter {
  label: string;
  value: string;
  days: number;
}

const CreatorAdvancedAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const timeFilters: TimeFilter[] = [
    { label: "Last 7 days", value: "7d", days: 7 },
    { label: "Last 30 days", value: "30d", days: 30 },
    { label: "Last 90 days", value: "90d", days: 90 },
    { label: "Last 12 months", value: "12m", days: 365 },
  ];

  // Mock analytics data
  useEffect(() => {
    const loadAnalyticsData = () => {
      setLoading(true);

      // Simulate API call
      setTimeout(() => {
        const mockData: AnalyticsData = {
          revenue: {
            current: 145280,
            previous: 128940,
            growth: 12.67,
            daily: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              value: Math.floor(Math.random() * 8000) + 2000,
            })),
          },
          orders: {
            current: 892,
            previous: 756,
            growth: 18.0,
            daily: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
              value: Math.floor(Math.random() * 50) + 10,
            })),
          },
          customers: {
            current: 2456,
            previous: 2189,
            growth: 12.2,
            new: 634,
            returning: 1822,
          },
          traffic: {
            sessions: 18540,
            pageViews: 45890,
            bounceRate: 42.3,
            avgSessionDuration: 185,
            sources: [
              { source: "Organic Search", sessions: 7416, percentage: 40.0 },
              { source: "Direct", sessions: 4635, percentage: 25.0 },
              { source: "Social Media", sessions: 2781, percentage: 15.0 },
              { source: "Email", sessions: 1854, percentage: 10.0 },
              { source: "Paid Ads", sessions: 1111, percentage: 6.0 },
              { source: "Referral", sessions: 743, percentage: 4.0 },
            ],
          },
          conversion: {
            rate: 4.81,
            funnel: [
              { stage: "Visitors", visitors: 18540, conversion: 100 },
              { stage: "Product Views", visitors: 12456, conversion: 67.2 },
              { stage: "Add to Cart", visitors: 3789, conversion: 20.4 },
              { stage: "Checkout", visitors: 1234, conversion: 6.7 },
              { stage: "Purchase", visitors: 892, conversion: 4.8 },
            ],
          },
          products: {
            topSelling: [
              {
                id: "1",
                name: "Premium Headphones",
                sales: 145,
                revenue: 14500,
                growth: 23.5,
              },
              {
                id: "2",
                name: "Wireless Speaker",
                sales: 89,
                revenue: 8900,
                growth: -5.2,
              },
              {
                id: "3",
                name: "Smart Watch",
                sales: 76,
                revenue: 15200,
                growth: 18.7,
              },
              {
                id: "4",
                name: "Laptop Stand",
                sales: 112,
                revenue: 5600,
                growth: 32.1,
              },
              {
                id: "5",
                name: "USB-C Hub",
                sales: 234,
                revenue: 11700,
                growth: 12.8,
              },
            ],
            categories: [
              { name: "Electronics", revenue: 58200, percentage: 40.1 },
              { name: "Fashion", revenue: 43560, percentage: 30.0 },
              { name: "Home & Garden", revenue: 26184, percentage: 18.0 },
              { name: "Sports", revenue: 11622, percentage: 8.0 },
              { name: "Books", revenue: 5811, percentage: 3.9 },
            ],
          },
          geography: {
            countries: [
              {
                name: "United States",
                code: "US",
                revenue: 58112,
                orders: 356,
                percentage: 40.0,
              },
              {
                name: "United Kingdom",
                code: "GB",
                revenue: 29056,
                orders: 178,
                percentage: 20.0,
              },
              {
                name: "Canada",
                code: "CA",
                revenue: 21792,
                orders: 134,
                percentage: 15.0,
              },
              {
                name: "Germany",
                code: "DE",
                revenue: 17834,
                orders: 107,
                percentage: 12.3,
              },
              {
                name: "Australia",
                code: "AU",
                revenue: 14528,
                orders: 89,
                percentage: 10.0,
              },
              {
                name: "Others",
                code: "",
                revenue: 3958,
                orders: 28,
                percentage: 2.7,
              },
            ],
          },
          devices: {
            desktop: 45.2,
            mobile: 42.8,
            tablet: 12.0,
          },
        };

        setAnalyticsData(mockData);
        setLoading(false);
      }, 1000);
    };

    loadAnalyticsData();
  }, [timeFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Advanced Analytics
            </h1>
            <BarChart3 className="w-6 h-6 text-secondary-500" />
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              Enterprise Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Deep insights into your business performance and customer behavior
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {timeFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit overflow-x-auto">
        {[
          "overview",
          "revenue",
          "traffic",
          "customers",
          "products",
          "geography",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize whitespace-nowrap ${
              activeTab === tab
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(analyticsData.revenue.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {analyticsData.revenue.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        analyticsData.revenue.growth > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(Math.abs(analyticsData.revenue.growth))}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatNumber(analyticsData.orders.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {analyticsData.orders.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        analyticsData.orders.growth > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(Math.abs(analyticsData.orders.growth))}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Customers
                  </p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {formatNumber(analyticsData.customers.current)}
                  </p>
                  <div className="flex items-center mt-1">
                    {analyticsData.customers.growth > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        analyticsData.customers.growth > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatPercentage(
                        Math.abs(analyticsData.customers.growth)
                      )}
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Conversion Rate
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatPercentage(analyticsData.conversion.rate)}
                  </p>
                  <div className="flex items-center mt-1">
                    <Target className="w-4 h-4 text-orange-500 mr-1" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {formatNumber(analyticsData.traffic.sessions)} sessions
                    </span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Percent className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Revenue Chart */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Revenue Trend
              </h3>
              <div className="flex space-x-2">
                {["revenue", "orders"].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 text-sm rounded-lg capitalize ${
                      selectedMetric === metric
                        ? "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-200"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {metric}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 flex items-end space-x-2 overflow-x-auto">
              {analyticsData.revenue.daily.map((day, index) => {
                const maxValue = Math.max(
                  ...analyticsData.revenue.daily.map((d) => d.value)
                );
                const height = (day.value / maxValue) * 200;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-shrink-0"
                  >
                    <div
                      className="w-6 bg-secondary-500 rounded-t-sm hover:bg-secondary-600 transition-colors cursor-pointer"
                      style={{ height: `${height}px` }}
                      title={`${new Date(
                        day.date
                      ).toLocaleDateString()}: ${formatCurrency(day.value)}`}
                    />
                    <span className="text-xs text-gray-500 mt-1 transform -rotate-45">
                      {new Date(day.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Traffic Sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Traffic Sources
              </h3>
              <div className="space-y-4">
                {analyticsData.traffic.sources.map((source, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-secondary-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {source.source}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(source.sessions)}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                        {formatPercentage(source.percentage)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Device Distribution
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Desktop
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPercentage(analyticsData.devices.desktop)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Mobile
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPercentage(analyticsData.devices.mobile)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Tablet
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPercentage(analyticsData.devices.tablet)}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Conversion Funnel
            </h3>
            <div className="space-y-4">
              {analyticsData.conversion.funnel.map((stage, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-24 text-sm font-medium text-gray-900 dark:text-white">
                    {stage.stage}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(stage.visitors)} visitors
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatPercentage(stage.conversion)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stage.conversion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Revenue Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Current Period:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(analyticsData.revenue.current)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Previous Period:
                  </span>
                  <span className="font-semibold text-gray-600">
                    {formatCurrency(analyticsData.revenue.previous)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Growth:
                  </span>
                  <span
                    className={`font-semibold ${
                      analyticsData.revenue.growth > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {analyticsData.revenue.growth > 0 ? "+" : ""}
                    {formatPercentage(analyticsData.revenue.growth)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Avg. Order Value:
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(
                      analyticsData.revenue.current /
                        analyticsData.orders.current
                    )}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Category Performance
              </h3>
              <div className="space-y-3">
                {analyticsData.products.categories
                  .slice(0, 4)
                  .map((category, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {category.name}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(category.revenue)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPercentage(category.percentage)}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Daily Average
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(analyticsData.revenue.current / 30)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average daily revenue
                </p>
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-xl font-semibold text-primary-600">
                    {Math.round(analyticsData.orders.current / 30)}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Average daily orders
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "traffic" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 text-center">
              <Eye className="w-8 h-8 text-primary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary-600">
                {formatNumber(analyticsData.traffic.sessions)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Sessions
              </div>
            </Card>

            <Card className="p-6 text-center">
              <MousePointer className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(analyticsData.traffic.pageViews)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Page Views
              </div>
            </Card>

            <Card className="p-6 text-center">
              <Activity className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary-600">
                {formatPercentage(analyticsData.traffic.bounceRate)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Bounce Rate
              </div>
            </Card>

            <Card className="p-6 text-center">
              <Clock className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {formatDuration(analyticsData.traffic.avgSessionDuration)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Avg Session
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Traffic Sources Detailed
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Source
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Sessions
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Percentage
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Bounce Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.traffic.sources.map((source, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-3 px-4 text-gray-900 dark:text-white">
                        {source.source}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatNumber(source.sessions)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatPercentage(source.percentage)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatPercentage(Math.random() * 30 + 20)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "customers" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Metrics
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {formatNumber(analyticsData.customers.current)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Customers
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {formatNumber(analyticsData.customers.new)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      New
                    </div>
                  </div>
                  <div className="text-center p-3 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                    <div className="text-lg font-bold text-secondary-600">
                      {formatNumber(analyticsData.customers.returning)}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Returning
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Value
              </h3>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      analyticsData.revenue.current /
                        analyticsData.customers.current
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Customer Value
                  </div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatCurrency(
                      analyticsData.revenue.current /
                        analyticsData.orders.current
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Order Value
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Customer Retention
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600 mb-2">
                  {formatPercentage(
                    (analyticsData.customers.returning /
                      analyticsData.customers.current) *
                      100
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Customer retention rate
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-secondary-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (analyticsData.customers.returning /
                          analyticsData.customers.current) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Selling Products
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Product
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Sales
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Revenue
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-white">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.products.topSelling.map((product, index) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center text-secondary-600 font-bold text-sm">
                            #{index + 1}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                        {formatNumber(product.sales)}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                        {formatCurrency(product.revenue)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`font-medium ${
                            product.growth > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {product.growth > 0 ? "+" : ""}
                          {formatPercentage(product.growth)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "geography" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Revenue by Country
            </h3>
            <div className="space-y-4">
              {analyticsData.geography.countries.map((country, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {country.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatNumber(country.orders)} orders
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(country.revenue)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatPercentage(country.percentage)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorAdvancedAnalytics;
