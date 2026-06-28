// src/components/PayoutsManagement.tsx

import React from "react";
import Card from "../../components/ui/Card"; // Assuming your Card component path
import Badge from "../../components/ui/Badge"; // Assuming your Badge component path
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
  FaHourglassHalf, // For pending
  FaCheckCircle, // For completed
  FaMoneyCheckAlt, // For main payout icon & status
  FaCalendarAlt, // For dates
  FaChartLine, // For trend chart
  FaDollarSign, // For fees/amounts
  FaBuilding, // For vendors in table
  FaChartPie, // Alternative for pie chart icon
} from "react-icons/fa";

interface MonthlyPayoutData {
  month: string;
  pending: number;
  completed: number;
}

interface PendingPayout {
  id: string;
  vendorName: string;
  amount: number;
  requestDate: string;
  status: "Pending" | "On Hold";
}

interface CompletedPayout {
  id: string;
  vendorName: string;
  amount: number;
  payoutDate: string;
  method: string;
  fee: number;
}

interface PayoutMethodDistribution {
  name: string;
  value: number; // Represents total amount processed by this method
  color: string;
}

// --- Mock Data ---
const monthlyPayoutData: MonthlyPayoutData[] = [
  { month: "Jan", pending: 1500, completed: 8000 },
  { month: "Feb", pending: 1000, completed: 9500 },
  { month: "Mar", pending: 2500, completed: 11000 },
  { month: "Apr", pending: 1800, completed: 10500 },
  { month: "May", pending: 3000, completed: 12000 },
  { month: "Jun", pending: 2200, completed: 13500 },
  { month: "Jul", pending: 1700, completed: 11500 },
  { month: "Aug", pending: 3500, completed: 14000 },
  { month: "Sep", pending: 2800, completed: 15500 },
  { month: "Oct", pending: 4100, completed: 16000 }, // Added Oct for more data, mirroring image's chart scale
];

const pendingPayouts: PendingPayout[] = [
  {
    id: "PAY009",
    vendorName: "Gadget Store XYZ",
    amount: 450.75,
    requestDate: "2025-08-27",
    status: "Pending",
  },
  {
    id: "PAY010",
    vendorName: "Fashion Hub Co.",
    amount: 1200,
    requestDate: "2025-08-26",
    status: "Pending",
  },
  {
    id: "PAY011",
    vendorName: "Book Worm Shop",
    amount: 80.5,
    requestDate: "2025-08-25",
    status: "On Hold",
  },
  {
    id: "PAY012",
    vendorName: "Electronics Bazaar",
    amount: 700.0,
    requestDate: "2025-08-24",
    status: "Pending",
  },
  {
    id: "PAY013",
    vendorName: "Outdoor Adventures",
    amount: 950.0,
    requestDate: "2025-08-23",
    status: "Pending",
  },
];

const completedPayouts: CompletedPayout[] = [
  {
    id: "PAY001",
    vendorName: "Crafty Hands Inc.",
    amount: 350.2,
    payoutDate: "2025-08-20",
    method: "Bank Transfer",
    fee: 3.5,
  },
  {
    id: "PAY002",
    vendorName: "Jewelry Lane",
    amount: 500.0,
    payoutDate: "2025-08-19",
    method: "PayPal",
    fee: 5.0,
  },
  {
    id: "PAY003",
    vendorName: "Sporty Gear",
    amount: 800.0,
    payoutDate: "2025-08-18",
    method: "Stripe",
    fee: 8.0,
  },
  {
    id: "PAY004",
    vendorName: "Pet Paradise",
    amount: 150.1,
    payoutDate: "2025-08-17",
    method: "Bank Transfer",
    fee: 1.5,
  },
  {
    id: "PAY005",
    vendorName: "Home Decor Finds",
    amount: 620.0,
    payoutDate: "2025-08-16",
    method: "PayPal",
    fee: 6.2,
  },
];

const payoutMethodDistribution: PayoutMethodDistribution[] = [
  { name: "Bank Transfer", value: 25000, color: "#6366F1" }, // primary-500
  { name: "PayPal", value: 18000, color: "#22C55E" }, // Green-500
  { name: "Stripe", value: 10000, color: "#F97316" }, // Orange-500
  { name: "Payoneer", value: 7000, color: "#EF4444" }, // Red-500
  { name: "Other", value: 3000, color: "#3B82F6" }, // primary-500
];

const PayoutsManagement: React.FC = () => {
  const totalPendingAmount = pendingPayouts.reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const totalFees = completedPayouts.reduce((sum, p) => sum + p.fee, 0);

  // For YTD completed based on mock monthly data for the card summary
  const totalMonthlyCompletedYTD = monthlyPayoutData.reduce(
    (sum, m) => sum + m.completed,
    0
  );

  // Helper function to find the first Friday of next month
  const getNextPayoutDate = () => {
    const today = new Date();
    let nextMonth = today.getMonth() + 1;
    let nextYear = today.getFullYear();

    if (nextMonth > 11) {
      // If it rolls over to the next year
      nextMonth = 0; // January
      nextYear++;
    }

    let firstDayOfNextMonth = new Date(nextYear, nextMonth, 1);
    let firstFriday = new Date(firstDayOfNextMonth);
    while (firstFriday.getDay() !== 5) {
      // 5 is Friday
      firstFriday.setDate(firstFriday.getDate() + 1);
    }
    return firstFriday.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const nextPayoutDate = getNextPayoutDate();

  return (
    // Main container for the dashboard body. Max width & horizontal centering
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-full lg:max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* --- Header Section (Title + Optional Badge) --- */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <FaMoneyCheckAlt className="mr-3 text-primary-600 dark:text-primary-400" />
            Payouts Management
          </h1>
          {/* Example badge - you can move or remove this as needed */}
          <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100 font-medium px-3 py-1 rounded-full text-sm">
            Admin View
          </Badge>
        </div>

        {/* --- Key Metrics Summary (Grid Layout) --- */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card: Total Pending Payouts */}
          <Card className="p-4 sm:p-3 flex items-start sm:items-center space-x-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] rounded-lg">
            <FaHourglassHalf className="text-yellow-500 dark:text-yellow-400 text-3xl sm:text-4xl mt-1 sm:mt-0 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Pending
              </p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                $
                {totalPendingAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </Card>

          {/* Card: Total Completed Payouts (YTD) */}
          <Card className="p-4 sm:p-3 flex items-start sm:items-center space-x-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] rounded-lg">
            <FaCheckCircle className="text-green-500 dark:text-green-400 text-3xl sm:text-4xl mt-1 sm:mt-0 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed (YTD)
              </p>
              <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">
                $
                {totalMonthlyCompletedYTD.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </Card>

          {/* Card: Next Payout Date */}
          <Card className="p-4 sm:p-3 flex items-start sm:items-center space-x-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] rounded-lg">
            <FaCalendarAlt className="text-primary-500 dark:text-primary-400 text-3xl sm:text-4xl mt-1 sm:mt-0 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Next Payout
              </p>
              <p className="text-xl sm:text-lg font-bold text-gray-900 dark:text-white">
                {nextPayoutDate}
              </p>
            </div>
          </Card>

          {/* Card: Total Payout Fees (YTD) */}
          <Card className="p-4 sm:p-3 flex items-start sm:items-center space-x-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.01] rounded-lg">
            <FaDollarSign className="text-red-500 dark:text-red-400 text-3xl sm:text-4xl mt-1 sm:mt-0 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Fees (YTD)
              </p>
              <p className="text-2xl sm:text-lg font-bold text-gray-900 dark:text-white">
                $
                {totalFees.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </Card>
        </section>

        {/* --- Main Payouts Trend Chart --- */}
        <section>
          <Card className="p-6 shadow-md rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <FaChartLine className="mr-2 text-primary-500 dark:text-primary-400" />{" "}
                Monthly Payouts Trend
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart
                data={monthlyPayoutData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e0e0e0"
                  className="dark:stroke-gray-600"
                />
                <XAxis
                  dataKey="month"
                  className="text-xs text-gray-600 dark:text-gray-300"
                  axisLine={false}
                  tickLine={false} // Match the clean style from the image
                />
                <YAxis
                  className="text-xs text-gray-600 dark:text-gray-300"
                  tickFormatter={(value) => `$${value / 1000}k`}
                  axisLine={false}
                  tickLine={false} // Match the clean style from the image
                />
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "var(--recharts-tooltip-bg, #fff)",
                    border: "1px solid var(--recharts-tooltip-border, #ccc)",
                    borderRadius: "8px", // More rounded tooltip like image
                    filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
                    padding: "8px 12px",
                  }}
                  itemStyle={{
                    color: "var(--recharts-tooltip-item-color, #333)",
                    fontSize: "13px",
                  }}
                  labelStyle={{
                    color: "var(--recharts-tooltip-label-color, #333)",
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: "var(--recharts-legend-color, #333)",
                    paddingTop: "10px",
                  }}
                  iconType="circle"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366F1" // Primary indigo color for completed
                  strokeWidth={2}
                  dot={{ r: 4 }} // Smaller dots
                  activeDot={{ r: 6 }} // Active dot slightly larger
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  stroke="#FBBF24" // Yellow for pending
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Pending"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </section>

        {/* --- Two-Column Section: Payout Distribution & Pending Payouts --- */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payout Method Distribution Card */}
          <Card className="p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaChartPie className="mr-2 text-teal-500 dark:text-teal-400" />{" "}
              Payout Method Distribution
            </h2>

            <div className="flex flex-col lg:flex-row gap-2 items-center">
              {/* Pie Chart */}
              <div className="flex-1 w-full lg:w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={payoutMethodDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      nameKey="name"
                      label={false} // remove inside labels
                    >
                      {payoutMethodDistribution.map((entry, index) => (
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
                        borderRadius: "8px",
                        filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
                        padding: "10px 12px",
                      }}
                      itemStyle={{ color: "#333", fontSize: "13px" }}
                      labelStyle={{
                        color: "#333",
                        fontWeight: "bold",
                        marginBottom: "4px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Payment Method List */}
              <div className="flex-1 w-full lg:w-1/2 flex flex-col gap-3">
                {payoutMethodDistribution.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="text-gray-700 dark:text-white font-medium text-lg">
                      {entry.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Pending Payouts Table */}
          <Card className="p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaHourglassHalf className="mr-2 text-yellow-500 dark:text-yellow-400" />{" "}
              Urgent Pending Payouts
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="relative px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {pendingPayouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {payout.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {payout.vendorName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                        $
                        {payout.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              payout.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100" // On Hold
                            }`}
                        >
                          {payout.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                          Process
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>

        {/* --- Recently Completed Payouts Table (Full Width) --- */}
        <section>
          <Card className="p-6 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
              <FaCheckCircle className="mr-2 text-green-500 dark:text-green-400" />{" "}
              All Recently Completed Payouts
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payout ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <FaBuilding className="inline mr-1" /> Vendor
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fee
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {completedPayouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {payout.id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {payout.vendorName}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-right">
                        $
                        {payout.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {payout.method}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 dark:text-red-400 text-right">
                        $
                        {payout.fee.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default PayoutsManagement;
