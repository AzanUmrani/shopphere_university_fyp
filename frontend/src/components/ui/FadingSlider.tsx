import React, { useState, useEffect } from "react";

interface FadingSliderProps {
  images: string[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  className?: string;
  transitionDuration?: number;
}

const FadingSlider: React.FC<FadingSliderProps> = ({
  images,
  autoPlay = true,
  autoPlayInterval = 4000,
  showDots = true,
  className = "",
  transitionDuration = 1000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const nextSlide = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, transitionDuration / 2);
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, currentIndex, isTransitioning]);

  const transitionStyles = [
    "fade-scale", // Scale and fade
    "fade-slide-up", // Slide up and fade
    "fade-slide-down", // Slide down and fade
    "fade-rotate", // Rotate and fade
    "fade-zoom", // Zoom and fade
  ];

  const currentTransition =
    transitionStyles[currentIndex % transitionStyles.length];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Images */}
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentIndex
                ? `opacity-100 visible ${currentTransition}-in`
                : "opacity-0 invisible"
            }`}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm ${
                index === currentIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-primary-500 transition-all ease-linear"
          style={{
            width: `${((currentIndex + 1) / images.length) * 100}%`,
            transitionDuration: autoPlay ? `${autoPlayInterval}ms` : "300ms",
          }}
        />
      </div>
    </div>
  );
};

export default FadingSlider;
