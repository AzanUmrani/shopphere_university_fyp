import { useState } from "react";
import {
  Zap,
  Clock,
  Target,
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Mail,
  ShoppingCart,
  Users,
  TrendingUp,
  Filter,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const CreatorAutomation = () => {
  const [activeTab, setActiveTab] = useState("workflows");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock automation data
  const workflows = [
    {
      id: "welcome-email",
      name: "New Customer Welcome Series",
      description: "Send welcome emails to new customers with discount codes",
      status: "active",
      trigger: "Customer Registration",
      actions: ["Send Welcome Email", "Add to Newsletter", "Send 10% Discount"],
      performance: { triggered: 156, completed: 152, conversion: 23 },
      lastRun: "2 hours ago",
      type: "email",
    },
    {
      id: "abandoned-cart",
      name: "Abandoned Cart Recovery",
      description: "Recover lost sales with targeted cart abandonment emails",
      status: "active",
      trigger: "Cart Abandoned (30 min)",
      actions: [
        "Send Reminder Email",
        "Send 15% Discount (24h)",
        "Final Reminder (48h)",
      ],
      performance: { triggered: 89, completed: 67, conversion: 18 },
      lastRun: "15 minutes ago",
      type: "cart",
    },
    {
      id: "review-request",
      name: "Post-Purchase Review Request",
      description: "Automatically request reviews from satisfied customers",
      status: "paused",
      trigger: "Order Delivered (7 days)",
      actions: ["Send Review Request", "Follow-up Reminder (14 days)"],
      performance: { triggered: 234, completed: 189, conversion: 45 },
      lastRun: "1 day ago",
      type: "review",
    },
    {
      id: "inventory-alert",
      name: "Low Stock Alert System",
      description: "Get notified when product inventory runs low",
      status: "active",
      trigger: "Stock Below Threshold",
      actions: ["Send Admin Alert", "Create Restock Task", "Notify Supplier"],
      performance: { triggered: 12, completed: 12, conversion: 0 },
      lastRun: "3 days ago",
      type: "inventory",
    },
    {
      id: "vip-customer",
      name: "VIP Customer Identification",
      description: "Automatically identify and tag high-value customers",
      status: "active",
      trigger: "Customer Lifetime Value > $500",
      actions: [
        "Add VIP Tag",
        "Send Exclusive Offers",
        "Assign Account Manager",
      ],
      performance: { triggered: 45, completed: 45, conversion: 12 },
      lastRun: "6 hours ago",
      type: "customer",
    },
  ];

  const templates = [
    {
      id: "welcome",
      name: "Customer Welcome Flow",
      description: "Multi-step welcome sequence for new customers",
      category: "Email Marketing",
      steps: 5,
      estimatedTime: "2 weeks",
    },
    {
      id: "winback",
      name: "Win-Back Campaign",
      description: "Re-engage inactive customers with special offers",
      category: "Email Marketing",
      steps: 3,
      estimatedTime: "1 week",
    },
    {
      id: "upsell",
      name: "Post-Purchase Upsell",
      description: "Recommend related products after successful purchase",
      category: "Sales",
      steps: 4,
      estimatedTime: "3 days",
    },
    {
      id: "birthday",
      name: "Birthday Campaign",
      description: "Send personalized birthday offers to customers",
      category: "Customer Retention",
      steps: 2,
      estimatedTime: "1 day",
    },
  ];

  const filteredWorkflows =
    filterStatus === "all"
      ? workflows
      : workflows.filter((workflow) => workflow.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "cart":
        return ShoppingCart;
      case "review":
        return TrendingUp;
      case "inventory":
        return Target;
      case "customer":
        return Users;
      default:
        return Zap;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Automation
            </h1>
            <Zap className="w-6 h-6 text-orange-500" />
            <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
              Enterprise Feature
            </Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Automate your marketing, sales, and customer service workflows
          </p>
        </div>

        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("workflows")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "workflows"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Active Workflows
        </button>
        <button
          onClick={() => setActiveTab("templates")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "templates"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Templates
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "analytics"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === "workflows" && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Status:
              </span>
            </div>
            <div className="flex space-x-2">
              {["all", "active", "paused", "error"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                    filterStatus === status
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Workflows Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredWorkflows.map((workflow) => {
              const TypeIcon = getTypeIcon(workflow.type);
              return (
                <Card key={workflow.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <TypeIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {workflow.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workflow.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(workflow.status)}
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        TRIGGER
                      </span>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {workflow.trigger}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        ACTIONS ({workflow.actions.length})
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {workflow.actions.slice(0, 2).map((action, index) => (
                          <Badge
                            key={index}
                            className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs"
                          >
                            {action}
                          </Badge>
                        ))}
                        {workflow.actions.length > 2 && (
                          <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-xs">
                            +{workflow.actions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {workflow.performance.triggered}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Triggered
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {workflow.performance.completed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {workflow.performance.conversion}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Conversions
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last run: {workflow.lastRun}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      {workflow.status === "active" ? (
                        <Button variant="outline" size="sm">
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <Badge className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                    {template.category}
                  </Badge>
                </div>

                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {template.description}
                </p>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Steps:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {template.steps}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Setup Time:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {template.estimatedTime}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Workflows
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {workflows.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Workflows
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {workflows.filter((w) => w.status === "active").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Triggers
                  </p>
                  <p className="text-2xl font-bold text-primary-600">
                    {workflows.reduce(
                      (sum, w) => sum + w.performance.triggered,
                      0
                    )}
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
                    Conversions
                  </p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {workflows.reduce(
                      (sum, w) => sum + w.performance.conversion,
                      0
                    )}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Workflow Performance
            </h3>
            <div className="space-y-4">
              {workflows.map((workflow) => {
                const conversionRate = (
                  (workflow.performance.conversion /
                    workflow.performance.triggered) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={workflow.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {workflow.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {workflow.performance.triggered} triggers •{" "}
                          {conversionRate}% conversion rate
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {workflow.performance.conversion}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        conversions
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorAutomation;
