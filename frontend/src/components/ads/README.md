# Advertisement System Documentation

## Overview

This e-commerce application includes a comprehensive advertisement system with support for:

- **Static Advertisements**: Banner ads, sidebar ads, inline ads, and popup ads
- **Video Advertisements**: Self-hosted video ads with controls and skip functionality
- **YouTube Integration**: Embed YouTube videos as advertisement content
- **Google AdSense**: Integration with Google's advertising platform

## Quick Start

### 1. Configuration

Update the advertisement configuration in `/src/config/ads.ts`:

```typescript
export const defaultAdConfig: AdConfig = {
  googleAds: {
    clientId: "ca-pub-YOUR_GOOGLE_ADSENSE_ID", // Your Google AdSense client ID
    enableAds: true,
    // ... other settings
  },
  youTubeAds: {
    enableYouTubeAds: true,
    videoConfigs: {
      tutorial: {
        videoId: "YOUR_VIDEO_ID", // Replace with your YouTube video ID
        title: "Your Video Title",
        description: "Video description",
      },
      // ... other video configs
    },
  },
  // ... other configurations
};
```

### 2. Google AdSense Setup

1. **Get your Google AdSense account**: Visit [Google AdSense](https://www.google.com/adsense/)
2. **Add your site**: Add your domain to AdSense
3. **Get your client ID**: Copy your publisher ID (ca-pub-xxxxxxxx)
4. **Update configuration**: Replace the `clientId` in `ads.ts`
5. **Add ad slots**: Create ad units and replace the slot IDs in the configuration

### 3. YouTube Integration Setup

1. **Upload videos**: Upload your advertisement videos to YouTube
2. **Get video IDs**: Copy the video ID from the YouTube URL (e.g., `dQw4w9WgXcQ` from `https://youtube.com/watch?v=dQw4w9WgXcQ`)
3. **Update configuration**: Replace the placeholder video IDs in `ads.ts`

## Advertisement Components

### Static Advertisements

Located in `/src/components/ads/Advertisement.tsx`:

- **Hero Variant**: Full-width banner at the top of pages
- **Banner Variant**: Horizontal banner ads
- **Card Variant**: Card-style ads with shadows
- **Sidebar Variant**: Vertical ads for sidebars
- **Inline Variant**: Ads that blend with content
- **Popup Variant**: Modal-style ads (use sparingly)

**Usage:**

```tsx
import Advertisement from "../components/ads/Advertisement";

<Advertisement
  variant="banner"
  title="Special Offer!"
  description="Get 50% off on all electronics"
  ctaText="Shop Now"
  onCtaClick={() => window.open("/products/electronics")}
  imageUrl="/images/electronics-sale.jpg"
/>;
```

### Video Advertisements

Located in `/src/components/ads/VideoAd.tsx`:

- **Inline**: Embedded within content
- **Overlay**: Appears over content
- **Banner**: Horizontal video banner
- **Sidebar**: Vertical video for sidebars
- **Fullscreen**: Full-screen video ads
- **Pre-roll**: Ads that play before main content

**Features:**

- Play/pause controls
- Progress tracking
- Skip functionality (after specified time)
- Mute/unmute
- Fullscreen support

**Usage:**

```tsx
import VideoAd from "../components/ads/VideoAd";

<VideoAd
  variant="inline"
  videoUrl="/videos/product-demo.mp4"
  title="Product Demo"
  description="See our products in action"
  allowSkip={true}
  skipAfterSeconds={5}
/>;
```

### YouTube Advertisements

Located in `/src/components/ads/YouTubeAd.tsx`:

**Usage:**

```tsx
import YouTubeAd from "../components/ads/YouTubeAd";

<YouTubeAd
  videoId="dQw4w9WgXcQ"
  title="Product Tutorial"
  description="Learn how to use our products effectively"
  variant="modal"
/>;
```

### Google AdSense Integration

Located in `/src/components/ads/GoogleAd.tsx`:

**Usage:**

```tsx
import GoogleAd from "../components/ads/GoogleAd";

<GoogleAd slot="1234567890" format="banner" width={728} height={90} />;
```

## Pre-configured Ad Components

Located in `/src/components/ads/AdComponents.tsx`:

Ready-to-use advertisement instances:

- `HeroAd`: Large hero banner
- `ProductListAd`: Ads between product listings
- `SidebarAd`: Sidebar advertisement
- `ProductDemoVideoAd`: Product demonstration videos
- `TutorialYouTubeAd`: YouTube tutorial videos
- `GoogleBannerAd`: Google AdSense banner

**Usage:**

```tsx
import { ProductListAd, SidebarAd } from '../components/ads/AdComponents';

<ProductListAd />
<SidebarAd />
```

## Advertisement Placement

### HomePage (`/src/pages/HomePage.tsx`)

- Product demo video after features section
- Google banner ad before categories
- Tutorial YouTube ad before featured products

### ProductsPage (`/src/pages/ProductsPage.tsx`)

- Product demo video after main content
- Google banner ad at bottom
- Sidebar ads in filter area

### Adding to Other Pages

1. **Import the components:**

```tsx
import {
  ProductDemoVideoAd,
  GoogleBannerAd,
} from "../components/ads/AdComponents";
```

2. **Add to JSX:**

```tsx
{
  /* Add between content sections */
}
<section className="py-8 bg-gray-50 dark:bg-gray-800">
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
    <GoogleBannerAd />
  </div>
</section>;
```

## Customization

### Styling

All advertisement components use Tailwind CSS and support dark mode:

- Light mode: `bg-white text-gray-900`
- Dark mode: `dark:bg-gray-800 dark:text-white`

### Configuration Options

Update `/src/config/ads.ts` to modify:

- **Ad placement**: Enable/disable ads on specific pages
- **Video settings**: Autoplay, controls, skip timing
- **Google AdSense**: Client ID, ad slots, formats
- **YouTube**: Video IDs, titles, descriptions

### Performance Tracking

The system includes basic performance tracking:

```tsx
import { trackAdPerformance } from "../config/ads";

// Track ad impressions
trackAdPerformance("hero-ad-001", "impression", "homepage");

// Track ad clicks
trackAdPerformance("hero-ad-001", "click", "homepage");
```

## Best Practices

### User Experience

1. **Don't be too aggressive**: Avoid too many ads that interfere with shopping
2. **Responsive design**: Ensure ads work on all device sizes
3. **Loading performance**: Lazy load video content
4. **Skip options**: Always provide skip options for video ads

### SEO Considerations

1. **Alt text**: Provide descriptive alt text for ad images
2. **No-follow links**: Use `rel="nofollow"` for external ad links
3. **Core Web Vitals**: Monitor impact on page load speed

### Privacy Compliance

1. **Cookie consent**: Implement cookie consent for tracking
2. **GDPR compliance**: Handle user data according to regulations
3. **Ad blocking**: Gracefully handle ad blockers

## Troubleshooting

### Common Issues

**Google AdSense not showing:**

1. Verify your client ID is correct
2. Check if your domain is approved in AdSense
3. Ensure ad blocker is not interfering

**YouTube videos not loading:**

1. Check video IDs are correct
2. Verify videos are public or unlisted
3. Check for CORS restrictions

**Video ads not playing:**

1. Verify video file paths are correct
2. Check video format compatibility (MP4 recommended)
3. Ensure proper MIME types are set

### Development vs Production

**Development:**

- Uses placeholder content
- Shows console logs for debugging
- Test ad configurations

**Production:**

- Replace all placeholder IDs
- Enable analytics tracking
- Monitor ad performance
- Optimize for loading speed

## Revenue Optimization

### A/B Testing

Test different ad placements and formats to find what works best for your audience.

### Analytics Integration

Integrate with Google Analytics or other analytics platforms to track ad performance.

### Ad Rotation

Implement ad rotation to prevent banner blindness and improve click-through rates.

### Seasonal Campaigns

Update ad content for seasonal promotions and special events.

## Support

For issues with the advertisement system:

1. Check the browser console for errors
2. Verify configuration in `/src/config/ads.ts`
3. Test individual components in isolation
4. Review network requests for failed ad loads

## Next Steps

1. **Set up your Google AdSense account**
2. **Upload your video content**
3. **Configure the ad settings in `/src/config/ads.ts`**
4. **Test the ads in development**
5. **Deploy and monitor performance**

The advertisement system is designed to be flexible and easy to configure. Start with basic static ads and gradually add video and YouTube integration as needed.
