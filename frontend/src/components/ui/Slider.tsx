import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  itemsPerView?: number; // default for desktop
  gap?: number;
}

const Slider: React.FC<SliderProps> = ({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = true,
  showDots = true,
  className = "",
  itemsPerView: defaultItemsPerView = 3, // default for desktop
  gap = 1,
}) => {
  const [itemsPerView, setItemsPerView] = useState(defaultItemsPerView);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // ✅ Responsive breakpoints
  useEffect(() => {
    const updateView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(1); // tablet
      } else {
        setItemsPerView(defaultItemsPerView); // desktop
      }
    };

    updateView(); // run at mount
    window.addEventListener("resize", updateView);
    return () => window.removeEventListener("resize", updateView);
  }, [defaultItemsPerView]);

  const totalSlides = Math.ceil(children.length / itemsPerView);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goToSlide = (index: number) => setCurrentIndex(index);

  useEffect(() => {
    if (autoPlay && !isHovered) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, isHovered]);

  const translateX = -(currentIndex * (100 / itemsPerView));

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides wrapper */}
      <div
        ref={sliderRef}
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(${translateX}%)`,
          gap: `${gap}px`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="flex-shrink-0"
            style={{ width: `${100 / itemsPerView}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg rounded-full p-2 transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && totalSlides > 1 && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
