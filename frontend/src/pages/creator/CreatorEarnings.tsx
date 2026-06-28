import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Clock,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch } from "../../hooks/redux";
import { fetchCreatorEarnings } from "../../store/slices/creatorSlice";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
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
} from "recharts";

// Mock earnings data
const earningsData = [
  { month: "Jan", earnings: 12500, orders: 89, commission: 625 },
  { month: "Feb", earnings: 15200, orders: 105, commission: 760 },
  { month: "Mar", earnings: 18900, orders: 134, commission: 945 },
  { month: "Apr", earnings: 16700, orders: 121, commission: 835 },
  { month: "May", earnings: 21300, orders: 156, commission: 1065 },
  { month: "Jun", earnings: 24600, orders: 178, commission: 1230 },
  { month: "Jul", earnings: 28400, orders: 201, commission: 1420 },
  { month: "Aug", earnings: 26100, orders: 189, commission: 1305 },
  { month: "Sep", earnings: 31200, orders: 225, commission: 1560 },
  { month: "Oct", earnings: 34500, orders: 241, commission: 1725 },
  { month: "Nov", earnings: 38200, orders: 256, commission: 1910 },
  { month: "Dec", earnings: 41800, orders: 278, commission: 2090 },
];

const payoutHistory = [
  {
    id: "PO-001",
    amount: 5400.0,
    status: "completed",
    method: "Bank Transfer",
    processedDate: "2024-02-01",
    transactionId: "TXN-123456789",
    ordersCount: 45,
  },
  {
    id: "PO-002",
    amount: 3200.0,
    status: "completed",
    method: "PayPal",
    processedDate: "2024-01-15",
    transactionId: "TXN-987654321",
    ordersCount: 28,
  },
  {
    id: "PO-003",
    amount: 4700.0,
    status: "processing",
    method: "Bank Transfer",
    scheduledDate: "2024-02-15",
    transactionId: null,
    ordersCount: 38,
  },
  {
    id: "PO-004",
    amount: 2100.0,
    status: "pending",
    method: "Stripe",
    scheduledDate: "2024-02-28",
    transactionId: null,
    ordersCount: 19,
  },
];

const recentEarnings = [
  {
    orderId: "ORD-001",
    customerName: "John Smith",
    amount: 284.99,
    commission: 15.0,
    netEarnings: 269.99,
    date: "2024-02-10",
    status: "paid",
  },
  {
    orderId: "ORD-002",
    customerName: "Emma Wilson",
    amount: 278.77,
    commission: 16.2,
    netEarnings: 262.57,
    date: "2024-02-09",
    status: "paid",
  },
  {
    orderId: "ORD-003",
    customerName: "Michael Brown",
    amount: 567.58,
    commission: 32.4,
    netEarnings: 535.18,
    date: "2024-02-08",
    status: "pending",
  },
  {
    orderId: "ORD-004",
    customerName: "Sarah Davis",
    amount: 84.49,
    commission: 4.5,
    netEarnings: 79.99,
    date: "2024-02-07",
    status: "paid",
  },
];

const earningsBreakdown = [
  { name: "Net Earnings", value: 85, color: "#10b981" },
  { name: "Platform Fee", value: 10, color: "#8b5cf6" },
  { name: "Processing Fee", value: 5, color: "#f59e0b" },
];

const CreatorEarnings = () => {
  const dispatch = useAppDispatch();

  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [selectedTab, setSelectedTab] = useState("overview");

  useEffect(() => {
    dispatch(fetchCreatorEarnings());
  }, [dispatch]);

  const totalEarnings = earningsData.reduce(
    (sum, item) => sum + item.earnings,
    0
  );
  const lastMonthEarnings =
    earningsData[earningsData.length - 1]?.earnings || 0;
  const previousMonthEarnings =
    earningsData[earningsData.length - 2]?.earnings || 0;
  const earningsGrowth =
    previousMonthEarnings > 0
      ? ((lastMonthEarnings - previousMonthEarnings) / previousMonthEarnings) *
        100
      : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "processing":
        return <Badge variant="info">Processing</Badge>;
      case "pending":
        return <Badge variant="warning">Pending</Badge>;
      case "failed":
        return <Badge variant="danger">Failed</Badge>;
      case "paid":
        return <Badge variant="success">Paid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-primary-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Earnings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your earnings and payout history
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
          >
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Earnings
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalEarnings.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                {earningsGrowth >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span
                  className={`text-sm font-medium ${
                    earningsGrowth >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {earningsGrowth >= 0 ? "+" : ""}
                  {earningsGrowth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  vs last month
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                This Month
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${lastMonthEarnings.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                From {earningsData[earningsData.length - 1]?.orders || 0} orders
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Payouts
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                $
                {payoutHistory
                  .filter(
                    (p) => p.status === "pending" || p.status === "processing"
                  )
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {
                  payoutHistory.filter(
                    (p) => p.status === "pending" || p.status === "processing"
                  ).length
                }{" "}
                pending
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. Order Value
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                $
                {(
                  totalEarnings /
                  earningsData.reduce((sum, item) => sum + item.orders, 0)
                ).toFixed(0)}
              </p>
              <p className="text-sm text-gray-500 mt-2">Per order earnings</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-secondary-500 to-pink-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-2 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <nav className="flex space-x-1">
          {[
            { id: "overview", label: "Overview" },
            { id: "payouts", label: "Payouts" },
            { id: "transactions", label: "Transactions" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === tab.id
                  ? "bg-gradient-to-r from-secondary-600 to-pink-600 text-white"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </Card>

      {selectedTab === "overview" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Earnings Chart */}
          <Card className="xl:col-span-2 p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Earnings Trend
              </h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Earnings
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full mr-2"></div>
                  Commission
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "none",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commission"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Earnings Breakdown */}
          <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Earnings Breakdown
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={earningsBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {earningsBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {earningsBreakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-600 dark:text-gray-400">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {selectedTab === "payouts" && (
        <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Payout History
              </h3>
              <Button
                size="sm"
                className="bg-gradient-to-r from-secondary-600 to-pink-600"
              >
                Request Payout
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Payout ID
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Method
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Orders
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {payoutHistory.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4">
                      <div className="flex items-center">
                        {getStatusIcon(payout.status)}
                        <span className="ml-2 font-medium text-gray-900 dark:text-white">
                          {payout.id}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      ${payout.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <CreditCard className="w-4 h-4 text-gray-400 mr-2" />
                        {payout.method}
                      </div>
                    </td>
                    <td className="p-4">{getStatusBadge(payout.status)}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {payout.processedDate
                        ? formatDate(payout.processedDate)
                        : payout.scheduledDate
                        ? `Scheduled: ${formatDate(payout.scheduledDate)}`
                        : "-"}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {payout.ordersCount} orders
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {selectedTab === "transactions" && (
        <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Order ID
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Customer
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Amount
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Commission
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Net Earnings
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Date
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900 dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentEarnings.map((earning) => (
                  <tr
                    key={earning.orderId}
                    className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {earning.orderId}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {earning.customerName}
                    </td>
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      ${earning.amount}
                    </td>
                    <td className="p-4 text-red-600">-${earning.commission}</td>
                    <td className="p-4 font-bold text-green-600">
                      ${earning.netEarnings}
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">
                      {formatDate(earning.date)}
                    </td>
                    <td className="p-4">{getStatusBadge(earning.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CreatorEarnings;
