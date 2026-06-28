import { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  SkipForward,
} from "lucide-react";
import Button from "./Button";

interface VideoAdProps {
  variant?:
    | "inline"
    | "overlay"
    | "banner"
    | "sidebar"
    | "fullscreen"
    | "pre-roll";
  videoUrl?: string;
  posterImage?: string;
  title: string;
  description?: string;
  duration?: number; // in seconds
  ctaText?: string;
  ctaUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
  skippable?: boolean;
  skipAfter?: number; // seconds after which skip becomes available
  showCloseButton?: boolean;
  onClose?: () => void;
  onComplete?: () => void;
  onSkip?: () => void;
  onCtaClick?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const VideoAd = ({
  variant = "inline",
  videoUrl,
  posterImage,
  title,
  description,
  duration = 30,
  ctaText = "Learn More",
  ctaUrl = "#",
  autoPlay = false,
  muted = true,
  skippable = true,
  skipAfter = 5,
  showCloseButton = true,
  onClose,
  onComplete,
  onSkip,
  onCtaClick,
  className = "",
  size = "md",
}: VideoAdProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [canSkip, setCanSkip] = useState(!skippable);
  const [isVisible, setIsVisible] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= skipAfter && skippable) {
        setCanSkip(true);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onComplete?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, [skipAfter, skippable, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSkip = () => {
    setIsVisible(false);
    onSkip?.();
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleCtaClick = () => {
    if (ctaUrl && ctaUrl !== "#") {
      window.open(ctaUrl, "_blank");
    }
    onCtaClick?.();
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  if (!isVisible) return null;

  // Fullscreen Overlay Ad
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
        <div className="relative w-full max-w-4xl mx-4">
          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterImage}
              className="w-full aspect-video"
              autoPlay={autoPlay}
              muted={muted}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            />

            {/* Controls Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60 transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Top Bar */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <div className="bg-black/50 px-3 py-1 rounded-full">
                  <span className="text-white text-sm font-medium">
                    Advertisement
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {skippable && canSkip && (
                    <button
                      onClick={handleSkip}
                      className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <SkipForward className="w-4 h-4 inline mr-1" />
                      Skip Ad
                    </button>
                  )}
                  {skippable && !canSkip && (
                    <div className="bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                      Skip in {Math.ceil(skipAfter - currentTime)}s
                    </div>
                  )}
                  {showCloseButton && (
                    <button
                      onClick={handleClose}
                      className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-4 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>

              {/* Bottom Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                {/* Progress Bar */}
                <div className="bg-white/20 h-1 rounded-full mb-4">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-gray-300 transition-colors"
                    >
                      {isMuted ? (
                        <VolumeX className="w-5 h-5" />
                      ) : (
                        <Volume2 className="w-5 h-5" />
                      )}
                    </button>
                    <div className="text-white text-sm">
                      {Math.floor(currentTime)}s / {duration}s
                    </div>
                  </div>
                  <Button
                    onClick={handleCtaClick}
                    className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                    {ctaText}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Info */}
          <div className="mt-4 text-center text-white">
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            {description && (
              <p className="text-gray-300 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pre-roll Ad (similar to fullscreen but with different styling)
  if (variant === "pre-roll") {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterImage}
          className="w-full aspect-video"
          autoPlay={autoPlay}
          muted={muted}
        />

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60">
          {/* Skip Button */}
          {skippable && canSkip && (
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 bg-black/70 hover:bg-black/80 text-white px-3 py-1 rounded text-sm transition-colors"
            >
              Skip Ad
            </button>
          )}

          {/* Ad Label */}
          <div className="absolute top-4 left-4 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            AD
          </div>

          {/* Play Button */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
            >
              <Play className="w-6 h-6 text-white ml-1" />
            </button>
          )}

          {/* Progress Bar */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/20 h-1 rounded-full">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Overlay Ad
  if (variant === "overlay") {
    return (
      <div className="fixed bottom-4 right-4 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="relative">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterImage}
            className="w-80 h-48 object-cover"
            autoPlay={autoPlay}
            muted={muted}
          />

          {/* Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>

            <div className="absolute bottom-2 left-2 right-2">
              <div className="bg-white/20 h-0.5 rounded-full mb-2">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white text-xs">{title}</span>
                <button
                  onClick={handleCtaClick}
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-2 py-1 rounded transition-colors"
                >
                  {ctaText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Banner Ad
  if (variant === "banner") {
    return (
      <div
        className={`w-full bg-black rounded-lg overflow-hidden ${className}`}
      >
        <div className="flex items-center">
          <div className="relative flex-shrink-0">
            <video
              ref={videoRef}
              src={videoUrl}
              poster={posterImage}
              className="w-32 h-20 object-cover"
              autoPlay={autoPlay}
              muted={muted}
            />
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/50 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          <div className="flex-1 p-4 text-white">
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
            {description && (
              <p className="text-xs text-gray-300 mb-2 line-clamp-2">
                {description}
              </p>
            )}
            <Button
              onClick={handleCtaClick}
              size="sm"
              className="bg-primary-600 hover:bg-primary-700"
            >
              {ctaText}
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {showCloseButton && (
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Inline Ad (default)
  return (
    <div
      className={`${sizeClasses[size]} mx-auto bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterImage}
          className="w-full aspect-video object-cover"
          autoPlay={autoPlay}
          muted={muted}
        />

        {/* Video Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20">
          {/* Close Button */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Ad Label */}
          <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
            SPONSORED
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 text-white" />
            ) : (
              <Play className="w-6 h-6 text-white ml-1" />
            )}
          </button>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Progress Bar */}
            <div className="bg-white/20 h-1 rounded-full mb-3">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <span className="text-white text-sm">
                  {Math.floor(currentTime)}s
                </span>
              </div>

              <Button
                onClick={handleCtaClick}
                size="sm"
                className="bg-primary-600 hover:bg-primary-700 text-white"
              >
                {ctaText}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ad Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoAd;
