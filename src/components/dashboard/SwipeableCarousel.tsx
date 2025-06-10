
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGesture } from "@use-gesture/react";

interface SwipeableCarouselProps {
  items: React.ReactNode[];
  title?: string;
  enableAutoScroll?: boolean;
  scrollInterval?: number;
}

export function SwipeableCarousel({ 
  items, 
  title, 
  enableAutoScroll = false, 
  scrollInterval = 5000 
}: SwipeableCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const [carouselApi, setCarouselApi] = React.useState<any>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-scroll functionality
  React.useEffect(() => {
    if (!enableAutoScroll || !carouselApi || isDragging) return;

    const interval = setInterval(() => {
      if (currentSlide >= items.length - 1) {
        carouselApi.scrollTo(0);
      } else {
        carouselApi.scrollNext();
      }
    }, scrollInterval);

    return () => clearInterval(interval);
  }, [enableAutoScroll, carouselApi, currentSlide, items.length, scrollInterval, isDragging]);

  // Enhanced gesture support with momentum and snap
  const bind = useGesture({
    onDrag: ({ direction: [dx], velocity: [vx], dragging, cancel }) => {
      if (!dragging || !carouselApi) return;
      
      setIsDragging(dragging);
      
      // Enhanced swipe detection with velocity consideration
      const threshold = isMobile ? 50 : 100;
      const velocityThreshold = 0.5;
      
      if (Math.abs(vx) > velocityThreshold || Math.abs(dx) > threshold) {
        if (dx > 0 || vx > velocityThreshold) {
          carouselApi.scrollPrev();
        } else if (dx < 0 || vx < -velocityThreshold) {
          carouselApi.scrollNext();
        }
        cancel();
      }
    },
    onDragEnd: () => {
      setIsDragging(false);
    }
  }, {
    drag: {
      axis: "x",
      filterTaps: true,
      threshold: 10,
      rubberband: true,
    }
  });
  
  const gestureProps = isMobile ? bind() : {};

  return (
    <div className="space-y-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      <div 
        {...gestureProps} 
        className="touch-pan-y select-none"
        style={{ touchAction: 'pan-y' }}
      >
        <Carousel 
          setApi={setCarouselApi} 
          className="w-full" 
          onSelect={() => {
            if (carouselApi) {
              setCurrentSlide(carouselApi.selectedScrollSnap());
            }
          }}
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: false,
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {items.map((item, index) => (
              <CarouselItem 
                key={index} 
                className={`pl-2 md:pl-4 ${isMobile ? "w-full" : "lg:basis-1/3 md:basis-1/2"}`}
              >
                <div className="transition-transform duration-200 hover:scale-[1.02]">
                  {item}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {!isMobile && (
            <>
              <CarouselPrevious className="-left-4 hover:scale-110 transition-transform" />
              <CarouselNext className="-right-4 hover:scale-110 transition-transform" />
            </>
          )}
          
          {/* Enhanced pagination dots for mobile */}
          {isMobile && items.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? "w-6 bg-primary" 
                      : "w-2 bg-muted hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
      
      {isMobile && items.length > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <p>Swipe left or right to view more</p>
          <p className="font-medium">{currentSlide + 1} of {items.length}</p>
        </div>
      )}
    </div>
  );
}
