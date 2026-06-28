import {
  Plus,
  Truck,
  Clock,
  DollarSign,
  Edit,
  Copy,
  Package,
  Globe,
  Settings,
  Zap,
  Shield,
  MoreVertical,
  Calendar,
  Weight,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

// Mock shipping profiles data
const shippingProfiles = [
  {
    id: "SP-001",
    name: "Standard Shipping",
    description: "Regular delivery for most products",
    isDefault: true,
    isActive: true,
    shippingRates: [
      {
        id: "SR-001",
        region: "Local (Same City)",
        minWeight: 0,
        maxWeight: 5,
        price: 5.99,
        estimatedDays: "1-2 business days",
        carrier: "Local Courier",
        minOrderAmount: undefined,
      },
      {
        id: "SR-002",
        region: "National",
        minWeight: 0,
        maxWeight: 5,
        price: 12.99,
        estimatedDays: "3-5 business days",
        carrier: "FedEx",
        minOrderAmount: undefined,
      },
      {
        id: "SR-003",
        region: "International",
        minWeight: 0,
        maxWeight: 5,
        price: 25.99,
        estimatedDays: "7-14 business days",
        carrier: "DHL Express",
        minOrderAmount: undefined,
      },
    ],
    applicableProducts: 156,
    totalOrders: 1234,
    lastUpdated: "2024-02-10",
  },
  {
    id: "SP-002",
    name: "Express Shipping",
    description: "Fast delivery for urgent orders",
    isDefault: false,
    isActive: true,
    shippingRates: [
      {
        id: "SR-004",
        region: "Local (Same City)",
        minWeight: 0,
        maxWeight: 5,
        price: 12.99,
        estimatedDays: "Same day",
        carrier: "Express Courier",
        minOrderAmount: undefined,
      },
      {
        id: "SR-005",
        region: "National",
        minWeight: 0,
        maxWeight: 5,
        price: 24.99,
        estimatedDays: "1-2 business days",
        carrier: "FedEx Express",
        minOrderAmount: undefined,
      },
      {
        id: "SR-006",
        region: "International",
        minWeight: 0,
        maxWeight: 5,
        price: 45.99,
        estimatedDays: "2-5 business days",
        carrier: "DHL Express",
        minOrderAmount: undefined,
      },
    ],
    applicableProducts: 89,
    totalOrders: 456,
    lastUpdated: "2024-02-08",
  },
  {
    id: "SP-003",
    name: "Free Shipping",
    description: "Free delivery for orders over $50",
    isDefault: false,
    isActive: true,
    shippingRates: [
      {
        id: "SR-007",
        region: "Local (Same City)",
        minWeight: 0,
        maxWeight: 10,
        price: 0,
        estimatedDays: "2-3 business days",
        carrier: "Standard Post",
        minOrderAmount: 50,
      },
      {
        id: "SR-008",
        region: "National",
        minWeight: 0,
        maxWeight: 10,
        price: 0,
        estimatedDays: "5-7 business days",
        carrier: "Standard Post",
        minOrderAmount: 75,
      },
    ],
    applicableProducts: 45,
    totalOrders: 789,
    lastUpdated: "2024-02-05",
  },
  {
    id: "SP-004",
    name: "Heavy Items",
    description: "Special shipping for bulky products",
    isDefault: false,
    isActive: false,
    shippingRates: [
      {
        id: "SR-009",
        region: "Local (Same City)",
        minWeight: 10,
        maxWeight: 50,
        price: 25.99,
        estimatedDays: "3-5 business days",
        carrier: "Freight Service",
        minOrderAmount: undefined,
      },
      {
        id: "SR-010",
        region: "National",
        minWeight: 10,
        maxWeight: 50,
        price: 49.99,
        estimatedDays: "7-10 business days",
        carrier: "Freight Service",
        minOrderAmount: undefined,
      },
    ],
    applicableProducts: 12,
    totalOrders: 67,
    lastUpdated: "2024-01-28",
  },
];

const CarrierOptions = [
  { id: "fedex", name: "FedEx", logo: "FX" },
  { id: "dhl", name: "DHL Express", logo: "DH" },
  { id: "ups", name: "UPS", logo: "UP" },
  { id: "usps", name: "USPS", logo: "US" },
  { id: "local", name: "Local Courier", logo: "LC" },
];

const CreatorShipping = () => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCarrierLogo = (carrierName: string) => {
    const carrier = CarrierOptions.find((c) =>
      carrierName.toLowerCase().includes(c.name.toLowerCase())
    );
    return carrier ? carrier.logo : carrierName.substring(0, 2).toUpperCase();
  };

  const activeProfiles = shippingProfiles.filter((p) => p.isActive).length;
  const totalProducts = shippingProfiles.reduce(
    (sum, p) => sum + p.applicableProducts,
    0
  );
  const totalOrders = shippingProfiles.reduce(
    (sum, p) => sum + p.totalOrders,
    0
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shipping Profiles
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your shipping rates and delivery options
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button className="bg-gradient-to-r from-secondary-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            Create Profile
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Profiles
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {activeProfiles}
              </p>
              <p className="text-sm text-gray-500 mt-2">Shipping options</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Products Covered
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalProducts}
              </p>
              <p className="text-sm text-gray-500 mt-2">Total products</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Orders Shipped
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {totalOrders.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-2">All time</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-secondary-500 to-pink-500 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg. Shipping Cost
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                $15.49
              </p>
              <p className="text-sm text-gray-500 mt-2">Per order</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </Card>
      </div>

      {/* Shipping Profiles */}
      <div className="space-y-6">
        {shippingProfiles.map((profile) => (
          <Card
            key={profile.id}
            className="bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {profile.name}
                    </h3>
                    {profile.isDefault && <Badge variant="info">Default</Badge>}
                    {profile.isActive ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {profile.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Products
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {profile.applicableProducts}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Orders
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {profile.totalOrders}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Regions
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {profile.shippingRates.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatDate(profile.lastUpdated)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="p-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Rates
              </h4>
              <div className="space-y-4">
                {profile.shippingRates.map((rate) => (
                  <div
                    key={rate.id}
                    className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-secondary-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                          {getCarrierLogo(rate.carrier)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">
                              {rate.region}
                            </h5>
                            <Badge variant="secondary" className="text-xs">
                              {rate.carrier}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Weight className="w-4 h-4 mr-1" />
                              {rate.minWeight}-{rate.maxWeight}kg
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {rate.estimatedDays}
                            </div>
                            {rate.minOrderAmount && (
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                Min ${rate.minOrderAmount}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {rate.price === 0 ? "FREE" : `$${rate.price}`}
                        </p>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          {rate.price === 0 ? (
                            <>
                              <Shield className="w-3 h-3 mr-1" />
                              Free shipping
                            </>
                          ) : rate.estimatedDays.includes("Same day") ? (
                            <>
                              <Zap className="w-3 h-3 mr-1" />
                              Express
                            </>
                          ) : (
                            <>
                              <Truck className="w-3 h-3 mr-1" />
                              Standard
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Quick Actions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your shipping settings efficiently
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline">
              <Globe className="w-4 h-4 mr-2" />
              Regional Settings
            </Button>
            <Button variant="outline">
              <Package className="w-4 h-4 mr-2" />
              Bulk Product Assignment
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Holiday Schedule
            </Button>
            <Button className="bg-gradient-to-r from-secondary-600 to-pink-600">
              <Settings className="w-4 h-4 mr-2" />
              Shipping Calculator
            </Button>
          </div>
        </div>
      </Card>

      {/* Carrier Integration */}
      <Card className="p-6 bg-white/70 backdrop-blur-xl border border-white/30 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Carrier Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Connect with shipping carriers for live rates and tracking
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {CarrierOptions.map((carrier) => (
            <div
              key={carrier.id}
              className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-cyan-500 flex items-center justify-center text-white font-bold mx-auto mb-2">
                {carrier.logo}
              </div>
              <p className="font-medium text-gray-900 dark:text-white text-sm">
                {carrier.name}
              </p>
              <Button size="sm" variant="outline" className="mt-2 w-full">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default CreatorShipping;
