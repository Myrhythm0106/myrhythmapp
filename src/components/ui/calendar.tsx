
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useGesture } from "@use-gesture/react";
import { useIsMobile } from "@/hooks/use-mobile";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const isMobile = useIsMobile();
  const [isGestureActive, setIsGestureActive] = React.useState(false);

  // Enhanced gesture support for month navigation
  const bind = useGesture({
    onDrag: ({ direction: [dx], velocity: [vx], dragging, cancel }) => {
      if (!isMobile || !dragging) return;
      
      setIsGestureActive(dragging);
      
      const threshold = 80;
      const velocityThreshold = 0.3;
      
      if (Math.abs(vx) > velocityThreshold || Math.abs(dx) > threshold) {
        if (dx > 0 || vx > velocityThreshold) {
          // Navigate to previous month
          const prevButton = document.querySelector('[aria-label="Go to previous month"]') as HTMLElement;
          prevButton?.click();
        } else if (dx < 0 || vx < -velocityThreshold) {
          // Navigate to next month  
          const nextButton = document.querySelector('[aria-label="Go to next month"]') as HTMLElement;
          nextButton?.click();
        }
        cancel();
      }
    },
    onDragEnd: () => {
      setIsGestureActive(false);
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
    <div {...gestureProps} className={cn("touch-pan-y", className)}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn("p-3", className)}
        classNames={{
          months: "flex flex-col space-y-4",
          month: "space-y-3 w-full",
          caption: "flex justify-center pt-1 relative items-center px-8",
          caption_label: cn(
            "text-base font-semibold",
            isMobile ? "text-lg" : "text-sm"
          ),
          nav: "space-x-1 flex items-center",
          nav_button: cn(
            buttonVariants({ variant: "outline" }),
            isMobile 
              ? "h-10 w-10 bg-transparent p-0 opacity-70 hover:opacity-100 transition-all duration-200 touch-manipulation" 
              : "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-all duration-200 hover:scale-110"
          ),
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex justify-between",
          head_cell: cn(
            "text-muted-foreground rounded-md font-normal text-center flex-1",
            isMobile ? "text-sm py-2" : "text-[0.8rem] w-9"
          ),
          row: "flex w-full mt-1 justify-between",
          cell: cn(
            "text-center text-sm p-0 relative flex-1",
            isMobile ? "h-12 min-w-[44px]" : "h-9 w-9",
            "[&:has([aria-selected].day-range-end)]:rounded-r-md",
            "[&:has([aria-selected].day-outside)]:bg-accent/50",
            "[&:has([aria-selected])]:bg-accent",
            "first:[&:has([aria-selected])]:rounded-l-md",
            "last:[&:has([aria-selected])]:rounded-r-md",
            "focus-within:relative focus-within:z-20",
            "transition-all duration-200"
          ),
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "font-normal aria-selected:opacity-100 transition-all duration-200 w-full h-full",
            isMobile 
              ? "text-base min-h-[44px] touch-manipulation hover:bg-accent/80" 
              : "h-9 w-9 p-0 hover:scale-110"
          ),
          day_range_end: "day-range-end",
          day_selected:
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground font-semibold",
          day_outside:
            "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle:
            "aria-selected:bg-accent aria-selected:text-accent-foreground",
          day_hidden: "invisible",
          ...classNames,
        }}
        components={{
          IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        }}
        style={{
          opacity: isGestureActive ? 0.8 : 1,
          transform: isGestureActive ? 'scale(0.98)' : 'scale(1)',
          transition: !isGestureActive ? 'all 0.2s ease-out' : undefined
        }}
        {...props}
      />
      
      {/* Mobile swipe hint */}
      {isMobile && (
        <div className="text-center mt-2">
          <p className="text-xs text-muted-foreground">
            💡 Swipe left/right to navigate months
          </p>
        </div>
      )}
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
