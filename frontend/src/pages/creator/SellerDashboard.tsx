import React from "react";
import { ShoppingBag, Package, DollarSign, TrendingUp } from "lucide-react";

const SellerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <div className="p-3 bg-gradient-to-r from-secondary-500 to-pink-500 rounded-lg mr-4 shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              Seller Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 ml-16">
              Welcome to your professional seller control center
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              $25,847
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue
            </p>
            <p className="text-xs text-green-600 mt-1">
              +12.5% from last month
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              342
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Orders
            </p>
            <p className="text-xs text-green-600 mt-1">+8.2% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg shadow-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              127
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Products
            </p>
            <p className="text-xs text-green-600 mt-1">+3.1% from last month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              12,547
            </h3>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Store Views
            </p>
            <p className="text-xs text-green-600 mt-1">
              +18.7% from last month
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            className="bg-primary-500 hover:bg-primary-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/creator/products/add")}
          >
            <Package className="w-8 h-8 mx-auto mb-2" />
            <div className="text-center">
              <div className="font-semibold text-sm mb-1">Add New Product</div>
              <div className="text-xs opacity-90">
                List a new item in your store
              </div>
            </div>
          </button>

          <button
            className="bg-secondary-500 hover:bg-secondary-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/creator/products")}
          >
            <Package className="w-8 h-8 mx-auto mb-2" />
            <div className="text-center">
              <div className="font-semibold text-sm mb-1">Manage Products</div>
              <div className="text-xs opacity-90">Update existing products</div>
            </div>
          </button>

          <button
            className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/creator/orders")}
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-2" />
            <div className="text-center">
              <div className="font-semibold text-sm mb-1">Process Orders</div>
              <div className="text-xs opacity-90">Handle pending orders</div>
            </div>
          </button>

          <button
            className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/creator/analytics")}
          >
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <div className="text-center">
              <div className="font-semibold text-sm mb-1">View Analytics</div>
              <div className="text-xs opacity-90">
                Check performance metrics
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-secondary-50 to-pink-50 dark:from-secondary-900/20 dark:to-pink-900/20 rounded-xl p-8 border border-secondary-200 dark:border-secondary-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🎉 Welcome to Your Professional Seller Dashboard!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            This is your command center for managing your online store. You now
            have access to all the tools you need to:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📦 Product Management
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Add, edit, and organize your product catalog
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                🛒 Order Processing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track and manage customer orders efficiently
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                📊 Analytics & Insights
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor your store performance and growth
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                💰 Revenue Tracking
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Keep track of earnings and financial metrics
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
