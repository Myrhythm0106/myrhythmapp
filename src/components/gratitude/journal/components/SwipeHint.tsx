
import React from "react";

interface SwipeHintProps {
  isMobile: boolean;
}

export function SwipeHint({ isMobile }: SwipeHintProps) {
  if (!isMobile) return null;

  return (
    <div className="text-center mt-1">
      <p className="text-xs text-muted-foreground">
        💡 Swipe right to share • Swipe left to delete
      </p>
    </div>
  );
}
