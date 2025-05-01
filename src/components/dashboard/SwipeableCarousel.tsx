
import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface SwipeableCarouselProps {
  items: React.ReactNode[];
  title?: string;
}

export function SwipeableCarousel({ items, title }: SwipeableCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-3">
      {title && <h2 className="text-lg font-semibold">{title}</h2>}

      <Carousel setApi={(api) => {
        if (api) {
          api.on('select', () => {
            setCurrentSlide(api.selectedScrollSnap());
          });
        }
      }} className="w-full">
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
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  currentSlide === index ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}
