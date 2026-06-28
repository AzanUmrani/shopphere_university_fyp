import type { Product, ProductVariant, Order } from "./index";

export interface Creator {
  id: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  businessType: "individual" | "company" | "partnership";
  businessEmail: string;
  businessPhone: string;
  businessAddress: Address;
  taxId?: string;
  businessLicense?: string;
  businessLogo?: string;
  businessBanner?: string;
  socialMedia: CreatorSocialMedia;
  bankAccount: BankAccount;
  subscriptionPlan: SubscriptionPlan;
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  rating: number;
  totalSales: number;
  totalOrders: number;
  joinedAt: string;
  lastActive: string;
  status: "active" | "suspended" | "inactive";
  policies: CreatorPolicies;
  statistics: CreatorStatistics;
}

export interface CreatorSocialMedia {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface BankAccount {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  routingNumber: string;
  accountType: "checking" | "savings";
  isVerified: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: "free" | "basic" | "premium" | "enterprise";
  price: number;
  features: string[];
  maxProducts: number;
  commissionRate: number;
  priority: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface CreatorPolicies {
  shippingPolicy: string;
  returnPolicy: string;
  privacyPolicy: string;
  termsOfService: string;
  processingTime: string;
}

export interface CreatorStatistics {
  totalRevenue: number;
  monthlyRevenue: number;
  totalProducts: number;
  activeProducts: number;
  totalCustomers: number;
  averageOrderValue: number;
  conversionRate: number;
  viewsToday: number;
  viewsThisMonth: number;
  ordersToday: number;
  ordersThisMonth: number;
  revenueGrowth: number;
  customerSatisfaction: number;
  returnRate: number;
}

export interface CreatorProduct extends Product {
  creatorId: string;
  sku: string;
  cost: number;
  profit: number;
  margin: number;
  weight?: number;
  dimensions?: ProductDimensions;
  shippingProfile: string;
  status: "draft" | "active" | "inactive" | "out_of_stock";
  visibility: "public" | "private" | "unlisted";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  variants?: ProductVariant[];
  inventory: InventoryItem[];
  analytics: ProductAnalytics;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: "cm" | "in";
}

export interface InventoryItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderLevel: number;
  reorderQuantity: number;
  lastRestocked?: string;
  location?: string;
}

export interface ProductAnalytics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  avgRating: number;
  totalReviews: number;
  clickThroughRate: number;
  conversionRate: number;
  bounceRate: number;
  timeOnPage: number;
  searchRanking: number;
  competitorPrice: number;
}

export interface CreatorOrder extends Order {
  creatorId: string;
  commission: number;
  creatorEarnings: number;
  platformFee: number;
  processingFee: number;
  fulfillmentStatus: FulfillmentStatus;
  trackingInfo?: TrackingInfo;
  customerNotes?: string;
  creatorNotes?: string;
}

export interface FulfillmentStatus {
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  updatedAt: string;
  updatedBy: string;
  notes?: string;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery?: string;
  trackingUrl?: string;
}

export interface CreatorReview {
  id: string;
  creatorId: string;
  customerId: string;
  orderId: string;
  productId?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  reportCount: number;
  response?: CreatorResponse;
  createdAt: string;
}

export interface CreatorResponse {
  message: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatorEarnings {
  id: string;
  creatorId: string;
  orderId: string;
  amount: number;
  commission: number;
  platformFee: number;
  processingFee: number;
  netEarnings: number;
  currency: string;
  status: "pending" | "processing" | "paid" | "failed";
  payoutDate?: string;
  payoutMethod: string;
  transactionId?: string;
  createdAt: string;
}

export interface CreatorPayout {
  id: string;
  creatorId: string;
  amount: number;
  currency: string;
  method: "bank_transfer" | "paypal" | "stripe" | "check";
  accountDetails: any;
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  scheduledDate: string;
  processedDate?: string;
  transactionId?: string;
  fees: number;
  netAmount: number;
  earningsIds: string[];
  notes?: string;
  createdAt: string;
}

export interface CreatorNotification {
  id: string;
  creatorId: string;
  type: "order" | "payment" | "product" | "review" | "system" | "promotion";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  actionUrl?: string;
  priority: "low" | "medium" | "high" | "urgent";
  expiresAt?: string;
  createdAt: string;
}

export interface Address {
  id: string;
  type: "shipping" | "billing" | "business";
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface ShippingProfile {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  zones: ShippingZone[];
  freeShippingThreshold?: number;
  processingTime: ProcessingTime;
  isDefault: boolean;
  isActive: boolean;
}

export interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  rates: ShippingRate[];
}

export interface ShippingRate {
  id: string;
  name: string;
  type: "flat_rate" | "weight_based" | "price_based";
  cost: number;
  additionalCost?: number;
  minWeight?: number;
  maxWeight?: number;
  minPrice?: number;
  maxPrice?: number;
  estimatedDays: number;
  isActive: boolean;
}

export interface ProcessingTime {
  min: number;
  max: number;
  unit: "hours" | "days" | "weeks";
}

export interface CreatorCampaign {
  id: string;
  creatorId: string;
  name: string;
  type: "discount" | "free_shipping" | "buy_one_get_one" | "bundle";
  description: string;
  discountType?: "percentage" | "fixed_amount";
  discountValue?: number;
  minOrderValue?: number;
  maxDiscount?: number;
  applicableProducts: string[];
  usageLimit?: number;
  usageCount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  performance: CampaignPerformance;
}

export interface CampaignPerformance {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ordersGenerated: number;
}

export interface CreatorInsight {
  period: "today" | "week" | "month" | "quarter" | "year";
  revenue: number;
  revenueChange: number;
  orders: number;
  ordersChange: number;
  customers: number;
  customersChange: number;
  avgOrderValue: number;
  avgOrderValueChange: number;
  conversionRate: number;
  conversionRateChange: number;
  topProducts: TopProduct[];
  topCategories: TopCategory[];
  customerDemographics: CustomerDemographics;
  salesByRegion: SalesByRegion[];
  trafficSources: TrafficSource[];
}

export interface TopProduct {
  productId: string;
  name: string;
  image: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface TopCategory {
  category: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface CustomerDemographics {
  ageGroups: Record<string, number>;
  genders: Record<string, number>;
  locations: Record<string, number>;
}

export interface SalesByRegion {
  region: string;
  sales: number;
  orders: number;
  growth: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  conversions: number;
  revenue: number;
}
