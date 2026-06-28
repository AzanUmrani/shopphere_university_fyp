// Advertisement Configuration
// This file contains configuration options for all advertisement components

export interface AdConfig {
  // Google AdSense Configuration
  googleAds: {
    clientId: string;
    enableAds: boolean;
    adFormats: {
      banner: {
        width: number;
        height: number;
        slot?: string;
      };
      rectangle: {
        width: number;
        height: number;
        slot?: string;
      };
      leaderboard: {
        width: number;
        height: number;
        slot?: string;
      };
    };
  };

  // YouTube Ads Configuration
  youTubeAds: {
    enableYouTubeAds: boolean;
    defaultChannelId?: string;
    videoConfigs: {
      tutorial: {
        videoId: string;
        title: string;
        description: string;
      };
      productDemo: {
        videoId: string;
        title: string;
        description: string;
      };
      brand: {
        videoId: string;
        title: string;
        description: string;
      };
    };
  };

  // Video Ads Configuration
  videoAds: {
    enableVideoAds: boolean;
    autoplay: boolean;
    showControls: boolean;
    allowSkip: boolean;
    skipTimeSeconds: number;
    maxDurationMinutes: number;
  };

  // Static Ads Configuration
  staticAds: {
    enableStaticAds: boolean;
    rotationIntervalSeconds: number;
    showCloseButton: boolean;
    defaultCTAText: string;
  };

  // Placement Configuration
  placements: {
    homePage: {
      heroAd: boolean;
      betweenSections: boolean;
      sidebarAds: boolean;
      footerAd: boolean;
    };
    productsPage: {
      topBanner: boolean;
      betweenProducts: boolean;
      sidebarFilters: boolean;
      bottomSection: boolean;
    };
    productDetailPage: {
      afterDescription: boolean;
      relatedProducts: boolean;
      sidebarRecommendations: boolean;
    };
  };
}

// Default configuration - Update these values according to your needs
export const defaultAdConfig: AdConfig = {
  googleAds: {
    clientId: "ca-pub-XXXXXXXXXXXXXXXXX", // Replace with your Google AdSense client ID
    enableAds: true,
    adFormats: {
      banner: {
        width: 728,
        height: 90,
        slot: "XXXXXXXXXX", // Replace with your ad slot ID
      },
      rectangle: {
        width: 300,
        height: 250,
        slot: "XXXXXXXXXX", // Replace with your ad slot ID
      },
      leaderboard: {
        width: 970,
        height: 250,
        slot: "XXXXXXXXXX", // Replace with your ad slot ID
      },
    },
  },

  youTubeAds: {
    enableYouTubeAds: true,
    defaultChannelId: "UCxxxxxxxxxxxxxxxxxxxxxx", // Replace with your channel ID
    videoConfigs: {
      tutorial: {
        videoId: "dQw4w9WgXcQ", // Replace with actual video ID
        title: "How to Shop Smart - Complete Tutorial",
        description:
          "Learn the best practices for online shopping and product selection.",
      },
      productDemo: {
        videoId: "dQw4w9WgXcQ", // Replace with actual video ID
        title: "Product Showcase - Premium Collection",
        description:
          "Discover our latest premium products and their amazing features.",
      },
      brand: {
        videoId: "dQw4w9WgXcQ", // Replace with actual video ID
        title: "Our Brand Story",
        description: "Learn about our mission and commitment to quality.",
      },
    },
  },

  videoAds: {
    enableVideoAds: true,
    autoplay: false, // Set to true for autoplay (be mindful of user experience)
    showControls: true,
    allowSkip: true,
    skipTimeSeconds: 5,
    maxDurationMinutes: 2,
  },

  staticAds: {
    enableStaticAds: true,
    rotationIntervalSeconds: 30,
    showCloseButton: true,
    defaultCTAText: "Learn More",
  },

  placements: {
    homePage: {
      heroAd: false, // Disabled to avoid being too aggressive
      betweenSections: true,
      sidebarAds: true,
      footerAd: false,
    },
    productsPage: {
      topBanner: false,
      betweenProducts: true,
      sidebarFilters: true,
      bottomSection: true,
    },
    productDetailPage: {
      afterDescription: true,
      relatedProducts: true,
      sidebarRecommendations: true,
    },
  },
};

// Helper functions for ad configuration
export const getAdConfig = (): AdConfig => {
  // You can implement logic to load configuration from localStorage, API, etc.
  return defaultAdConfig;
};

export const updateAdConfig = (newConfig: Partial<AdConfig>): void => {
  // You can implement logic to save configuration to localStorage, API, etc.
  console.log("Ad configuration updated:", newConfig);
};

// Advertisement performance tracking (optional)
export interface AdPerformance {
  adId: string;
  impressions: number;
  clicks: number;
  ctr: number; // Click-through rate
  placement: string;
  timestamp: Date;
}

export const trackAdPerformance = (
  adId: string,
  event: "impression" | "click",
  placement: string
): void => {
  // Implement your analytics tracking here
  console.log(`Ad ${event}:`, { adId, placement, timestamp: new Date() });

  // Example: Send to Google Analytics, Facebook Pixel, or your own analytics
  // gtag('event', event, {
  //   event_category: 'advertisement',
  //   event_label: adId,
  //   custom_parameter: placement
  // });
};
