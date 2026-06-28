import { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  BarChart3,
  Eye,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const SalesAnalytics = () => {
  const [analytics, setAnalytics] = useState<any>({});

  useEffect(() => {
    // Mock sales analytics data
    const mockAnalytics = {
      totalSales: 45250.75,
      totalOrders: 324,
      averageOrderValue: 139.66,
      conversionRate: 3.2,
      topProducts: [
        { name: "Wireless Headphones", sales: 85, revenue: 6375.0 },
        { name: "Smart Watch", sales: 62, revenue: 12400.0 },
        { name: "Phone Case", sales: 145, revenue: 3625.0 },
      ],
      monthlySales: [
        { month: "Jan", sales: 12500 },
        { month: "Feb", sales: 15750 },
        { month: "Mar", sales: 18900 },
      ],
    };
    setAnalytics(mockAnalytics);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Sales Analytics
        </h1>
        <BarChart3 className="w-6 h-6 text-primary-500" />
        <Badge className="bg-primary-100 text-primary-800">Pro Feature</Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${analytics.totalSales?.toLocaleString()}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Sales</p>
          <Badge className="mt-2 bg-green-100 text-green-800">+12.5%</Badge>
        </Card>

        <Card className="p-6 text-center">
          <ShoppingBag className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.totalOrders}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
          <Badge className="mt-2 bg-primary-100 text-primary-800">+8.3%</Badge>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            ${analytics.averageOrderValue?.toFixed(2)}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Avg Order Value</p>
          <Badge className="mt-2 bg-secondary-100 text-secondary-800">+4.2%</Badge>
        </Card>

        <Card className="p-6 text-center">
          <Users className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {analytics.conversionRate}%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Conversion Rate</p>
          <Badge className="mt-2 bg-orange-100 text-orange-800">+0.8%</Badge>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Sales Trend
          </h3>
          <div className="space-y-3">
            {analytics.monthlySales?.map((month: any) => (
              <div
                key={month.month}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {month.month}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${(month.sales / 20000) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${month.sales.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Products
          </h3>
          <div className="space-y-3">
            {analytics.topProducts?.map((product: any, index: number) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    #{index + 1} {product.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {product.sales} units sold
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <Button variant="outline" size="sm" className="mt-1">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sales Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-primary-800 dark:text-primary-300">
              Peak Sales Hour
            </p>
            <p className="text-lg font-bold text-primary-900 dark:text-primary-100">
              2:00 PM - 4:00 PM
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <ShoppingBag className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-800 dark:text-green-300">
              Best Selling Day
            </p>
            <p className="text-lg font-bold text-green-900 dark:text-green-100">
              Saturday
            </p>
          </div>
          <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
            <Users className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-secondary-800 dark:text-secondary-300">
              Return Customer Rate
            </p>
            <p className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
              68%
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SalesAnalytics;
