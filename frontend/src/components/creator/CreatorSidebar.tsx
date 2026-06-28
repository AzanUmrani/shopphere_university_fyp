import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingBag,
  DollarSign,
  Users,
  Settings,
  Star,
  Truck,
  TrendingUp,
  CreditCard,
  Store,
  Tag,
  FileText,
  LogOut,
  Plus,
  ChevronDown,
  ChevronRight,
  Crown,
  Zap,
  Shield,
  X,
} from "lucide-react";
import { useAppDispatch } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";
import { authService } from "../../services/auth";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
  children?: SidebarItem[];
  requiredTier?: "free" | "pro" | "enterprise";
  isNew?: boolean;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
    path: "/creator/dashboard",
    description: "Overview of your store performance",
  },
  {
    id: "products",
    label: "Products",
    icon: Package,
    path: "/creator/products",
    description: "Manage your product catalog",
    children: [
      {
        id: "all-products",
        label: "All Products",
        icon: Package,
        path: "/creator/products",
        description: "View and manage all products",
      },
      {
        id: "add-product",
        label: "Add Product",
        icon: Plus,
        path: "/creator/products/add",
        description: "Add new products to your store",
      },
      {
        id: "categories",
        label: "Categories",
        icon: Tag,
        path: "/creator/products/categories",
        description: "Organize products into categories",
      },
      {
        id: "inventory",
        label: "Inventory",
        icon: Package,
        path: "/creator/products/inventory",
        description: "Track stock levels and inventory",
      },
      {
        id: "bulk-operations",
        label: "Bulk Operations",
        icon: Package,
        path: "/creator/products/bulk",
        requiredTier: "pro",
        description: "Bulk edit, import, and export products",
        isNew: true,
      },
    ],
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBag,
    path: "/creator/orders",
    badge: 8,
    description: "Process and manage customer orders",
    children: [
      {
        id: "all-orders",
        label: "All Orders",
        icon: ShoppingBag,
        path: "/creator/orders",
        description: "View all customer orders",
      },
      {
        id: "pending",
        label: "Pending",
        icon: ShoppingBag,
        path: "/creator/orders/pending",
        badge: 5,
        description: "Orders waiting for processing",
      },
      {
        id: "processing",
        label: "Processing",
        icon: ShoppingBag,
        path: "/creator/orders/processing",
        badge: 2,
        description: "Orders currently being processed",
      },
      {
        id: "shipped",
        label: "Shipped",
        icon: Truck,
        path: "/creator/orders/shipped",
        badge: 1,
        description: "Orders that have been shipped",
      },
      {
        id: "completed",
        label: "Completed",
        icon: ShoppingBag,
        path: "/creator/orders/completed",
        description: "Successfully delivered orders",
      },
      {
        id: "returns",
        label: "Returns & Refunds",
        icon: ShoppingBag,
        path: "/creator/orders/returns",
        requiredTier: "pro",
        description: "Handle returns and refund requests",
      },
    ],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: TrendingUp,
    path: "/creator/analytics",
    requiredTier: "pro",
    description: "Advanced insights and reporting",
    children: [
      {
        id: "sales-analytics",
        label: "Sales Analytics",
        icon: TrendingUp,
        path: "/creator/analytics/sales",
        requiredTier: "pro",
        description: "Detailed sales performance metrics",
      },
      {
        id: "customer-analytics",
        label: "Customer Analytics",
        icon: Users,
        path: "/creator/analytics/customers",
        requiredTier: "pro",
        description: "Customer behavior and demographics",
      },
      {
        id: "product-analytics",
        label: "Product Analytics",
        icon: Package,
        path: "/creator/analytics/products",
        requiredTier: "pro",
        description: "Product performance insights",
      },
      {
        id: "conversion-analytics",
        label: "Conversion Funnel",
        icon: TrendingUp,
        path: "/creator/analytics/conversion",
        requiredTier: "enterprise",
        description: "Advanced conversion tracking",
        isNew: true,
      },
    ],
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: DollarSign,
    path: "/creator/earnings",
    description: "Track your revenue and payouts",
    children: [
      {
        id: "revenue",
        label: "Revenue",
        icon: DollarSign,
        path: "/creator/earnings/revenue",
        description: "View your total earnings",
      },
      {
        id: "payouts",
        label: "Payouts",
        icon: CreditCard,
        path: "/creator/earnings/payouts",
        description: "Manage payment withdrawals",
      },
      {
        id: "taxes",
        label: "Tax Reports",
        icon: FileText,
        path: "/creator/earnings/taxes",
        requiredTier: "pro",
        description: "Generate tax documents",
      },
      {
        id: "financial-reports",
        label: "Financial Reports",
        icon: FileText,
        path: "/creator/earnings/reports",
        requiredTier: "enterprise",
        description: "Comprehensive financial reporting",
      },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: TrendingUp,
    path: "/creator/marketing",
    requiredTier: "pro",
    description: "Grow your business with marketing tools",
    children: [
      {
        id: "campaigns",
        label: "Campaigns",
        icon: TrendingUp,
        path: "/creator/marketing/campaigns",
        requiredTier: "pro",
        description: "Create and manage marketing campaigns",
      },
      {
        id: "discounts",
        label: "Discounts & Coupons",
        icon: Tag,
        path: "/creator/marketing/discounts",
        requiredTier: "pro",
        description: "Set up promotional offers",
      },
      {
        id: "seo",
        label: "SEO Tools",
        icon: TrendingUp,
        path: "/creator/marketing/seo",
        requiredTier: "pro",
        description: "Optimize for search engines",
      },
      {
        id: "email-marketing",
        label: "Email Marketing",
        icon: TrendingUp,
        path: "/creator/marketing/email",
        requiredTier: "enterprise",
        description: "Automated email campaigns",
        isNew: true,
      },
      {
        id: "social-media",
        label: "Social Media",
        icon: TrendingUp,
        path: "/creator/marketing/social",
        requiredTier: "enterprise",
        description: "Manage social media presence",
        isNew: true,
      },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    icon: Users,
    path: "/creator/customers",
    requiredTier: "pro",
    description: "Manage customer relationships",
    children: [
      {
        id: "customer-list",
        label: "Customer List",
        icon: Users,
        path: "/creator/customers",
        requiredTier: "pro",
        description: "View all customers",
      },
      {
        id: "customer-segments",
        label: "Customer Segments",
        icon: Users,
        path: "/creator/customers/segments",
        requiredTier: "enterprise",
        description: "Create customer segments",
        isNew: true,
      },
      {
        id: "loyalty-program",
        label: "Loyalty Program",
        icon: Star,
        path: "/creator/customers/loyalty",
        requiredTier: "enterprise",
        description: "Reward loyal customers",
        isNew: true,
      },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    icon: Star,
    path: "/creator/reviews",
    description: "Manage customer reviews and ratings",
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
    path: "/creator/shipping",
    description: "Configure shipping methods and rates",
    children: [
      {
        id: "shipping-zones",
        label: "Shipping Zones",
        icon: Truck,
        path: "/creator/shipping/zones",
        description: "Set up shipping zones",
      },
      {
        id: "shipping-rates",
        label: "Shipping Rates",
        icon: Truck,
        path: "/creator/shipping/rates",
        description: "Configure shipping costs",
      },
      {
        id: "shipping-labels",
        label: "Shipping Labels",
        icon: Truck,
        path: "/creator/shipping/labels",
        requiredTier: "pro",
        description: "Print shipping labels",
      },
      {
        id: "tracking",
        label: "Package Tracking",
        icon: Truck,
        path: "/creator/shipping/tracking",
        requiredTier: "enterprise",
        description: "Advanced package tracking",
      },
    ],
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Zap,
    path: "/creator/integrations",
    requiredTier: "enterprise",
    description: "Connect with third-party services",
    children: [
      {
        id: "payment-gateways",
        label: "Payment Gateways",
        icon: CreditCard,
        path: "/creator/integrations/payments",
        requiredTier: "enterprise",
        description: "Additional payment options",
      },
      {
        id: "inventory-management",
        label: "Inventory Management",
        icon: Package,
        path: "/creator/integrations/inventory",
        requiredTier: "enterprise",
        description: "Third-party inventory tools",
      },
      {
        id: "accounting",
        label: "Accounting",
        icon: FileText,
        path: "/creator/integrations/accounting",
        requiredTier: "enterprise",
        description: "Sync with accounting software",
      },
      {
        id: "api-access",
        label: "API Access",
        icon: Zap,
        path: "/creator/integrations/api",
        requiredTier: "enterprise",
        description: "Custom integrations via API",
        isNew: true,
      },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    icon: Zap,
    path: "/creator/automation",
    requiredTier: "enterprise",
    description: "Automate your business processes",
    isNew: true,
    children: [
      {
        id: "workflow-automation",
        label: "Workflows",
        icon: Zap,
        path: "/creator/automation/workflows",
        requiredTier: "enterprise",
        description: "Automated business workflows",
        isNew: true,
      },
      {
        id: "inventory-automation",
        label: "Inventory Automation",
        icon: Package,
        path: "/creator/automation/inventory",
        requiredTier: "enterprise",
        description: "Automated inventory management",
        isNew: true,
      },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/creator/settings",
    description: "Configure your store settings",
    children: [
      {
        id: "general",
        label: "General",
        icon: Settings,
        path: "/creator/settings",
        description: "Basic store settings",
      },
      {
        id: "team",
        label: "Team Management",
        icon: Users,
        path: "/creator/settings/team",
        requiredTier: "pro",
        description: "Manage team members",
      },
      {
        id: "permissions",
        label: "Permissions",
        icon: Shield,
        path: "/creator/settings/permissions",
        requiredTier: "enterprise",
        description: "Advanced permission controls",
      },
    ],
  },
];

interface CreatorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorSidebar: React.FC<CreatorSidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "products",
    "orders",
    "earnings",
  ]);
  const [showPlanBenefits, setShowPlanBenefits] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "pro" | "enterprise"
  >("pro");

  // Mock user plan data - in real app this would come from Redux store
  const [userPlan, setUserPlan] = useState({
    type: selectedPlan,
    name:
      selectedPlan === "free"
        ? "Free"
        : selectedPlan === "pro"
          ? "Professional"
          : "Enterprise",
    commission:
      selectedPlan === "free" ? "15%" : selectedPlan === "pro" ? "5%" : "2%",
    features: getFeaturesByPlan(selectedPlan),
    nextBilling: "2024-09-15",
    daysLeft: 23,
  });

  function getFeaturesByPlan(plan: "free" | "pro" | "enterprise") {
    switch (plan) {
      case "free":
        return ["Up to 25 products", "Basic analytics", "Standard support"];
      case "pro":
        return [
          "Unlimited products",
          "Advanced analytics",
          "Priority support",
          "Marketing tools",
        ];
      case "enterprise":
        return [
          "Everything in Pro",
          "API access",
          "Custom integrations",
          "Dedicated support",
        ];
      default:
        return [];
    }
  }

  // Update user plan when selectedPlan changes
  const handlePlanSwitch = (plan: "free" | "pro" | "enterprise") => {
    setSelectedPlan(plan);
    setUserPlan({
      type: plan,
      name:
        plan === "free"
          ? "Free"
          : plan === "pro"
            ? "Professional"
            : "Enterprise",
      commission: plan === "free" ? "15%" : plan === "pro" ? "5%" : "2%",
      features: getFeaturesByPlan(plan),
      nextBilling: "2024-09-15",
      daysLeft: 23,
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const handleNavigation = (path: string, item: SidebarItem) => {
    if (!canAccess(item)) {
      // Show upgrade modal or redirect to upgrade page
      setShowUpgradeModal(true);
      return;
    }
    navigate(path);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const canAccess = (item: SidebarItem) => {
    if (!item.requiredTier) return true;

    const tierHierarchy = { free: 0, pro: 1, enterprise: 2 };
    const userTier = tierHierarchy[userPlan.type as keyof typeof tierHierarchy];
    const requiredTier = tierHierarchy[item.requiredTier];

    return userTier >= requiredTier;
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const active = isActive(item.path);
    const accessible = canAccess(item);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all duration-200 cursor-pointer ${
            level > 0 ? "ml-6" : ""
          } ${
            active
              ? "bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 font-medium"
              : accessible
                ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                : "text-gray-400 dark:text-gray-600"
          }`}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              handleNavigation(item.path, item);
            }
          }}
        >
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <item.icon
              className={`w-5 h-5 flex-shrink-0 ${
                !accessible ? "opacity-50" : ""
              }`}
            />
            <span className="truncate">{item.label}</span>
            {item.isNew && (
              <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-0.5">
                New
              </Badge>
            )}
            {item.requiredTier === "pro" && userPlan.type === "free" && (
              <Crown className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            )}
            {item.requiredTier === "enterprise" &&
              userPlan.type !== "enterprise" && (
                <Shield className="w-4 h-4 text-secondary-500 flex-shrink-0" />
              )}
          </div>
          <div className="flex items-center space-x-2">
            {item.badge && item.badge > 0 && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-1 min-w-0">
                {item.badge}
              </Badge>
            )}
            {hasChildren && (
              <div className="text-gray-400">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </div>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const getPlanIcon = () => {
    switch (userPlan.type) {
      case "pro":
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case "enterprise":
        return <Shield className="w-5 h-5 text-secondary-500" />;
      default:
        return <Zap className="w-5 h-5 text-primary-500" />;
    }
  };

  const getPlanColor = () => {
    switch (userPlan.type) {
      case "pro":
        return "from-yellow-400 to-orange-500";
      case "enterprise":
        return "from-secondary-500 to-pink-500";
      default:
        return "from-primary-400 to-cyan-500";
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 shadow-xl border-r
           border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out 
           lg:translate-x-0 lg:static lg:z-auto ${
             isOpen ? "translate-x-0" : "-translate-x-full"
           }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Creator Panel
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your store
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Plan Benefits Card */}
          {showPlanBenefits && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <Card className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 relative">
                <button
                  onClick={() => setShowPlanBenefits(false)}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center space-x-2 mb-3">
                  {getPlanIcon()}
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                      {userPlan.name} Plan
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userPlan.commission} commission
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Next billing</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {userPlan.daysLeft} days
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    fullWidth
                    onClick={() => navigate("/creator/settings?tab=billing")}
                  >
                    {userPlan.type === "free" ? "Upgrade Plan" : "Manage Billing"}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Plan Switcher for Testing */}
          <Card className="p-4 m-4 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <h3 className="text-sm font-semibold mb-3 text-primary-900 dark:text-primary-200">
              🧪 Test Different Plans
            </h3>
            <div className="flex flex-col space-y-2">
              <Button
                size="sm"
                variant={userPlan.type === "free" ? "primary" : "outline"}
                onClick={() => handlePlanSwitch("free")}
                className="justify-start"
              >
                <Zap className="w-4 h-4 mr-2" />
                Free Plan
              </Button>
              <Button
                size="sm"
                variant={userPlan.type === "pro" ? "primary" : "outline"}
                onClick={() => handlePlanSwitch("pro")}
                className="justify-start"
              >
                <Crown className="w-4 h-4 mr-2" />
                Pro Plan
              </Button>
              <Button
                size="sm"
                variant={userPlan.type === "enterprise" ? "primary" : "outline"}
                onClick={() => handlePlanSwitch("enterprise")}
                className="justify-start"
              >
                <Shield className="w-4 h-4 mr-2" />
                Enterprise Plan
              </Button>
            </div>
          </Card>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {sidebarItems.map((item) => renderSidebarItem(item))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={async () => {
                try {
                  // Call logout API
                  await authService.logout();
                  // Clear Redux state
                  dispatch(logout());
                  // Navigate to home
                  navigate("/");
                } catch (error) {
                  console.error("Logout error:", error);
                  // Still logout locally even if API call fails
                  dispatch(logout());
                  navigate("/");
                }
              }}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white dark:bg-gray-800">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Upgrade Required
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowUpgradeModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    This feature requires a higher plan to access. Upgrade now
                    to unlock advanced features.
                  </p>

                  <div className="space-y-3">
                    {userPlan.type === "free" && (
                      <Card className="p-4 border-2 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center space-x-3 mb-3">
                          <Crown className="w-6 h-6 text-yellow-600" />
                          <div>
                            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200">
                              Professional Plan
                            </h3>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                              5% commission • $29/month
                            </p>
                          </div>
                        </div>
                        <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                          <li>✓ Unlimited products</li>
                          <li>✓ Advanced analytics</li>
                          <li>✓ Marketing tools</li>
                          <li>✓ Priority support</li>
                        </ul>
                      </Card>
                    )}

                    {(userPlan.type === "free" || userPlan.type === "pro") && (
                      <Card className="p-4 border-2 border-secondary-200 bg-secondary-50 dark:bg-secondary-900/20">
                        <div className="flex items-center space-x-3 mb-3">
                          <Shield className="w-6 h-6 text-secondary-600" />
                          <div>
                            <h3 className="font-semibold text-secondary-900 dark:text-secondary-200">
                              Enterprise Plan
                            </h3>
                            <p className="text-sm text-secondary-700 dark:text-secondary-300">
                              2% commission • $99/month
                            </p>
                          </div>
                        </div>
                        <ul className="text-sm text-secondary-800 dark:text-secondary-200 space-y-1">
                          <li>✓ Everything in Pro</li>
                          <li>✓ API access</li>
                          <li>✓ Custom integrations</li>
                          <li>✓ Dedicated support</li>
                        </ul>
                      </Card>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={() => {
                      setShowUpgradeModal(false);
                      navigate("/creator/settings?tab=billing");
                    }}
                    className="flex-1"
                  >
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default CreatorSidebar;
