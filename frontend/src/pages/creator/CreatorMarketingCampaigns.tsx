import { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Edit,
  Eye,
  Play,
  Pause,
  Mail,
  Users,
  Target,
  TrendingUp,
  DollarSign,
  Crown,
  X,
  Copy,
  Download,
  Search,
  BarChart3,
  MousePointer,
  ShoppingCart,
  Percent,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface Campaign {
  id: string;
  name: string;
  description: string;
  type: "email" | "discount" | "social" | "ads" | "sms";
  status: "draft" | "active" | "paused" | "completed";
  startDate: string;
  endDate: string;
  budget?: number;
  spent?: number;
  targetAudience: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  createdAt: string;
  updatedAt: string;
}

const CreatorMarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Mock campaign data
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: "1",
        name: "Summer Sale 2024",
        description:
          "20% off all summer products with email marketing campaign",
        type: "email",
        status: "active",
        startDate: "2024-02-01",
        endDate: "2024-02-29",
        budget: 500,
        spent: 325,
        targetAudience: "Previous customers",
        metrics: {
          impressions: 12500,
          clicks: 850,
          conversions: 45,
          revenue: 2250,
          ctr: 6.8,
          cpc: 0.38,
          roas: 6.9,
        },
        createdAt: "2024-01-25",
        updatedAt: "2024-02-10",
      },
      {
        id: "2",
        name: "Valentine's Day Promo",
        description: "Special discount codes for Valentine's Day collection",
        type: "discount",
        status: "completed",
        startDate: "2024-02-10",
        endDate: "2024-02-14",
        budget: 200,
        spent: 180,
        targetAudience: "All customers",
        metrics: {
          impressions: 8500,
          clicks: 420,
          conversions: 28,
          revenue: 1680,
          ctr: 4.9,
          cpc: 0.43,
          roas: 9.3,
        },
        createdAt: "2024-02-05",
        updatedAt: "2024-02-14",
      },
      {
        id: "3",
        name: "New Product Launch",
        description: "Social media campaign for new product line launch",
        type: "social",
        status: "active",
        startDate: "2024-02-08",
        endDate: "2024-02-22",
        budget: 800,
        spent: 245,
        targetAudience: "Lookalike audience",
        metrics: {
          impressions: 25000,
          clicks: 1200,
          conversions: 15,
          revenue: 900,
          ctr: 4.8,
          cpc: 0.2,
          roas: 3.7,
        },
        createdAt: "2024-02-01",
        updatedAt: "2024-02-11",
      },
      {
        id: "4",
        name: "Retargeting Campaign",
        description: "Target cart abandoners with personalized ads",
        type: "ads",
        status: "paused",
        startDate: "2024-01-15",
        endDate: "2024-03-15",
        budget: 300,
        spent: 125,
        targetAudience: "Cart abandoners",
        metrics: {
          impressions: 5800,
          clicks: 290,
          conversions: 12,
          revenue: 720,
          ctr: 5.0,
          cpc: 0.43,
          roas: 5.8,
        },
        createdAt: "2024-01-10",
        updatedAt: "2024-02-05",
      },
      {
        id: "5",
        name: "Flash Sale SMS",
        description: "24-hour flash sale promotion via SMS",
        type: "sms",
        status: "draft",
        startDate: "2024-02-15",
        endDate: "2024-02-16",
        budget: 150,
        spent: 0,
        targetAudience: "VIP customers",
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          ctr: 0,
          cpc: 0,
          roas: 0,
        },
        createdAt: "2024-02-12",
        updatedAt: "2024-02-12",
      },
    ];

    setCampaigns(mockCampaigns);
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    const matchesType = filterType === "all" || campaign.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "completed":
        return "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "discount":
        return Percent;
      case "social":
        return Users;
      case "ads":
        return Target;
      case "sms":
        return Mail;
      default:
        return Megaphone;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "email":
        return "text-primary-600";
      case "discount":
        return "text-green-600";
      case "social":
        return "text-secondary-600";
      case "ads":
        return "text-orange-600";
      case "sms":
        return "text-pink-600";
      default:
        return "text-gray-600";
    }
  };

  const totalBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + (c.spent || 0), 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.metrics.revenue, 0);
  const averageROAS =
    campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + c.metrics.roas, 0) / campaigns.length
      : 0;

  const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Marketing Campaigns
            </h1>
            <Megaphone className="w-6 h-6 text-secondary-500" />
            <Crown className="w-5 h-5 text-yellow-500" />
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              Pro Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage your marketing campaigns
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => console.log("Create campaign")}
            className="bg-secondary-600 hover:bg-secondary-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {["overview", "campaigns", "analytics", "templates"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {activeCampaigns}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    ${totalBudget.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    ${totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Revenue Generated
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg ROAS
                  </p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {averageROAS.toFixed(1)}x
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Campaign Performance Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Campaign Performance
            </h3>
            <div className="space-y-4">
              {campaigns
                .filter((c) => c.status === "active")
                .map((campaign) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                        <Megaphone className="w-5 h-5 text-secondary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {campaign.metrics.clicks} clicks •{" "}
                          {campaign.metrics.conversions} conversions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ${campaign.metrics.revenue}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Revenue
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">
                          {campaign.metrics.roas.toFixed(1)}x
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          ROAS
                        </p>
                      </div>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Campaign Types */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Campaign Types Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {["email", "discount", "social", "ads", "sms"].map((type) => {
                const typeCount = campaigns.filter(
                  (c) => c.type === type
                ).length;
                const Icon = getTypeIcon(type);
                const colorClass = getTypeColor(type);

                return (
                  <div key={type} className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-2`}
                    >
                      <Icon className={`w-8 h-8 ${colorClass}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {type}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {typeCount} campaigns
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "campaigns" && (
        <div className="space-y-6">
          {/* Filters and Search */}
          <Card className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                  <option value="draft">Draft</option>
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Types</option>
                  <option value="email">Email</option>
                  <option value="discount">Discount</option>
                  <option value="social">Social</option>
                  <option value="ads">Ads</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Campaigns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCampaigns.map((campaign) => {
              const Icon = getTypeIcon(campaign.type);
              const colorClass = getTypeColor(campaign.type);

              return (
                <Card
                  key={campaign.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Icon className={`w-6 h-6 ${colorClass}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {campaign.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {campaign.type} • {campaign.targetAudience}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCampaign(campaign)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {campaign.status === "active" ? (
                          <Button variant="outline" size="sm">
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : campaign.status === "paused" ? (
                          <Button variant="outline" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {campaign.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Start Date
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        End Date
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Budget:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${campaign.budget?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Spent:
                      </span>
                      <span className="font-medium text-orange-600">
                        ${campaign.spent?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Revenue:
                      </span>
                      <span className="font-medium text-green-600">
                        ${campaign.metrics.revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        ROAS:
                      </span>
                      <span className="font-medium text-secondary-600">
                        {campaign.metrics.roas.toFixed(1)}x
                      </span>
                    </div>
                  </div>

                  {campaign.budget && campaign.spent && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                        <span>Budget Used</span>
                        <span>
                          {((campaign.spent / campaign.budget) * 100).toFixed(
                            0
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-secondary-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              (campaign.spent / campaign.budget) * 100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Campaign Analytics Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <MousePointer className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary-600">
                  {campaigns
                    .reduce((sum, c) => sum + c.metrics.clicks, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Clicks
                </div>
              </div>

              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  {campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Conversions
                </div>
              </div>

              <div className="text-center p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg">
                <BarChart3 className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-secondary-600">
                  {campaigns.length > 0
                    ? (
                        campaigns.reduce((sum, c) => sum + c.metrics.ctr, 0) /
                        campaigns.length
                      ).toFixed(1)
                    : 0}
                  %
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Avg CTR
                </div>
              </div>

              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  $
                  {campaigns.length > 0
                    ? (
                        campaigns.reduce((sum, c) => sum + c.metrics.cpc, 0) /
                        campaigns.length
                      ).toFixed(2)
                    : 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Avg CPC
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performing Campaigns
            </h3>
            <div className="space-y-3">
              {campaigns
                .sort((a, b) => b.metrics.roas - a.metrics.roas)
                .slice(0, 5)
                .map((campaign, index) => (
                  <div
                    key={campaign.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center text-secondary-600 font-bold text-sm">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {campaign.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {campaign.type}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {campaign.metrics.roas.toFixed(1)}x ROAS
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${campaign.metrics.revenue.toLocaleString()} revenue
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-6">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Copy className="w-8 h-8 text-secondary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Campaign Templates
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Quick-start templates to launch campaigns faster
            </p>
            <Button className="bg-secondary-600 hover:bg-secondary-700">
              <Plus className="w-4 h-4 mr-2" />
              Browse Templates
            </Button>
          </Card>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-secondary-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedCampaign.name}
                    </h2>
                    <Badge className={getStatusColor(selectedCampaign.status)}>
                      {selectedCampaign.status}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCampaign(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedCampaign.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      {selectedCampaign.metrics.impressions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Impressions
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedCampaign.metrics.clicks.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Clicks
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary-600">
                      {selectedCampaign.metrics.conversions}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Conversions
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${selectedCampaign.metrics.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Revenue
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Campaign Details
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Type:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {selectedCampaign.type}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Audience:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedCampaign.targetAudience}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Start:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            selectedCampaign.startDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          End:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {new Date(
                            selectedCampaign.endDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Budget & Spend
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Budget:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          ${selectedCampaign.budget?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Spent:
                        </span>
                        <span className="font-medium text-orange-600">
                          ${selectedCampaign.spent?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Remaining:
                        </span>
                        <span className="font-medium text-primary-600">
                          $
                          {(
                            (selectedCampaign.budget || 0) -
                            (selectedCampaign.spent || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Performance Metrics
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          CTR:
                        </span>
                        <span className="font-medium text-green-600">
                          {selectedCampaign.metrics.ctr.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          CPC:
                        </span>
                        <span className="font-medium text-primary-600">
                          ${selectedCampaign.metrics.cpc.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          ROAS:
                        </span>
                        <span className="font-medium text-secondary-600">
                          {selectedCampaign.metrics.roas.toFixed(1)}x
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorMarketingCampaigns;
