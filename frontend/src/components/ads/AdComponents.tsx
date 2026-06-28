import Advertisement from "../ui/Advertisement";
import VideoAd from "../ui/VideoAd";
import YouTubeAd from "./YouTubeAd";
import GoogleAd from "./GoogleAd";

// Sample advertisement data - you can replace these with your actual ads later
export const sampleAds = {
  topBanner: {
    title: "🎉 Summer Sale - Up to 70% Off!",
    description: "Limited time offer on all electronics and fashion items",
    ctaText: "Shop Sale",
    ctaUrl: "/products?sale=true",
    backgroundColor: "bg-gradient-to-r from-orange-500 to-red-600",
  },

  heroSection: {
    title: "Discover Premium Products",
    description:
      "Exclusive collection of hand-picked items just for you. Experience luxury at unbeatable prices.",
    ctaText: "Explore Collection",
    imageUrl:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    backgroundColor:
      "bg-gradient-to-br from-secondary-800 via-secondary-600 to-pink-600",
  },

  sidebarPromo: {
    title: "New Arrivals",
    description: "Check out our latest products and trending items",
    ctaText: "View All",
    imageUrl:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&h=200&fit=crop",
    backgroundColor: "bg-gradient-to-br from-primary-600 to-primary-700",
  },

  productListBanner: {
    title: "⚡ Flash Deal Alert!",
    description: "Grab these deals before they're gone - Only 24 hours left!",
    ctaText: "View Deals",
    backgroundColor: "bg-gradient-to-r from-yellow-500 to-orange-600",
  },

  cartUpsell: {
    title: "🚚 Free Shipping on Orders Over $50",
    description: "Add a few more items to qualify for free shipping",
    ctaText: "Continue Shopping",
    backgroundColor: "bg-gradient-to-r from-green-500 to-teal-600",
  },

  checkoutPromo: {
    title: "💳 Save 10% with Premium Membership",
    description: "Join our premium program and get exclusive discounts",
    ctaText: "Join Now",
    backgroundColor: "bg-gradient-to-r from-primary-600 to-secondary-700",
  },

  footerCta: {
    title: "Stay Updated with Our Newsletter",
    description:
      "Get exclusive offers, new arrivals, and insider deals directly to your inbox",
    ctaText: "Subscribe Now",
    ctaUrl: "#newsletter-section",
    imageUrl:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=300&h=200&fit=crop",
    backgroundColor: "bg-gradient-to-r from-gray-800 to-gray-900",
  },

  mobileApp: {
    title: "📱 Download Our Mobile App",
    description: "Shop on the go and get exclusive mobile-only deals",
    ctaText: "Download App",
    imageUrl:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop",
    backgroundColor: "bg-gradient-to-br from-pink-600 to-rose-700",
  },

  seasonalPromo: {
    title: "🎄 Holiday Special Offer",
    description:
      "Perfect gifts for everyone on your list - Starting at just $9.99",
    ctaText: "Shop Gifts",
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
    backgroundColor: "bg-gradient-to-r from-red-700 to-green-700",
  },

  brandSpotlight: {
    title: "Featured Brand: TechPro",
    description: "Discover premium electronics from our partner brand",
    ctaText: "Shop Brand",
    ctaUrl: "/products?brand=techpro",
    imageUrl:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop",
    backgroundColor: "bg-gradient-to-r from-slate-700 to-slate-900",
  },
};

// Video advertisement configurations
export const videoAds = {
  productDemo: {
    title: "Experience Our Premium Collection",
    description: "Watch how our products can transform your lifestyle",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    posterImage:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
    ctaText: "Shop Now",
    ctaUrl: "/products",
    duration: 30,
  },

  brandStory: {
    title: "Our Story - Quality & Innovation",
    description: "Discover the passion behind every product we create",
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4", // Replace with your video
    posterImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop",
    ctaText: "Learn More",
    ctaUrl: "/about",
    duration: 25,
  },

  flashSale: {
    title: "⚡ Flash Sale - 48 Hours Only!",
    description: "Don't miss out on these incredible deals",
    videoUrl:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4", // Replace with your video
    posterImage:
      "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&h=400&fit=crop",
    ctaText: "Shop Sale",
    ctaUrl: "/products?sale=true",
    duration: 15,
  },
};

// YouTube ad configurations
export const youTubeAds = {
  productReview: {
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    title: "Customer Reviews - See What People Say",
    description: "Real customers sharing their experiences with our products",
    ctaText: "Shop Now",
    ctaUrl: "/products",
  },

  tutorial: {
    videoId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
    title: "How to Style Your New Purchase",
    description: "Professional styling tips and tricks for your wardrobe",
    ctaText: "Get Styling Tips",
    ctaUrl: "/blog/styling-guide",
  },
};

// Google AdSense configuration (replace with your actual ad units)
export const googleAdConfig = {
  client: "ca-pub-0000000000000000", // Replace with your Google AdSense client ID
  slots: {
    banner: "0000000000", // Replace with your banner ad slot ID
    sidebar: "1111111111", // Replace with your sidebar ad slot ID
    mobile: "2222222222", // Replace with your mobile ad slot ID
    video: "3333333333", // Replace with your video ad slot ID
  },
};

// Component for different ad placements
export const TopBanner = () => (
  <Advertisement
    variant="banner"
    size="md"
    {...sampleAds.topBanner}
    showCloseButton={true}
  />
);

export const HeroAd = () => (
  <Advertisement variant="hero" {...sampleAds.heroSection} />
);

export const SidebarAd = () => (
  <Advertisement variant="sidebar" {...sampleAds.sidebarPromo} />
);

export const ProductListAd = () => (
  <Advertisement variant="card" size="md" {...sampleAds.productListBanner} />
);

export const CartUpsellAd = () => (
  <Advertisement variant="inline" {...sampleAds.cartUpsell} />
);

export const CheckoutPromoAd = () => (
  <Advertisement variant="card" size="sm" {...sampleAds.checkoutPromo} />
);

export const FooterCtaAd = () => (
  <Advertisement variant="card" size="lg" {...sampleAds.footerCta} />
);

export const MobileAppAd = () => (
  <Advertisement variant="sidebar" {...sampleAds.mobileApp} />
);

export const SeasonalPromoAd = () => (
  <Advertisement variant="card" size="lg" {...sampleAds.seasonalPromo} />
);

export const BrandSpotlightAd = () => (
  <Advertisement variant="card" size="md" {...sampleAds.brandSpotlight} />
);

// Video Advertisement Components
export const ProductDemoVideoAd = () => (
  <VideoAd
    variant="inline"
    size="lg"
    {...videoAds.productDemo}
    autoPlay={false}
    muted={true}
    skippable={true}
    skipAfter={5}
  />
);

export const BrandStoryVideoAd = () => (
  <VideoAd
    variant="banner"
    {...videoAds.brandStory}
    autoPlay={true}
    muted={true}
    skippable={false}
  />
);

export const FlashSaleVideoAd = () => (
  <VideoAd
    variant="overlay"
    {...videoAds.flashSale}
    autoPlay={true}
    muted={true}
    skippable={true}
    skipAfter={3}
  />
);

// YouTube Advertisement Components
export const ProductReviewYouTubeAd = () => (
  <YouTubeAd variant="inline" size="lg" {...youTubeAds.productReview} />
);

export const TutorialYouTubeAd = () => (
  <YouTubeAd variant="sidebar" {...youTubeAds.tutorial} />
);

export const ModalYouTubeAd = () => (
  <YouTubeAd variant="modal" {...youTubeAds.productReview} />
);

// Google AdSense Components (with fallback)
export const GoogleBannerAd = () => (
  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
    <div className="text-gray-500 dark:text-gray-400">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
        📢
      </div>
      <h3 className="text-lg font-medium mb-2">Advertisement Space</h3>
      <p className="text-sm">This space is available for promotional content</p>
    </div>
  </div>
);

export const GoogleSidebarAd = () => (
  <GoogleAd
    adClient={googleAdConfig.client}
    adSlot={googleAdConfig.slots.sidebar}
    adFormat="vertical"
    className="mb-4"
  />
);

export const GoogleMobileAd = () => (
  <GoogleAd
    adClient={googleAdConfig.client}
    adSlot={googleAdConfig.slots.mobile}
    adFormat="auto"
    className="my-4 lg:hidden"
  />
);

export default {
  TopBanner,
  HeroAd,
  SidebarAd,
  ProductListAd,
  CartUpsellAd,
  CheckoutPromoAd,
  FooterCtaAd,
  MobileAppAd,
  SeasonalPromoAd,
  BrandSpotlightAd,
  // Video Ads
  ProductDemoVideoAd,
  BrandStoryVideoAd,
  FlashSaleVideoAd,
  // YouTube Ads
  ProductReviewYouTubeAd,
  TutorialYouTubeAd,
  ModalYouTubeAd,
  // Google Ads
  GoogleBannerAd,
  GoogleSidebarAd,
  GoogleMobileAd,
};
