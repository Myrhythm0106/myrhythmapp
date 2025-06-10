
import React, { ReactNode, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { useIsMobile } from '@/hooks/use-mobile';

interface SwipeAction {
  label: string;
  icon: ReactNode;
  color: string;
  action: () => void;
}

interface SwipeableContainerProps {
  children: ReactNode;
  onSwipeLeft?: SwipeAction;
  onSwipeRight?: SwipeAction;
  onPullToRefresh?: () => void;
  enableHorizontalSwipe?: boolean;
  enablePullToRefresh?: boolean;
  className?: string;
  threshold?: number;
}

export function SwipeableContainer({
  children,
  onSwipeLeft,
  onSwipeRight,
  onPullToRefresh,
  enableHorizontalSwipe = true,
  enablePullToRefresh = false,
  className = "",
  threshold = 100
}: SwipeableContainerProps) {
  const isMobile = useIsMobile();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [swipeProgress, setSwipeProgress] = React.useState(0);
  const [pullProgress, setPullProgress] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleRefresh = useCallback(async () => {
    if (onPullToRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onPullToRefresh();
      } finally {
        setIsRefreshing(false);
        setPullProgress(0);
      }
    }
  }, [onPullToRefresh, isRefreshing]);

  const bind = useGesture({
    onDrag: ({ direction: [dx, dy], distance: [distanceX, distanceY], dragging, cancel }) => {
      if (!isMobile) return;

      setIsDragging(dragging);

      // Handle horizontal swipe actions
      if (enableHorizontalSwipe && Math.abs(dx) > Math.abs(dy)) {
        const progress = Math.min(Math.abs(distanceX) / threshold, 1);
        setSwipeProgress(progress);

        if (!dragging) {
          if (distanceX > threshold && dx > 0 && onSwipeRight) {
            onSwipeRight.action();
          } else if (distanceX > threshold && dx < 0 && onSwipeLeft) {
            onSwipeLeft.action();
          }
          setSwipeProgress(0);
        }
      }

      // Handle pull to refresh
      if (enablePullToRefresh && dy > 0 && distanceY > distanceX) {
        const progress = Math.min(distanceY / (threshold * 1.5), 1);
        setPullProgress(progress);

        if (!dragging && distanceY > threshold * 1.5) {
          handleRefresh();
        } else if (!dragging) {
          setPullProgress(0);
        }
      }
    },
  }, {
    drag: {
      filterTaps: true,
      threshold: 10,
    }
  });

  const gestureProps = isMobile ? bind() : {};

  return (
    <div 
      {...gestureProps} 
      className={`relative overflow-hidden ${className}`}
      style={{
        transform: enablePullToRefresh ? `translateY(${pullProgress * 20}px)` : undefined,
        transition: !isDragging ? 'transform 0.3s ease-out' : undefined
      }}
    >
      {/* Pull to refresh indicator */}
      {enablePullToRefresh && pullProgress > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-2 bg-primary/10 text-primary text-sm font-medium z-10"
          style={{
            transform: `translateY(-${100 - pullProgress * 100}%)`,
            opacity: pullProgress
          }}
        >
          {isRefreshing ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Refreshing...
            </div>
          ) : (
            pullProgress > 0.8 ? "Release to refresh" : "Pull to refresh"
          )}
        </div>
      )}

      {/* Swipe action indicators */}
      {enableHorizontalSwipe && swipeProgress > 0 && (
        <>
          {onSwipeLeft && (
            <div 
              className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-4 text-white font-medium z-10"
              style={{
                backgroundColor: onSwipeLeft.color,
                width: `${swipeProgress * 100}px`,
                opacity: swipeProgress
              }}
            >
              <div className="flex items-center gap-2">
                {onSwipeLeft.icon}
                <span className="text-sm">{onSwipeLeft.label}</span>
              </div>
            </div>
          )}
          {onSwipeRight && (
            <div 
              className="absolute left-0 top-0 bottom-0 flex items-center justify-center px-4 text-white font-medium z-10"
              style={{
                backgroundColor: onSwipeRight.color,
                width: `${swipeProgress * 100}px`,
                opacity: swipeProgress
              }}
            >
              <div className="flex items-center gap-2">
                {onSwipeRight.icon}
                <span className="text-sm">{onSwipeRight.label}</span>
              </div>
            </div>
          )}
        </>
      )}

      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
}
