import React, { useEffect } from "react";
import { X, Play, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import Button from "./Button";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title?: string;
  description?: string;
  onSwitchToDemo?: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ", // Default demo video
  title = "ShopSphere Demo",
  description = "Discover how ShopSphere revolutionizes your shopping experience",
  onSwitchToDemo,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const videoRef = React.useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setIsPlaying(false);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-primary-100 mt-1">{description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          {!isPlaying ? (
            // Video Thumbnail with Play Button
            <div className="relative w-full h-full bg-gradient-to-br from-primary-900 via-secondary-900 to-pink-800 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-transparent"></div>

              {/* Play Button */}
              <button
                onClick={handlePlay}
                className="relative z-10 group"
                aria-label="Play video"
              >
                <div className="w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-300">
                  <Play
                    className="w-10 h-10 text-primary-600 ml-1"
                    fill="currentColor"
                  />
                </div>
              </button>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-cyan-400 to-primary-500 rounded-full filter blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-r from-secondary-400 to-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
              </div>

              {/* Demo Features */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                    <h4 className="font-semibold mb-2">🛍️ Smart Shopping</h4>
                    <p className="text-sm text-gray-200">
                      AI-powered product recommendations
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                    <h4 className="font-semibold mb-2">🚀 Fast Checkout</h4>
                    <p className="text-sm text-gray-200">
                      One-click purchasing experience
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                    <h4 className="font-semibold mb-2">📱 Mobile First</h4>
                    <p className="text-sm text-gray-200">
                      Optimized for all devices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Actual Video Player
            <div className="relative w-full h-full">
              <iframe
                ref={videoRef}
                src={`${videoUrl}?autoplay=1&mute=${isMuted ? 1 : 0}`}
                title="ShopSphere Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1 text-white hover:text-cyan-400 transition-colors"
                    aria-label={isMuted ? "Unmute" : "Mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>
                  <span className="text-white text-sm">ShopSphere Demo</span>
                </div>
                <button
                  onClick={handleFullscreen}
                  className="p-1 text-white hover:text-cyan-400 transition-colors"
                  aria-label={
                    isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                  }
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-gray-900">
                Ready to get started?
              </h4>
              <p className="text-gray-600 text-sm">
                Join thousands of satisfied customers today!
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>
                Maybe Later
              </Button>
              {onSwitchToDemo && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onSwitchToDemo();
                  }}
                  className="border-primary-200 text-primary-600 hover:bg-primary-50"
                >
                  Interactive Demo
                </Button>
              )}
              <Button
                className="bg-gradient-to-r from-primary-500 to-secondary-600"
                onClick={() => {
                  onClose();
                  // Navigate to products or registration
                  window.location.href = "/products";
                }}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
