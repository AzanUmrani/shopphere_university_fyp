import { useState, useEffect } from "react";
import {
  Star,
  Gift,
  Trophy,
  Users,
  DollarSign,
  Plus,
  Edit,
  Eye,
  Settings,
  Crown,
  Shield,
  Zap,
  Check,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface LoyaltyTier {
  id: string;
  name: string;
  description: string;
  minimumSpend: number;
  minimumOrders?: number;
  benefits: string[];
  discountPercentage: number;
  color: string;
  icon: "Star" | "Gift" | "Trophy" | "Crown";
  isActive: boolean;
  customerCount: number;
}

interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  type: "discount" | "freeShipping" | "freeProduct" | "points";
  value: number;
  pointsCost: number;
  isActive: boolean;
  redemptions: number;
  expiryDays?: number;
}

interface LoyaltyMember {
  id: string;
  customerName: string;
  email: string;
  currentTier: string;
  points: number;
  totalSpent: number;
  joinDate: string;
  lastActivity: string;
  ordersCount: number;
}

const CreatorLoyaltyProgram = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [members, setMembers] = useState<LoyaltyMember[]>([]);

  // Mock data
  useEffect(() => {
    const mockTiers: LoyaltyTier[] = [
      {
        id: "1",
        name: "Bronze",
        description: "Start your loyalty journey",
        minimumSpend: 0,
        minimumOrders: 1,
        benefits: ["2% cashback", "Early access to sales", "Birthday discount"],
        discountPercentage: 2,
        color: "#CD7F32",
        icon: "Star",
        isActive: true,
        customerCount: 145,
      },
      {
        id: "2",
        name: "Silver",
        description: "Loyal customers with good spending",
        minimumSpend: 500,
        minimumOrders: 5,
        benefits: [
          "5% cashback",
          "Free shipping",
          "Priority support",
          "Exclusive products",
        ],
        discountPercentage: 5,
        color: "#C0C0C0",
        icon: "Gift",
        isActive: true,
        customerCount: 89,
      },
      {
        id: "3",
        name: "Gold",
        description: "High-value customers",
        minimumSpend: 1500,
        minimumOrders: 10,
        benefits: [
          "10% cashback",
          "Free expedited shipping",
          "Personal shopper",
          "VIP events",
        ],
        discountPercentage: 10,
        color: "#FFD700",
        icon: "Trophy",
        isActive: true,
        customerCount: 34,
      },
      {
        id: "4",
        name: "Platinum",
        description: "Our most valued customers",
        minimumSpend: 3000,
        minimumOrders: 20,
        benefits: [
          "15% cashback",
          "Free everything",
          "Dedicated manager",
          "Custom products",
        ],
        discountPercentage: 15,
        color: "#E5E4E2",
        icon: "Crown",
        isActive: true,
        customerCount: 12,
      },
    ];

    const mockRewards: LoyaltyReward[] = [
      {
        id: "1",
        name: "$10 Off Next Order",
        description: "Get $10 discount on your next purchase",
        type: "discount",
        value: 10,
        pointsCost: 100,
        isActive: true,
        redemptions: 45,
        expiryDays: 30,
      },
      {
        id: "2",
        name: "Free Shipping",
        description: "Free shipping on any order",
        type: "freeShipping",
        value: 0,
        pointsCost: 50,
        isActive: true,
        redemptions: 123,
        expiryDays: 60,
      },
      {
        id: "3",
        name: "20% Off Coupon",
        description: "20% discount on entire order",
        type: "discount",
        value: 20,
        pointsCost: 200,
        isActive: true,
        redemptions: 28,
      },
      {
        id: "4",
        name: "Free Premium Product",
        description: "Choose any premium product for free",
        type: "freeProduct",
        value: 50,
        pointsCost: 500,
        isActive: false,
        redemptions: 8,
      },
    ];

    const mockMembers: LoyaltyMember[] = [
      {
        id: "1",
        customerName: "Sarah Johnson",
        email: "sarah@example.com",
        currentTier: "Gold",
        points: 850,
        totalSpent: 2450,
        joinDate: "2024-01-15",
        lastActivity: "2024-02-10",
        ordersCount: 12,
      },
      {
        id: "2",
        customerName: "Michael Chen",
        email: "michael@example.com",
        currentTier: "Silver",
        points: 340,
        totalSpent: 890,
        joinDate: "2024-02-01",
        lastActivity: "2024-02-09",
        ordersCount: 6,
      },
      {
        id: "3",
        customerName: "Emma Davis",
        email: "emma@example.com",
        currentTier: "Bronze",
        points: 120,
        totalSpent: 340,
        joinDate: "2024-01-20",
        lastActivity: "2024-02-08",
        ordersCount: 3,
      },
    ];

    setTiers(mockTiers);
    setRewards(mockRewards);
    setMembers(mockMembers);
  }, []);

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Star":
        return Star;
      case "Gift":
        return Gift;
      case "Trophy":
        return Trophy;
      case "Crown":
        return Crown;
      default:
        return Star;
    }
  };

  const totalMembers = members.length;
  const totalPointsIssued = members.reduce(
    (sum, member) => sum + member.points,
    0
  );
  const averageSpending =
    members.reduce((sum, member) => sum + member.totalSpent, 0) /
    members.length;
  const totalRedemptions = rewards.reduce(
    (sum, reward) => sum + reward.redemptions,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Loyalty Program
            </h1>
            <Star className="w-6 h-6 text-yellow-500" />
            <Shield className="w-5 h-5 text-secondary-500" />
            <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              Enterprise Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Reward loyal customers and drive repeat purchases
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Program Settings
          </Button>
          <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
            <Zap className="w-4 h-4 mr-2" />
            Launch Campaign
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {["overview", "tiers", "rewards", "members"].map((tab) => (
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Members
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalMembers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Points Issued
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {totalPointsIssued.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Avg Member Spending
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    ${averageSpending.toFixed(0)}
                  </p>
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
                    Total Redemptions
                  </p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {totalRedemptions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Tier Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Tier Distribution
            </h3>
            <div className="space-y-4">
              {tiers.map((tier) => {
                const percentage = (tier.customerCount / totalMembers) * 100;
                const IconComponent = getIconComponent(tier.icon);

                return (
                  <div
                    key={tier.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tier.color}20` }}
                      >
                        <IconComponent
                          className="w-4 h-4"
                          style={{ color: tier.color }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {tier.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {tier.customerCount} members
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            backgroundColor: tier.color,
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recent Member Activity
            </h3>
            <div className="space-y-3">
              {members.slice(0, 5).map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-secondary-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.customerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {member.customerName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {member.currentTier} • {member.points} points
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${member.totalSpent}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.ordersCount} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "tiers" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Loyalty Tiers
            </h2>
            <Button
              onClick={() => console.log("Add Tier")}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiers.map((tier) => {
              const IconComponent = getIconComponent(tier.icon);

              return (
                <Card
                  key={tier.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${tier.color}20` }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: tier.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {tier.name}
                        </h3>
                        <Badge
                          className={
                            tier.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                          }
                        >
                          {tier.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {tier.description}
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Min Spend:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${tier.minimumSpend}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Min Orders:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tier.minimumOrders || 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Members:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {tier.customerCount}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Discount:
                      </span>
                      <span className="font-medium text-green-600">
                        {tier.discountPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Benefits:
                    </p>
                    <div className="space-y-1">
                      {tier.benefits.slice(0, 3).map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Check className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {benefit}
                          </span>
                        </div>
                      ))}
                      {tier.benefits.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{tier.benefits.length - 3} more benefits
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "rewards" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Loyalty Rewards
            </h2>
            <Button
              onClick={() => console.log("Add Reward")}
              className="bg-secondary-600 hover:bg-secondary-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Reward
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-secondary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {reward.name}
                      </h3>
                      <Badge
                        className={
                          reward.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        }
                      >
                        {reward.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {reward.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Points Cost:
                    </span>
                    <span className="font-medium text-yellow-600">
                      {reward.pointsCost} pts
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Value:
                    </span>
                    <span className="font-medium text-green-600">
                      {reward.type === "discount"
                        ? `$${reward.value}`
                        : reward.type === "freeShipping"
                        ? "Free Shipping"
                        : `$${reward.value}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Redemptions:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {reward.redemptions}
                    </span>
                  </div>
                  {reward.expiryDays && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Expires:
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {reward.expiryDays} days
                      </span>
                    </div>
                  )}
                </div>

                <Badge
                  className={`w-full justify-center ${
                    reward.type === "discount"
                      ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                      : reward.type === "freeShipping"
                      ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                      : reward.type === "freeProduct"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200"
                  }`}
                >
                  {reward.type === "discount"
                    ? "Discount"
                    : reward.type === "freeShipping"
                    ? "Free Shipping"
                    : reward.type === "freeProduct"
                    ? "Free Product"
                    : "Points"}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Loyalty Members
          </h2>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Tier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {members.map((member) => {
                    const tier = tiers.find(
                      (t) => t.name === member.currentTier
                    );
                    const IconComponent = tier
                      ? getIconComponent(tier.icon)
                      : Star;

                    return (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-secondary-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {member.customerName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {member.customerName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-6 h-6 rounded flex items-center justify-center"
                              style={{ backgroundColor: `${tier?.color}20` }}
                            >
                              <IconComponent
                                className="w-3 h-3"
                                style={{ color: tier?.color }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.currentTier}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-yellow-600">
                          {member.points} pts
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${member.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {member.ordersCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(member.lastActivity).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorLoyaltyProgram;
