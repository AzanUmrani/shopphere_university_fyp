// src/components/RevenueDashboard.tsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  FaDollarSign,
  FaChartLine,
  FaBoxOpen,
  FaFunnelDollar,
  FaCalendarAlt,
} from "react-icons/fa";

// --- Interfaces for Mock Data ---
interface MonthlyRevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

interface ProductRevenue {
  id: number;
  name: string;
  revenue: number;
  orders: number;
}

interface ChannelRevenue {
  name: string;
  value: number; // Represents revenue amount
  color: string; // For Pie Chart cells
}

interface RecentOrder {
  id: string;
  customerName: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
}

// --- Mock Data ---
const monthlyRevenueData: MonthlyRevenueData[] = [
  { month: "Jan", revenue: 15000, expenses: 7000 },
  { month: "Feb", revenue: 17000, expenses: 8000 },
  { month: "Mar", revenue: 20000, expenses: 9000 },
  { month: "Apr", revenue: 18000, expenses: 8500 },
  { month: "May", revenue: 22000, expenses: 9500 },
  { month: "Jun", revenue: 25000, expenses: 11000 },
  { month: "Jul", revenue: 23000, expenses: 10000 },
  { month: "Aug", revenue: 27000, expenses: 12000 },
];

const topProductsRevenue: ProductRevenue[] = [
  { id: 1, name: "Wireless Headphones X", revenue: 8500, orders: 120 },
  { id: 2, name: "Smartwatch Pro", revenue: 7200, orders: 85 },
  { id: 3, name: "Portable Bluetooth Speaker", revenue: 5800, orders: 150 },
  { id: 4, name: "Gaming Mouse RGB", revenue: 4100, orders: 110 },
  { id: 5, name: "USB-C Hub 7-in-1", revenue: 3500, orders: 90 },
];

const revenueByChannel: ChannelRevenue[] = [
  { name: "Search", value: 12000, color: "#8884d8" }, // Indigo shade
  { name: "Paid Ads", value: 9500, color: "#82ca9d" }, // Green shade
  { name: "Direct", value: 6000, color: "#ffc658" }, // Orange shade
  { name: "Social Media", value: 4500, color: "#ff7f50" }, // Coral shade
  { name: "Marketing", value: 3000, color: "#a4de6c" }, // Light green shade
];

const recentOrders: RecentOrder[] = [
  {
    id: "ORD001",
    customerName: "Alice Smith",
    amount: 249.99,
    date: "2025-08-27",
    status: "Completed",
  },
  {
    id: "ORD002",
    customerName: "Bob Johnson",
    amount: 79.5,
    date: "2025-08-26",
    status: "Completed",
  },
  {
    id: "ORD003",
    customerName: "Charlie Brown",
    amount: 129.0,
    date: "2025-08-26",
    status: "Pending",
  },
  {
    id: "ORD004",
    customerName: "Diana Prince",
    amount: 399.99,
    date: "2025-08-25",
    status: "Completed",
  },
  {
    id: "ORD005",
    customerName: "Eve Adams",
    amount: 49.99,
    date: "2025-08-25",
    status: "Cancelled",
  },
];

// --- Main Component ---
const RevenueDetails: React.FC = () => {
  const totalRevenue = monthlyRevenueData.reduce(
    (sum, data) => sum + data.revenue,
    0
  );
  const currentMonthRevenue =
    monthlyRevenueData[monthlyRevenueData.length - 1]?.revenue || 0;
  const previousMonthRevenue =
    monthlyRevenueData[monthlyRevenueData.length - 2]?.revenue || 0;
  const revenueGrowth =
    previousMonthRevenue > 0
      ? (
          ((currentMonthRevenue - previousMonthRevenue) /
            previousMonthRevenue) *
          100
        ).toFixed(2)
      : "N/A";

  const averageOrderValue =
    recentOrders.length > 0
      ? (
          recentOrders.reduce((sum, order) => sum + order.amount, 0) /
          recentOrders.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center">
          <FaFunnelDollar className="mr-3 text-primary-600 dark:text-primary-400" />{" "}
          Revenue Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Total Revenue */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Revenue (YTD)
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <FaDollarSign className="text-primary-500 dark:text-primary-400 text-4xl opacity-75" />
          </div>

          {/* Card 2: Current Month Revenue */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Month Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                ${currentMonthRevenue.toLocaleString()}
              </p>
              <p
                className={`text-sm mt-1 ${
                  parseFloat(revenueGrowth) >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {revenueGrowth !== "N/A" && (
                  <span>
                    {parseFloat(revenueGrowth) >= 0 ? "↑" : "↓"} {revenueGrowth}
                    % vs. Prev Month
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Card 3: Average Order Value */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Order Value
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                ${averageOrderValue}
              </p>
            </div>
          </div>

          {/* Card 4: Total Orders (Example - could be Orders) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Orders (YTD)
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {recentOrders.length}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaChartLine className="mr-2 text-primary-500 dark:text-primary-400" />{" "}
              Monthly Revenue & Expenses
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={monthlyRevenueData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="month"
                  className="text-xs text-gray-600 dark:text-gray-300"
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-gray-600 dark:text-gray-300"
                  tickFormatter={(value) => `$${value / 1000}k`}
                  stroke="currentColor"
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  // Dynamically set contentStyle and itemStyle based on global dark mode
                  contentStyle={{
                    backgroundColor: "var(--recharts-tooltip-bg, #fff)",
                    border: "1px solid var(--recharts-tooltip-border, #ccc)",
                    borderRadius: "4px",
                    filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
                  }}
                  itemStyle={{
                    color: "var(--recharts-tooltip-item-color, #333)",
                  }}
                  labelStyle={{
                    color: "var(--recharts-tooltip-label-color, #A0AEC0)",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "var(--recharts-legend-color, #A0AEC0)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8" // Keep consistent primary brand color
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#82ca9d" // Keep consistent accent color
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Channel Pie Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaFunnelDollar className="mr-2 text-green-500 dark:text-green-400" />{" "}
              Revenue by Channel
            </h2>

            <div className="flex flex-col lg:flex-row items-center justify-between">
              {/* Pie Chart */}
              <div className="w-full lg:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueByChannel}
                      cx="50%"
                      cy="50%"
                      labelLine={false} // remove overlay text
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                    >
                      {revenueByChannel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) =>
                        `$${value.toLocaleString()}`
                      }
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
                      }}
                      itemStyle={{ color: "#333" }}
                      labelStyle={{ color: "#A0AEC0" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Text Labels */}
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0 lg:pl-6 flex flex-col justify-center space-y-2">
                {revenueByChannel.map((entry) => (
                  <div key={entry.name} className="flex items-center space-x-2">
                    <span
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="text-gray-700 dark:text-gray-200 font-medium">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaBoxOpen className="mr-2 text-orange-500 dark:text-orange-400" />{" "}
              Top Selling Products
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Orders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {topProductsRevenue.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                        ${product.revenue.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                        {product.orders.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-teal-500 dark:text-teal-400" />{" "}
              Recent High-Value Orders
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {recentOrders
                    .filter((order) => order.amount >= 100)
                    .map(
                      (
                        order // Showing only high-value orders
                      ) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                            {order.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                            ${order.amount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                              : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                              : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                          }`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDetails;
