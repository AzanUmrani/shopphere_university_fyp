import { lazy } from "react";

// Lazy load pages for better performance
const HomePage = lazy(() => import("../pages/HomePage"));
const ProductsPage = lazy(() => import("../pages/ProductsPage"));
const ProductDetailPage = lazy(() => import("../pages/ProductDetailPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const CheckoutSuccessPage = lazy(() => import("../pages/CheckoutSuccessPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const FAQPage = lazy(() => import("../pages/FAQPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const WishlistPage = lazy(() => import("../pages/WishlistPage"));
const PrivacyPolicyPage = lazy(() => import("../pages/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("../pages/TermsOfServicePage"));
const HelpCenterPage = lazy(() => import("../pages/HelpCenterPage"));
const SupportSystemPage = lazy(() => import("../pages/SupportSystemPage"));
const ReviewsPage = lazy(() => import("../pages/ReviewsPage"));
const ChangePasswordPage = lazy(() => import("../pages/ChangePasswordPage"));
const ChatPage = lazy(() => import("../pages/ChatPage"));
const CreatorOnboardingPage = lazy(() => import("../pages/CreatorOnboardingPage"));


// User Dashboard pages
const UserDashboard = lazy(() => import("../pages/UserDashboard"));
const UserAddresses = lazy(() => import("../pages/UserAddresses"));
const UserSecurity = lazy(() => import("../pages/UserSecurity"));
const UserNotifications = lazy(() => import("../pages/UserNotifications"));
const UserPaymentMethods = lazy(() => import("../pages/UserPaymentMethods"));
const UserSettings = lazy(() => import("../pages/UserSettings"));
const UserDashboardLayout = lazy(
  () => import("../components/layout/UserDashboardLayout")
);

// Creator Panel pages
const CreatorDashboard = lazy(
  () => import("../pages/creator/CreatorDashboardNew")
);
const CreatorProducts = lazy(() => import("../pages/creator/CreatorProducts"));
const ProductCategories = lazy(
  () => import("../pages/creator/ProductCategories")
);
const ProductInventory = lazy(
  () => import("../pages/creator/ProductInventory")
);
const ProductEditPage = lazy(() => import("../pages/creator/ProductEditPage"));
const CreatorOrdersFilter = lazy(
  () => import("../pages/creator/CreatorOrdersFilter")
);
const CreatorOrders = lazy(() => import("../pages/creator/CreatorOrders"));
const CreatorAnalytics = lazy(
  () => import("../pages/creator/CreatorAnalytics")
);
const CreatorEarnings = lazy(() => import("../pages/creator/CreatorEarnings"));
const CreatorMarketing = lazy(
  () => import("../pages/creator/CreatorMarketing")
);
const CreatorReviews = lazy(() => import("../pages/creator/CreatorReviews"));
const CreatorShipping = lazy(() => import("../pages/creator/CreatorShipping"));
const CreatorSettings = lazy(() => import("../pages/creator/CreatorSettings"));
const AddProduct = lazy(() => import("../pages/creator/AddProduct"));

// Additional Creator Panel pages
const CreatorBulkOperations = lazy(
  () => import("../pages/creator/CreatorBulkOperations")
);
const CreatorCustomers = lazy(
  () => import("../pages/creator/CreatorCustomers")
);
const CreatorCustomerSegments = lazy(
  () => import("../pages/creator/CreatorCustomerSegments")
);
const CreatorLoyaltyProgram = lazy(
  () => import("../pages/creator/CreatorLoyaltyProgram")
);
const CreatorAdvancedAnalytics = lazy(
  () => import("../pages/creator/CreatorAdvancedAnalytics")
);
const CreatorMarketingCampaigns = lazy(
  () => import("../pages/creator/CreatorMarketingCampaigns")
);
const CreatorSocialMedia = lazy(
  () => import("../pages/creator/CreatorSocialMedia")
);
const CreatorHelpSupport = lazy(
  () => import("../pages/creator/CreatorHelpSupport")
);
const CreatorIntegrations = lazy(
  () => import("../pages/creator/CreatorIntegrations")
);

// Order Status Pages
const PendingOrders = lazy(() => import("../pages/creator/PendingOrders"));
const ProcessingOrders = lazy(
  () => import("../pages/creator/ProcessingOrders")
);
const ShippedOrders = lazy(() => import("../pages/creator/ShippedOrders"));
const CompletedOrders = lazy(() => import("../pages/creator/CompletedOrders"));
const ReturnsRefunds = lazy(() => import("../pages/creator/ReturnsRefunds"));

// Analytics Pages
const SalesAnalytics = lazy(() => import("../pages/creator/SalesAnalytics"));
const CustomerAnalytics = lazy(
  () => import("../pages/creator/CustomerAnalytics")
);
const ProductAnalytics = lazy(
  () => import("../pages/creator/ProductAnalytics")
);
const ConversionAnalytics = lazy(
  () => import("../pages/creator/ConversionAnalytics")
);

// Earnings Pages
const RevenueDetails = lazy(() => import("../pages/creator/RevenueDetails"));
const PayoutsManagement = lazy(
  () => import("../pages/creator/PayoutsManagement")
);
const TaxReports = lazy(() => import("../pages/creator/TaxReports"));
const FinancialReports = lazy(
  () => import("../pages/creator/FinancialReports")
);

// Marketing Pages
const DiscountsCoupons = lazy(
  () => import("../pages/creator/DiscountsCoupons")
);
const SEOTools = lazy(() => import("../pages/creator/SEOTools"));
const EmailMarketing = lazy(() => import("../pages/creator/EmailMarketing"));

// Shipping Pages
const ShippingZones = lazy(() => import("../pages/creator/ShippingZones"));
const ShippingRates = lazy(() => import("../pages/creator/ShippingRates"));
const ShippingLabels = lazy(() => import("../pages/creator/ShippingLabels"));
const PackageTracking = lazy(() => import("../pages/creator/PackageTracking"));

// Integration Pages
const PaymentGateways = lazy(() => import("../pages/creator/PaymentGateways"));
const InventoryManagement = lazy(
  () => import("../pages/creator/InventoryManagement")
);
const AccountingIntegration = lazy(
  () => import("../pages/creator/AccountingIntegration")
);

// Creator Onboarding pages
const BecomeCreatorPage = lazy(() => import("../pages/BecomeCreatorPage"));
// const CreatorOnboardingPage = lazy(
//   () => import("../pages/CreatorOnboardingPage")
// );

export interface RouteConfig {
  path: string;
  element: React.ComponentType;
  title?: string;
  description?: string;
  requiresAuth?: boolean;
  layout?: string;
}

// Main application routes
export const routes: RouteConfig[] = [
  // Public routes
  {
    path: "/",
    element: HomePage,
    title: "Home - ShopSphere",
    description: "Discover premium products with AI-powered recommendations",
  },
  {
    path: "/products",
    element: ProductsPage,
    title: "Products - ShopSphere",
    description: "Browse our premium collection of products",
  },
  {
    path: "/products/:id",
    element: ProductDetailPage,
    title: "Product Details - ShopSphere",
    description: "View detailed product information and reviews",
  },
  {
    path: "/cart",
    element: CartPage,
    title: "Shopping Cart - ShopSphere",
    description: "Review your selected items",
  },
  {
    path: "/checkout",
    element: CheckoutPage,
    title: "Checkout - ShopSphere",
    description: "Complete your purchase securely",
  },
  {
    path: "/checkout/success",
    element: CheckoutSuccessPage ,
    title: "Order Confirmed - ShopSphere",
    description: "Your order has been successfully placed",
  },
  {
    path: "/contact",
    element: ContactPage,
    title: "Contact Us - ShopSphere",
    description: "Get in touch with our customer service team",
  },
  {
    path: "/faq",
    element: FAQPage,
    title: "FAQ - ShopSphere",
    description: "Frequently asked questions and answers",
  },

  // Authentication routes
  {
    path: "/login",
    element: LoginPage,
    title: "Sign In - ShopSphere",
    description: "Sign in to your ShopSphere account",
  },
  {
    path: "/register",
    element: RegisterPage,
    title: "Create Account - ShopSphere",
    description: "Join ShopSphere and start shopping",
  },
  {
    path: "/forgot-password",
    element: ForgotPasswordPage,
    title: "Reset Password - ShopSphere",
    description: "Reset your ShopSphere account password",
  },
  {
    path: "/reset-password",
    element: ResetPasswordPage,
    title: "Reset Password - ShopSphere",
    description: "Create a new password for your account",
  },
  {
    path: "/change-password",
    element: ChangePasswordPage,
    title: "Change Password - ShopSphere",
    description: "Update your account password",
    requiresAuth: true,
  },

  // User account routes (require authentication)
  {
    path: "/profile",
    element: ProfilePage,
    title: "My Profile - ShopSphere",
    description: "Manage your account settings and preferences",
    requiresAuth: true,
  },
  {
    path: "/orders",
    element: OrdersPage,
    title: "My Orders - ShopSphere",
    description: "View and track your order history",
    requiresAuth: true,
  },
  {
    path: "/wishlist",
    element: WishlistPage,
    title: "My Wishlist - ShopSphere",
    description: "Your saved items and favorites",
    requiresAuth: true,
  },

  // User Dashboard routes (with layout)
  {
    path: "/user",
    element: UserDashboardLayout,
    title: "User Dashboard - ShopSphere",
    description: "Manage your account and preferences",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/dashboard",
    element: UserDashboard,
    title: "Dashboard - ShopSphere",
    description: "Your account overview and quick actions",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/profile",
    element: ProfilePage,
    title: "My Profile - ShopSphere",
    description: "Manage your personal information",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/addresses",
    element: UserAddresses,
    title: "My Addresses - ShopSphere",
    description: "Manage your delivery addresses",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/security",
    element: UserSecurity,
    title: "Security Settings - ShopSphere",
    description: "Manage your account security and privacy",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/orders",
    element: OrdersPage,
    title: "My Orders - ShopSphere",
    description: "View and track your order history",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/wishlist",
    element: WishlistPage,
    title: "My Wishlist - ShopSphere",
    description: "Your saved items and favorites",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/notifications",
    element: UserNotifications,
    title: "Notifications - ShopSphere",
    description: "Manage your notifications and alerts",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/payment-methods",
    element: UserPaymentMethods,
    title: "Payment Methods - ShopSphere",
    description: "Manage your saved payment methods",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/messages",
    element: ChatPage,
    title: "Messages - ShopSphere",
    description: "Your conversations and chat history",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/reviews",
    element: ReviewsPage,
    title: "My Reviews - ShopSphere",
    description: "Reviews you've written for products",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/help",
    element: HelpCenterPage,
    title: "Help Center - ShopSphere",
    description: "Get help and support",
    requiresAuth: true,
    layout: "user",
  },
  {
    path: "/user/settings",
    element: UserSettings,
    title: "Account Settings - ShopSphere",
    description: "Manage your account preferences",
    requiresAuth: true,
    layout: "user",
  },

  // Review system routes
  {
    path: "/reviews/:productId",
    element: ReviewsPage,
    title: "Product Reviews - ShopSphere",
    description: "Read and write product reviews",
  },
  {
    path: "/reviews/:productId/:orderId",
    element: ReviewsPage,
    title: "Write Review - ShopSphere",
    description: "Share your experience with this product",
    requiresAuth: true,
  },

  // Chat routes
  {
    path: "/chat",
    element: ChatPage,
    title: "Messages - ShopSphere",
    description: "Chat with creators and support",
    requiresAuth: true,
  },
  {
    path: "/chat/:roomId",
    element: ChatPage,
    title: "Chat - ShopSphere",
    description: "Continue your conversation",
    requiresAuth: true,
  },

  // Legal and support pages
  {
    path: "/privacy-policy",
    element: PrivacyPolicyPage,
    title: "Privacy Policy - ShopSphere",
    description: "How we collect, use, and protect your personal information",
  },
  {
    path: "/terms-of-service",
    element: TermsOfServicePage,
    title: "Terms of Service - ShopSphere",
    description: "Terms and conditions for using ShopSphere",
  },
  {
    path: "/help-center",
    element: HelpCenterPage,
    title: "Help Center - ShopSphere",
    description: "Find answers to common questions and get support",
  },
  {
    path: "/support",
    element: SupportSystemPage,
    title: "Customer Support - ShopSphere",
    description: "Get help from our customer support team",
  },

  // Creator Panel routes
  {
    path: "/creator",
    element: CreatorDashboard,
    title: "Creator Dashboard - ShopSphere",
    description: "Manage your creator profile and track performance",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/dashboard",
    element: CreatorDashboard,
    title: "Creator Dashboard - ShopSphere",
    description: "Overview of your creator account and analytics",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/products",
    element: CreatorProducts,
    title: "My Products - Creator Panel",
    description: "Manage your product catalog",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/products/add",
    element: AddProduct,
    title: "Add Product - Creator Panel",
    description: "List a new product for sale",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/products/categories",
    element: ProductCategories,
    title: "Product Categories - Creator Panel",
    description: "Manage your product categories",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/products/inventory",
    element: ProductInventory,
    title: "Product Inventory - Creator Panel",
    description: "Monitor and manage product stock levels",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/products/:id",
    element: ProductEditPage,
    title: "Edit Product - Creator Panel",
    description: "View and edit product details",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/products/:id/analytics",
    element: ProductEditPage,
    title: "Product Analytics - Creator Panel",
    description: "View detailed product analytics and performance",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/orders",
    element: CreatorOrders,
    title: "Orders - Creator Panel",
    description: "Track and manage customer orders",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/orders/:status",
    element: CreatorOrdersFilter,
    title: "Filtered Orders - Creator Panel",
    description: "View orders by status",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/analytics",
    element: CreatorAnalytics,
    title: "Analytics - Creator Panel",
    description: "View detailed performance analytics",
    requiresAuth: true,
    layout: "creator",
  },
  // Product Bulk Operations
  {
    path: "/creator/products/bulk",
    element: CreatorBulkOperations,
    title: "Bulk Operations - Creator Panel",
    description: "Bulk edit, import, and export products",
    requiresAuth: true,
    layout: "creator",
  },
  // Order Status Routes
  {
    path: "/creator/orders/pending",
    element: PendingOrders,
    title: "Pending Orders - Creator Panel",
    description: "Orders waiting for processing",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/orders/processing",
    element: ProcessingOrders,
    title: "Processing Orders - Creator Panel",
    description: "Orders currently being processed",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/orders/shipped",
    element: ShippedOrders,
    title: "Shipped Orders - Creator Panel",
    description: "Orders that have been shipped",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/orders/completed",
    element: CompletedOrders,
    title: "Completed Orders - Creator Panel",
    description: "Successfully delivered orders",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/orders/returns",
    element: ReturnsRefunds,
    title: "Returns & Refunds - Creator Panel",
    description: "Handle returns and refund requests",
    requiresAuth: true,
    layout: "creator",
  },
  // Analytics Sub-routes
  {
    path: "/creator/analytics/sales",
    element: SalesAnalytics,
    title: "Sales Analytics - Creator Panel",
    description: "Detailed sales performance metrics",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/analytics/customers",
    element: CustomerAnalytics,
    title: "Customer Analytics - Creator Panel",
    description: "Customer behavior and demographics",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/analytics/products",
    element: ProductAnalytics,
    title: "Product Analytics - Creator Panel",
    description: "Product performance insights",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/analytics/conversion",
    element: ConversionAnalytics,
    title: "Conversion Analytics - Creator Panel",
    description: "Advanced conversion tracking",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/analytics/advanced",
    element: CreatorAdvancedAnalytics,
    title: "Advanced Analytics - Creator Panel",
    description: "Enterprise-level analytics dashboard",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/earnings",
    element: CreatorEarnings,
    title: "Earnings - Creator Panel",
    description: "Track your earnings and payouts",
    requiresAuth: true,
    layout: "creator",
  },
  // Earnings Sub-routes
  {
    path: "/creator/earnings/revenue",
    element: RevenueDetails,
    title: "Revenue Details - Creator Panel",
    description: "View your total earnings breakdown",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/earnings/payouts",
    element: PayoutsManagement,
    title: "Payouts Management - Creator Panel",
    description: "Manage payment withdrawals",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/earnings/taxes",
    element: TaxReports,
    title: "Tax Reports - Creator Panel",
    description: "Generate tax documents",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/earnings/reports",
    element: FinancialReports,
    title: "Financial Reports - Creator Panel",
    description: "Comprehensive financial reporting",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/marketing",
    element: CreatorMarketing,
    title: "Marketing - Creator Panel",
    description: "Manage your marketing campaigns",
    requiresAuth: true,
    layout: "creator",
  },
  // Marketing Sub-routes
  {
    path: "/creator/marketing/campaigns",
    element: CreatorMarketingCampaigns,
    title: "Marketing Campaigns - Creator Panel",
    description: "Create and manage marketing campaigns",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/marketing/discounts",
    element: DiscountsCoupons,
    title: "Discounts & Coupons - Creator Panel",
    description: "Set up promotional offers",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/marketing/seo",
    element: SEOTools,
    title: "SEO Tools - Creator Panel",
    description: "Optimize for search engines",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/marketing/email",
    element: EmailMarketing,
    title: "Email Marketing - Creator Panel",
    description: "Automated email campaigns",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/marketing/social",
    element: CreatorSocialMedia,
    title: "Social Media - Creator Panel",
    description: "Manage social media presence",
    requiresAuth: true,
    layout: "creator",
  },
  // Customer Management Routes
  {
    path: "/creator/customers",
    element: CreatorCustomers,
    title: "Customer Management - Creator Panel",
    description: "Manage customer relationships",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/customers/segments",
    element: CreatorCustomerSegments,
    title: "Customer Segments - Creator Panel",
    description: "Create and manage customer segments",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/customers/loyalty",
    element: CreatorLoyaltyProgram,
    title: "Loyalty Program - Creator Panel",
    description: "Reward loyal customers",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/reviews",
    element: CreatorReviews,
    title: "Reviews - Creator Panel",
    description: "Monitor and respond to customer reviews",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/shipping",
    element: CreatorShipping,
    title: "Shipping - Creator Panel",
    description: "Configure shipping rates and profiles",
    requiresAuth: true,
    layout: "creator",
  },
  // Shipping Sub-routes
  {
    path: "/creator/shipping/zones",
    element: ShippingZones,
    title: "Shipping Zones - Creator Panel",
    description: "Set up shipping zones",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/shipping/rates",
    element: ShippingRates,
    title: "Shipping Rates - Creator Panel",
    description: "Configure shipping costs",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/shipping/labels",
    element: ShippingLabels,
    title: "Shipping Labels - Creator Panel",
    description: "Print shipping labels",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/shipping/tracking",
    element: PackageTracking,
    title: "Package Tracking - Creator Panel",
    description: "Advanced package tracking",
    requiresAuth: true,
    layout: "creator",
  },
  // Integration Routes
  {
    path: "/creator/integrations",
    element: CreatorIntegrations,
    title: "Integrations - Creator Panel",
    description: "Connect with third-party services",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/integrations/payments",
    element: PaymentGateways,
    title: "Payment Gateways - Creator Panel",
    description: "Additional payment options",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/integrations/inventory",
    element: InventoryManagement,
    title: "Inventory Management - Creator Panel",
    description: "Third-party inventory tools",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/integrations/accounting",
    element: AccountingIntegration,
    title: "Accounting Integration - Creator Panel",
    description: "Sync with accounting software",
    requiresAuth: true,
    layout: "creator",
  },
  // Help & Support
  {
    path: "/creator/help",
    element: CreatorHelpSupport,
    title: "Help & Support - Creator Panel",
    description: "Get help and support resources",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/creator/settings",
    element: CreatorSettings,
    title: "Settings - Creator Panel",
    description: "Manage your creator account settings",
    requiresAuth: true,
    layout: "creator",
  },
  {
    path: "/become-creator",
    element: BecomeCreatorPage,
    title: "Become a Creator",
    description: "Join our creator community and start your business",
    requiresAuth: false,
    layout: "main",
  },
  {
    path: "/creator/onboarding",
    element: CreatorOnboardingPage,
    title: "Creator Onboarding",
    description: "Set up your creator account",
    requiresAuth: true,
    layout: "main",
  },
  {
  path: "/creator/onboarding/:stepName", 
  element: CreatorOnboardingPage,
  requiresAuth: true,
  layout: "main",
},
];

// Route categories for navigation
export const routeCategories = {
  main: ["/", "/products", "/cart", "/checkout"],
  account: ["/profile", "/orders", "/wishlist", "/change-password"],
  support: ["/help-center", "/support", "/contact", "/faq"],
  legal: ["/privacy-policy", "/terms-of-service"],
  auth: ["/login", "/register", "/forgot-password", "/reset-password"],
  creator: [
    "/creator",
    "/creator/dashboard",
    "/creator/products",
    "/creator/products/add",
    "/creator/products/categories",
    "/creator/products/inventory",
    "/creator/products/:id",
    "/creator/orders",
    "/creator/orders/:status",
    "/creator/analytics",
    "/creator/earnings",
    "/creator/marketing",
    "/creator/reviews",
    "/creator/shipping",
    "/creator/settings",
    "/become-creator",
    "/creator/onboarding",
  ],
};

// Helper function to get route by path
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  return routes.find((route) => route.path === path);
};

// Helper function to get routes by category
export const getRoutesByCategory = (
  category: keyof typeof routeCategories
): RouteConfig[] => {
  const categoryPaths = routeCategories[category];
  return routes.filter((route) => categoryPaths.includes(route.path));
};

// Helper function to check if route requires authentication
export const isProtectedRoute = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresAuth || false;
};

export default routes;
