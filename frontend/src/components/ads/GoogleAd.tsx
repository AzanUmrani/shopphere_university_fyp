import { useEffect, useRef } from "react";

interface GoogleAdProps {
  adClient: string; // Your Google AdSense client ID (ca-pub-xxxxxxxxxxxxxxxx)
  adSlot: string; // Your ad unit ID
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd = ({
  adClient,
  adSlot,
  adFormat = "auto",
  adLayout,
  adLayoutKey,
  style = { display: "block" },
  className = "",
  responsive = true,
}: GoogleAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google AdSense script if not already loaded
    if (!window.adsbygoogle) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.setAttribute("data-ad-client", adClient);
      document.head.appendChild(script);

      window.adsbygoogle = [];
    }

    // Push ad to Google AdSense queue
    try {
      if (adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error("Google AdSense error:", error);
    }
  }, [adClient]);

  return (
    <div ref={adRef} className={`google-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export default GoogleAd;
