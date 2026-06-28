// Admin Configuration for Discounted Products Section
// This configuration will be used by the admin panel to control the section

export interface DiscountedProductsConfig {
  // Section Visibility
  isEnabled: boolean;
  isVisible: boolean;

  // Content Configuration
  sectionTitle: string;
  sectionSubtitle: string;

  // Design Configuration
  accentColor: "emerald" | "blue" | "purple" | "red" | "amber";
  backgroundColor:
    | "light"
    | "dark"
    | "gradient-emerald"
    | "gradient-blue"
    | "gradient-purple"
    | "gradient-red"
    | "gradient-amber";

  // Product Configuration
  maxProducts: number;
  sortBy: "discount" | "price" | "popularity" | "newest" | "random";
  minDiscountPercentage: number;
  maxDiscountPercentage: number;

  // Countdown Configuration
  showCountdown: boolean;
  countdownHours: number;
  countdownMinutes: number;
  countdownSeconds: number;

  // CTA Configuration
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;

  // Analytics & Tracking
  trackImpressions: boolean;
  trackClicks: boolean;
  sectionId: string;

  // Scheduling
  startDate?: Date;
  endDate?: Date;
  timezone: string;

  // Advanced Settings
  showStockCount: boolean;
  showSavingsAmount: boolean;
  showQuickView: boolean;
  enableWishlist: boolean;
  showProductRating: boolean;
  showCategoryBadge: boolean;
  showNewBadge: boolean;

  // Responsive Settings
  mobileColumns: 1 | 2;
  tabletColumns: 2 | 3;
  desktopColumns: 3 | 4 | 5;

  // Animation Settings
  enableAnimations: boolean;
  animationDelay: number; // milliseconds between each product animation
  hoverEffects: boolean;
}

// Default configuration
export const defaultDiscountedProductsConfig: DiscountedProductsConfig = {
  // Section Visibility
  isEnabled: true,
  isVisible: true,

  // Content Configuration
  sectionTitle: "Incredible Savings",
  sectionSubtitle:
    "Handpicked products with amazing discounts - Limited time offers you don't want to miss",

  // Design Configuration
  accentColor: "emerald",
  backgroundColor: "gradient-emerald",

  // Product Configuration
  maxProducts: 8,
  sortBy: "discount",
  minDiscountPercentage: 20,
  maxDiscountPercentage: 80,

  // Countdown Configuration
  showCountdown: true,
  countdownHours: 23,
  countdownMinutes: 45,
  countdownSeconds: 12,

  // CTA Configuration
  primaryCtaText: "Shop All Discounted Items",
  primaryCtaLink: "/products?filter=discounted",
  secondaryCtaText: "Get Notified of New Sales",
  secondaryCtaLink: "/newsletter",

  // Analytics & Tracking
  trackImpressions: true,
  trackClicks: true,
  sectionId: "discounted-products-section",

  // Scheduling
  timezone: "UTC",

  // Advanced Settings
  showStockCount: true,
  showSavingsAmount: true,
  showQuickView: true,
  enableWishlist: true,
  showProductRating: true,
  showCategoryBadge: true,
  showNewBadge: true,

  // Responsive Settings
  mobileColumns: 1,
  tabletColumns: 2,
  desktopColumns: 4,

  // Animation Settings
  enableAnimations: true,
  animationDelay: 100,
  hoverEffects: true,
};

// Background configuration options
export const backgroundOptions = {
  light: "bg-gray-50 dark:bg-gray-900",
  dark: "bg-gray-900 dark:bg-gray-800",
  "gradient-emerald":
    "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-teal-900/20",
  "gradient-blue":
    "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20",
  "gradient-purple":
    "bg-gradient-to-br from-purple-50 via-violet-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-violet-900/20",
  "gradient-red":
    "bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20",
  "gradient-amber":
    "bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-yellow-900/20",
};

// Admin Panel Form Schema for this section
export const discountedProductsFormSchema = {
  sections: [
    {
      title: "Section Visibility",
      fields: [
        {
          name: "isEnabled",
          type: "toggle",
          label: "Enable Section",
          description: "Turn the entire section on or off",
        },
        {
          name: "isVisible",
          type: "toggle",
          label: "Visible to Users",
          description: "Show or hide from frontend (useful for A/B testing)",
        },
      ],
    },
    {
      title: "Content Settings",
      fields: [
        {
          name: "sectionTitle",
          type: "text",
          label: "Section Title",
          placeholder: "Enter section title",
          maxLength: 100,
        },
        {
          name: "sectionSubtitle",
          type: "textarea",
          label: "Section Subtitle",
          placeholder: "Enter section description",
          maxLength: 200,
        },
      ],
    },
    {
      title: "Design Settings",
      fields: [
        {
          name: "accentColor",
          type: "select",
          label: "Accent Color",
          options: [
            { value: "emerald", label: "Emerald Green" },
            { value: "blue", label: "Blue" },
            { value: "purple", label: "Purple" },
            { value: "red", label: "Red" },
            { value: "amber", label: "Amber" },
          ],
        },
        {
          name: "backgroundColor",
          type: "select",
          label: "Background Style",
          options: [
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
            { value: "gradient-emerald", label: "Emerald Gradient" },
            { value: "gradient-blue", label: "Blue Gradient" },
            { value: "gradient-purple", label: "Purple Gradient" },
            { value: "gradient-red", label: "Red Gradient" },
            { value: "gradient-amber", label: "Amber Gradient" },
          ],
        },
      ],
    },
    {
      title: "Product Settings",
      fields: [
        {
          name: "maxProducts",
          type: "number",
          label: "Maximum Products to Show",
          min: 4,
          max: 20,
        },
        {
          name: "sortBy",
          type: "select",
          label: "Sort Products By",
          options: [
            { value: "discount", label: "Highest Discount" },
            { value: "price", label: "Lowest Price" },
            { value: "popularity", label: "Most Popular" },
            { value: "newest", label: "Newest First" },
            { value: "random", label: "Random" },
          ],
        },
        {
          name: "minDiscountPercentage",
          type: "range",
          label: "Minimum Discount Percentage",
          min: 10,
          max: 50,
        },
        {
          name: "maxDiscountPercentage",
          type: "range",
          label: "Maximum Discount Percentage",
          min: 51,
          max: 90,
        },
      ],
    },
    {
      title: "Countdown Timer",
      fields: [
        {
          name: "showCountdown",
          type: "toggle",
          label: "Show Countdown Timer",
        },
        {
          name: "countdownHours",
          type: "number",
          label: "Hours",
          min: 0,
          max: 48,
          dependsOn: "showCountdown",
        },
        {
          name: "countdownMinutes",
          type: "number",
          label: "Minutes",
          min: 0,
          max: 59,
          dependsOn: "showCountdown",
        },
        {
          name: "countdownSeconds",
          type: "number",
          label: "Seconds",
          min: 0,
          max: 59,
          dependsOn: "showCountdown",
        },
      ],
    },
    {
      title: "Call-to-Action Buttons",
      fields: [
        {
          name: "primaryCtaText",
          type: "text",
          label: "Primary Button Text",
          maxLength: 50,
        },
        {
          name: "primaryCtaLink",
          type: "text",
          label: "Primary Button Link",
          placeholder: "/products?filter=discounted",
        },
        {
          name: "secondaryCtaText",
          type: "text",
          label: "Secondary Button Text",
          maxLength: 50,
        },
        {
          name: "secondaryCtaLink",
          type: "text",
          label: "Secondary Button Link",
          placeholder: "/newsletter",
        },
      ],
    },
    {
      title: "Responsive Layout",
      fields: [
        {
          name: "mobileColumns",
          type: "select",
          label: "Mobile Columns",
          options: [
            { value: 1, label: "1 Column" },
            { value: 2, label: "2 Columns" },
          ],
        },
        {
          name: "tabletColumns",
          type: "select",
          label: "Tablet Columns",
          options: [
            { value: 2, label: "2 Columns" },
            { value: 3, label: "3 Columns" },
          ],
        },
        {
          name: "desktopColumns",
          type: "select",
          label: "Desktop Columns",
          options: [
            { value: 3, label: "3 Columns" },
            { value: 4, label: "4 Columns" },
            { value: 5, label: "5 Columns" },
          ],
        },
      ],
    },
    {
      title: "Advanced Features",
      fields: [
        {
          name: "showStockCount",
          type: "toggle",
          label: "Show Stock Count",
        },
        {
          name: "showSavingsAmount",
          type: "toggle",
          label: "Show Savings Amount",
        },
        {
          name: "showQuickView",
          type: "toggle",
          label: "Enable Quick View",
        },
        {
          name: "enableWishlist",
          type: "toggle",
          label: "Enable Wishlist",
        },
        {
          name: "showProductRating",
          type: "toggle",
          label: "Show Product Rating",
        },
        {
          name: "showCategoryBadge",
          type: "toggle",
          label: "Show Category Badge",
        },
        {
          name: "showNewBadge",
          type: "toggle",
          label: "Show New Product Badge",
        },
      ],
    },
    {
      title: "Animation Settings",
      fields: [
        {
          name: "enableAnimations",
          type: "toggle",
          label: "Enable Animations",
        },
        {
          name: "animationDelay",
          type: "range",
          label: "Animation Delay (ms)",
          min: 50,
          max: 500,
          dependsOn: "enableAnimations",
        },
        {
          name: "hoverEffects",
          type: "toggle",
          label: "Enable Hover Effects",
        },
      ],
    },
    {
      title: "Analytics & Tracking",
      fields: [
        {
          name: "trackImpressions",
          type: "toggle",
          label: "Track Section Views",
        },
        {
          name: "trackClicks",
          type: "toggle",
          label: "Track Product Clicks",
        },
        {
          name: "sectionId",
          type: "text",
          label: "Section ID (for analytics)",
          placeholder: "discounted-products-section",
        },
      ],
    },
    {
      title: "Scheduling",
      fields: [
        {
          name: "startDate",
          type: "datetime",
          label: "Section Start Date/Time",
          optional: true,
        },
        {
          name: "endDate",
          type: "datetime",
          label: "Section End Date/Time",
          optional: true,
        },
        {
          name: "timezone",
          type: "select",
          label: "Timezone",
          options: [
            { value: "UTC", label: "UTC" },
            { value: "America/New_York", label: "Eastern Time" },
            { value: "America/Chicago", label: "Central Time" },
            { value: "America/Denver", label: "Mountain Time" },
            { value: "America/Los_Angeles", label: "Pacific Time" },
            { value: "Europe/London", label: "GMT" },
            { value: "Europe/Paris", label: "Central European Time" },
            { value: "Asia/Tokyo", label: "Japan Standard Time" },
            { value: "Asia/Shanghai", label: "China Standard Time" },
            { value: "Australia/Sydney", label: "Australian Eastern Time" },
          ],
        },
      ],
    },
  ],
};

// Configuration validation functions
export const validateDiscountedProductsConfig = (
  config: Partial<DiscountedProductsConfig>
): string[] => {
  const errors: string[] = [];

  if (
    config.maxProducts &&
    (config.maxProducts < 4 || config.maxProducts > 20)
  ) {
    errors.push("Maximum products must be between 4 and 20");
  }

  if (config.minDiscountPercentage && config.maxDiscountPercentage) {
    if (config.minDiscountPercentage >= config.maxDiscountPercentage) {
      errors.push(
        "Minimum discount percentage must be less than maximum discount percentage"
      );
    }
  }

  if (config.sectionTitle && config.sectionTitle.length > 100) {
    errors.push("Section title must be 100 characters or less");
  }

  if (config.sectionSubtitle && config.sectionSubtitle.length > 200) {
    errors.push("Section subtitle must be 200 characters or less");
  }

  if (config.primaryCtaText && config.primaryCtaText.length > 50) {
    errors.push("Primary CTA text must be 50 characters or less");
  }

  if (config.secondaryCtaText && config.secondaryCtaText.length > 50) {
    errors.push("Secondary CTA text must be 50 characters or less");
  }

  return errors;
};

// Helper functions for admin panel
export const getDiscountedProductsPreview = (
  config: DiscountedProductsConfig
) => {
  return {
    title: config.sectionTitle,
    subtitle: config.sectionSubtitle,
    accentColor: config.accentColor,
    backgroundColor: config.backgroundColor,
    maxProducts: config.maxProducts,
    showCountdown: config.showCountdown,
    isVisible: config.isVisible,
    isEnabled: config.isEnabled,
  };
};

export const exportDiscountedProductsConfig = (
  config: DiscountedProductsConfig
): string => {
  return JSON.stringify(config, null, 2);
};

export const importDiscountedProductsConfig = (
  jsonString: string
): DiscountedProductsConfig | null => {
  try {
    const config = JSON.parse(jsonString);
    const errors = validateDiscountedProductsConfig(config);
    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(", ")}`);
    }
    return { ...defaultDiscountedProductsConfig, ...config };
  } catch (error) {
    console.error("Error importing configuration:", error);
    return null;
  }
};
