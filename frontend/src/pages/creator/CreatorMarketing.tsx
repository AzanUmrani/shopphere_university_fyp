import { useState } from "react";
import {
  Plus,
  Edit3,
  Play,
  Pause,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Search,
  Filter,
  Target,
  DollarSign,
  BarChart3,
  Copy,
  MoreVertical,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Input from "../../components/ui/Input";
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

// Mock campaign data
const campaigns = [
  {
    id: "CAMP-001",
    name: "Summer Sale Campaign",
    type: "discount",
    status: "active",
    budget: 2500,
    spent: 1847,
    reach: 45000,
    impressions: 125000,
    clicks: 3400,
    conversions: 156,
    revenue: 12450,
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    targetAudience: "Age 25-45, Fashion Enthusiasts",
    discount: 25,
  },
  {
    id: "CAMP-002",
    name: "New Product Launch",
    type: "awareness",
    status: "paused",
    budget: 1800,
    spent: 1200,
    reach: 32000,
    impressions: 87000,
    clicks: 2100,
    conversions: 78,
    revenue: 6890,
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    targetAudience: "Tech Enthusiasts, Early Adopters",
    discount: 0,
  },
  {
    id: "CAMP-003",
    name: "Holiday Special",
    type: "seasonal",
    status: "completed",
    budget: 3500,
    spent: 3456,
    reach: 67000,
    impressions: 189000,
    clicks: 5600,
    conversions: 234,
    revenue: 21890,
    startDate: "2023-12-01",
    endDate: "2023-12-31",
    targetAudience: "All Demographics",
    discount: 30,
  },
  {
    id: "CAMP-004",
    name: "Back to School",
    type: "seasonal",
    status: "draft",
    budget: 2000,
    spent: 0,
    reach: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    startDate: "2024-08-01",
    endDate: "2024-08-31",
    targetAudience: "Students, Parents",
    discount: 20,
  },
];

const campaignPerformanceData = [
  {
    date: "Jan 1",
    impressions: 12000,
    clicks: 456,
    conversions: 23,
    revenue: 1245,
  },
  {
    date: "Jan 8",
    impressions: 15000,
    clicks: 578,
    conversions: 34,
    revenue: 1678,
  },
  {
    date: "Jan 15",
    impressions: 18000,
    clicks: 723,
    conversions: 45,
    revenue: 2134,
  },
  {
    date: "Jan 22",
    impressions: 16000,
    clicks: 634,
    conversions: 38,
    revenue: 1876,
  },
  {
    date: "Jan 29",
    impressions: 21000,
    clicks: 856,
    conversions: 56,
    revenue: 2567,
  },
  {
    date: "Feb 5",
    impressions: 24000,
    clicks: 967,
    conversions: 67,
    revenue: 3098,
  },
  {
    date: "Feb 12",
    impressions: 19000,
    clicks: 745,
    conversions: 42,
    revenue: 2234,
  },
];

const audienceData = [
  { name: "18-24", value: 15, color: "#8b5cf6" },
  { name: "25-34", value: 35, color: "#06b6d4" },
  { name: "35-44", value: 28, color: "#10b981" },
  { name: "45-54", value: 15, color: "#f59e0b" },
  { name: "55+", value: 7, color: "#ef4444" },
];

const CreatorMarketing = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "paused":
        return <Badge variant="warning">Paused</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "draft":
        return <Badge variant="info">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case "discount":
        return <DollarSign className="w-4 h-4" />;
      case "awareness":
        return <Eye className="w-4 h-4" />;
      case "seasonal":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateROI = (revenue: number, spent: number) => {
    if (spent === 0) return 0;
    return (((revenue - spent) / spent) * 100).toFixed(1);
  };

  const calculateCTR = (clicks: number, impressions: number) => {
    if (impressions === 0) return 0;
    return ((clicks / impressions) * 100).toFixed(2);
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Marketing Campaigns
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and manage your marketing campaigns
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-secondary-600 to-pink-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Campaigns
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {activeCampaigns}
              </p>
              <p className="text-sm text-gray-500 mt-2">Running campaigns</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spent
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                of ${totalBudget.toLocaleString()} budget
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Campaign Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                ${totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {calculateROI(totalRevenue, totalSpent)}% ROI
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Reach
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {(
                  campaigns.reduce((sum, c) => sum + c.reach, 0) / 1000
                ).toFixed(0)}
                K
              </p>
              <p className="text-sm text-gray-500 mt-2">People reached</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-secondary-500 to-pink-500 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Chart & Audience Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <Card className="xl:col-span-2 p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Campaign Performance
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-primary-500 rounded-full mr-2"></div>
                Revenue
              </div>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Conversions
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
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
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Audience Demographics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={audienceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {audienceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {audienceData.map((item, index) => (
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
                    {item.name} years
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

      {/* Filters */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Campaigns List */}
      <Card className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Your Campaigns ({filteredCampaigns.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-secondary-600 to-pink-600 flex items-center justify-center text-white">
                      {getCampaignTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {campaign.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {campaign.targetAudience}
                      </p>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Budget
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ${campaign.budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        ${campaign.spent.toLocaleString()} spent
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Reach
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {(campaign.reach / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Clicks
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {campaign.clicks.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {calculateCTR(campaign.clicks, campaign.impressions)}%
                        CTR
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Conversions
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {campaign.conversions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Revenue
                      </p>
                      <p className="font-semibold text-green-600">
                        ${campaign.revenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        ROI
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {calculateROI(campaign.revenue, campaign.spent)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Duration
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(campaign.startDate)} -{" "}
                        {formatDate(campaign.endDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {campaign.status === "active" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-600"
                    >
                      <Pause className="w-4 h-4" />
                    </Button>
                  )}
                  {campaign.status === "paused" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create New Campaign</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Campaign creation functionality will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={() => setShowCreateModal(false)}>Create</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorMarketing;
