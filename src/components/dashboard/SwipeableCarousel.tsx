
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGesture } from "@use-gesture/react";

interface SwipeableCarouselProps {
  items: React.ReactNode[];
  title?: string;
}

export function SwipeableCarousel({ items, title }: SwipeableCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();
  const [carouselApi, setCarouselApi] = React.useState<any>(null);

  // Enhanced gesture support
  const bind = useGesture({
    onDrag: ({ direction: [dx], dragging, cancel }) => {
      if (!dragging || !carouselApi) return;
      
      if (dx > 0) {
        carouselApi.prev();
      } else if (dx < 0) {
        carouselApi.next();
      }
      
      cancel();
    },
  }, {
    drag: {
      axis: "x",
      filterTaps: true,
      threshold: 10,
    }
  });
  
  const gestureProps = isMobile ? bind() : {};

  return (
    <div className="space-y-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      <div {...gestureProps} className="touch-pan-y">
        <Carousel setApi={setCarouselApi} className="w-full" 
          onSelect={() => {
            if (carouselApi) {
              setCurrentSlide(carouselApi.selectedScrollSnap());
            }
          }}
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem key={index} className={isMobile ? "w-full" : "lg:basis-1/3 md:basis-1/2"}>
                {item}
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {!isMobile && (
            <>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </>
          )}
          
          {/* Pagination dots for mobile */}
          {isMobile && items.length > 1 && (
            <div className="flex justify-center mt-4 space-x-1">
              {items.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    currentSlide === index ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </Carousel>
      </div>
      
      {isMobile && items.length > 1 && (
        <p className="text-xs text-center text-muted-foreground mt-2">
          Swipe left or right to view more
        </p>
      )}
    </div>
  );
}
