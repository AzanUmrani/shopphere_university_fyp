import { useState, useEffect } from "react";
import {
  Users,
  Target,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Shield,
  X,
  Save,
  DollarSign,
  TrendingUp,
  Zap,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: SegmentCriteria;
  customerCount: number;
  averageValue: number;
  totalRevenue: number;
  growthRate: number;
  createdAt: string;
  lastUpdated: string;
  isActive: boolean;
  color: string;
}

interface SegmentCriteria {
  totalSpent?: { min?: number; max?: number };
  orderCount?: { min?: number; max?: number };
  lastOrderDays?: number;
  location?: string[];
  tags?: string[];
  joinedWithin?: number; // days
  averageOrderValue?: { min?: number; max?: number };
  lifetimeValue?: { min?: number; max?: number };
}

const CreatorCustomerSegments = () => {
  const [segments, setSegments] = useState<CustomerSegment[]>([]);
  const [showCreateSegment, setShowCreateSegment] = useState(false);
  const [selectedSegment, setSelectedSegment] =
    useState<CustomerSegment | null>(null);

  // Mock segment data
  useEffect(() => {
    const mockSegments: CustomerSegment[] = [
      {
        id: "1",
        name: "VIP Customers",
        description: "High-value customers with lifetime value over $2000",
        criteria: {
          lifetimeValue: { min: 2000 },
          orderCount: { min: 5 },
        },
        customerCount: 45,
        averageValue: 2850,
        totalRevenue: 128250,
        growthRate: 12.5,
        createdAt: "2024-01-15",
        lastUpdated: "2024-02-10",
        isActive: true,
        color: "#FFD700",
      },
      {
        id: "2",
        name: "New Customers",
        description: "Customers who joined in the last 30 days",
        criteria: {
          joinedWithin: 30,
        },
        customerCount: 28,
        averageValue: 145,
        totalRevenue: 4060,
        growthRate: 45.2,
        createdAt: "2024-01-20",
        lastUpdated: "2024-02-11",
        isActive: true,
        color: "#22C55E",
      },
      {
        id: "3",
        name: "At-Risk Customers",
        description: "Customers who haven't ordered in 60+ days",
        criteria: {
          lastOrderDays: 60,
          orderCount: { min: 1 },
        },
        customerCount: 82,
        averageValue: 325,
        totalRevenue: 26650,
        growthRate: -8.3,
        createdAt: "2024-01-10",
        lastUpdated: "2024-02-09",
        isActive: true,
        color: "#EF4444",
      },
      {
        id: "4",
        name: "Frequent Buyers",
        description: "Customers with 10+ orders and high engagement",
        criteria: {
          orderCount: { min: 10 },
          averageOrderValue: { min: 150 },
        },
        customerCount: 23,
        averageValue: 1250,
        totalRevenue: 28750,
        growthRate: 18.7,
        createdAt: "2024-01-25",
        lastUpdated: "2024-02-08",
        isActive: true,
        color: "#8B5CF6",
      },
      {
        id: "5",
        name: "Regional - West Coast",
        description: "Customers from California, Oregon, and Washington",
        criteria: {
          location: ["California", "Oregon", "Washington"],
        },
        customerCount: 156,
        averageValue: 485,
        totalRevenue: 75660,
        growthRate: 6.2,
        createdAt: "2024-01-05",
        lastUpdated: "2024-02-07",
        isActive: true,
        color: "#F59E0B",
      },
    ];

    setSegments(mockSegments);
  }, []);

  const [newSegment, setNewSegment] = useState<Partial<CustomerSegment>>({
    name: "",
    description: "",
    criteria: {},
    isActive: true,
    color: "#8B5CF6",
  });

  const handleCreateSegment = () => {
    if (!newSegment.name || !newSegment.description) return;

    const segment: CustomerSegment = {
      id: Date.now().toString(),
      name: newSegment.name,
      description: newSegment.description,
      criteria: newSegment.criteria || {},
      customerCount: Math.floor(Math.random() * 100) + 10, // Mock count
      averageValue: Math.floor(Math.random() * 1000) + 100, // Mock value
      totalRevenue: 0, // Will be calculated
      growthRate: Math.random() * 20 - 10, // Mock growth rate
      createdAt: new Date().toISOString().split("T")[0],
      lastUpdated: new Date().toISOString().split("T")[0],
      isActive: newSegment.isActive ?? true,
      color: newSegment.color || "#8B5CF6",
    };

    segment.totalRevenue = segment.customerCount * segment.averageValue;

    setSegments([...segments, segment]);
    setNewSegment({
      name: "",
      description: "",
      criteria: {},
      isActive: true,
      color: "#8B5CF6",
    });
    setShowCreateSegment(false);
  };

  const handleDeleteSegment = (segmentId: string) => {
    setSegments(segments.filter((s) => s.id !== segmentId));
  };

  const formatCriteria = (criteria: SegmentCriteria) => {
    const conditions = [];

    if (criteria.lifetimeValue?.min) {
      conditions.push(`LTV > $${criteria.lifetimeValue.min}`);
    }
    if (criteria.orderCount?.min) {
      conditions.push(`Orders ≥ ${criteria.orderCount.min}`);
    }
    if (criteria.lastOrderDays) {
      conditions.push(`Inactive ${criteria.lastOrderDays}+ days`);
    }
    if (criteria.joinedWithin) {
      conditions.push(`Joined within ${criteria.joinedWithin} days`);
    }
    if (criteria.averageOrderValue?.min) {
      conditions.push(`AOV ≥ $${criteria.averageOrderValue.min}`);
    }
    if (criteria.location?.length) {
      conditions.push(`Location: ${criteria.location.join(", ")}`);
    }

    return conditions.length > 0 ? conditions.join(" • ") : "No criteria set";
  };

  const totalCustomersInSegments = segments.reduce(
    (sum, s) => sum + s.customerCount,
    0
  );
  const totalRevenueFromSegments = segments.reduce(
    (sum, s) => sum + s.totalRevenue,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Customer Segments
            </h1>
            <Target className="w-6 h-6 text-primary-500" />
            <Shield className="w-5 h-5 text-secondary-500" />
            <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              Enterprise Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage customer segments for targeted marketing
          </p>
        </div>

        <Button
          onClick={() => setShowCreateSegment(true)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Segment
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Segments
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {segments.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Segmented Customers
              </p>
              <p className="text-2xl font-bold text-secondary-600">
                {totalCustomersInSegments}
              </p>
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
                Segment Revenue
              </p>
              <p className="text-2xl font-bold text-green-600">
                ${totalRevenueFromSegments.toLocaleString()}
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
                Avg Growth Rate
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {(
                  segments.reduce((sum, s) => sum + s.growthRate, 0) /
                  segments.length
                ).toFixed(1)}
                %
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <Card
            key={segment.id}
            className="p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {segment.name}
                </h3>
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSegment(segment)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => console.log("Edit segment:", segment)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSegment(segment.id)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {segment.description}
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Customers:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {segment.customerCount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Avg Value:
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  ${segment.averageValue}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Total Revenue:
                </span>
                <span className="font-medium text-green-600">
                  ${segment.totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Growth Rate:
                </span>
                <span
                  className={`font-medium ${
                    segment.growthRate >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {segment.growthRate > 0 ? "+" : ""}
                  {segment.growthRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mb-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Criteria:
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {formatCriteria(segment.criteria)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <Badge
                className={
                  segment.isActive
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                }
              >
                {segment.isActive ? "Active" : "Inactive"}
              </Badge>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700">
                  <Zap className="w-4 h-4 mr-1" />
                  Campaign
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Segment Modal */}
      {showCreateSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Create New Segment
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateSegment(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Segment Name
                    </label>
                    <input
                      type="text"
                      value={newSegment.name || ""}
                      onChange={(e) =>
                        setNewSegment({ ...newSegment, name: e.target.value })
                      }
                      placeholder="Enter segment name"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newSegment.description || ""}
                      onChange={(e) =>
                        setNewSegment({
                          ...newSegment,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe this customer segment"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Segment Color
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={newSegment.color || "#8B5CF6"}
                        onChange={(e) =>
                          setNewSegment({
                            ...newSegment,
                            color: e.target.value,
                          })
                        }
                        className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Choose a color for this segment
                      </span>
                    </div>
                  </div>
                </div>

                {/* Criteria Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Segment Criteria
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Lifetime Value
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 1000"
                        onChange={(e) =>
                          setNewSegment({
                            ...newSegment,
                            criteria: {
                              ...newSegment.criteria,
                              lifetimeValue: { min: Number(e.target.value) },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Minimum Orders
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5"
                        onChange={(e) =>
                          setNewSegment({
                            ...newSegment,
                            criteria: {
                              ...newSegment.criteria,
                              orderCount: { min: Number(e.target.value) },
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Inactive for (days)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        onChange={(e) =>
                          setNewSegment({
                            ...newSegment,
                            criteria: {
                              ...newSegment.criteria,
                              lastOrderDays: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Joined within (days)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 30"
                        onChange={(e) =>
                          setNewSegment({
                            ...newSegment,
                            criteria: {
                              ...newSegment.criteria,
                              joinedWithin: Number(e.target.value),
                            },
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateSegment(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateSegment}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Create Segment
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Segment Detail Modal */}
      {selectedSegment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: selectedSegment.color }}
                  />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedSegment.name}
                  </h2>
                  <Badge
                    className={
                      selectedSegment.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    }
                  >
                    {selectedSegment.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSegment(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedSegment.description}
                </p>

                {/* Criteria */}
                <Card className="p-4 bg-gray-50 dark:bg-gray-800/50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Segment Criteria
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatCriteria(selectedSegment.criteria)}
                  </p>
                </Card>

                {/* Performance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-secondary-600">
                      {selectedSegment.customerCount}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Customers
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${selectedSegment.totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Total Revenue
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary-600">
                      ${selectedSegment.averageValue}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Avg Value
                    </div>
                  </Card>
                  <Card className="p-4 text-center">
                    <div
                      className={`text-2xl font-bold ${
                        selectedSegment.growthRate >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedSegment.growthRate > 0 ? "+" : ""}
                      {selectedSegment.growthRate.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Growth Rate
                    </div>
                  </Card>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    <Zap className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Button>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Customers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      console.log("Edit segment:", selectedSegment);
                      setSelectedSegment(null);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Segment
                  </Button>
                  <Button variant="outline">
                    <Eye className="w-4 h-4 mr-2" />
                    View Customers
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorCustomerSegments;
