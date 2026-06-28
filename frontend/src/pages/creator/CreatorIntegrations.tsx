import { useState } from "react";
import {
  Zap,
  CreditCard,
  Package,
  Users,
  FileText,
  Shield,
  ExternalLink,
  Settings,
  CheckCircle,
  X,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const CreatorIntegrations = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock integrations data
  const integrations = [
    {
      id: "stripe",
      name: "Stripe",
      category: "payment",
      description: "Accept credit card payments worldwide",
      icon: CreditCard,
      connected: true,
      tier: "enterprise",
      features: [
        "Global payments",
        "Subscription billing",
        "Advanced fraud protection",
      ],
    },
    {
      id: "paypal",
      name: "PayPal",
      category: "payment",
      description: "PayPal and Buy Now Pay Later options",
      icon: CreditCard,
      connected: false,
      tier: "enterprise",
      features: ["PayPal checkout", "BNPL options", "Seller protection"],
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      category: "accounting",
      description: "Sync your sales data with QuickBooks",
      icon: FileText,
      connected: false,
      tier: "enterprise",
      features: ["Auto sync sales", "Expense tracking", "Tax preparation"],
    },
    {
      id: "mailchimp",
      name: "Mailchimp",
      category: "marketing",
      description: "Email marketing and automation",
      icon: Users,
      connected: true,
      tier: "enterprise",
      features: [
        "Email campaigns",
        "Customer segmentation",
        "Automated workflows",
      ],
    },
    {
      id: "inventory-plus",
      name: "Inventory Plus",
      category: "inventory",
      description: "Advanced inventory management system",
      icon: Package,
      connected: false,
      tier: "enterprise",
      features: ["Multi-location tracking", "Low stock alerts", "Forecasting"],
    },
    {
      id: "custom-api",
      name: "Custom API",
      category: "api",
      description: "Build custom integrations with our API",
      icon: Zap,
      connected: false,
      tier: "enterprise",
      features: ["REST API access", "Webhooks", "Rate limiting"],
    },
  ];

  const categories = [
    { id: "all", label: "All Integrations", icon: Zap },
    { id: "payment", label: "Payment Gateways", icon: CreditCard },
    { id: "inventory", label: "Inventory Management", icon: Package },
    { id: "accounting", label: "Accounting", icon: FileText },
    { id: "marketing", label: "Marketing", icon: Users },
    { id: "api", label: "API & Webhooks", icon: Zap },
  ];

  const filteredIntegrations =
    activeCategory === "all"
      ? integrations
      : integrations.filter(
          (integration) => integration.category === activeCategory
        );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Integrations
            </h1>
            <Shield className="w-6 h-6 text-secondary-500" />
            <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              Enterprise Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your store with third-party services and APIs
          </p>
        </div>

        <Button className="bg-secondary-600 hover:bg-secondary-700">
          <ExternalLink className="w-4 h-4 mr-2" />
          Browse App Store
        </Button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? "bg-secondary-100 text-secondary-700 dark:bg-secondary-900/30 dark:text-secondary-300"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Card
              key={integration.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {integration.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {integration.tier === "enterprise" && (
                        <Shield className="w-3 h-3 text-secondary-500" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {integration.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {integration.connected ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs">
                      Connected
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 text-xs">
                      Not Connected
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {integration.description}
              </p>

              <div className="space-y-2 mb-6">
                {integration.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                {integration.connected ? (
                  <>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    className="flex-1 bg-secondary-600 hover:bg-secondary-700"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* API Access Card */}
      <Card className="p-6 bg-gradient-to-br from-secondary-50 to-pink-50 dark:from-secondary-900/20 dark:to-pink-900/20 border-secondary-200 dark:border-secondary-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Access & Custom Integrations
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Build custom integrations with our comprehensive API
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-secondary-100 text-secondary-800 dark:bg-secondary-900 dark:text-secondary-200">
              Enterprise Only
            </Badge>
            <Button className="bg-secondary-600 hover:bg-secondary-700">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600 mb-2">
              REST API
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Full CRUD operations on all resources
            </p>
          </div>
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600 mb-2">
              Webhooks
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time event notifications
            </p>
          </div>
          <div className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-secondary-600 mb-2">SDK</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              JavaScript, Python, PHP libraries
            </p>
          </div>
        </div>
      </Card>

      {/* Empty state when no integrations match filter */}
      {filteredIntegrations.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No integrations found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We couldn't find any integrations in this category.
          </p>
          <Button variant="outline" onClick={() => setActiveCategory("all")}>
            View All Integrations
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CreatorIntegrations;
