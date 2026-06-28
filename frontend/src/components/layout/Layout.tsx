import { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import AIFloatingChat from "../chat/AIFloatingChat";
import { MobileAppAd } from "../ads/AdComponents";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [showMobileAd, setShowMobileAd] = useState(false);

  useEffect(() => {
    // Show mobile app ad after 30 seconds, only once per session
    const hasSeenMobileAd = sessionStorage.getItem("hasSeenMobileAd");
    if (!hasSeenMobileAd) {
      const timer = setTimeout(() => {
        setShowMobileAd(true);
        sessionStorage.setItem("hasSeenMobileAd", "true");
      }, 30000); // 30 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <AIFloatingChat />

      {/* Floating Mobile App Advertisement */}
      {showMobileAd && (
        <div className="fixed bottom-20 right-4 z-40 w-80 max-w-[calc(100vw-2rem)]">
          <div className="relative">
            <MobileAppAd />
            <button
              onClick={() => setShowMobileAd(false)}
              className="absolute top-2 right-2 p-1 bg-black/20 rounded-full hover:bg-black/40 transition-colors"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
