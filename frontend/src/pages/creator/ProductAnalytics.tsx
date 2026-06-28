import { useState } from "react";
import { Package, TrendingUp, Star, Eye, BarChart3 } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const ProductAnalytics = () => {
  const [productData] = useState({
    totalProducts: 156,
    bestSeller: "Wireless Headphones",
    topPerformers: [
      { name: "Wireless Headphones", views: 2340, sales: 89, revenue: 6675 },
      { name: "Smart Watch", views: 1890, sales: 67, revenue: 13400 },
      { name: "Phone Case", views: 3210, sales: 234, revenue: 5850 },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Product Analytics
        </h1>
        <Package className="w-6 h-6 text-primary-500" />
        <Badge className="bg-primary-100 text-primary-800">Pro Feature</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <Package className="w-8 h-8 text-primary-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {productData.totalProducts}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Total Products</p>
        </Card>

        <Card className="p-6 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {productData.bestSeller}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Best Seller</p>
        </Card>

        <Card className="p-6 text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            85%
          </h3>
          <p className="text-gray-600 dark:text-gray-400">Products In Stock</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Performing Products
        </h3>
        <div className="space-y-4">
          {productData.topPerformers.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  #{index + 1} {product.name}
                </h4>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3 h-3" />
                    <span>{product.views} views</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Package className="w-3 h-3" />
                    <span>{product.sales} sold</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <BarChart3 className="w-3 h-3" />
                    <span>${product.revenue.toLocaleString()} revenue</span>
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ProductAnalytics;
